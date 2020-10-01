# Babylon.js website

## Installation process

``` sh
    npm install -g gulp
    npm install
```

## Development mode

Web site will be available at http://localhost:8080/

``` sh
    gulp run
```

## Additional options for the page

### Page title

This property is available as a part of page level Json property.

``` sh
    "title": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
```

### Meta tags

Meta tags can be unique for each page. This property is available as a part of page level Json property and contains list of tags.

``` json
    "metaTags": [
    {
      "name": "description",
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    },
    {
      "property": "og:title", //optional property for open graph
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    }
  ]
```

