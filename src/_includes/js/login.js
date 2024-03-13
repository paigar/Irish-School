const keySize = 256;
const iterations = 1000;
const formElement = document.getElementById("staticrypt-form");
let errorCount = 0;
const errors = [
	"La contraseña no es correcta",
	"Error!  Inténtalo de nuevo.",
	"¿Tal vez tienes activadas las mayúsculas?",
	"Vuelve a intentarlo, por favor.",
	"Incorrecto.",
	"No es la contraseña correcta, lo siento.",
	"Comprueba que la contraseña sea correcta.",
];

function decrypt(encryptedMsg, pass) {
	var salt = CryptoJS.enc.Hex.parse(encryptedMsg.substr(0, 32));
	var iv = CryptoJS.enc.Hex.parse(encryptedMsg.substr(32, 32));
	var encrypted = encryptedMsg.substring(64);

	var key = CryptoJS.PBKDF2(pass, salt, {
		keySize: keySize / 32,
		iterations: iterations,
	});

	var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
		iv: iv,
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC,
	}).toString(CryptoJS.enc.Utf8);
	return decrypted;
}

function submitPass(passphrase) {
	const encryptedMsg = "{encrypted}";
	const encryptedHMAC = encryptedMsg.substring(0, 64);
	const encryptedHTML = encryptedMsg.substring(64);
	const decryptedHMAC = CryptoJS.HmacSHA256(
		encryptedHTML,
		CryptoJS.SHA256(passphrase).toString()
	).toString();

	if (decryptedHMAC !== encryptedHMAC) {
		document.querySelector(".instructions").innerHTML = errors[errorCount];
		if (errorCount < errors.length - 1) {
			errorCount += 1;
		}
		return;
	}
	// good pass, decrypt the page
	const myStorage = window.sessionStorage;
	myStorage.setItem("passphrase", passphrase);
	const plainHTML = decrypt(encryptedHTML, passphrase);

	document.write(plainHTML);
	document.close();
}

// catch the form submission
formElement.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputValue = document.getElementById("staticrypt-password").value;
	submitPass(inputValue);
});

// auto-decrypt if the password is in session storage
document.addEventListener("DOMContentLoaded", () => {
	const myStorage = window.sessionStorage;
	if (myStorage.getItem("passphrase")) {
		submitPass(myStorage.getItem("passphrase"));
	}
});
