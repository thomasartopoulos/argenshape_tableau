from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

@app.route('/proxy', methods=['GET'])
def proxy():
    url = 'https://apis.datos.gob.ar/georef/api/provincias.geojson'
    response = requests.get(url)
    data = response.json()

    # Allow CORS
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return jsonify(data), response.status_code, headers

if __name__ == '__main__':
    app.run(debug=True, port=8000)
