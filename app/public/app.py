# Import Packages
from fastapi import FastAPI


# App Instance
publicApp = FastAPI()


# ============================================================
# * API Routers
# ============================================================

# * Home Routers
from app.public.home.routers.api import authRoute
publicApp.include_router(authRoute.router)



# ============================================================
# * Web Routers
# ============================================================

# * Home Routers
from app.public.home.routers.web import homeRoute
publicApp.include_router(homeRoute.router)