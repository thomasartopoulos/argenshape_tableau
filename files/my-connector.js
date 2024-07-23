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

        console.log("Schema: ", tableSchema);
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        var url = "https://apis.datos.gob.ar/georef/api/provincias.geojson";
        console.log("Fetching data from: ", url);

        $.getJSON(url, function(resp) {
            console.log("Response: ", resp);
            var feat = resp.features,
                tableData = [];

            for (var i = 0, len = feat.length; i < len; i++) {
                // Convert the polygon coordinates to Well-Known Text (WKT) format for Tableau
                var coordinates = feat[i].geometry.coordinates[0];
                var wktPolygon = "POLYGON((";
                for (var j = 0; j < coordinates.length; j++) {
                    wktPolygon += coordinates[j][0] + " " + coordinates[j][1];
                    if (j < coordinates.length - 1) {
                        wktPolygon += ", ";
                    }
                }
                wktPolygon += "))";

                tableData.push({
                    "id": feat[i].properties.id,
                    "nombre": feat[i].properties.nombre,
                    "nombre_completo": feat[i].properties.nombre_completo,
                    "fuente": feat[i].properties.fuente,
                    "categoria": feat[i].properties.categoria,
                    "centroide_lon": feat[i].properties.centroide.lon,
                    "centroide_lat": feat[i].properties.centroide.lat,
                    "iso_id": feat[i].properties.iso_id,
                    "iso_nombre": feat[i].properties.iso_nombre,
                    "geometry": wktPolygon  // Include the WKT polygon
                });
            }

            console.log("Table Data: ", tableData);
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Location Data";
            console.log("Submitting connection: ", tableau.connectionName);
            tableau.submit();
        });
    });
})();
