import json
from starlette.responses import FileResponse 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import yagmail

app = FastAPI()

f = open('data.json')
data = json.load(f)

@app.get("/courses")
def home():
    return {'data': data}

@app.post("/sendEmail")
async def sendEmail(msg: str):
    yag = yagmail.SMTP('hackathon2022team26@gmail.com', 'xtcfgqkknmvleeuj')
    try:
        yag.send('csrrocz@gmail.com', 'test', msg)
        return {"send": "successful"}
    except:
        return {"error": "error"}
        

app.mount("/", StaticFiles(directory="Frontend",html = True), name="Frontend")
@app.get("/")
async def read_index():
    return FileResponse('index.html')


        


