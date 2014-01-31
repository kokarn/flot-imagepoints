Flot ImageSymbol
================

Flotcharts (http://www.flotcharts.org/) plugin to enable custom images for each point.

Image parameters should be added to the points object in options, like so:
 
```
 points : {
    show: true,
    radius: 15,
    image : {
        path: 'img/', // Base path to the images you want to use
        base: 'day.svg', // Base image you want to use in case one is missing
        images: icons // An array of image names corresponding to the plot points
    }
 }
 ```
