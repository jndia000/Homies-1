# Import Packages
from fastapi import FastAPI


# App Instance
RMS = FastAPI()


# ============================================================
# * API Router
# ============================================================

# * Human Resource
# ? Recruitment
from app.internal.human_resource.rms.routers.api \
    import deptHead_apiRoute, deptMngr_apiRoute, hireMngr_apiRoute, recruiter_apiRoute
RMS.include_router(deptHead_apiRoute.router)
RMS.include_router(deptMngr_apiRoute.router)
RMS.include_router(hireMngr_apiRoute.router)
RMS.include_router(recruiter_apiRoute.router)


# ============================================================
# * Web Routers
# ============================================================

# * Human Resource
# ? Recruitment
from app.internal.human_resource.rms.routers.web \
    import redirect_webRouter, deptHead_webRoute, deptMngr_webRoute, hireMngr_webRoute, recruiter_webRoute
RMS.include_router(redirect_webRouter.router)
RMS.include_router(deptHead_webRoute.router)
RMS.include_router(deptMngr_webRoute.router)
RMS.include_router(hireMngr_webRoute.router)
RMS.include_router(recruiter_webRoute.router)