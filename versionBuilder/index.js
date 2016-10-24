var componentListURL = "http://babyloncomponentselector.azurewebsites.net/api/componentlist";
var generateURL = "http://babyloncomponentselector.azurewebsites.net/api/buildbabylon";


// Dirty ugly mapping between component ID and group ID
var dirtyMapping = {
    'Physics'               : [0, 1],                           // Group 0 : Oimo.js -  Cannon.js
    'GUI'                   : [2],                              // Group 1 : Canvas2D
    'Collisions'            : [3],                              // Group 2 : Collisions
    'Loaders'               : [4,5,6],                          // Group 3 : Loaders             
    'Post-Process'          : [17,18],                          // Group 5 : PP
    'Materials'             : [7,8,9,10,11,12,13,14,15,16],     // Group 4 : Materials     
    'Procedural Textures'   : [19, 20, 21, 22, 23, 24, 25, 26]  // Group 6 : Textures
};

var componentsSorted = [];

var buildBlock = function(title, comps) {
    var ul = $('<ul>'); // list of choices
    
    var block = $('<div>').addClass('block').append(
        $('<div>').addClass('title').text(title) // title
    ).append(
        $('<div>').addClass('choices').append(ul) // choices
    )
    
    for (var c of comps) {
        ul.append(
            buildOption(componentsSorted[c].label)
        )
    }
    return block;
}

//  <li><input type='checkbox' />Oimo.js</li>
var buildOption = function(label) {
    return $('<li>').append(
            $('<input>').attr('type', 'checkbox')
        ).append(
            $('<span>').text(label)
        );
}

$.getJSON(componentListURL, function (data) {
    var components = [];
    var versions = [];

    // Components.
    $.each(data.components, function (key, val) {
        let id = Number.parseInt(val.id);
        componentsSorted[id] = val;
    });
    
    // For each group, build block
    for (var g in dirtyMapping) {
        $('#components').append(buildBlock(g, dirtyMapping[g]));
    }

    // // Update View.
    // componentsList.html(components.join(""));

    // // Generate Button.
    // generateUrlButton.click(function () {
    //     var url = generateUrl();
    //     window.open(url, "blank");
    // });
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
