document.addEventListener("DOMContentLoaded", () => {
	// ===> DOM elements <=== //

	const imagesContainer = document.getElementById("galeria");
	const lightbox = document.getElementById("lightbox");
	const header = document.querySelector(".site-header");

	// ===> Event listeners and triggers <=== //

	// Crear contenido del lightbox
	function crearLightbox(boton) {
		let prev = boton.previousElementSibling;
		let next = boton.nextElementSibling;
		let contenidoLightbox =
			'<button class="close-lightbox"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg></button>';
		if (prev) {
			contenidoLightbox +=
				'<button data-cerrar="no" id="buttonPrev"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg></button>';
		}
		contenidoLightbox +=
			'<div class="ajustar"><img src="' +
			boton.querySelector(".imagen").getAttribute("data-imagen") +
			'" alt="' +
			boton.querySelector(".imagen").getAttribute("data-alt") +
			'" /></div>';
		if (next) {
			contenidoLightbox +=
				'<button data-cerrar="no" id="buttonNext"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg></button>';
		}

		lightbox.innerHTML = contenidoLightbox;
		lightbox.classList.add("show");
		header.classList.add("atras");
		document.body.classList.add("noscroll");
		trapFocus(lightbox);

		if (prev) {
			buttonPrev.addEventListener("click", (e) => {
				crearLightbox(prev);
			});
		}
		if (next) {
			buttonNext.addEventListener("click", (e) => {
				crearLightbox(next);
			});
		}

		// Navegar con flechas
		lightbox.addEventListener("keyup", handleKeyUp);
		function handleKeyUp(e) {
			if (e.key == "ArrowLeft" && prev !== null) {
				crearLightbox(prev);
				lightbox.removeEventListener("keyup", handleKeyUp);
			}
			if (e.key == "ArrowRight" && next !== null) {
				crearLightbox(next);
				lightbox.removeEventListener("keyup", handleKeyUp);
			}
			if (e.key == "Escape") cerrarlightbox();
		}

		// Hide Lightbox
		lightbox.addEventListener("click", (e) => {
			if (!e.target.hasAttribute("data-cerrar")) {
				cerrarlightbox();
			}
		});

		function cerrarlightbox() {
			lightbox.classList.remove("show");
			header.classList.remove("atras");
			document.body.classList.remove("noscroll");
			lightbox.removeEventListener("keyup", handleKeyUp);
		}
	}

	// Show lightbox
	imagesContainer.addEventListener("click", (e) => {
		const imageWrapper = e.target.closest(".elementogaleria");
		crearLightbox(imageWrapper);
	});

	imagesContainer.classList.add("clicable");
});

// Limitar tabs a lightbox

function trapFocus(element) {
	let focusableEls = element.querySelectorAll("button:not([disabled])");
	let firstFocusableEl = focusableEls[0];
	let lastFocusableEl = focusableEls[focusableEls.length - 1];
	let KEYCODE_TAB = 9;

	setTimeout(function () {
		lastFocusableEl.focus();
	}, 100);

	element.addEventListener("keydown", function (e) {
		let isTabPressed = e.key === "Tab" || e.keyCode === KEYCODE_TAB;

		if (!isTabPressed) {
			return;
		}

		if (e.shiftKey) {
			/* shift + tab */ if (document.activeElement === firstFocusableEl) {
				lastFocusableEl.focus();
				e.preventDefault();
			}
		} /* tab */ else {
			if (document.activeElement === lastFocusableEl) {
				firstFocusableEl.focus();
				e.preventDefault();
			}
		}
	});
}
