from flask import Flask, send_from_directory, jsonify, request, render_template
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Serve the connector.json file
@app.route('/connectors/<path:filename>')
def get_connector(filename):
    return send_from_directory('connectors', filename)

# Serve the main webpage
@app.route('/')
def home():
    return render_template('index.html')

# Example endpoint for the connection resolver
@app.route('/connectionResolver', methods=['POST'])
def connection_resolver():
    data = request.json
    return jsonify({
        "result": {
            "connectionDetails": {
                "protocol": "https",
                "server": "apis.datos.gob.ar",
                "port": 443,
                "database": "georef",
                "additionalProperties": {
                    "resource": "provincias.geojson"
                }
            }
        }
    })

# Endpoint to fetch and parse data from the API
@app.route('/data', methods=['GET'])
def data():
    api_url = "https://apis.datos.gob.ar/georef/api/provincias.geojson"
    response = requests.get(api_url)
    data = response.json()
    
    transformed_data = []
    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']
        transformed_data.append({
            'id': properties.get('id'),
            'name': properties.get('nombre'),
            'full_name': properties.get('nombre_completo'),
            'source': properties.get('fuente'),
            'category': properties.get('categoria'),
            'centroid_lon': properties.get('centroide', {}).get('lon'),
            'centroid_lat': properties.get('centroide', {}).get('lat'),
            'iso_id': properties.get('iso_id'),
            'iso_name': properties.get('iso_nombre'),
            'geometry_type': geometry.get('type'),
            'coordinates': geometry.get('coordinates')
        })
    
    return jsonify(transformed_data)

if __name__ == '__main__':
    app.run(debug=True)
