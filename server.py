import json
from starlette.responses import FileResponse 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI

app = FastAPI()

app.mount("/", StaticFiles(directory="Frontend",html = True), name="Frontend")

f = open('data.json')
data = json.load(f)

@app.get("/courses")
def home():
    return {'data': data}


@app.get("/")
async def read_index():
    return FileResponse('index.html')

