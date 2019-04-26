from __future__ import print_function

from PIL import Image # Notice the 'from PIL' at the start of the line
from flask import request, Flask, jsonify
from werkzeug.utils import secure_filename
from flask_uploads import UploadSet, configure_uploads
import config
import time
import os
import shutil
import sys
from test import process_batch_with_unet
# from flask import redirect, url_for, render_template
# from flask_uploads import IMAGES, ALL

# import torch
# import torch.utils.data as data
# import torchvision.utils as utils
# import torchvision.datasets as dataset
# import torchvision.transforms as transforms
# import pathlib

DEBUG_DEMO = True


def rm_file_dir(folder_path):
    if os.path.exists(folder_path):
        for the_file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(e)
    else:
        make_dir(folder_path)

def make_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)


app = Flask(__name__)
app.config.from_object(config)
photos = UploadSet('PHOTO')
configure_uploads(app, photos)

IMAGE_FOLDER = os.path.join("/app", "uploads")
RESULT_FOLDER = os.path.join("/app", "result")


def p(*args):
    print(*args, file=sys.stderr)


def dp(d, *args):
    if d:
        p(*args)

@app.route('/')
def hello_world():
    return '<h3>Hello, World!</h3><br>Me, the Machine Learning Server is online!!'


@app.route('/demo', methods=['POST', 'GET'])
def demo():
    rm_file_dir(IMAGE_FOLDER)          # Clean the folder structure
    rm_file_dir(RESULT_FOLDER)
    make_dir(IMAGE_FOLDER)
    make_dir(RESULT_FOLDER)
    if request.method == 'POST':
        img = request.files['img'].filename
        img_name = secure_filename(img)
        dp(DEBUG_DEMO, "Received the File:" + img_name)
        new_name = time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime()) + '_' + img_name
        filename = photos.save(request.files['img'], name=new_name)
        dp(DEBUG_DEMO, "Stored the file as (" + filename + ") in location ("+IMAGE_FOLDER+")")
        # dp(DEBUG_DEMO, os.listdir(IMAGE_FOLDER))

        try:
            process_batch_with_unet(IMAGE_FOLDER,RESULT_FOLDER)
        except KeyError :
            print (k)

        return jsonify({"message": "received the File"})
    return jsonify({"message": "Invalid API Call"})


@app.route('/getInferences', methods=['POST', 'GET'])
def get_inferences():
    if request.method == 'POST':
        img = request.files['img'].filename
        img = secure_filename(img)
        new_name = time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime()) + '_' + img
        filename = photos.save(request.files['img'], name=new_name)
        # data = predict_img(photos.path(filename), is_numpy=False,topk=int(topk))
        # img_path = photos.url(filename)
        # return flask.jsonify({"result":data,"img_path":img_path})

        return '{"message":"received the File"}'
    return '{"message":"Invalid API Call"}'
