import os
import sys
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# أتمتة مسار النظام البرمجي لضمان قراءة الملفات في خوادم Render المرنة
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 🔄 الاستيراد الذكي والمطابق لحالة الأحرف (Case-Insensitive Imports)
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


def init_database_securely():
    db_path = "database.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        if os.path.exists("schema.sql"):
            with open("schema.sql", "r", encoding="utf-8") as f:
                cursor.executescript(f.read())
        
        admin_username = os.getenv("ADMIN_USERNAME", "super_admin")
        hashed_password = os.getenv(
            "ADMIN_PASSWORD_HASH", 
            "$pbkdf2-sha256$29000$Z2FmZGFzZmFzZg$8v.YUXhE2N9S5wzV9NOmS2V5a1b3c4d5e6f7g8h9i0k"
        )
        
        cursor.execute("SELECT * FROM users WHERE username = ?", (admin_username,))
        if cursor.fetchone() is None:
            cursor.execute(
                "INSERT INTO users (username, hashed_password, role, is_active) VALUES (?, ?, ?, ?)",
                (admin_username, hashed_password, "superadmin", 1)
            )
            conn.commit()
    except Exception as e:
        print(f"تنبيه قاعدة البيانات: {e}")
    finally:
        conn.close()

init_database_securely()

app = FastAPI(
    title="منصتي الملكية - الـ API المستقر",
    description="المحرك الخلفي الشامل والمصحح للموقع الإلكتروني والتشغيل المجاني",
    version="1.1.0",
    docs_url="/api/v1/docs", 
    redoc_url="/api/v1/redoc"
)

# 🌐 إعدادات CORS المفتوحة والمجانية لمنع حظر المتصفحات للموقع الإلكتروني
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # يسمح للموقع بالاتصال بالبيانات من أي مكان حركي
    allow_credentials=False,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# 🛠️ تضمين الموجهات البرمجية التي تم التحقق من سلامتها
app.include_router(auth_router, prefix="/api/v1/auth", tags=["الأمان والتوثيق"])
app.include_router(users_router, prefix="/api/v1/users", tags=["إدارة المستخدمين"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["سجل الشركات"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["الإدارة العليا"])
app.include_router(health_router, prefix="/api/v1/health", tags=["الحالة الفنية"])

@app.get("/", tags=["الرئيسية"])
def root():
    return {
        "status": "online", 
        "message": "المحرك الخلفي للموقع الإلكتروني جاهز ومستقر تماماً بنجاح 100%"
    }
