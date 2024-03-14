mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: cordinates, // starting position [lng, lat]
    zoom: 11 // level of zoom
});

console.log(cordinates)

const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(cordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        // .setHTML("<br><p>Exact location provide after booking!</p>")
        .setHTML("<br><p>Exact location provide after booking!</p>")
    )
    .addTo(map);


    




map.on('load', () => {
    // Load an image from an external URL.
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
        (error, image) => {
            if (error) throw error;
            // Add the image to the map style.
            map.addImage('cat', image);
                
            // Add a data source containing one point feature.
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': cordinates
                        }
                    }]
                }
            });
        
            // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', // reference the data source
                'layout': {
                    'icon-image': 'cat', // reference the image
                    'icon-size': 0.1
                }
            });
        }
    );
});