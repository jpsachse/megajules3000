import json

from flask import Flask
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/current_map')
def get_map():
    response = dict()
    response["name"] = "Sample"
    response["objects"] = "{}"
    response["map"] = "[[{}, {}], [{}, {}]]"
    return json.dumps(response)


if __name__ == '__main__':
    app.run(port=4242, debug=True)