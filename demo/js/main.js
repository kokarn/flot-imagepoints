(function( $ ){
    "use strict";
    function loadWeatherData(){
        // API Path: http://www.smhi.se/klimatdata/Oppna-data/Meteorologiska-data/api-for-vaderprognosdata-1.34233
        var weatherDataPath = 'http://opendata-download-metfcst.smhi.se/api/category/pmp1g/version/1/geopoint/lat/57.70/lon/11.96/data.json';

        $.ajax({
            url : weatherDataPath,
            dataType : 'json',
            success : function( data ){
                parseWeatherData( data );
            }
        });
    }

    function parseWeatherData( data ){
        var i,
            temperatures = [],
            icons = [];

        for( i = 0; i < data.timeseries.length; i++ ){
            if( data.timeseries[ i ].validTime.indexOf( 'T12:00:00' ) !== -1 ){
                temperatures.push( [ new Date( data.timeseries[ i ].validTime ).getTime(), data.timeseries[ i ].t ] );
                icons.push( getWeatherType( data.timeseries[ i ] ) + '.svg' );
            }
        }

        drawChart( temperatures, icons );
    }

    function getWeatherType( data ){
        /*
         wd : wind direction
         ws : wind speed
         r : humidity
         tstm : probability of thunder
         tcc : total cloud cover
         lcc : low cloud cover (low clouds)
         mcc : medium cloud cover (medium clouds)
         hcc : high cloud cover (high clouds)
         gust : gust speed
         pit : precipitation intensity total
         pis : precipitation intensity snow
         pcat : Rain type
         */
        var rainTypes = [
                'none',
                'snow',
                'snowrain',
                'rain',
                'drizzle',
                'freezingrain'
                //'freezingdrizzle'
            ],
            enabledTypes = [
                'rain',
                'drizzle',
                'cloud',
                'sun',
                'snow'
            ],
            weatherType;

        if( data.pcat > 0 ){

            // Change freezing drizzle to freezing rain
            if( data.pcat == 6 ){
                data.pcat = 5;
            }

            weatherType = rainTypes[ data.pcat ];
        } else {
            // Check if it's cloudy
            if( data.tcc > 3 ){
                weatherType =  'cloud';
            } else if( data.tcc > 1 ) {
                weatherType = 'partly-day';
            } else {
                weatherType = 'day';
            }
        }

        return weatherType;
    }

    function drawChart( dataset, icons ){
        var $plotWrapper = $( '.js-weather-graph' ),
            plotOptions = {
                xaxis: {
                    mode: "time",
                    timeformat: "%a"
                },
                yaxis: {
                    min: -10,
                    max: 20
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true,
                        image : {
                            path: 'img/',
                            base: 'day.svg',
                            images: icons
                        },
                        radius: 15
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true
                }
            },
            plotData = [
                dataset
            ];

        var plot = $plotWrapper.plot( plotData, plotOptions ).data( "plot" );
    }

    $(function(){
        loadWeatherData();
    });
}( jQuery ));