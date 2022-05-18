import util
from flask import Flask,request,jsonify,render_template
import os,json,PIL
from flask_cors import CORS

# from werkzeug.wrappers import response
# import util

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
   return render_template('app.html')
#    return render_template('./../UI/app.html')

@app.route('/classify',methods=['Get','Post'])
def ImageClassify():
    if request.method == 'POST':
        data = request.form.get("Image_data")
        img = util.strtoimg(data)
        response = jsonify(util.getFaceImage(img))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    

    # print(f"received data: {request}")
    # if os.path.exist('./1.jpg'):
    # response  =jsonify(util.getFaceImage())
    



if __name__ == "__main__":
    util.load_artifacts()
    app.run(port=5000)
