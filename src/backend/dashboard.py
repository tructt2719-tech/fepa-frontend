from fastapi import APIRouter, HTTPException
import sqlite3
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta  # Cần cài đặt: pip install python-dateutil

# Thiết lập đường dẫn cơ sở dữ liệu
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '../database/fepa.sqlite'))

router = APIRouter()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- 1. LẤY CÁC CHỈ SỐ TỔNG QUÁT (4 THẺ TRÊN CÙNG) ---
@router.get("/api/dashboard/stats/{user_id}")
async def get_dashboard_stats(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Total Balance: Tổng hạn mức ngân sách đã lập
        cursor.execute("SELECT IFNULL(SUM(limitAmount), 0) FROM Budget WHERE userID = ?", (user_id,))
        total_limit = cursor.fetchone()[0]

        # Total Expense: Tổng chi tiêu thực tế từ trước đến nay
        cursor.execute("SELECT IFNULL(SUM(amount), 0) FROM Expense WHERE userID = ?", (user_id,))
        total_all_expenses = cursor.fetchone()[0]

        # Saving Goal (Còn thiếu): Tổng số tiền cần tích lũy thêm để đạt mục tiêu
        cursor.execute("""
            SELECT IFNULL(SUM(targetAmount - currentAmount), 0) 
            FROM SavingGoal 
            WHERE userID = ? AND targetAmount > currentAmount
        """, (user_id,))
        total_remaining_to_save = cursor.fetchone()[0]

        # Total Debt (Nợ còn lại): Tổng số nợ trừ đi số đã trả
        cursor.execute("""
            SELECT IFNULL(SUM(total - paid), 0) 
            FROM Debt 
            WHERE userID = ?
        """, (user_id,))
        total_remaining_debt = cursor.fetchone()[0]

        return {
            "balance": total_limit,
            "totalBudget": total_all_expenses,
            "totalSpent": total_remaining_to_save,
            "totalDebt": total_remaining_debt,
            "currency": "USD"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --- 2. LẤY DỮ LIỆU BIỂU ĐỒ TRÒN (PHÂN BỔ CHI TIÊU) ---
@router.get("/api/dashboard/charts/{user_id}")
async def get_chart_data(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Lấy chi tiêu theo danh mục (Sử dụng cho DonutChart)
        query = """
            SELECT category, SUM(amount) as value 
            FROM Expense 
            WHERE userID = ? 
            GROUP BY category
        """
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        # Chuyển đổi từ Row sang Dict để Frontend dễ đọc
        return [{"category": row["category"], "value": row["value"]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --- 3. LẤY DỮ LIỆU BIỂU ĐỒ ĐƯỜNG (XU HƯỚNG 6 THÁNG) ---
@router.get("/api/dashboard/charts/line/{user_id}")
async def get_line_chart_data(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    chart_data = []
    now = datetime.now()

    try:
        # Lặp ngược 6 tháng từ hiện tại về quá khứ
        for i in range(5, -1, -1):
            target_date = now - relativedelta(months=i)
            month_label = target_date.strftime("%b")     # Ví dụ: "Jan", "Feb"
            month_query = target_date.strftime("%Y-%m")  # Ví dụ: "2024-02"

            # 1. Tổng chi tiêu của tháng đó
            cursor.execute("""
                SELECT IFNULL(SUM(amount), 0) 
                FROM Expense 
                WHERE userID = ? AND date LIKE ?
            """, (user_id, f"{month_query}%"))
            expense = cursor.fetchone()[0]

            # 2. Tổng hạn mức thu nhập/ngân sách tháng đó
            # Giả định: Ngân sách hợp lệ nếu tháng đó nằm trong khoảng startDate và endDate
            cursor.execute("""
                SELECT IFNULL(SUM(limitAmount), 0) 
                FROM Budget 
                WHERE userID = ? 
                AND (startDate <= ? AND endDate >= ?)
            """, (user_id, f"{month_query}-31", f"{month_query}-01"))
            income = cursor.fetchone()[0]

            chart_data.append({
                "month": month_label,
                "income": income if income > 0 else 0, # Giá trị mặc định để biểu đồ không bị trống
                "expense": expense
            })
        return chart_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()