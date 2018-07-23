/* ==========================================================================
   Main JS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
	// Extract from jQuery Easing v1.3
	jQuery.extend(jQuery.easing, {
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}
	});

	// Bulletproof ease scrolling function
	$("a[href^='#']").click(function (e) {
		e.preventDefault();
		var anchor = this.hash;
		if (anchor === "") { return false; }
		// Add exceptions here
		$('body').addClass("filteredscrolling");
		$('html,body').stop().animate({ 'scrollTop': Math.ceil($(anchor).offset().top) }, 1000, 'easeInOutQuint', function () {
			anchor == "#top" ? window.location.hash = '' : window.location.hash = anchor;
			$('body').removeClass("filteredscrolling");
		});
	});

	// All demos
	var demos = document.querySelectorAll("#maindemossection article");

	// Add filter for webvr tab
	var webvrFilter = document.querySelector(".filter");
	var demoGallery = document.querySelector("#maindemossection .gallery");

	// Clean a division
	var clean = function (div) {
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
	}

	webvrFilter.addEventListener('change', function () {
		let value = this.value;
		// Restore all demos
		clean(demoGallery);
		for (let d = 0; d < demos.length; d++) {
			let demo = demos[d];
			demoGallery.appendChild(demo);
		}

		if (value !== 'all') {
			for (let d = 0; d < demos.length; d++) {
				let demo = demos[d];
				if (!demo.classList.contains(value) && demo.parentElement === demoGallery) {
					demoGallery.removeChild(demo);
				}
			}
		}
	});
});

// Query string
var queryString = window.location.search;

if (queryString) {
	var query = queryString.replace("?", "");

	window.location = "./Demos/" + query;
}

//Giving Description to big WebGL Element
let descriptionBox = document.createElement("p");
descriptionBox.id = "descBox";
descriptionBox.appendChild(document.createTextNode("Web Graphics Library, or WebGL, is a JavaScript API designed to render interactive 3D computer graphics and 2D graphics within any compatible web browser, without the use of any plug-ins."));

document.getElementById("bigWebGL").appendChild(descriptionBox);
let descBox = document.getElementById("descBox");
descBox.style.visibility = "hidden";
//Styling
descBox.style.fontSize = "15px";
descBox.style.color = "#000";
descBox.style.backgroundColor = "#FFF";
descBox.style.position = "absolute";
descBox.style.width = "300px";
descBox.style.height = "90px";
descBox.style.border = "solid black";
descBox.style.padding = "10px";
descBox.style.fontFamily = "roboto";

function webGLDescription() {
	document.getElementById("descBox").style.visibility = "visible";
}

function noWebGLDescription(){
    document.getElementById("descBox").style.visibility = "hidden";
}



