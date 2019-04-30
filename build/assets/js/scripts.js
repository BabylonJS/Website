window.onload = function() {
    //    Carousel
    var carouselContainer = document.querySelector('.carousel');
    if (carouselContainer) {
        var carouselPaginationItems = document.querySelectorAll('.carousel-navigate-item');
        var windowWidth = document.documentElement.clientWidth;
        var caretStep = 55;
        var caret = document.querySelector('.carousel-navigate .caret');
        var currentSlide = 0;

        function detectWebGL() {
            // Check for the WebGL rendering context
            if (!!window.WebGLRenderingContext) {
                var canvas = document.createElement('canvas'),
                    names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
                    context = false;

                for (var i in names) {
                    try {
                        context = canvas.getContext(names[i]);
                        if (context && typeof context.getParameter === 'function') {
                            // WebGL is enabled.
                            return 1;
                        }
                    } catch (e) { }
                }

                // WebGL is supported, but disabled.
                return 0;
            }

            // WebGL not supported.
            return -1;
        };

        if (carouselContainer.dataset && carouselContainer.dataset.sample && detectWebGL()) {
            var frame = document.createElement("iframe");
            frame.setAttribute("src", carouselContainer.dataset.sample);
            carouselContainer.innerHTML = '';
            carouselContainer.appendChild(frame);
            var overlay = document.createElement("div");
            overlay.setAttribute("class", 'iframe-overlay');
            overlay.addEventListener('click', function(e) {
                e.target.classList.add('hidden');
            });
            carouselContainer.appendChild(overlay);

        } else {
            function initiateScroll(order) {
                carouselContainer.style.transform = 'translateX(-' + ((order) * 100) + '%)';
                document.querySelector('.carousel-navigate-item.hidden').classList.remove('hidden');
                carouselPaginationItems[order].classList.add('hidden');
                caret.style.left = (order) * caretStep + 15 + 'px';
                currentSlide = order;
            }


            function setAutoSlide() {
                if (currentSlide < carouselPaginationItems.length - 1) {
                    currentSlide++;
                } else {
                    currentSlide = 0;
                }
                initiateScroll(currentSlide);
            }

            carouselPaginationItems[0].classList.add('hidden');
            var delay = carouselContainer.dataset.delay || 4000;

            var interval = setInterval(setAutoSlide, delay);

            carouselPaginationItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    initiateScroll(item.dataset.order);

                    clearInterval(interval);
                    interval = setInterval(setAutoSlide, delay);
                });
            });
            window.addEventListener('resize', function() {
                windowWidth = document.documentElement.clientWidth;
                initiateScroll(currentSlide);
                clearInterval(interval);
                interval = setInterval(setAutoSlide, delay);
            });
        }
    }


    var menuBtn = document.querySelector('.menu-btn');
    var submenuLinks = document.querySelectorAll('.header-ul-wrapper > ul li a');
    var headerTopWrapper = document.querySelector('.header-top-wrapper');
    var outsideHandler = null;

    if (menuBtn.addEventListener) {
        menuBtn.addEventListener('click', showMenu);
    } else if (menuBtn.attachEvent) {
        menuBtn.attachEvent('onclick', showMenu);
    }

    for (var i = submenuLinks.length - 1; i >= 0; i--) {
        if (submenuLinks[i].addEventListener) {
            submenuLinks[i].addEventListener('click', showSubMenu);
        } else if (submenuLinks[i].attachEvent) {
            submenuLinks[i].attachEvent('onclick', showSubMenu);
        }
    }

    // Check is menu open and click was outside menu and close it.
    window.addEventListener('click', function(e) {
        var isMenuActive = headerTopWrapper.classList.contains('show');
        if (e.target.closest('.menu') === null && e.target.closest('.menu-btn') === null && isMenuActive) {
            showMenu();
        }
    });


    function showMenu(event) {
        if (!headerTopWrapper.classList.contains('show')) {
            menuBtn.classList.add("active");
            headerTopWrapper.classList.remove('overflow');
        } else {
            menuBtn.classList.remove("active");
            setTimeout(function() {
                headerTopWrapper.classList.add('overflow');
            }, 500);
        }
        headerTopWrapper.classList.toggle('show');

        var activeElement = document.querySelector('.menu .active');

        if (activeElement) {
            activeElement.classList.remove('active');
            var item = document.querySelector('.sub-menu .' + activeElement.firstChild.classList[0]);

            item.parentNode.classList.add('no-transition');
            setTimeout(function() {
                item.classList.add('hidden');
                item.parentNode.classList.remove('no-transition');
            }, 100);
        }

        if (headerTopWrapper.classList.contains('show-submenu')) {
            headerTopWrapper.classList.remove('show-submenu');
            headerTopWrapper.classList.add('hide-menu');
        }
    }

    function showSubMenu(event) {
        var clickedMenuItem = event.target || event.srcElement;
        var targetName = clickedMenuItem.classList[0];
        var submenuContainer = document.querySelector('.sub-menu > .' + targetName);
        var activeItem = document.querySelector('.header-ul-wrapper li.active');

        if (clickedMenuItem.tagName.toLowerCase() === 'a') {
            clickedMenuItem = clickedMenuItem.parentNode;
        }

        document.querySelectorAll('.sub-menu ul').forEach(function(item) {
            item.classList.add('hidden');
        });

        if (submenuContainer) {
            clickedMenuItem.classList.toggle('active');
            submenuContainer.classList.toggle('hidden');

            if (activeItem && JSON.stringify(activeItem.classList) === JSON.stringify(event.target.classList)) {
                headerTopWrapper.classList.remove('show-submenu');
            } else {
                headerTopWrapper.classList.add('show-submenu');
            }


            headerTopWrapper.classList.remove('hide-menu');
            event.preventDefault();
        } else {
            headerTopWrapper.classList.remove('show-submenu');
        }


        if (activeItem) {
            activeItem.classList.remove('active');
        }
    }
};
