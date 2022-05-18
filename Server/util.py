import joblib , cv2 , os , json , numpy as np 
import matplotlib.pyplot as plt
import base64




model = None
numtoceleb =[]
celebrity_name={}


def strtoimg(data):
        encoded_data = data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img



def load_artifacts():
    global celebrity_name
    global numtoceleb
    with open("./artifact/data.json","r") as f:
        celebrity_name = json.load(f)
        
    numtoceleb = [name for name,num in celebrity_name.items() ]
        # for name,num in celebrity_name.items():
        #     numtoceleb[num]=name

    global model
    if model is None:
        model = joblib.load('./artifact/saved_model.pkl')



def getFaceImage(img):
    face_cascade = cv2.CascadeClassifier('./opencv/haarcascades/haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier('./opencv/haarcascades/haarcascade_eye.xml')
    
    # img = cv2.imread('./'+name)
    if img is None:
        # print("Send the proper link")
        return {
            "status":-2
        }
    grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(grey, 1.3, 5)
    roi_list =[]
    for (x,y,z,h) in faces:
        roi_grey = grey[y:y+h, x:x+z]
        roi_color = img[y:y+h, x:x+z]
        eyes = eye_cascade.detectMultiScale(roi_grey)
        if len(eyes)>1:
            image = cv2.resize(roi_color,(500,500))
            roi_list.append(image)
    if len(roi_list) == 0:
        return {
            "status":-1
        }
    X= np.array(roi_list)
    X_scaled = X/255
    pred = model.predict(X_scaled)
    ans = pred[0]
    max_val = np.max(pred[0])
    for i in pred:
        if np.max(i) > max_val:
            max_val = np.max(i)
            ans = i
    return {
        "status":1,
        "Probability":ans.tolist(),
        "Celebrity":numtoceleb[np.argmax(ans)],
        "celebrity_name":celebrity_name
    }




# _celeb = json'.load('./art')
if __name__ == "__main__":
    load_artifacts()
    # print(celebrity_name)