var babylonLogo = document.querySelector('.babylon-logo');
babylonLogo.classList.remove("hidden");

var metaTags = document.getElementsByTagName("meta");
for (var i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute("name") === "custom") {
        babylonLogo.classList.add("hidden");
        var version = document.querySelector('.version');
        var largeLogo = document.querySelector('.large-logo img');
        var ratio = 1400 / 405;
        var offsetRatio = 1400 / 160;
        var pixelDistanceRatio = 1400 / (380 - 70);

        window.addEventListener("resize", function() {
            window.onscroll();
        });

        window.onscroll = function() {
            let scrollTop = Math.max(0, document.body.scrollTop || document.documentElement.scrollTop);
            let currentWidth = Math.min(window.innerWidth, 1400);
            let currentHeightMax = currentWidth / ratio;
            let offset = currentWidth / offsetRatio;
            var pixelDistance = currentWidth / pixelDistanceRatio;
            var scale = currentHeightMax < 200 ? 1.5 : 1;

            if (scrollTop > 0) {
                version.style.opacity = 0;
            } else {
                version.style.opacity = 1;
            }

            if (scrollTop <= currentHeightMax - offset) {
                let center = currentHeightMax - scrollTop - offset;
                let current = currentHeightMax - offset - 70;

                if (current > 1) {
                    height = Math.max(70, scale * pixelDistance * (currentHeightMax - scrollTop) / currentHeightMax);
                } else {
                    height = 70;
                }

                largeLogo.style.width = height + "px";
                largeLogo.style.height = height + "px";
                largeLogo.style.left = "calc(50% - " + (height / 2) + "px)";
                largeLogo.style.top = Math.max(0, (center - height / 2)) + "px";

                let fontSize = 30 + (currentHeightMax / 405) * 25;
                version.style.top = (currentHeightMax - fontSize * 2.2) + "px";
                version.style.fontSize = fontSize + "px";
            } else {
                largeLogo.style.width = "70px";
                largeLogo.style.height = "70px";
                largeLogo.style.left = "calc(50% - 35px)";
                largeLogo.style.top = "0px";
            }

            if (scrollTop > currentHeightMax) {
                largeLogo.style.opacity = 0;
                babylonLogo.classList.remove("hidden");
            }
            else {
                largeLogo.style.opacity = 1;
                babylonLogo.classList.add("hidden");
            }
        };

        window.onscroll();
        break;
    }
}