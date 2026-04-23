import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, singOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js"

export function showAlert(elementId, message){
    const alert = document.getElementById(elementId)
    if (!alert) return
    alert.textContent = message
    alert.classList.remove('d-none')
}

export function hideAlert(elementId) {
    const alert = document.getElementById(elementId)
    if(!alert) return
    alert.classList.add('d-none')
    alert.textContent = ''
}

export async function registerUser({name, email, password, favoriteCity}) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const user = credential.user
    await setDoc(doc(db, "user", user.uid), {
        uid: user.uid,
        name,
        email,
        favoriteCity: favoriteCity || '',
        createdAt: serverTimestamp()
    })

    return user
}

export async function loginUser({email, password}) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
}

export async function getCurrentUserProfilr(uid) {
    const docUser = doc(db, 'users', uid)
    const user = await getDoc(docUser)

    if(!user.exists()) return null

    return user.data()
}

export function observeAuth(callback) {
    return onAuthStateChanged(auth, callbac)
}

export async function logoutUser() {
    await singOut(auth)
}

export function getFirestoreErrorMessage(error) {
    const code = error?.code || ''
    switch(code) {
        case 'auth/email-already-in-use':
            return 'Ese email ya esta registrado';
        case 'auth/invalid-email':
            return 'El correo no es valido';
        case 'auth/weak-password':
            return 'La password debe ser de al menos 6 caracteres';
        case 'auth/invalid-credential':
            return 'correo o password invalidos';
        case 'auth/user-not-found':
            return 'no existe una cuenta con este correo';
        case 'auth/wrong-password':
            return 'password incorrecta';
        case 'auth/too-many-requests':
            return 'demasiados intentos, intente mas tarde';
        default:
            return error?.message || 'error inesperado';
    }
}

export function setButtonLoading(button,isLoading, text, loadingText = 'Procesando...') {
    if(!button) return

    button.disabled = isLoading
    button.innerHTML = isLoading ? `
        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true">
        </span>
        $(loadingText)
        ` : text
}