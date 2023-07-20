// Creating map
let myMap = L.map('map', {
    center: [29.4252, -98.4946],
    zoom: 3
});

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Link that holds GeoJSON data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Executing GeoJSON data
d3.json(url).then((data) => {

    // Promising data
    console.log(data)
    let features = data.features;
    
    // Loop to extract and display
    for (let i = 0; i < features.length; i++) {
        
        let latitude = features[i].geometry.coordinates[1];
        let longitude = features[i].geometry.coordinates[0];
        let depth = features[i].geometry.coordinates[2];

        // Determining marker color by depth
        if (depth >= -10 && depth < 10) {
            depthColor = '#66ff66' // lime green
        }

        else if (depth >= 10 && depth < 30) {
            depthColor = '#ccff00' // light green
        }

        else if (depth >= 30 && depth < 50) {
            depthColor = '#ffff00'  // yellow
        }

        else if (depth >= 50 && depth < 70) {
            depthColor = '#ffcc33' // lighter orange
        }

        else if (depth >= 70 && depth < 90) {
            depthColor = '#FFA500' // dark orange
        }

        else {
            depthColor = '#FF0000' // red
        };

        // Displaying marker
        let marker = L.circle([latitude, longitude], {
            radius: features[i].properties.mag * 30000,
            color: 'black',
            weight: 0.5,
            fillColor: depthColor,
            fillOpacity: 0.75
        }).addTo(myMap);

        // Displaying marker information
        marker.bindPopup(
        `Location: ${features[i].properties.place} <br>
        Time: ${new Date(features[i].properties.time)} <br>
        Magnitude: ${features[i].properties.mag} <br>
        Depth: ${depth}`
        );
    };

});


// Creating Legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<l style="background: #66ff66"></l>-10-10<br>'
    div.innerHTML += '<l style="background: #ccff00"></l>10-30<br>'
    div.innerHTML += '<l style="background: #ffff00"></l>30-50<br>'
    div.innerHTML += '<l style="background: #ffcc33"></l>50-70<br>'
    div.innerHTML += '<l style="background: #FFA500"></l>70-90<br>'
    div.innerHTML += '<l style="background: #FF0000"></l>90+<br>'

    return div;
};

legend.addTo(myMap);