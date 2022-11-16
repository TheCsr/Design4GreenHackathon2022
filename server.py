import json
from starlette.responses import FileResponse 
from fastapi import FastAPI

app = FastAPI()


f = open('data.json')
data = json.load(f)


@app.get("/courses")
def home():
    return {'data': data}

@app.get("/")
async def read_index():
    return FileResponse('Frontend/index.html')