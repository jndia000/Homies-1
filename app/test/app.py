# Import Packages
from fastapi import FastAPI


# App Instance
testApp = FastAPI()


#============================================================
#* API Router
#============================================================

from app.test import api
testApp.include_router(api.router)

