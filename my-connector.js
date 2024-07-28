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
            {id: "geometry", alias: "Geometry", dataType: tableau.dataTypeEnum.string} // Changed to string for simplicity
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
            const proxyUrl = 'https://corsproxy.io/?';
            const targetUrl = encodeURIComponent('https://apis.datos.gob.ar/georef/api/provincias.geojson');

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
                    if (data && data.provincias) { // Ensure data is available
                        data.provincias.forEach(item => {
                            tableData.push({
                                "id": item.id,
                                "nombre": item.nombre,
                                "nombre_completo": item.nombre_completo,
                                "fuente": item.fuente,
                                "categoria": item.categoria,
                                "centroide_lon": item.centroide_lon,
                                "centroide_lat": item.centroide_lat,
                                "iso_id": item.iso_id,
                                "iso_nombre": item.iso_nombre,
                                "geometry": JSON.stringify(item.geometry) // Convert geometry to string for simplicity
                            });
                        });
                    }

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
