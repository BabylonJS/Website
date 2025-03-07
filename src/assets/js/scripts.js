window.onload = function () {
  //    Carousel
  var carouselContainer = document.querySelector(".carousel");
  // if exists but not an assets (3D) carousel
  if (carouselContainer && !carouselContainer.classList.contains("assets")) {
    var carouselPaginationItems = document.querySelectorAll(
      ".carousel-navigate-item"
    );
    var windowWidth = document.documentElement.clientWidth;
    var caretStep = 55;
    var caret = document.querySelector(".carousel-navigate .caret");
    var currentSlide = 0;

    function detectWebGL() {
      // Check for the WebGL rendering context
      if (!!window.WebGLRenderingContext) {
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
    }

    if (
      carouselContainer.dataset &&
      carouselContainer.dataset.sample &&
      detectWebGL()
    ) {
      var frame = document.createElement("iframe");
      frame.setAttribute("src", carouselContainer.dataset.sample);
      carouselContainer.innerHTML = "";
      carouselContainer.appendChild(frame);
      var overlay = document.createElement("div");
      overlay.setAttribute("class", "iframe-overlay");
      overlay.addEventListener("click", function (e) {
        e.target.classList.add("hidden");
      });
      carouselContainer.appendChild(overlay);
    } else {
      function initiateScroll(order) {
        carouselContainer.style.transform = "translateX(-" + order * 100 + "%)";
        document
          .querySelector(".carousel-navigate-item.hidden")
          .classList.remove("hidden");
        carouselPaginationItems[order].classList.add("hidden");
        caret.style.left = order * caretStep + 15 + "px";
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

      carouselPaginationItems[0].classList.add("hidden");
      var delay = carouselContainer.dataset.delay || 4000;

      var interval = setInterval(setAutoSlide, delay);

      carouselPaginationItems.forEach(function (item) {
        item.addEventListener("click", function () {
          initiateScroll(item.dataset.order);

          clearInterval(interval);
          interval = setInterval(setAutoSlide, delay);
        });
      });
      window.addEventListener("resize", function () {
        windowWidth = document.documentElement.clientWidth;
        initiateScroll(currentSlide);
        clearInterval(interval);
        interval = setInterval(setAutoSlide, delay);
      });
    }
  }

  var menuBtn = document.querySelector(".menu-btn");
  var submenuLinks = document.querySelectorAll(".header-ul-wrapper > ul li a");
  var headerTopWrapper = document.querySelector(".header-top-wrapper");
  var outsideHandler = null;

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

  // Check is menu open and click was outside menu and close it.
  window.addEventListener("click", function (e) {
    var isMenuActive = headerTopWrapper.classList.contains("show");
    if (
      e.target.closest(".menu") === null &&
      e.target.closest(".menu-btn") === null &&
      isMenuActive
    ) {
      showMenu();
    }
  });

  function showMenu(event) {
    if (!headerTopWrapper.classList.contains("show")) {
      menuBtn.classList.add("active");
      headerTopWrapper.classList.remove("overflow");
    } else {
      menuBtn.classList.remove("active");
      setTimeout(function () {
        headerTopWrapper.classList.add("overflow");
      }, 500);
    }
    headerTopWrapper.classList.toggle("show");

    var activeElement = document.querySelector(".menu .active");

    if (activeElement) {
      activeElement.classList.remove("active");
      var item = document.querySelector(
        ".sub-menu ." + activeElement.firstChild.classList[0]
      );

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
    var clickedMenuItem = event.target || event.srcElement;
    var targetName = clickedMenuItem.classList[0];
    var submenuContainer = document.querySelector(".sub-menu > ." + targetName);
    var activeItem = document.querySelector(".header-ul-wrapper li.active");

    if (clickedMenuItem.tagName.toLowerCase() === "a") {
      clickedMenuItem = clickedMenuItem.parentNode;
    }

    document.querySelectorAll(".sub-menu ul").forEach(function (item) {
      item.classList.add("hidden");
    });

    if (submenuContainer) {
      clickedMenuItem.classList.toggle("active");
      submenuContainer.classList.toggle("hidden");

      if (
        activeItem &&
        JSON.stringify(activeItem.classList) ===
          JSON.stringify(event.target.classList)
      ) {
        headerTopWrapper.classList.remove("show-submenu");
      } else {
        headerTopWrapper.classList.add("show-submenu");
      }

      headerTopWrapper.classList.remove("hide-menu");
      event.preventDefault();
    } else {
      headerTopWrapper.classList.remove("show-submenu");
    }

    if (activeItem) {
      activeItem.classList.remove("active");
    }
  }

  // Manifest example:

  /*
{
    "demos": [
        {
        "filename": "demos/2021_lamborghini_countach_lpi_800-4.glb",
        "title": "2021 Lamborghini Countach LPI 800",
        "description": "The 2021 Lamborghini Countach LPI 800-4 is a limited edition hybrid supercar that pays homage to the original Countach. It features a 6.5-liter V12 engine paired with an electric motor for a total output of 803 horsepower.",
        "tags": ["lamborghini", "countach", "supercar", "hybrid"],
        "author": "",
        "thumbnail": "thumbnails/2021_lamborghini_countach_lpi_800-4.glb.png",
        "main": true
        },
        {
        "filename": "demos/cartoon_octopus_takes_a_tea_bath.glb",
        "title": "Cartoon Octopus Takes a Tea Bath",
        "description": "This cute cartoon octopus is taking a relaxing tea bath. It's a fun and whimsical 3D model that is perfect for animation or rendering projects.",
        "tags": ["cartoon", "octopus", "tea", "bath"],
        "author": "",
        "size": "small"
        },
        {
        "filename": "demos/ftm.glb",
        "title": "Futuristic Transportation Module",
        "tags": ["futuristic", "transportation", "module", "urban", "mobility"],
        "author": ""
        },
    ],
    "baseUrl": "https://whatever.com"
}
*/

  // if the page is the main page or the featureDemos page, load the manifest
  if (
    location.pathname.indexOf("/featureDemos/") === 0 ||
    location.pathname === "/"
  ) {
    const isMainPage = location.pathname === "/";
    // load the manifest from https://babylonjsassetslib.z01.azurefd.net/DEMOS/manifest.json
    getManifest().then((manifest) => {
      const hexGrid = document.getElementById("hexGrid");
      if ((!isMainPage && !hexGrid) || !manifest.demos) {
        // no hexGrid to add elements to
        return;
      }
      const updateCarousel = false;
      if (isMainPage && updateCarousel) {
        // get only the demos marked with "main": true
        const mainDemos = manifest.demos.filter((demo) => demo.main);
        var carouselContainer = document.querySelector(".carousel");
        if (!carouselContainer) {
          return;
        }
        let hovering = false;
        let pointer = false;
        carouselContainer.addEventListener("mouseover", function () {
          hovering = true;
        });
        carouselContainer.addEventListener("mouseout", function () {
          hovering = false;
        });
        // same with pointerdown and poitnerup
        carouselContainer.addEventListener("pointerdown", function () {
          pointer = true;
        });
        carouselContainer.addEventListener("pointerup", function () {
          pointer = false;
        });
        const html = mainDemos
          .map((demo) => {
            return `
<div class="img-holder">
 <babylon-viewer
            source="${manifest.baseUrl}/${demo.filename}"
            environment="https://cdn.jsdelivr.net/npm/@babylonjs/viewer/assets/photoStudio.env"
          >
          </babylon-viewer>
        </div>
`;
          })
          .join("");
        carouselContainer.innerHTML = html;
        let navigationHtml = `
<img src="/assets/img/CarouselActive.svg" alt="" class="caret">
`;
        mainDemos.forEach((demo, index) => {
          navigationHtml += `<div class="carousel-navigate-item" data-order="$${index}">
            <img src="/assets/img/CarouselBreadcrumb.svg" alt="">
        </div>`;
        });
        const navigationHtmlElement =
          document.querySelector(".carousel-navigate");
        navigationHtmlElement.innerHTML = navigationHtml;

        var carouselPaginationItems = document.querySelectorAll(
          ".carousel-navigate-item"
        );

        var caretStep = 55;
        var caret = document.querySelector(".carousel-navigate .caret");
        var currentSlide = 0;

        function initiateScroll(order) {
          carouselContainer.style.transform =
            "translateX(-" + order * 100 + "%)";
          document
            .querySelector(".carousel-navigate-item.hidden")
            .classList.remove("hidden");
          carouselPaginationItems[order].classList.add("hidden");
          caret.style.left = order * caretStep + 15 + "px";
          currentSlide = order;
        }

        function setAutoSlide() {
          if (hovering || pointer) {
            return;
          }
          if (currentSlide < carouselPaginationItems.length - 1) {
            currentSlide++;
          } else {
            currentSlide = 0;
          }
          initiateScroll(currentSlide);
        }

        carouselPaginationItems[0].classList.add("hidden");
        var delay = carouselContainer.dataset.delay || 4000;

        var interval = setInterval(setAutoSlide, delay);

        carouselPaginationItems.forEach(function (item, index) {
          item.addEventListener("click", function () {
            initiateScroll(index);

            clearInterval(interval);
            interval = setInterval(setAutoSlide, delay);
          });
        });
      } else {
        manifest.demos.forEach((demo) => {
          // default thumbnail is in the thumbnails/ directory, and is named FILENAME.png (i.e. thumbnails/cartoon_octopus_takes_a_tea_bath.glb.png)

          // add a new li element that looks like this:
          const thumbnailPath =
            demo.thumbnail ||
            `thumbnails/${demo.filename.split("/").pop()}.png`;
          const li = document.createElement("li");
          li.classList.add("hex");
          li.innerHTML = `
<div class="hexIn">
        <a class="hexLink" href="/viewer.html?url=${manifest.baseUrl}/${
            demo.filename
          }" target="_blank">
            <img src="${manifest.baseUrl}/${thumbnailPath}" alt="${demo.title}">
            <div class="desc">
                <div class="hexDesc">${demo.title}</div>
                <div class="hexDesc author">${demo.author || ""}</div>
            </div>
            <img src="/assets/img/hoverFrame.svg" class="hoverFrame">
            <img src="/assets/img/defaultFrame.svg" class="defaultFrame">
        </a>
    </div>
`;
          hexGrid.append(li);
        });
      }
    });
  }

  async function getManifest() {
    const response = await fetch(
      "https://babylonjsassetslib.z01.azurefd.net/DEMOS/manifest.json?" + Date.now()
    );
    const json = await response.json();
    return json;
  }
};
