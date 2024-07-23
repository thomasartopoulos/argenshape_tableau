(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        var cols = [
            {id: "id", alias: "ID", dataType: tableau.dataTypeEnum.string},
            {id: "nombre", alias: "Name", dataType: tableau.dataTypeEnum.string},
            {id: "nombre_completo", alias: "Full Name", dataType: tableau.dataTypeEnum.string},
            {id: "fuente", alias: "Source", dataType: tableau.dataTypeEnum.string},
            {id: "categoria", alias: "Category", dataType: tableau.dataTypeEnum.string},
            {id: "centroide_lon", alias: "Longitude", dataType: tableau.dataTypeEnum.float},
            {id: "centroide_lat", alias: "Latitude", dataType: tableau.dataTypeEnum.float},
            {id: "iso_id", alias: "ISO ID", dataType: tableau.dataTypeEnum.string},
            {id: "iso_nombre", alias: "ISO Name", dataType: tableau.dataTypeEnum.string},
            {id: "geometry", alias: "Geometry", dataType: tableau.dataTypeEnum.geometry}  // Add geometry data type
        ];

        var tableSchema = {
            id: "LocationData",
            alias: "Location Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        function fetchData() {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://apis.datos.gob.ar/georef/api/provincias.geojson';
            fetch(proxyUrl + targetUrl)
                .then(response => {
                    console.log(response); // Log the raw response
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data); // Log the parsed JSON data
                    var tableData = [];
                    // Assuming 'data' is an array of objects, each representing a row
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
                            "geometry": JSON.stringify(feature.geometry)  // Convert geometry object to string
                        });
                    });

                    table.appendRows(tableData);
                    doneCallback();
                })
                .catch(error => console.error('Error:', error));
        }

        fetchData();
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Location Data";
            tableau.submit();
        });
    });
})();