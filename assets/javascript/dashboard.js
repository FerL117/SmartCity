import { observeAuth, logoutUser, getCurrentUserProfile } from "./auth.js"
// IMPORT NUEVO FASE 3
import { getCityWeather, formatWeatherUpdateTime } from "./weather.js"


const userName = document.getElementById('userName')
const navUserName = document.getElementById('navUserName')
const userEmail = document.getElementById('userEmail')
const favoriteCity = document.getElementById('favoriteCity')
const logoutBtn = document.getElementById('logoutBtn')

// CONST NUEVAS PARA EL CLIMA
const refrreshWeatherBtn = document.getElementById('refreshWeatherBtn')
const weatherAlert = document.getElementById('WeatherAlert')
const weatherLoading = document.getElementById('weatherLoading')
const weatherContent = document.getElementById('weatherContent')
const weatherCityName = document.getElementById('weatherCityName')
const weatherDescription = document.getElementById('weatherDescription')
const weatherTemperature = document.getElementById('weatherTemperature')
const weatherApparentTemp = document.getElementById('weatherApparentTemp')
const weatherHumidity = document.getElementById('weatherHumidity')
const weatherWind = document.getElementById('weatherWind')
const weatherCoords = document.getElementById('weatherCoords')
const weatherUpdateAt = document.getElementById('weatherUpdateAt')
const weatherIcon = document.getElementById('weatherIcon')

//FUNCIONES DE CLIMA
let currentFavoriteCity = ''

const showWeatherAlert = message => {
    weatherAlert.textContent = message
    weatherAlert.classList.remove('d-none')
}

const hideWeatherAlert = () => {
    weatherAlert.textContent = ''
    weatherAlert.classList.remove('d-none')
}

const setWeatherLoading = isLoading => {
    weatherLoading.classList.toggle('d-none', !isLoading)
    refrreshWeatherBtn.disabled = isLoading
}

const hideWeatherContent = () => {
    weatherContent.classList.add('d-none')
}

const showWeatherContent = () => {
    weatherContent.classList.remove('d-none')
}

const buildLoacationLabel = location => {
    const parts = [location.name]
    if(location.admin1) {
        parts.push(location.admin1)
    }
    if (location.country) {
        parts.push(location.country)
    }
    return parts.join(", ")
}

const renderWeather = weatherData => {
    const{ Location, current, weatherInfo } = weatherData
    console.log('@@ render - weather => ', {location, current, weatherInfo })

    weatherCityName.textContent = buildLoacationLabel(location)
    weatherDescription.textContent = weatherInfo.label
    weatherApparentTemp.textContent = `${Math.round(current.temperature_2m)} °C`
    weatherHumidity.textContent = `${current.relative_humidity_2m} %`
    weatherWind.textContent = `${current.wind_speed_10m} Km/h`
    weatherCoords.textContent = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    weatherUpdateAt.textContent = formatWeatherUpdateTime(current.time)
    weatherIcon.className = `bi ${weatherInfo.icon} weather-main-icon`
    showWeatherContent()
}

const loadWeather = async (city) => {
    if (!city) {
        hideWeatherContent()
        showWeatherAlert('No hay una ciudad')
        return
    }

    hideWeatherAlert()
    hideWeatherContent()
    setWeatherLoading(true)

    try {
        const weatherData = await getCityWeather(city)
        console.log('@@@ weather =>', weatherData)
        renderWeather(weatherData)
    }catch (error) {
        hideWeatherContent()
        showWeatherAlert(error.message || 'no se encontro el clima')
    }finally {
        setWeatherLoading(false)
    }

}
// TERMINA FUNCIONES DE CLIMA

observeAuth( async (user) => {
    if(!user) {
        window.location.href = './../../dashboard.html'
        return
    }
    try{
        const profile = await getCurrentUserProfile(user.uid)
        const resolvedName = profile?.name || user.email?.split('@') [0] || 'Usuario'
        const resolvedEmail = profile?.email || user.email || '__'
        const resolvedCity = profile?.favoriteCity.trim() || 'No Added'

        userName.textContent = resolvedName
        navUserName.textContent = resolvedName
        userEmail.textContent = resolvedEmail
        favoriteCity.textContent = resolvedCity
        currentFavoriteCity = resolvedCity

        await loadWeather(currentFavoriteCity)
    }catch (error) {
        showWeatherAlert('No fue posible cargar tu perfil')
    }

})

logoutBtn?.addEventListener('click', async() => {
    await logoutUser()
    window.location.href = './../../login.html'
})

refrreshWeatherBtn?.addEventListener('click', async () => {
    await loadWeather(currentFavoriteCity)
})
