var menuBtn = document.querySelector(".menu-btn");
var submenuLinks = document.querySelectorAll(".menu > ul li a");
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

    if (headerTopWrapper.classList.contains("show-submenu")) {
        headerTopWrapper.classList.remove("show-submenu");
        headerTopWrapper.classList.add("hide-menu");
    }
}

function showSubMenu(event) {
    var clickedMenuItem = event.target || event.srcElement;
    var targetName = clickedMenuItem.classList[0];
    var submenuContainer = document.querySelector(".sub-menu > ." + targetName);
    if (submenuContainer) {
        submenuContainer.classList.toggle("hidden");
        headerTopWrapper.classList.toggle("show-submenu");
        headerTopWrapper.classList.remove("hide-menu");
        event.preventDefault();
    }
}
