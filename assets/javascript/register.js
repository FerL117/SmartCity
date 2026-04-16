document.getElementById('registerForm')?.addEventListener('submit', (e) =>{
    e.preventDefault()
    
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if(!name || !email || !password || !confirmPassword) {
        showAlert('registerAler', 'Todos los datos son Obligatorios')
        return
    }

    if (password !== confirmPassword) {
        showAlert('registerAlert', 'Las password no son iguales')
        return
    }

    // simulacion de registro
    localStorage.setItem('userName', name)

    showAler('registerAlert', 'Registro Satisfactorio')
    window.location.href = 'login.html'

})