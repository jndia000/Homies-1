# Import Packages
from fastapi import FastAPI



# App Instance
internalApp = FastAPI()


# ============================================================
# * API Router
# ============================================================

### none yet



# ============================================================
# * Web Routers
# ============================================================

# * Home
from app.internal.home.routers.web import mainRoute
internalApp.include_router(mainRoute.router)
