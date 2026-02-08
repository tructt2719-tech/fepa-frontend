from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '../database/fepa.sqlite'))

router = APIRouter()

class ExpenseCreate(BaseModel):
    userID: int
    amount: float
    category: str
    date: str
    note: Optional[str] = None
    icon: Optional[str] = "💰"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Đảm bảo bảng có cột createdAt để sắp xếp chuẩn xác hơn
def init_expense_table(conn):
    conn.execute('''
        CREATE TABLE IF NOT EXISTS Expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            note TEXT,
            icon TEXT DEFAULT '💰',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userID) REFERENCES User(id)
        )
    ''')
    conn.commit()

# --- CREATE EXPENSE ---
@router.post("/api/expenses")
async def create_expense(expense: ExpenseCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """INSERT INTO Expense (userID, amount, category, date, note, icon) 
                   VALUES (?, ?, ?, ?, ?, ?)"""
        cursor.execute(query, (expense.userID, expense.amount, expense.category, 
                               expense.date, expense.note, expense.icon))
        conn.commit()
        
        new_id = cursor.lastrowid
        
        # Trả về toàn bộ object để Frontend dùng [newExpense, ...prev]
        return {
            "id": new_id,
            "userID": expense.userID,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date,
            "note": expense.note,
            "icon": expense.icon,
            "message": "Success"
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --- GET ALL EXPENSES (Sắp xếp mới nhất lên đầu) ---
@router.get("/api/expenses/{user_id}")
async def get_expenses(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Sắp xếp theo ngày (date) giảm dần VÀ id giảm dần (để cái vừa nhập lên đầu tiên)
        query = """
            SELECT * FROM Expense 
            WHERE userID = ? 
            ORDER BY date DESC, id DESC
        """
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

# --- DELETE EXPENSE ---
@router.delete("/api/expenses/{expense_id}")
async def delete_expense(expense_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM Expense WHERE id = ?", (expense_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Expense not found")

        cursor.execute("DELETE FROM Expense WHERE id = ?", (expense_id,))
        conn.commit()
        return {"status": "success", "message": "Deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()