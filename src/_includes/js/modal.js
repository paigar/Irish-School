const modal = document.querySelector(".modal");
const infolegal = modal.querySelector(".infolegal");
const md = infolegal.innerHTML;
const politica = "## Política de privacidad " + md.split("---").pop();
let converter = new showdown.Converter(),
	text = politica;
infolegal.innerHTML = converter.makeHtml(text);

const abrirmodal = document.querySelector(".abrirmodal");
abrirmodal.innerHTML = "política de privacidad";
abrirmodal.addEventListener("click", () => {
	abrirlightbox();
});

function abrirlightbox() {
	modal.classList.add("show");
	document.body.classList.add("noscroll");
	document.addEventListener("keyup", handleKeyUp);
	modal.addEventListener("click", (e) => {
		if (e.target.hasAttribute("data-cerrar")) {
			cerrarlightbox();
		}
	});
	trapFocus(modal);
}

function cerrarlightbox() {
	modal.classList.remove("show");
	document.body.classList.remove("noscroll");
	document.removeEventListener("keyup", handleKeyUp);
}

function handleKeyUp(e) {
	if (e.key == "Escape") cerrarlightbox();
}

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
