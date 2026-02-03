# auth.py (updated)
import sqlite3
import os
from google import genai # Import thư viện mới thay vì google.generativeai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
import json
import math  # Để tính distance manual
from pydantic import BaseModel
from fastapi import Body
router = APIRouter()

SECRET_KEY = "fepa_secret_key"
ALGORITHM = "HS256"
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/fepa.sqlite'))
#----- AI gemini



# --- MODELS ---
class RegisterRequest(BaseModel):
    id: int
    email: str
    password: str
    phone: str
class FullRegisterRequest(BaseModel):
    email: str
    code: str
    password: str = None
    phone: str = None
    id: int = None
class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    email: str
    fullName: str
    phone: str
    address: str
    gender: str
    dob: str

class BiometricKeyRequest(BaseModel):
    email: str
    key: str

# --- HELPER FUNCTIONS ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn

def create_token(email: str):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_biometric_distance(stored_str: str, received_str: str) -> bool:
    try:
        stored = json.loads(stored_str)
        received = json.loads(received_str)
        if len(stored) != 128 or len(received) != 128:
            return False
        distance = math.sqrt(sum((a - b) ** 2 for a, b in zip(stored, received)))
        return distance < 0.6  # Threshold chuẩn cho face-api.js
    except:
        return False

# --- ENDPOINTS ---

@router.post("/api/login")
async def login(data: LoginRequest):
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM User WHERE email = ? AND password = ?", 
        (data.email, data.password)
    ).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")

    # Kiểm tra trạng thái 2FA từ cột mới (giả sử cột tên 'two_factor_method' với giá trị 'none', 'otp', 'biometric')
    two_factor_method = user["two_factor_method"] or 'none'

    # Trường hợp bật 2FA OTP
    if two_factor_method == 'otp':
        return {
            "need_2fa": True,
            "method": "otp",
            "email": user["email"]
        }

    # Trường hợp bật Biometric
    if two_factor_method == 'biometric':
        return {
            "need_2fa": True,
            "method": "biometric",
            "email": user["email"]
        }

    # Đăng nhập thẳng (none)
    token = create_token(user["email"])
    return {"need_2fa": False, "access_token": token, "user": dict(user)}

@router.post("/api/verify-login-otp")
async def verify_login_otp(data: FullRegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Kiểm tra xem user đã tồn tại chưa (phòng trường hợp đăng ký trùng)
    user = cursor.execute("SELECT * FROM User WHERE email = ?", (data.email,)).fetchone()
    
    if not user:
        # 2. Nếu không tồn tại (đây là đăng ký mới), tiến hành INSERT vào DB
        try:
            cursor.execute(
                "INSERT INTO User (id, email, password, phone, two_factor_method) VALUES (?, ?, ?, ?, 'none')",
                (data.id, data.email, data.password, data.phone)
            )
            conn.commit()
            # Lấy lại thông tin vừa tạo
            user = cursor.execute("SELECT * FROM User WHERE email = ?", (data.email,)).fetchone()
        except Exception as e:
            conn.close()
            raise HTTPException(status_code=500, detail=f"Lỗi lưu user: {str(e)}")

    conn.close()
    
    # 3. Tạo token và trả về thông tin user
    token = create_token(data.email)
    return {
        "access_token": token,
        "user": dict(user)
    }

# NEW: Endpoint để verify biometric (quét mặt khi login)
@router.post("/api/verify-biometric")
async def verify_biometric(data: BiometricKeyRequest):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM User WHERE email = ?", (data.email,)).fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    
    stored_key = user["biometric_data"]
    if not stored_key:
        raise HTTPException(status_code=400, detail="Chưa đăng ký sinh trắc học")
    
    if verify_biometric_distance(stored_key, data.key):
        token = create_token(data.email)
        return {
            "access_token": token,
            "user": dict(user)
        }
    else:
        raise HTTPException(status_code=401, detail="Khuôn mặt không khớp")

@router.post("/api/toggle-biometric")
async def toggle_biometric(email: str, enable: bool):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    user = cursor.execute("SELECT biometric_data, two_factor_method FROM User WHERE email = ?", (email,)).fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    if enable and not user["biometric_data"]:
        conn.close()
        return {
            "status": "need_registration",
            "message": "Vui lòng đăng ký FaceID/Vân tay trên thiết bị này."
        }

    # Cập nhật cột two_factor_method
    new_method = 'biometric' if enable else 'none'
    cursor.execute("UPDATE User SET two_factor_method = ? WHERE email = ?", (new_method, email))
    conn.commit()
    conn.close()
    return {"status": "success", "new_method": new_method}

@router.post("/api/register-biometric-key")
async def register_biometric_key(data: BiometricKeyRequest):
    print(f"[REGISTER-BIOMETRIC] Nhận request cho {data.email} | key length: {len(data.key)}")
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        user = cursor.execute("SELECT * FROM User WHERE email = ?", (data.email,)).fetchone()
        if not user:
            print("[REGISTER-BIOMETRIC] User không tồn tại")
            raise HTTPException(404, "User not found")

        # Lưu key và cập nhật method
        cursor.execute(
            "UPDATE User SET biometric_data = ?, two_factor_method = 'biometric' WHERE email = ?",
            (data.key, data.email)
        )
        conn.commit()
        
        print(f"[REGISTER-BIOMETRIC] Thành công")
        return {"status": "success"}

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"[REGISTER-BIOMETRIC] LỖI: {type(e).__name__} - {str(e)}")
        if isinstance(e, sqlite3.OperationalError) and "locked" in str(e).lower():
            raise HTTPException(500, "Database bị lock - thử lại sau vài giây")
        raise HTTPException(500, f"Server error: {str(e)}")
    
    finally:
        if conn:
            conn.close()
