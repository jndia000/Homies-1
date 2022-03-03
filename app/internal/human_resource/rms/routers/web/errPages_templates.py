# Import Packagaes
from fastapi import Request
from fastapi.templating import Jinja2Templates


# Template
template = Jinja2Templates(directory = "app/internal/human_resource/rms/views")


# Templates Path
TEMPLATES_PATH = "/pages/errors/"


# 404 Page Not Found
def page_not_found(req: Request):
    return template.TemplateResponse(TEMPLATES_PATH + "404.html", {
        "request": req,
        "page_title": "404 Page Not Found"
    })