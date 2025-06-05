async function arraysArchivos(programa) {
	try {
		const response = await fetch(
			"https://irish.idenautas.work/generarJSON.php?programa=" + programa
		);
		console.log(
			"https://irish.idenautas.work/generarJSON.php?programa=" + programa
		);
		if (!response.ok) {
			throw new Error("Error al obtener días ocupados");
		}
		const data = await response.json();
		return [data.Imagenes, data.Documentos, data.Texto] || [];
	} catch (error) {
		return ["error"];
	}
}

async function llamada(programa) {
	let arrayArchivo = await arraysArchivos(programa);

	const textoPrivado = document.getElementById("texto-privado");
	let converter = new showdown.Converter();
	let md = arrayArchivo[2];
	let html = converter.makeHtml(md);
	textoPrivado.innerHTML = html;
	console.log(arrayArchivo[2]);

	const containerImagenes = document.getElementById("lightgallery");

	let estructura = "";
	for (let i = 0; i < arrayArchivo[0].length; i++) {
		estructura +=
			'<a href="https://irish.idenautas.work/archivos-' +
			programa +
			"/" +
			arrayArchivo[0][i] +
			'">';
		estructura +=
			'<img alt="" src="https://irish.idenautas.work/archivos-' +
			programa +
			"/" +
			arrayArchivo[0][i] +
			'"/>';
		estructura += "</a>";
	}

	containerImagenes.innerHTML = estructura;

	lightGallery(document.getElementById("lightgallery"), {
		speed: 500,
	});

	const containerArchivos = document.getElementById("archivos-privado");
	let estructura2 = '<ul class="privado-archivos">';

	for (let i = 0; i < arrayArchivo[1].length; i++) {
		estructura2 += "<li>";
		estructura2 +=
			'<a target="_blank" href="https://irish.idenautas.work/archivos-' +
			programa +
			"/" +
			arrayArchivo[1][i] +
			'">';
		estructura2 += arrayArchivo[1][i];
		estructura2 += "</li>";
	}

	estructura2 += "</ul>";

	containerArchivos.innerHTML = estructura2;

	//Construir dentro de esta funcion las imagenes y los archivos
}
