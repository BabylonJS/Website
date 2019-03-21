## Additional options for the page
#### Page title
this property available as part of page level Json property
```sh
    "title": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
```
#### Meta tags
meta tags can be unique for each page. This property available as part of page level Json property and contains list of tags
```sh
    "metaTags": [
    {
      "name": "description",
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    },
    {
      "property": "og:title",//optional property for open graph
      "content": "BabylonJS - 3D engine based on WebGL/Web Audio and JavaScript"
    }
  ]
```
## Available templates
Carousel with live samples:
```sh
{
  "templateName": "samplesCarouselBlock",
  "content": {
    "items": [
      {
        "interactiveSampleUrl": "",
        "videoUrl": ""
      },
      {
        "interactiveSampleUrl": "",
        "videoUrl": ""
      }
    ]
  }
}
```
Image and text:
```sh
{
  "templateName": "imageAndTextBlock",
  "content": {
    "alignment": "left",//left or right
    "background": "#5C5C5C",
    "img": {
      "name": "imageName",//relative path to the image
      "alt": "Alternative text for the image"
    },
    "title": "Block title",
    "desc": "Long description"
  }
}
```
Just text:
```sh
{
  "templateName": "textBlock",
  "content": {
    "title": "Block title",
    "desc": "Long description"
  }
}
 ```
Table with images:
```sh
{
  "templateName": "imageBlocks",
  "content": {
    "title": "FEATURED DEMOS",
    "items": [
      {
        "img": {
          "name": "featuredDemo1",
          "alt": "Demo 1 description"
        },
        "link": "https://google.com"
      },
      {
        "img": {
          "name": "featuredDemo2",
          "alt": "Demo 2 description"
        },
        "link": "https://google.ua"
      },
      {
        "img": {
          "name": "featuredDemo3",
          "alt": "Demo 3 description"
        },
        "link": "https://google.nl"
      }
    ]
  }
}
 ```