# Import Packages
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles as sf


# To create tables
import models
from database import engine
# models.Base.metadata.create_all(bind=engine)


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

from app.internal.app import internalApp
app.mount('/internal', internalApp)

#? Recruitment
from app.internal.human_resource.recruitment.app import RMS
app.mount('/rms', RMS)

#? Visitors
from app.internal.core.visitors.app import VMS
app.mount('/vms', VMS)

# =================================================================
# * Import Test Routes
# =================================================================

from app.test.app import testApp
app.mount('/test', testApp)

# =================================================================
# * Import Public Routes
# =================================================================
#? last dapat to kasi masasalo lahat HAHAHAH
from app.public.app import publicApp
app.mount('/', publicApp)