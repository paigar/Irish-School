---
title: "Sobre nosotros"
imagencabecera: edificio.jpg
permalink: /sobre-nosotros/
css: ["posts-concat.css"]
components:
  - name: "posts-list-with-images"
    filter: programas
    style: "parrilla"
    order: orden
    heading: "Nuestros programas"
---

Irish School es una empresa pionera en la organización de cursos de idiomas en el extranjero. Cuenta con más de 45 años de experiencia en la promoción y organización de programas de Inglés en Irlanda principalmente.

{% set listado = collections.nosotros %}
{% for item in listado %}

<div class="sec">
{% imagen item.data.imagencabecera,
      item.data.title,
      '',
      "500px" %}
<div class="contenido">
<h3 class="titulo">{{ item.data.title }}</h3>
{{ item.content | safe }}
</div>
</div>
{% endfor %}
