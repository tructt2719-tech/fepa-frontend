import sqlite3
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

# Đường dẫn DB khớp với dự án của bạn
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/fepa.sqlite'))

class PaymentRequest(BaseModel):
    email: str


DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../database/fepa.sqlite")
)

# ===== REQUEST MODEL =====
class PaymentRequest(BaseModel):
    email: str

# ===== DB CONNECT =====
def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================================================
# PAYMENT → AUTO ADD / UPDATE SUBSCRIPTION
# ==========================================================

@router.post("/api/process-payment")
async def process_payment(data: PaymentRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Lấy thông tin User hiện tại (ID và FullName)
        user = cursor.execute("SELECT id, fullName FROM User WHERE email = ?", (data.email,)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")

        user_id = user["id"]
        full_name = user["fullName"]
        
        # 2. Tính toán duration (thời gian 1 tháng sau kể từ hôm nay)
        current_time = datetime.now()
        expiry_date = current_time + timedelta(days=30)
        duration_str = expiry_date.strftime("%Y-%m-%d %H:%M:%S")

        # 3. Nạp hoặc cập nhật vào bảng Subscription dùng ID và Name của User
        # Sử dụng INSERT OR REPLACE để nếu ID đã tồn tại thì cập nhật thời hạn mới
        cursor.execute("""
            INSERT OR REPLACE INTO Subscription (id, name, price, duration, type)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, full_name, 99000, duration_str, 'premium'))

        # 4. Cập nhật User lên Premium
        # subscriptionID bây giờ sẽ chính là userID của họ
        cursor.execute("""
            UPDATE User 
            SET subscriptionID = ?, 
                isActive = 1 
            WHERE email = ?
        """, (user_id, data.email))
        
        conn.commit()
        return {
            "status": "success", 
            "message": f"Tài khoản {full_name} đã nâng cấp thành công!",
            "expiry_date": duration_str
        }

    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@router.get("/api/check-premium")
async def check_premium(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Lấy type từ bảng Subscription bằng cách JOIN với bảng User qua ID
        query = """
            SELECT s.type 
            FROM Subscription s
            JOIN User u ON u.id = s.id
            WHERE u.email = ? AND u.isActive = 1
        """
        result = cursor.execute(query, (email,)).fetchone()
        
        # Nếu tìm thấy bản ghi và type là premium
        is_premium = result is not None and result["type"] == 'premium'
        return {"isPremium": is_premium}
    finally:
        conn.close()
# Thêm endpoint này vào file Backend của bạn

    try:
        # 1. Lấy user
        user = cursor.execute(
            "SELECT id, fullName FROM User WHERE email = ?",
            (data.email,)
        ).fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User không tồn tại")

        user_id = user["id"]

        # 2. Thời hạn Premium (30 ngày)
        now = datetime.now()
        expiry_date = now + timedelta(days=30)

        # 3. Kiểm tra user đã có subscription chưa
        existing = cursor.execute(
            """
            SELECT s.id
            FROM Subscription s
            JOIN User u ON u.subscriptionID = s.id
            WHERE u.id = ?
            """,
            (user_id,)
        ).fetchone()

        if existing:
            # 👉 Gia hạn
            cursor.execute(
                """
                UPDATE Subscription
                SET duration = ?, type = 'premium'
                WHERE id = ?
                """,
                (
                    expiry_date.strftime("%Y-%m-%d %H:%M:%S"),
                    existing["id"]
                )
            )
            subscription_id = existing["id"]
        else:
            # 👉 Tạo mới subscription premium
            cursor.execute(
                """
                INSERT INTO Subscription (name, price, duration, type)
                VALUES (?, ?, ?, 'premium')
                """,
                (
                    user["fullName"],
                    99000,
                    expiry_date.strftime("%Y-%m-%d %H:%M:%S"),
                )
            )
            subscription_id = cursor.lastrowid

        # 4. Gán subscription cho user
        cursor.execute(
            """
            UPDATE User
            SET subscriptionID = ?, isActive = 1
            WHERE id = ?
            """,
            (subscription_id, user_id)
        )

        conn.commit()

        return {
            "status": "success",
            "subscriptionID": subscription_id,
            "expiry_date": expiry_date.strftime("%Y-%m-%d %H:%M:%S"),
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        conn.close()

# ==========================================================
# CHECK PREMIUM (FRONTEND GUARD)
# ==========================================================
@router.get("/api/check-premium-status")
async def check_premium_status(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        result = cursor.execute(
            """
            SELECT s.type, s.duration, u.isActive
            FROM User u
            LEFT JOIN Subscription s ON u.subscriptionID = s.id
            WHERE u.email = ?
            """,
            (email,)
        ).fetchone()

        if not result:
            return {"isPremium": False}

        if result["type"] != "premium":
            return {"isPremium": False}

        if result["isActive"] != 1:
            return {"isPremium": False}

        # Check hết hạn
        if result["duration"]:
            expiry = datetime.strptime(
                result["duration"],
                "%Y-%m-%d %H:%M:%S"
            )
            if expiry < datetime.now():
                return {"isPremium": False}

        return {"isPremium": True}

    finally:
        conn.close()

