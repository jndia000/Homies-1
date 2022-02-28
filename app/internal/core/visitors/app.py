from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, PlainTextResponse
from starlette.exceptions import HTTPException as StarletteException
# from templates import template
# from routes import authRoutes, blacklistRoutes, inpatientRoutes, mailerRoutes, stationRoutes, healthFormRoutes, receptionistRoutes, passRoutes, appointmentRoutes, smsRoutes, userRoutes, visitRoutes, visitorRoutes

VMS = FastAPI()
#? Mount static folder
# VMS.mount('/static', StaticFiles(directory='static'), name='static')
# VMS.mount('/storage', StaticFiles(directory='storage'), name='storage')

#? Register Routes
# VMS.include_router(authRoutes.router)
# VMS.include_router(receptionistRoutes.router)
# VMS.include_router(visitorRoutes.router)
# VMS.include_router(appointmentRoutes.router)
# VMS.include_router(passRoutes.router)
# VMS.include_router(stationRoutes.router)
# VMS.include_router(visitRoutes.router)
# VMS.include_router(userRoutes.router)
# VMS.include_router(healthFormRoutes.router)
# VMS.include_router(blacklistRoutes.router)
# VMS.include_router(mailerRoutes.router)
# VMS.include_router(smsRoutes.router)
# VMS.include_router(inpatientRoutes.router)


# TODO: CREATE HANDLERS
@VMS.exception_handler(StarletteException)
def http_exception_handler(request, exc):
    if exc.status_code == 401:
        return RedirectResponse('/')
    else:
        return PlainTextResponse(content=str(exc.detail),status_code=exc.status_code)


@VMS.get('/visiting_schedule')
def visiting_schedule(request: Request):
    return 'visiting schedule'
#     return template.TemplateResponse('/contents/public/visiting_schedule.html',{
#     'request': request,
#     'page': 'visiting_schedule',
#     'title': 'Visiting Schedule'
# })

@VMS.get('/visiting_procedures')
def visiting_procedures(request: Request):
    return 'visiting procedures'
#     return template.TemplateResponse('/contents/public/visiting_procedures.html',{
#     'request': request,
#     'page': 'visiting_procedures',
#     'title': 'Visiting Procedures'
# })

@VMS.get('/visiting_policies_requirements')
def visiting_policies_requirements(request: Request):
    return 'visiting policies'
#     return template.TemplateResponse('/contents/public/visiting_policies_requirements.html',{
#     'request': request,
#     'page': 'visiting_policies_requirements',
#     'title': 'Visiting Policies and Requirements'
# })

@VMS.get('/visitor')
def index(request: Request):
    return "fake visitor login page"