class ChangePasswordRequest(BaseModel):
    email: str
    old_password: str
    new_password: str

@router.post("/api/change-password")
async def change_password(data: ChangePasswordRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute(
        "SELECT password FROM User WHERE email = ?",
        (data.email,)
    ).fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(404, "User not found")
    
    if user["password"] != data.old_password:
        conn.close()
        raise HTTPException(401, "Mật khẩu cũ không đúng")
    
    cursor.execute(
        "UPDATE User SET password = ? WHERE email = ?",
        (data.new_password, data.email)
    )
    conn.commit()
    conn.close()
    return {"message": "Đổi mật khẩu thành công"}
@router.post("/api/delete-account")
async def delete_account(data: dict = Body(...)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=422, detail="Missing email in request body")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Kiểm tra user tồn tại
    user = cursor.execute("SELECT id FROM User WHERE email = ?", (email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Xóa toàn bộ record của user (có thể thêm xóa các bảng liên quan nếu có)
    cursor.execute("DELETE FROM User WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    print(f"[DELETE-ACCOUNT] Đã xóa tài khoản: {email}")
    return {"message": "Tài khoản đã được xóa thành công"}
@router.post("/api/delete-biometric")
async def delete_biometric(data: dict = Body(...)):
    email = data.get("email")
    if not email:
        raise HTTPException(422, "Missing email in request body")
    
    print(f"[DELETE-BIOMETRIC] Xóa FaceID cho {email}")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    user = cursor.execute("SELECT * FROM User WHERE email = ?", (email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(404, "User not found")
    
    cursor.execute(
        "UPDATE User SET biometric_data = NULL, two_factor_method = 'none' WHERE email = ?",
        (email,)
    )
    conn.commit()
    conn.close()
    
    return {"status": "success"}
@router.post("/api/toggle-2fa")
async def toggle_2fa(email: str, enable: bool):
    """Cập nhật trực tiếp không cần OTP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute("SELECT * FROM User WHERE email = ?", (email,)).fetchone()
    
    if user:
        new_method = 'otp' if enable else 'none'
        cursor.execute("UPDATE User SET two_factor_method = ? WHERE email = ?", (new_method, email))
        conn.commit()
        conn.close()
        return {"new_method": new_method}
    
    conn.close()
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/api/update-profile")
async def update_profile(data: UpdateProfileRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE User 
            SET fullName = ?, phone = ?, address = ?, gender = ?, dob = ?
            WHERE email = ?
        """, (data.fullName, data.phone, data.address, data.gender, data.dob, data.email))
        cursor.execute("""
            UPDATE Subscription 
            SET name = ? 
            WHERE id = (SELECT id FROM User WHERE email = ?)
        """, (data.fullName, data.email))

        conn.commit()
        return {"message": "Cập nhật hồ sơ và tên gói dịch vụ thành công"}
    
    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@router.get("/api/check-email")
async def check_email(email: str):
    conn = get_db_connection()
    user = conn.execute("SELECT email FROM User WHERE email = ?", (email,)).fetchone()
    conn.close()
    
    if user:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký!")
    
    return {"status": "available"}