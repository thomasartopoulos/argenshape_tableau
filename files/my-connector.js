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
            {id: "iso_nombre", alias: "ISO Name", dataType: tableau.dataTypeEnum.string}
        ];

        var tableSchema = {
            id: "LocationData",
            alias: "Location Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        var url = "https://apis.datos.gob.ar/georef/api/provincias.geojson";

        $.getJSON(url, function(resp) {
            var feat = resp.features,
                tableData = [];

            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].properties.id,
                    "nombre": feat[i].properties.nombre,
                    "nombre_completo": feat[i].properties.nombre_completo,
                    "fuente": feat[i].properties.fuente,
                    "categoria": feat[i].properties.categoria,
                    "centroide_lon": feat[i].properties.centroide.lon,
                    "centroide_lat": feat[i].properties.centroide.lat,
                    "iso_id": feat[i].properties.iso_id,
                    "iso_nombre": feat[i].properties.iso_nombre
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Location Data";
            tableau.submit();
        });
    });
})();
