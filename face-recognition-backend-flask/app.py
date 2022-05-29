import io
import base64
import os
import sys
import time
import torch
import shutil
from pathlib import Path
from PIL import Image
from PIL import ImageFile
from flask_cors import CORS
from flask import (
    Flask,
    jsonify,
    request
)

# LOADING IMAGE FILE
FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)
CORS(app)

# RUNNING WEBCAM IN ROUTER
@app.route("/transaction-verification", methods=["POST"])
def prediction():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No data received"}), 400
    if "image" not in data:
        return jsonify({"error": "No image received"}), 400

    dir = './temp'
    if os.path.exists(dir):
        shutil.rmtree(dir)
    if not os.path.exists(dir):
        try:
            os.mkdir(dir)
            time.sleep(1)
            result = data["image"]
            image_base64 = result.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image_file = io.BytesIO(image_bytes)
            image = Image.open(image_file)
            img_dir = os.path.join(dir, 'image.jpg')
            image.save(img_dir)
        except Exception as e:
            print(e)
            return jsonify({"error": "Error Processing Image"}), 400

# LOADING MODEL
    model = torch.hub.load('.', 'custom', path='best.pt', source='local')
    results = model(os.path.join(dir, 'image.jpg'))
    result_string = results.print()
    if result_string == "Not Detected":
        return jsonify({
            "message": result_string,
            "status": False
        })

    return jsonify({
        "message": result_string,
        "status": True
    })


if __name__ == "__main__":
    app.run(debug=True)
