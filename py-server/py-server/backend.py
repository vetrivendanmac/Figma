from flask import Flask,request
import requests
from flask_cors import CORS, cross_origin
from gevent.pywsgi import WSGIServer
import base64

app = Flask(__name__)
data={}
@app.route("/get_from_figma",methods=['GET','POST'])
@cross_origin(origin='*')
def getFromFigma():
    print("API invoked",data)
    payload={"data":app.config["data"],
    "message":app.config["prompt"]}
    return payload

@app.route("/figma",methods=['GET','POST'])
@cross_origin(origin='*')
def figma():
    print("API invoked")
    data = request.json
    app.config["data"]=data
    # print(data,type(data))
    
    # send api request to another python server
    return "Invoked"

@app.route("/binary_data",methods=['GET','POST'])
@cross_origin(origin='*')
def binaryData():
    try:
        
        data = request.json['data']
        prompt = request.json['prompt']
        print("API invoked")
        app.config["data"]=data
        app.config["prompt"]=prompt
        obj={"data":data,
            "message":prompt}
        url="http://*.*.*.*:9000/codeGen"
        print(prompt)
        response=requests.post(url,json=obj)
        
        if response.status_code==200:
            print("response from other server",response.json())
        else:
            print("response from other server",response.status_code)
    
    except Exception as e:
        print(e)
    return "Invoked"

def run_server():
    if(app.debug):
        application = app
    else:
        application = app
    
    server = WSGIServer(('0.0.0.0', 9000), application)
    print("Server Start")
    server.serve_forever()

if __name__ == '__main__':
      run_server()