import { observeAuth, logoutUser, getCurrentUserProfile } from "./auth.js"

const userName = document.getElementById('userName')
const navUserName = document.getElementById('navUserName')
const userEmail = document.getElementById('userEmail')
const favoriteCity = document.getElementById('favoriteCity')
const logoutBtn = document.getElementById('logoutBtn')


observeAuth( async (user) => {
    if(!user) {
        window.location.href = './../../dashboard.html'
        return
    }
    const profile = await getCurrentUserProfile(user.uid)

    const resolvedName = profile?.name || 'Usuario'
    const resolvedEmail = profile?.email || '__'
    const resolvedCity = profile?.favoriteCity

    userName.textContent = resolvedName
    navUserName.textContent = resolvedName
    userEmail.textContent = resolvedEmail
    favoriteCity.textContent = resolvedCity
})

logoutBtn?.addEventListener('click', async() => {
    await logoutUser()
    window.location.href = './../../login.html'
})
