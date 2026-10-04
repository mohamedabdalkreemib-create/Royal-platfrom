import os
import sys
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# أتمتة مسار النظام لضمان قراءة الملفات بغض النظر عن حالة الأحرف في السيرفر
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# استيراد الموجهات البرمجية الفعلية
try:
    import route_auth as auth_module
    auth_router = auth_module.router
except ModuleNotFoundError:
    import Route_auth as auth_module
    auth_router = auth_module.router

try:
    import route_users as users_module
    users_router = users_module.router
except ModuleNotFoundError:
    import Route_users as users_module
    users_router = users_module.router

try:
    import route_companies as companies_module
    companies_router = companies_module.router
except ModuleNotFoundError:
    import Route_companies as companies_module
    companies_router = companies_module.router

try:
    import route_admin as admin_module
    admin_router = admin_module.router
except ModuleNotFoundError:
    import Route_admin as admin_module
    admin_router = admin_module.router

try:
    import route_health as health_module
    health_router = health_module.router
except ModuleNotFoundError:
    import Route_health as health_module
    health_router = health_module.router
