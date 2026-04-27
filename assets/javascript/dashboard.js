import { observeAuth, logoutUser, getCurrentUserProfile, hideAlert, showAlert, setButtonLoading } from "./auth.js"
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

//CONSTANTES DEL PERFIL
const editProfileForm = document.getElementById('editProfileForm')
const editEmail = document.getElementById('editEmail')
const editName = document.getElementById('editName')
const editCity = document.getElementById('editCity')
const editProfileBtn = document.getElementById('editProfileBtn')

const editProfileModalElement = document.getElementById('editProfileModal')
const editProfileModal = editProfileModalElement ? bootstrap.Modal.getOrCreateInstance(editProfileModalElement) : null


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

const renderProfile = (user, profile) => {
    const resolvedName = profile?.name || user.email?.split('@') [0] || Usuario
    const resolvedEmail = profile?.email || user.email || '-'
    const resolvedCity = profile?.favoriteCity?.trim || ''

    userName.textContent = resolvedName
    navUserName.textContent = resolvedName
    userEmail.textContent = resolvedEmail
    favoriteCity.textContent = resolvedCity || 'No Definida'

    editName.value = resolvedName
    editEmail.value = resolvedEmail
    editCity.value = resolvedCity

    currentFavoriteCity = resolvedCity
}

const reloadProfileAndWeather = () => {
    if(!currentUser) {
        return
    }
    const profile = await getCurrentUserProfile(currentUser.uid)
    currentProfile = profile
    renderProfile(currentUser, profile)
    await loadWeather(currentFavoriteCity)
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
        currentUser = user
        const profile = await getCurrentUserProfile(user, uid)
        currentProfile = profile
        renderProfile(user, profile)

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

editProfileForm?.addEventListener('submit', async (event) => {
    event.preventDefault()

    hideAlert('profileAlert')
    hideAlert('profileSuccess')

    const name = editName.value.trim()
    const city = editCity.value.trim()

    if (!name) {
        showAlert('profileAlert', 'El nombre es Obligatorio')
    }

    if (!city) {
        showAlert('profileAlert', 'La ciudad es Obligatoria')
    }

    try{
        setButtonLoading(
            saveProfileBtn,
            true,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios',
            'Guardando...'
        )

        await getCurrentUserProfile(currentUser.uid, {
            name,
            favoriteCity: city
        })

        showAlert('profileSuccess', 'perfil Actualizado')
        await reloadProfileAndWeather()
        setTimeout(() => {
            editProfileModal?.hide()
            hideAlert('profileSuccess')
        }, 1500)
    } catch (error) {
        showAlert('profileAlert', error.message || 'No podemos actualizar')
    } finally {
        setButtonLoading(
            saveProfileBtn,
            false,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios'
        )
    }
})