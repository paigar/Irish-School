function borrarClave() {
	localStorage.removeItem("staticrypt_passphrase");
}

// Llama a esta función cuando se pulse el enlace con id "logout"
document.getElementById("logout").addEventListener("click", borrarClave);
