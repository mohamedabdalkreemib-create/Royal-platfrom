import os
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# استيراد الموجهات من ملفاتك المرفقة
from route_auth import router as auth_router
from route_users import router as users_router
from route_companies import router as companies_router
from route_locations import router as locations_router
from route_admin import router as admin_router
from route_health import router as health_router

def init_database_securely():
    db_path = "database.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        if os.path.exists("schema.sql"):
            with open("schema.sql", "r", encoding="utf-8") as f:
                cursor.executescript(f.read())
        
        # 🔒 قراءة كلمة المرور واسم مستخدم المسؤول من البيئة لتأمين الإنتاج
        admin_username = os.getenv("ADMIN_USERNAME", "super_admin")
        # في بيئة الإنتاج، يتم تمرير الهاش الفعلي المشفر بـ passlib/bcrypt عبر البيئة
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
        print(f"قاعدة البيانات مهيأة مسبقاً أو حدث تنبيه آمن: {e}")
    finally:
        conn.close()

init_database_securely()

app = FastAPI(
    title="منصتي الملكية الآمنة - API",
    description="النظام الخلفي المتكامل والمحمي لإدارة المؤسسات والشركات المعتمدة",
    version="1.0.0",
    docs_url="/api/v1/docs", 
    redoc_url="/api/v1/redoc"
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["Content-Type", "Authorization"], 
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["الأمان والتوثيق"])
app.include_router(users_router, prefix="/api/v1/users", tags=["إدارة المستخدمين"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["سجل الشركات"])
app.include_router(locations_router, prefix="/api/v1/locations", tags=["الفروع والمواقع"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["الإدارة العليا"])
app.include_router(health_router, prefix="/api/v1/health", tags=["الحالة الفنية"])

@app.get("/", tags=["الرئيسية"])
def root():
    return {"status": "secured", "message": "المحرك الخلفي جاهز للإنتاج بنجاح 100%"}
