# Import Packages
from fastapi import FastAPI


# App Instance
MRS = FastAPI()


# ============================================================
# * API Router
# ============================================================

# * Core
# ? Medical Records
from app.internal.core.mrs.routers.api \
    import record_apiRoute
MRS.include_router(record_apiRoute.router)



# ============================================================
# * Web Routers
# ============================================================

# * Core
# ? Medical Records
from app.internal.core.mrs.routers.web \
    import record_webRoute
MRS.include_router(record_webRoute.router)
