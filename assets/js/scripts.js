window.onload = function () {
    var menuBtn = document.querySelector(".menu-btn");
    var submenuLinks = document.querySelectorAll(".header-ul-wrapper > ul li a");
    var headerTopWrapper = document.querySelector(".header-top-wrapper");

    if (menuBtn.addEventListener) {
        menuBtn.addEventListener("click", showMenu);
    } else if (menuBtn.attachEvent) {
        menuBtn.attachEvent("onclick", showMenu);
    }

    for (var i = submenuLinks.length - 1; i >= 0; i--) {
        if (submenuLinks[i].addEventListener) {
            submenuLinks[i].addEventListener("click", showSubMenu);
        } else if (submenuLinks[i].attachEvent) {
            submenuLinks[i].attachEvent("onclick", showSubMenu);
        }
    }


    function showMenu(event) {
        headerTopWrapper.classList.toggle("show");

        var activeElement = document.querySelector(".menu .active");

        if(activeElement){
            activeElement.classList.remove("active");
            var item = document.querySelector(".sub-menu ." + activeElement.firstChild.classList[0]);

            item.parentNode.classList.add("no-transition");
            setTimeout(function () {
                item.classList.add("hidden");
                item.parentNode.classList.remove("no-transition");
            }, 100);
        }

        if (headerTopWrapper.classList.contains("show-submenu")) {
            headerTopWrapper.classList.remove("show-submenu");
            headerTopWrapper.classList.add("hide-menu");
        }
    }

    function showSubMenu(event) {
        event.preventDefault();
        var clickedMenuItem = event.target || event.srcElement;
        var targetName = clickedMenuItem.classList[0];
        var submenuContainer = document.querySelector(".sub-menu > ." + targetName);

        if(clickedMenuItem.tagName.toLowerCase() === "a"){
            clickedMenuItem = clickedMenuItem.parentNode;
        }

        clickedMenuItem.classList.toggle("active");


        if (submenuContainer) {
            submenuContainer.classList.toggle("hidden");
            headerTopWrapper.classList.toggle("show-submenu");
            headerTopWrapper.classList.remove("hide-menu");
            event.preventDefault();
        }
    }



//    Carousel

    var carousel = document.querySelector(".carousel ul");
    var carouselPaginationItems = document.querySelectorAll(".carousel-navigate-item");
    var carouselItems = document.querySelectorAll(".carousel ul li");
    var windowWidth = document.documentElement.clientWidth;
    var caretStep = 37;
    var caret = document.querySelector(".carousel-navigate .caret");
    var currentSlide = 0;

    function detectWebGL()
    {
        // Check for the WebGL rendering context
        if ( !! window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;

            for (var i in names) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter === "function") {
                        // WebGL is enabled.
                        return 1;
                    }
                } catch (e) {}
            }

            // WebGL is supported, but disabled.
            return 0;
        }

        // WebGL not supported.
        return -1;
    };

    if (detectWebGL()) {
        for (var i = 0; i < carouselItems.length; i++) {
            var sampleUrl = carouselItems[i].dataset.sample;
            if (sampleUrl) {
                var sample = document.createElement("iframe");
                sample.setAttribute("src", sampleUrl);
                carouselItems[i].appendChild(sample);
            }
        }
    } else {
        //nothing to do
    }



    function initiateScroll(order) {
        carousel.style.transform = "translateX(-" + ((order) * windowWidth) + "px)";
        document.querySelector(".carousel-navigate-item.hidden").classList.remove("hidden");
        carouselPaginationItems[order].classList.add("hidden");
        caret.style.left = (order) * caretStep + 10 + 'px';
        currentSlide = order;
    }


    function setAutoSlide() {
        if(currentSlide  < carouselPaginationItems.length){
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        initiateScroll(currentSlide);
    }

    carouselPaginationItems[0].classList.add("hidden");

    var interval = setInterval(setAutoSlide, 20000);

    carouselPaginationItems.forEach(function (item) {
        item.addEventListener("click", function () {
            initiateScroll(item.dataset.order);

            clearInterval(interval);
            interval = setInterval(setAutoSlide, 4000);
        });
    });

};
