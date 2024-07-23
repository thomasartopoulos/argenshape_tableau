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
            // Process the response here
            // Assuming resp is an array of objects matching the schema
            var tableData = [];
            for (var i = 0, len = resp.length; i < len; i++) {
                tableData.push({
                    "id": resp[i].id,
                    "nombre": resp[i].nombre,
                    // Add other fields as necessary
                });
            }

            table.appendRows(tableData);
            doneCallback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data: ", textStatus, errorThrown);
            tableau.abortWithError("Error fetching data.");
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