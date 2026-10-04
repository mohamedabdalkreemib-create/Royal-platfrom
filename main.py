import os
import sys
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🚀 أداة الأتمتة الجذريّة: إجبار محرك بايثون على قراءة المجلد الرئيسي للمشروع أولاً
# هذا السطر البرمجي يحل مشكلة تعارض مجلد البيئة المحلية .venv في السيرفر السحابي
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

# استيراد الموجهات بالأسماء الحرفية الموثقة بداخل مستودع GitHub الخاص بك
import route_auth
import route_users
import route_companies
import route_admin
import route_health

def init_database_securely():
    db_path = os.path.join(CURRENT_DIR, "database.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        schema_path = os.path.join(CURRENT_DIR, "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
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
    description="المحرك الخلفي الموثق والآمن للموقع الإلكتروني والتشغيل المجاني",
    version="1.3.0",
    docs_url="/api/v1/docs", 
    redoc_url="/api/v1/redoc"
)

# 🌐 إعدادات CORS المفتوحة والمجانية لمنع حظر المتصفحات للموقع الإلكتروني
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# 🛠️ ربط الموجهات بالمسارات الدقيقة الفردية المعتمدة بملفات النظام
app.include_router(route_auth.router, prefix="/api/v1/auth", tags=["الأمان والتوثيق"])
app.include_router(route_users.router, prefix="/api/v1/users", tags=["إدارة المستخدمين"])
app.include_router(route_companies.router, prefix="/api/v1/companies", tags=["سجل الشركات"])
app.include_router(route_admin.router, prefix="/api/v1/admin", tags=["الإدارة العليا"])
app.include_router(route_health.router, prefix="/api/v1/health", tags=["الحالة الفنية"])

@app.get("/", tags=["الرئيسية"])
def root():
    return {
        "status": "online", 
        "message": "المحرك الخلفي للموقع الإلكتروني جاهز ومستقر تماماً بنجاح 100%"
    }
