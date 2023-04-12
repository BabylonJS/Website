# Babylon.js website

## List of folders to copy to website repo

- [ ] gulpfile.js
---
- [ ] src\assets\img (copy and skip replacing duplicates as there are only new files)
---
- [ ] src\assets\styles\pressRelease.css
---
- [ ] src\assets\videos\fluidRendering.mp4
- [ ] src\assets\videos\physics.mp4
- [ ] src\assets\videos\SSRv2.mp4
---
- [ ] src\content\community\assets\Arques-La-Bataille.jpg
- [ ] src\content\community\assets\bitByBit.jpg
- [ ] src\content\community\assets\jsWings.jpg
- [ ] src\content\community\assets\sidusheroes.jpg
- [ ] src\content\community\config.json
---
- [ ] src\content\digitalTwinIot\
---
- [ ] src\content\featureDemos\
---
- [ ] src\content\features\
---
- [ ] src\content\games\config.json
---
- [ ] src\content\industries\
---
- [ ] src\content\metaverse\
---
- [ ] src\content\partners\assets\img
- [ ] src\content\partners\config.json
---
- [ ] src\content\pressRelease\
---
- [ ] src\content\specifications\config.json
---
- [ ] src\content\config.json
- [ ] src\content\site.json
---
- [ ] src\templates\imageAndTextBlock-template.html
- [ ] src\templates\index-template.html
- [ ] src\templates\pressRelease-template.html

## Updates to the press release page
To make any last minute changes to the press release page that get approved from our partners, you will want to edit the file:

- src\content\pressRelease\config.json

This json is broken up by paragraph to follow the prestanding template system. We did not have a template for long form content that needed independent formatting. Adding this content as a single string - which is the way our template system works - quickly becomes unreadable and is prone to errors. 

### Options
The available options for the pressRelease template are:
- margin-left
- margin-right
- title
- date
- subtitle
- list
- desc

Only use the options that are needed for the specific section of the press release. The only ones that should be present everywhere are the margin options. Otherwise, any option not present in the iteration will not render. It it normal for the first iteration of the template in the json to have margins, title, date, and desc to format the start of the press release. Following iterations can use whatever is needed, but do not need repeats of title or date.

### Margins
The margin settings will set up the placement of the text within the template. Normally, these will be set to 50px each, but each should be consisten with one another to maintain consistent margins.

### Title
The title for the press release. There should only be one iteration that includes a title.

### Date
This will add a date to the iteration, right below title if one is present.

### Subtitle
Any iteration of the template can be styled with a subtitle by adding the string for a subtitle in the template. 

### Bullet Lists
Adding a bullet list to an iteration of the template can be accomplished by adding a key of "list" with an array of strings for the value. The spacing and bullets will be added by the css. Local formatting using html tags is available for lists.

### Descriptions
Desc is the string which holds the current paragraph of copy in the press release. Since these are strings, we can't format for paragraph space, but other formatting is allowed. 

### Formatting
Each string will parse html tags correctly, so all of the standard html formatting tags are available in the paragraphs. You can even add local css via the html tag if needed.

## Examples

This is an example of the start of a press release
``` json
{
  "templateName": "pressRelease",
  "content": {
      "margin-left": "50px",
      "margin-right": "50px",
      "title": "Babylon.js Welcomes Havok Physics",
      "date": "April 20, 2023",
      "desc": [
          "Babylon.js is excited to welcome Havok Physics to the platform. Havok is an award winning physics engine that sets the standard for AAA games and now their core functionality is available through Babylon.js for free."
              
      ]
  }   
}
```

This is an example of a bullet list
``` json
{
    "templateName": "pressRelease",
    "content": {
        "margin-left": "50px",
        "margin-right": "50px",
        "list": [
            "New features like inertia, collision filtering, keyframed bodies, advanced sleep control, and more",
            "Faster raycasts",
            "Improved physics debugging"
        ]
    }
}
```

This is an example of a single paragraph iteraion

``` json
{
    "templateName": "pressRelease",
    "content": {
        "margin-left": "50px",
        "margin-right": "50px",
        "desc": "Babylon.js 6.0 is available from March 30th, to see Havok Physics in action check out [link to demo video] and to get started visit us at <a href=\"https://www.babylonjs.com\">https://www.babylonjs.com</a>."
    }
}
```

Finally, an example of a subhead and paragraph

``` json
{
    "templateName": "pressRelease",
    "content": {
        "margin-left": "50px",
        "margin-right": "50px",
        "subtitle": "About Babylon.js",
        "desc": "Babylon.js is a powerful, open-source, web rendering engine built to make it as simple as possible for web developers to unlock the power, performance, and rendering capabilities of the GPU onboard every device. Babylon.js works across all browsers and platforms and is completely free."
    }
}
```
