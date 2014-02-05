/*
 Flot plugin that enables custom images for plot points

 Copyright (c) 2014 by Kokarn.
 Licensed under the MIT license.

 Image parameters should be added to the points var, like so:

 points : {
    show: true,
    radius: 15,
    image : {
        path: 'img/', // Base path to the images you want to use
        base: 'day.svg', // Base image you want to use in case one is missing
        images: icons // An array of image names corresponding to the plot points
    }
 }

 */

(function( $ ) {
    var i = 0;

    function processRawData( plot, series, datapoints ) {
        function drawImageSymbol( ctx, x, y, radius, shadow, image ){
            var img = new Image(),
                plotOffset = plot.getPlotOffset(),
                drawPositionX,
                drawPositionY;

            // Only draw the image if it's not the shadow (because we cant really add a shadow to an image)
            if( shadow ){
                return false;
            }

            drawPositionX = x - radius + plotOffset.left;
            drawPositionY = y - radius + plotOffset.top;

            img.onload = function() {
                ctx.drawImage( img, drawPositionX , drawPositionY , radius * 2, radius * 2 );
            };

            img.src = image;

            return true;
        }

        var s = series.points.image,
            baseRadius = false,
            image;

        if( s ) {
            series.points.symbol = function( ctx, x, y, radius, shadow ){
                
                if( series.points.image.images[ i ] ){
                    image = series.points.image.path + series.points.image.images[ i ]
                } else if( series.points.image.images[ i ] !== false ){
                    image = series.points.image.path + series.points.image.base;
                } else {
                    image = false;
                }

                // Increase the counter so we keep up with the dataseries
                i++;
                
                drawImageSymbol( ctx, x, y, radius, shadow, image );
            };
        }
    }

    function resetVars(){
        i = 0;
    }

    function init( plot ) {
        plot.hooks.processDatapoints.push( processRawData );
        plot.hooks.draw.push( resetVars );
    }

    $.plot.plugins.push( {
        init: init,
        name: 'imagesymbol',
        version: '0.1'
    } );
})( jQuery );