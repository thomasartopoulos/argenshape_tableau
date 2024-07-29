(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        var cols = [
            {id: "id", dataType: tableau.dataTypeEnum.string},
            {id: "nombre", dataType: tableau.dataTypeEnum.string},
            {id: "nombre_completo", dataType: tableau.dataTypeEnum.string},
            {id: "fuente", dataType: tableau.dataTypeEnum.string},
            {id: "categoria", dataType: tableau.dataTypeEnum.string},
            {id: "centroide_lon", dataType: tableau.dataTypeEnum.float},
            {id: "centroide_lat", dataType: tableau.dataTypeEnum.float}
        ];

        var tableSchema = {
            id: "provinciasFeed",
            alias: "Provincias Feed",
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
                    console.log('Raw response:', response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Parsed data:', data);
                    var tableData = [];
                    if (data && data.provincias) {
                        data.provincias.forEach(item => {
                            tableData.push({
                                "id": item.properties.id,
                                "nombre": item.properties.nombre,
                                "nombre_completo": item.properties.nombre_completo,
                                "fuente": item.properties.fuente,
                                "categoria": item.properties.categoria,
                                "centroide_lon": item.properties.centroide.lon,
                                "centroide_lat": item.properties.centroide.lat
                            });
                        });
                    }
                    table.appendRows(tableData);
                    doneCallback();
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }
        fetchData();
    };

    tableau.registerConnector(myConnector);
})();