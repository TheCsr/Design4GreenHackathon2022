import json
from starlette.responses import FileResponse 
from fastapi.staticfiles import StaticFiles
import logging
from fastapi import FastAPI
import yagmail
import pdfkit
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()


origins = ['http://vps-e475b14c.vps.ovh.net:3000','http://127.0.0.1:8000/courses', 'http://127.0.0.1:8000',"http://54.36.98.185:3000"]

app.add_middleware (
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

f = open('data.json')
data = json.load(f)
courses = data["data"]

@app.get("/courses")
def home():
    response = {'data': data}
    return response

@app.post("/sendEmail")
async def sendEmail(msg: str):
    yag = yagmail.SMTP('hackathon2022team26@gmail.com', 'xtcfgqkknmvleeuj')
    try:
        yag.send('design4green@etik.com', 'Quote for Design4Green Platform', msg)
        return {"send": "successful"}
    except:
        return {"error": "error"}

@app.get("/export/")
async def export_pdf(ids:str):
    """
    e.g of endpoint!    http://127.0.0.1:8000/export/?ids=1,2,3,4

    """
    courses_ids = [int(_id) for _id in ids.split(",")]
    courses_selected = [course for course in courses if course["id"] in courses_ids]    

    to_display = [
        'Organisation',
        'Organisation Type',
        'Organisation Name',
        'Department Unit',
        'Location',
        'Type of Training', 
        'Academic Level',
        'Programme Objectives',
        'Programme Description',
        'Course Title',
        'Training Access',
        'Duration (days)',
        'Course Outcome',
        'URL'
    ]
    template_file = './Frontend/template.html' #Template
    export_file = "./Frontend/export.html" # Export file

    with open(template_file, "r") as rf:
        with open(export_file, "w") as wf:
            for line in rf:
                if line.find("    <!--COURSES-->") != -1:
                    for obj in courses_selected:
                        html_string = f"<h2>{obj['Course Title']}</h2><div><p>"
                        for key in to_display:
                            val = obj[key]
                            if val:
                                if key == "URL":
                                    html_string += f"<b>{key}: </b> <a href='{val}'> {val}</a> <br>"
                                else:
                                    html_string += f"<b>{key}: </b> {val} <br>"
                        html_string += "</p></div></div><hr>"                    
                        wf.write(f"{html_string}\n")
                else:
                    wf.write(line)
                
    pdf_exported = './Frontend/pdf/Selected Courses.pdf'
    pdfkit.from_url(export_file, pdf_exported) # File is saved
    return FileResponse(pdf_exported)      

app.mount("/", StaticFiles(directory="Frontend",html = True), name="Frontend")

@app.get("/")
async def read_index():
    return FileResponse('index.html')


        


