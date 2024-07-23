myConnector.getData = function(table, doneCallback) {
    function fetchData() {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://apis.datos.gob.ar/georef/api/provincias.geojson';
        
        fetch(proxyUrl + targetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();  // Get response as text
            })
            .then(text => {
                try {
                    const data = JSON.parse(text);  // Parse the text as JSON
                    console.log(data);

                    var tableData = [];
                    data.features.forEach(function(feature) {
                        tableData.push({
                            "id": feature.properties.id,
                            "nombre": feature.properties.nombre,
                            "nombre_completo": feature.properties.nombre_completo,
                            "fuente": feature.properties.fuente,
                            "categoria": feature.properties.categoria,
                            "centroide_lon": feature.geometry.coordinates[0],
                            "centroide_lat": feature.geometry.coordinates[1],
                            "iso_id": feature.properties.iso_id,
                            "iso_nombre": feature.properties.iso_nombre,
                            "geometry": JSON.stringify(feature.geometry)
                        });
                    });

                    table.appendRows(tableData);
                    doneCallback();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }

    fetchData();
};
