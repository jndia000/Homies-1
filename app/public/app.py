# Import Packages
from fastapi import FastAPI


# App Instance
publicApp = FastAPI()


# ============================================================
# * API Router
# ============================================================

# Import API Routers
### none yet



# ============================================================
# * Web Routers
# ============================================================

# Import Web Routers
from app.public.home.routers.web import homeRoute
publicApp.include_router(homeRoute.router)