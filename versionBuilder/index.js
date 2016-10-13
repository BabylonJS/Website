var componentListURL = "http://babyloncomponentselector.azurewebsites.net/api/componentlist";
var generateURL = "http://babyloncomponentselector.azurewebsites.net/api/buildbabylon";

var componentsList = $("#componentsList");
var optionsVersion = $("#optionsVersion");
var optionsMinification = $("#optionsMinification");
var generateUrlButton = $("#generate");

var stableVersion = $("#stableVersion");
var previewVersion = $("#previewVersion");
var previewCheckbox = $("#preview");
var unminifiedCheckbox = $("#unminified");

$.getJSON(componentListURL, function (data) {
    var components = [];
    var versions = [];

    // Versions.
    stableVersion.html(data.stable);
    previewVersion.html(data.dev);

    // Components.
    $.each(data.components, function (key, val) {
        components.push("<li><div class='checkbox'><label><input type='checkbox' id='" + val.id + "'>" + val.label + "</label><div></li>");
    });

    // Update View.
    componentsList.html(components.join(""));

    // Generate Button.
    generateUrlButton.click(function () {
        var url = generateUrl();
        window.open(url, "blank");
    });
});

function generateUrl() {
    var url = generateURL + "?";
    var preview = previewCheckbox[0].checked;
    var unminified = unminifiedCheckbox[0].checked;

    // Version
    url += "stable="
    url += preview ? "false" : "true";
    // Minified
    url += "&minified=";
    url += unminified ? "false" : "true";

    // Components
    var components = $('#components input:checked');
    if (components.length > 0) {
        url += "&components=";
        components.each(function (key, val) {
            url += val.id + ",";
        });
        url = url.substring(0, url.length - 1);
    }

    return url;
}
