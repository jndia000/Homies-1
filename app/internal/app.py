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


# * Human Resource
# Recruitment
from app.internal.human_resource.recruitment.routers.web \
    import redirectRouter, deptHeadRouter, deptMngrRouter, hireMngrRoute, recruiterRoute
internalApp.include_router(redirectRouter.router)
internalApp.include_router(deptHeadRouter.router)
internalApp.include_router(deptMngrRouter.router)
internalApp.include_router(hireMngrRoute.router)
internalApp.include_router(recruiterRoute.router)