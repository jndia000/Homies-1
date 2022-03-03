# Import Packages
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.responses import HTMLResponse
from jwt_token import get_token


# Router
router = APIRouter()


# ===========================================================
# * WEB ROUTES
# ===========================================================

# Redirect
@router.get("/")
def home(req: Request, user_data: dict = Depends(get_token)):

    # Redirect Path if /rms is loaded
    redirectPath = {
        "Department Head"   : "/dh",
        "Department Manager": "/dm",
        "Hiring Manager"    : "/h",
        "Talent Recruiter"  : "/r",
    }

    # Get the user roles
    userRoles = user_data["roles"]

    # Check if there is Recruitment with Role
    if "Recruitment" not in userRoles and userRoles["Recruitment"] not in redirectPath:
        return "page not found"

    # Redirect to a correct path
    return RedirectResponse("/rms" + redirectPath[userRoles["Recruitment"]])
