# Babylon.js website
Our mission is to create one of the most powerful, beautiful, and simple Web rendering engines in the world. Our passion is to make it completely open and free for everyone. Up to 3 times smaller and 12% faster, Babylon.js 4.1 includes countless performance optimizations, continuing the lineage of a high-performance engine. With the new Node Material Editor, a truly cross-platform development experience with Babylon Native, Cascaded Shadows, Navigation Mesh, updated WebXR and glTF support, and much much more, Babylon.js 4.1 brings even more power to your web development toolbox.

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

this property available as part of page level Json property

``` sh
    "title": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
```

### Meta tags

meta tags can be unique for each page. This property available as part of page level Json property and contains list of tags

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

