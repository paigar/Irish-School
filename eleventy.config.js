const CleanCSS = require("clean-css");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const htmlmin = require("html-minifier-terser");
const fs = require("fs");
const { minify } = require("terser");
const { DateTime } = require("luxon");
const striptags = require("striptags");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
	/* Filtros */

	/* Minimizar CSS */
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	/* Convertir Color HEX en HSL */
	eleventyConfig.addFilter("hextohsl", function (H, opt) {
		// Convert hex to RGB first
		let r = 0,
			g = 0,
			b = 0;
		if (H.length == 4) {
			r = "0x" + H[1] + H[1];
			g = "0x" + H[2] + H[2];
			b = "0x" + H[3] + H[3];
		} else if (H.length == 7) {
			r = "0x" + H[1] + H[2];
			g = "0x" + H[3] + H[4];
			b = "0x" + H[5] + H[6];
		}
		// Then to HSL
		r /= 255;
		g /= 255;
		b /= 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		if (h < 0) h += 360;

		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		if (opt == "h") return h;
		if (opt == "s") return s + "%";
		if (opt == "l") return l + "%";
	});

	/* Obtener nombre de thumbnails para imágenes */
	eleventyConfig.addFilter("thumbname", function (file, size) {
		const extension = path.extname(file);
		const name = path.basename(file, extension);
		return `${name}-${size}w`;
	});

	/* Dar formato a las fechas */
	eleventyConfig.addFilter("asPostDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
	});

	/* Crear sinopsis del artículo */
	eleventyConfig.addFilter("excerpt", function (content, lenght) {
		let excerpt = null;

		excerpt = striptags(content)
			.substring(0, lenght) // Cap at x characters
			.replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, "")
			.trim()
			.concat("...");
		return excerpt;
	});

	/* Limitar número de artículos pasados en un array */
	eleventyConfig.addFilter("limit", function (arr, limit) {
		return arr.slice(0, limit);
	});

	/* Obtener artículos aleatorios */
	eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
		// Filters out current page
		const pageArr = arr.filter((page) => page.url !== currPage);
		// Randomizes remaining items
		pageArr.sort(() => {
			return 0.5 - Math.random();
		});
		// Returns array items up to limit
		return pageArr.slice(0, limit);
	});

	/* Eliminar un artículo de una colección por su URL */
	eleventyConfig.addFilter(
		"excludeByURL",
		function (collection = [], url = "") {
			if (!url) {
				return collection;
			}
			return collection.filter((item) => item.url != url);
		}
	);

	/* Ordenar artículos */
	function sortByOrder(values) {
		let vals = [...values]; // this *seems* to prevent collection mutation...
		return vals.sort((a, b) => Math.sign(a.data.order - b.data.order));
	}
	eleventyConfig.addFilter("sortByOrder", sortByOrder);

	/* Plugins */
	eleventyConfig.addPlugin(pluginRss);

	/* Genera imágenes de varios tamaños para web */
	eleventyConfig.addNunjucksAsyncShortcode(
		"imagen",
		async function (
			src,
			alt,
			caption,
			sizes = "(min-width: 55rem) 820px, 100vw"
		) {
			if (!alt) {
				throw new Error(`Missing \`alt\` on myImage from: ${src}`);
			}

			let imgSrc = path.dirname(this.page.inputPath) + "/img/" + src;
			let urlPath = this.page.url + "/img/";
			let outputDir = path.dirname(this.page.outputPath) + "/img/";
			if (this.page.url == "/") {
				urlPath = "/assets/images";
				outputDir = path.dirname(this.page.outputPath) + "/assets/images/";
			}
			let metadata = await Image(imgSrc, {
				widths: [20, 420, 820, 1280, 1800],
				formats: ["avif", "webp", "jpeg"],
				urlPath: urlPath,
				outputDir: outputDir,
				filenameFormat: function (id, src, width, format, options) {
					const extension = path.extname(src);
					const name = path.basename(src, extension);
					return `${name}-${width}w.${format}`;
				},
			});
			let lowsrc = metadata.jpeg[0];
			let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

			return htmlmin.minify(
				`<figure class="imagen" style="background-image: url(${
					lowsrc.url
				}); aspect-ratio: ${highsrc.width} / ${highsrc.height}" data-imagen="${
					highsrc.url
				}" data-alt="${alt}">
          <picture>
          ${Object.values(metadata)
						.map((imageFormat) => {
							return `  <source type="${
								imageFormat[0].sourceType
							}" srcset="${imageFormat
								.map((entry) => entry.srcset)
								.join(", ")}" sizes="${sizes}">`;
						})
						.join("\n")}
            <img
              src="${lowsrc.url}"
              width="${highsrc.width}"
              height="${highsrc.height}"
              alt="${alt}"
              loading = 'lazy'
              decoding="async">
          </picture>
          ${caption ? `<figcaption>${caption}</figcaption>` : ``}
          </figure>
          `,
				{ collapseWhitespace: true }
			);
		}
	);

	/* Minimizar javascript */
	eleventyConfig.addNunjucksAsyncFilter(
		"jsmin",
		async function (code, callback) {
			try {
				const minified = await minify(code);
				callback(null, minified.code);
			} catch (err) {
				console.error("Terser error: ", err);
				// Fail gracefully.
				callback(null, code);
			}
		}
	);

	/* Añadir colección para la galería de imágenes */
	eleventyConfig.addCollection("galeria", () => {
		const galleryPath = path.resolve("./src/pages/galeria/img");
		const files = fs.readdirSync(galleryPath);
		const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

		return files.map((file) => {
			if (allowedExtensions.exec(file)) {
				// console.log(`🖼 Adding picture to gallery: ${file}`);
				return {
					name: file.split(".")[0], // Get image name without extension
					src: file,
				};
			}
		});
	});

	/* Copia de ficheros */
	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		jsTemplateEngine: "njk",

		dir: {
			input: "src",
			output: "_site",
			layouts: "_includes/layouts",
		},
	};
};

/* Funciones */
function extractExcerpt(article) {
	let excerpt = null;

	excerpt = striptags(article)
		.substring(0, 100) // Cap at 100 characters
		.replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, "")
		.trim()
		.concat("...");
	return excerpt;
}
