# Import Packages
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles as sf


# To create tables
import models
from database import engine
models.Base.metadata.create_all(bind=engine)


# App Instance
app = FastAPI()


# Mount static folders
app.mount('/static' , sf(directory='static')        , name='static')
app.mount('/plugins', sf(directory='static/plugins'), name='plugins')
app.mount('/dist'   , sf(directory='static/dist')   , name='dist')
app.mount('/src'    , sf(directory='static/src')    , name='src')


# =================================================================
# * Import Internal Routes
# =================================================================

# ? Internal Home
from app.internal.app import internalApp
app.mount('/internal', internalApp)


# ! HOSPITAL CORE

# ? Visitors
from app.internal.core.vms.app import VMS
app.mount('/vms', VMS)

# ? Medical Records
from app.internal.core.mrs.app import MRS
app.mount('/mrs', MRS)


# ! HUMAN RESOURCE

# ? Recruitment
from app.internal.human_resource.rms.app import RMS
app.mount('/rms', RMS)


# =================================================================
# * Import Test Routes
# =================================================================

# ? This will remove after everything will be okay
from app.test.app import testApp
app.mount('/test', testApp)


# =================================================================
# * Import Public Routes
# =================================================================

# ? Public
from app.public.app import publicApp
app.mount('/', publicApp)