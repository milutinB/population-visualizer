import os
import json
from os import environ
from flask import Flask, request, g, send_from_directory, make_response
from requests import get
import threading
import gzip
import io

IS_DEV = environ["FLASK_ENV"] == "development"
WEBPACK_DEV_SERVER_HOST = "http://localhost:3000"


# code to enable hot-reloading with react
# taken from the following blogpost: 
# https://ajhyndman.medium.com/hot-reloading-with-react-and-flask-b5dae60d9898
def proxy(host, path):
    response = get(f"{host}{path}")
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = {
        name: value
        for name, value in response.raw.headers.items()
        if name.lower() not in excluded_headers
    }
    return (response.content, response.status_code, headers)

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, 
    static_folder='../client/build', static_url_path="/app")

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if IS_DEV:
            return proxy(WEBPACK_DEV_SERVER_HOST, request.path)
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    @app.route('/map_data')
    def compressed():
        # data = open('__data/countries.geojson.gz', 'rb').read()
        data = open('data/countries.geojson', 'rb').read()
        response = make_response(data)
        response.headers['Content-length'] = len(data)
        # response.headers['Content-Encoding'] = 'gzip'
        return response

    @app.route('/population_data')
    def population():
        data = open('__data/population_data.json', 'rb').read()
        response = make_response(data)
        response.headers['Content-length'] = len(data)
        return response

    return app