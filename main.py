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
# * Import Public Routes
# =================================================================

from app.public.app import publicApp
app.mount('/public', publicApp)


# =================================================================
# * Import Internal Routes
# =================================================================

from app.internal.app import internalApp
app.mount('/internal', internalApp)


# =================================================================
# * Import Test Routes
# =================================================================

from app.test.app import testApp
app.mount('/test', testApp)