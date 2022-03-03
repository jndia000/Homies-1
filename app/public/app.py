# Import Packages
from fastapi import FastAPI


# App Instance
publicApp = FastAPI()


# ============================================================
# * API Routers
# ============================================================

# * Home Routers
# ? Main Public API
from app.public.home.routers.api import authRoute
publicApp.include_router(authRoute.router)

# * Career Routers
# ? Recruitment Public API
from app.internal.human_resource.rms.routers.api import careers_apiRoute
publicApp.include_router(careers_apiRoute.router)



# ============================================================
# * Web Routers
# ============================================================

# * Home Routers
# ? Main Public Portal
from app.public.home.routers.web import homeRoute
publicApp.include_router(homeRoute.router)

# * Careers Routers
# ? Recruitment Public Portal
from app.internal.human_resource.rms.routers.web import careers_webRoute
publicApp.include_router(careers_webRoute.router)