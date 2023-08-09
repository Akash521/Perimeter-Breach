# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_cors import cross_origin
# import cv2
# import os

# app = Flask(__name__)
# CORS(app)

# # Directory to store captured screenshots
# SCREENSHOT_DIR = "screenshots"
# if not os.path.exists(SCREENSHOT_DIR):
#     os.makedirs(SCREENSHOT_DIR)

# def capture_screenshot(rtsp_url):
#     cap = cv2.VideoCapture(rtsp_url)
#     ret, frame = cap.read()
#     if ret:
#         screenshot_path = os.path.join(SCREENSHOT_DIR, "screenshot.jpg")
#         cv2.imwrite(screenshot_path, frame)
#         cap.release()
#         return screenshot_path
#     else:
#         cap.release()
#         return None

# @app.route('/capture-screenshot', methods=['POST'])
# @cross_origin()
# def capture_and_return_screenshot():
#     data = request.get_json()
#     rtsp_url = data.get('rtsp_url')

#     if not rtsp_url:
#         return jsonify({"error": "RTSP URL not provided in the request"}), 400

#     screenshot_path = capture_screenshot(rtsp_url)
#     if screenshot_path:
#         return jsonify({"image_url": screenshot_path})
#     else:
#         return jsonify({"error": "Failed to capture screenshot"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
import cv2
import os

WIDTH=640
HEIGHT=384
app = Flask(__name__)
CORS(app)

# Directory to store captured screenshots
SCREENSHOT_DIR = "screenshots"
if not os.path.exists(SCREENSHOT_DIR):
    os.makedirs(SCREENSHOT_DIR)

def capture_screenshot(rtsp_url):
    cap = cv2.VideoCapture(rtsp_url)
    # cap.set(3, WIDTH)  # Set width
    # cap.set(4, HEIGHT)  # Set height

    ret, frame = cap.read()
    frame = cv2.resize(frame,(WIDTH,HEIGHT))
    if ret:
        screenshot_path = os.path.join(SCREENSHOT_DIR, "screenshot.jpg")
        cv2.imwrite(screenshot_path, frame)
        cap.release()
        return screenshot_path
    else:
        cap.release()
        return None

@app.route('/capture-screenshot', methods=['POST'])
@cross_origin()
def capture_and_return_screenshot():
    data = request.get_json()
    rtsp_url = data.get('rtsp_url')
    # width = data.get('width', 640)  # Default width if not provided
    # height = data.get('height', 480)  # Default height if not provided

    if not rtsp_url:
        return jsonify({"error": "RTSP URL not provided in the request"}), 400

    screenshot_path = capture_screenshot(rtsp_url)
    if screenshot_path:
        response_data = {
            "image_url": screenshot_path,
            "width": WIDTH,
            "height": HEIGHT
        }
        return jsonify(response_data)
    else:
        return jsonify({"error": "Failed to capture screenshot"}), 500

if __name__ == '__main__':
    app.run(debug=True)

