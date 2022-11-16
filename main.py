import json
from starlette.responses import FileResponse 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI

app = FastAPI()

f = open('data.json')
data = json.load(f)

@app.get("/courses")
def home():
    return {'data': data}

app.mount("/", StaticFiles(directory="Frontend",html = True), name="Frontend")
@app.get("/")
async def read_index():
    return FileResponse('index.html')

