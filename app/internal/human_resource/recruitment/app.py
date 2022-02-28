# Import Packages
from fastapi import FastAPI


# App Instance
RMS = FastAPI()


# ============================================================
# * API Router
# ============================================================

### none yet



# ============================================================
# * Web Routers
# ============================================================


# * Human Resource
# Recruitment
from app.internal.human_resource.recruitment.routers.web \
    import redirectRouter, deptHeadRouter, deptMngrRouter, hireMngrRoute, recruiterRoute
RMS.include_router(redirectRouter.router)
RMS.include_router(deptHeadRouter.router)
RMS.include_router(deptMngrRouter.router)
RMS.include_router(hireMngrRoute.router)
RMS.include_router(recruiterRoute.router)