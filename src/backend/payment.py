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

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn

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
@router.get("/api/check-premium-status")
async def check_premium_status(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Lấy thông tin type từ bảng Subscription thông qua userID
        query = """
            SELECT s.type, u.subscriptionID, u.isActive 
            FROM User u
            LEFT JOIN Subscription s ON u.id = s.id
            WHERE u.email = ?
        """
        result = cursor.execute(query, (email,)).fetchone()
        
        if not result:
            return {"isPremium": False}

        # Kiểm tra nếu type là premium và tài khuoản đang Active
        is_premium = result["type"] == 'premium' and result["isActive"] == 1
        return {
            "isPremium": is_premium,
            "subscriptionID": result["subscriptionID"],
            "isActive": result["isActive"]
        }
    finally:
        conn.close()