# Import Packages
from fastapi import FastAPI


# App Instance
internalApp = FastAPI()


# ============================================================
# * API Router
# ============================================================

# Import API Routers
### none yet



# ============================================================
# * Web Routers
# ============================================================

# Import Internal Home Web Routers
from app.internal.home.routers.web import mainRoute
internalApp.include_router(mainRoute.router)