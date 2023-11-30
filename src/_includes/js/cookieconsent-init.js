var cc = initCookieConsent();

// run plugin with config object
cc.run({
	current_lang: "es",
	autoclear_cookies: true, // default: false
	cookie_name: "cc_cookie", // default: 'cc_cookie'
	cookie_expiration: 365, // default: 182
	force_consent: true, // default: false
	autorun: "{{ page.url }}" !== "/uso-de-cookies/",

	// page_scripts: false,                         // default: false
	// auto_language: null,                     // default: null; could also be 'browser' or 'document'
	// autorun: true,                           // default: true
	// delay: 0,                                // default: 0
	// hide_from_bots: false,                   // default: false
	// remove_cookie_tables: false              // default: false
	// cookie_domain: location.hostname,        // default: current domain
	// cookie_path: '/',                        // default: root
	// cookie_same_site: 'Lax',
	// use_rfc_cookie: false,                   // default: false
	// revision: 0,                             // default: 0

	gui_options: {
		consent_modal: {
			layout: "cloud", // box,cloud,bar
			position: "middle center", // bottom,middle,top + left,right,center
			transition: "zoom", // zoom,slide
		},
		settings_modal: {
			layout: "bar", // box,bar
			position: "left", // right,left (available only if bar layout selected)
			transition: "slide", // zoom,slide
		},
	},

	/* 	onFirstAction: function () {
		console.log("onFirstAction fired");
	},

	onAccept: function () {
		console.log("onAccept fired!");

		// If analytics category is disabled => load all iframes automatically
		if (cc.allowedCategory("analytics")) {
			console.log("iframemanager: loading all iframes");
			manager.acceptService("all");
		}
	}, */

	onChange: function (cookie, changed_preferences) {
		/* 		console.log("onChange fired!");

		// If analytics category is disabled => ask for permission to load iframes
		if (!cc.allowedCategory("analytics")) {
			console.log("iframemanager: disabling all iframes");
			manager.rejectService("all");
		} else {
			console.log("iframemanager: loading all iframes");
			manager.acceptService("all");
		} */
	},

	languages: {
		es: {
			consent_modal: {
				title: "USO DE COOKIES",
				description:
					"{{ client.siteName }} utiliza cookies propias y de terceros para posibilitar y mejorar tu experiencia de navegación, mostrarte publicidad personalizada así como para realizar análisis estadísticos. Puedes elegir si aceptas las cookies utilizadas por {{ client.siteName }}, o puedes dedicar unos minutos a personalizarlas haciendo click en 'Personalizar'. <br /><br />Obtendrás más información en nuestra <a href='/uso-de-cookies' class='cc-link'>política de cookies</a>.",
				primary_btn: {
					text: "Aceptar y seguir navegando",
					role: "accept_all", //'accept_selected' or 'accept_all'
				},
				secondary_btn: {
					text: "Personalizar",
					role: "settings", //'settings' or 'accept_necessary'
				},
				revision_message:
					"<br><br>Estimado usuario: los términos y condiciones han cambiado desde tu última visita!",
			},
			settings_modal: {
				title: "Configuración de Cookies",
				save_settings_btn: "Guardar configuración",
				accept_all_btn: "Aceptar todo",
				reject_all_btn: "Rechazar todo",
				close_btn_label: "Cerrar",
				cookie_table_headers: [
					{ col1: "Nombre" },
					{ col2: "Dominio" },
					{ col3: "Descripción" },
				],
				blocks: [
					{
						title: "La protección de tus datos es nuestra prioridad",
						description:
							"{{ client.siteName }} utiliza cookies propias y de terceros para posibilitar y mejorar tu experiencia de navegación, mostrarte publicidad personalizada así como para realizar análisis estadísticos.",
					},
					{
						title: "Cookies estrictamente necesarias",
						description:
							"Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan, incluyendo aquellas que el editor utiliza para permitir la gestión y operativa de la página web y habilitar sus funciones y servicios.",
						toggle: {
							value: "necessary",
							enabled: true,
							readonly: true, //cookie categories with readonly=true are all treated as "necessary cookies"
						},
					},
					{
						title: "Cookies estadísticas",
						description:
							"Las cookies estadísticas ayudan a los propietarios de páginas web a comprender cómo interactúan los visitantes con esas páginas, reuniendo y proporcionando información de forma anónima.",
						toggle: {
							value: "analytics",
							enabled: false,
							readonly: false,
						},
						cookie_table: [
							{
								col1: "^_ga",
								col2: "{{ client.domain }}",
								col3: "Registra una identificación única que se utiliza para generar datos estadísticos acerca de cómo utiliza el visitante el sitio web. Es de tipo HTTP y caduca a los dos años.",
								is_regex: true,
							},
							{
								col1: "_gat",
								col2: "{{ client.domain }}",
								col3: "Utilizado por Google Analytics para controlar la tasa de peticiones. Es de tipo HTTP y caduca en un día.",
							},
							{
								col1: "_gid",
								col2: "{{ client.domain }}",
								col3: "Registra una identificación única que se utiliza para generar datos estadísticos acerca de cómo utiliza el visitante el sitio web. Es de tipo HTTP y caduca en un día.",
							},
						],
					},
					{
						title: "Cookies de marketing",
						description:
							"Las cookies de marketing se utilizan para rastrear a los visitantes en las páginas web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual, y por lo tanto, más valiosos para los editores y terceros anunciantes.",
						toggle: {
							value: "marketing",
							enabled: false,
							readonly: false,
						},
						cookie_table: [
							{
								col1: "_fbp",
								col2: "{{ client.domain }}",
								col3: "Utilizada por Facebook para proporcionar una serie de productos publicitarios, como pujas, en tiempo real de terceros anunciantes. Es de tipo HTTP y caduca a los tres meses.",
								is_regex: true,
							},
							{
								col1: "_gcl_au",
								col2: "{{ client.domain }}",
								col3: "Utilizada por Google AdSense para experimentar con la eficiencia publicitaria a través de las webs usando sus servicios. Es de tipo HTTP y caduca a los tres meses.",
							},
							{
								col1: "fr",
								col2: "{{ client.domain }}",
								col3: "Utilizada por Facebook para proporcionar una serie de productos publicitarios como pujas en tiempo real, de terceros anunciantes. Es de tipo HTTP y caduca a los tres meses.",
							},
						],
					},
					{
						title: "Más información",
						description:
							'Puedes obtener más información en nuestra <a href="/uso-de-cookies" class="cc-link">política de cookies</a>.',
					},
				],
			},
		},
	},
});
