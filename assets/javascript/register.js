import { hideAlert, showAlert, setButtonLoading, registerUser, getFirestoreErrorMessage } from "./auth.js"

const form = document.getElementById('registerForm')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const cityInput = document.getElementById('city')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirmPassword')
const registerBtn = document.getElementById('registerBtn')
const successBox = document.getElementById('registerSuccess')



form?.addEventListener('submit', async (e) =>{
    e.preventDefault()

    hideAlert('registerAlert')
    successBox.classList.add('d-none')
    successBox.textContent = ''
    
    const name = nameInput.value.trim()
    const email = emailInput.value.trim()
    const city = cityInput.value.trim()
    const password = passwordInput.value.trim()
    const confirmPassword = confirmPasswordInput.value.trim()

    if(!name || !email || !password || !confirmPassword) {
        showAlert('registerAlert', 'Todos los datos son Obligatorios')
        return
    }

    if (password !== confirmPassword) {
        showAlert('registerAlert', 'Las password no son iguales')
        return
    }

    // simulacion de registro
    localStorage.setItem('userName', name)

    showAlert('registerAlert', 'Registro Satisfactorio')
    window.location.href = 'login.html'

})

//agregar if para password menor a 6 caracteres

 try {
         registerBtn(
            loginBtn,
            true,
            '<i class="bi bi-box-person-check me-2"></i> Crear Cuenta',
            'Creando cuenta'
        )
        await registerUser({name, email, password, favoriteCity})
        successBox.textContent = 'Cuenta Creada'
        successBox.classList.remove('d-none')

        setTimeout(() => {
            window.location.href = './../../dashboard.html'
        }, 1200)
    } catch (error) {
         showAlert('registerAlert', getFirebaseErrorMessage(error))
    } finally {
        registerBtn(
            loginBtn,
            false,
            '<i class="bi bi-box-person-check me-2"></i> Crear Cuenta'
        )
    }