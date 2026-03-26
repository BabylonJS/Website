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

if (queryString && !queryString.startsWith('?fbclid=')) {
	var query = queryString.replace("?", "");

	window.location = "./Demos/" + query;
}


function webGLDescription() {
	document.getElementById("descriptionBox").style.visibility = "visible";
}

function noWebGLDescription(){
    document.getElementById("descriptionBox").style.visibility = "hidden";
}



