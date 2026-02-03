from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '../database/fepa.sqlite'))

router = APIRouter()

# --- MODELS ---
class BudgetCreate(BaseModel):
    userID: int
    category: str
    limitAmount: float
    startDate: str
    endDate: str
class GoalDeposit(BaseModel):
    amount: float
class BudgetUpdate(BaseModel):
    limitAmount: float
    startDate: str
    endDate: str

# Model này khớp với dữ liệu từ CreateGoalModal gửi lên
class DepositToAllGoals(BaseModel):
    amount: float
    expense_date: str  # YYYY-MM-DD, để kiểm tra goal còn hạn
class GoalCreate(BaseModel):
    user_id: int
    goal_name: str
    target_amount: float
    current_amount: float
    target_date: str  
# --- DATABASE CONNECTION ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- INITIALIZATION ---
def init_tables():
    conn = get_db_connection()
    try:
        # 1. Khởi tạo bảng Budget
        conn.execute('''
            CREATE TABLE IF NOT EXISTS Budget (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID INTEGER NOT NULL,
                category TEXT NOT NULL,
                limitAmount REAL NOT NULL,
                startDate TEXT NOT NULL,
                endDate TEXT NOT NULL,
                FOREIGN KEY (userID) REFERENCES User(id) 
            )
        ''')
        # 2. Khởi tạo bảng SavingGoal (ĐÃ ĐỔI TÊN VÀ CỘT)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS SavingGoal (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID INTEGER NOT NULL,
                goal_name TEXT NOT NULL,
                targetAmount REAL NOT NULL,
                currentAmount REAL DEFAULT 0,
                deadline TEXT NOT NULL,
                FOREIGN KEY (userID) REFERENCES User(id)
            )
        ''')
        conn.commit()
        print("✅ Tables initialized successfully (Using SavingGoal).")
    except Exception as e:
        print(f"❌ Error initializing tables: {e}")
    finally:
        conn.close()

# Tự động chạy khi khởi động
init_tables()

# --- BUDGET ROUTES ---
@router.post("/api/budgets")
async def create_budget(budget: BudgetCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO Budget (userID, category, limitAmount, startDate, endDate)
            VALUES (?, ?, ?, ?, ?)
        ''', (budget.userID, budget.category, budget.limitAmount, budget.startDate, budget.endDate))
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Success"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/api/budgets/{user_id}")
async def get_budgets(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT b.id, b.category AS name, b.limitAmount AS 'limit', b.startDate, b.endDate,
            (SELECT IFNULL(SUM(e.amount), 0) FROM Expense e WHERE e.userID = b.userID 
             AND e.category = b.category AND e.date BETWEEN b.startDate AND b.endDate) as spent
            FROM Budget b WHERE b.userID = ?
        """
        cursor.execute(query, (user_id,))
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

# --- SAVING GOAL ROUTES (ĐÃ SỬA TÊN BẢNG) ---
@router.post("/api/goals/{user_id}/deposit-all")
async def deposit_to_all_active_goals(user_id: int, deposit: DepositToAllGoals):
    """
    Cộng tiền vào currentAmount của TẤT CẢ SavingGoal còn hạn (deadline >= expense_date)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE SavingGoal
            SET currentAmount = currentAmount + ?
            WHERE userID = ?
              AND deadline >= ?
        """, (deposit.amount, user_id, deposit.expense_date))

        affected = cursor.rowcount
        conn.commit()

        return {
            "status": "success",
            "message": f"Đã cộng +{deposit.amount}$ vào {affected} mục tiêu tiết kiệm còn hạn.",
            "affected_goals": affected
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@router.post("/api/goals")
async def create_goal(goal: GoalCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Xóa icon khỏi câu lệnh INSERT và VALUES
        cursor.execute('''
            INSERT INTO SavingGoal (userID, goal_name, targetAmount, currentAmount, deadline)
            VALUES (?, ?, ?, ?, ?)
        ''', (goal.user_id, goal.goal_name, goal.target_amount, goal.current_amount, goal.target_date))
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Success"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/api/goals/{user_id}")
async def get_goals(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Lấy dữ liệu từ bảng SavingGoal
        cursor.execute("SELECT * FROM SavingGoal WHERE userID = ?", (user_id,))
        rows = cursor.fetchall()
        goals = [dict(row) for row in rows]
        
        for g in goals:
            # Lấy tổng chi tiêu để tính toán thực tế
            cursor.execute("SELECT IFNULL(SUM(amount), 0) FROM Expense WHERE userID = ?", (user_id,))
            total_spent = cursor.fetchone()[0]
            
            # Tiết kiệm thực tế = currentAmount (số tiền đã có) - total_spent (chi tiêu)
            # Lưu ý: Bạn có thể đổi logic này tùy theo cách bạn muốn quản lý quỹ
            g['actualSaved'] = g['currentAmount'] - total_spent
            g['totalSpent'] = total_spent
            
            # Tính ngày còn lại từ cột 'deadline'
            try:
                target_dt = datetime.strptime(g['deadline'], '%Y-%m-%d').date()
                today = datetime.now().date()
                g['daysLeft'] = (target_dt - today).days
                g['isExpired'] = today > target_dt
            except:
                g['daysLeft'] = 0
                g['isExpired'] = True
                
        return goals
    finally:
        conn.close()

@router.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM SavingGoal WHERE id = ?", (goal_id,))
        conn.commit()
        return {"status": "success", "message": "Deleted goal"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@router.patch("/api/goals/{goal_id}/deposit")
async def deposit_to_goal(goal_id: int, deposit: GoalDeposit):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Kiểm tra mục tiêu có tồn tại không
        cursor.execute("SELECT id FROM SavingGoal WHERE id = ?", (goal_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Mục tiêu không tồn tại")

        # Thực hiện cộng dồn số tiền
        cursor.execute('''
            UPDATE SavingGoal 
            SET currentAmount = currentAmount + ? 
            WHERE id = ?
        ''', (deposit.amount, goal_id))
        
        conn.commit()
        return {"message": f"Đã nạp thêm ${deposit.amount} vào mục tiêu", "status": "success"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
@router.delete("/api/budgets/{budget_id}")
async def delete_budget(budget_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Kiểm tra sự tồn tại trước khi xóa (tùy chọn)
        cursor.execute("DELETE FROM Budget WHERE id = ?", (budget_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy ngân sách để xóa")
            
        return {"status": "success", "message": "Deleted budget"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()