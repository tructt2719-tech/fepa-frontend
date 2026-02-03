from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import sqlite3
from datetime import date, datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '../database/fepa.sqlite'))

router = APIRouter()

# --- MODELS ---
class DebtCreate(BaseModel):
    userID: int
    name: str
    type: str
    total: float
    paid: float = 0
    monthly: float
    interest: float | None = 0
    nextPayment: str | None = None  # YYYY-MM-DD

class DebtPay(BaseModel):
    amount: float

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- INITIALIZATION ---
def init_tables():
    conn = get_db_connection()
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS Debt (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID INTEGER NOT NULL,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                total REAL NOT NULL,
                paid REAL DEFAULT 0,
                monthly REAL NOT NULL,
                interest REAL DEFAULT 0,
                nextPayment TEXT,
                payoff TEXT,
                overdue INTEGER DEFAULT 0,
                FOREIGN KEY (userID) REFERENCES User(id)
            )
        """)
        conn.commit()
        print("✅ Debt table initialized")
    except Exception as e:
        print("❌ Init Debt error: ", e)
    finally:
        conn.close()

# Tự động chạy khi khởi động
init_tables()

# --- Update Overdue chạy mỗi 24h
from datetime import date

def update_overdue_for_user(user_id: int):
    """
    Update overdue cho 1 user cụ thể
    Dùng khi GET debts để đảm bảo realtime
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        today = date.today().isoformat()

        cursor.execute("""
            UPDATE Debt
            SET overdue = 1
            WHERE userID = ?
              AND nextPayment IS NOT NULL
              AND nextPayment < ?
              AND paid < total
        """, (user_id, today))

        conn.commit()
    finally:
        conn.close()


# --- Xu ly paid ---
@router.patch("/api/debts/{debt_id}/pay")
async def pay_debt(debt_id: int, payload: DebtPay):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT total, paid, payoff FROM Debt WHERE id = ?",
        (debt_id,)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Debt not found")

    total = row["total"]
    paid = row["paid"] or 0
    payoff = row["payoff"]

    new_paid = paid + payload.amount

    # 🔥 LOGIC QUAN TRỌNG
    new_payoff = payoff
    if new_paid >= total and payoff is None:
        new_paid = total
        new_payoff = date.today().isoformat()

    cursor.execute("""
        UPDATE Debt
        SET paid = ?, payoff = ?, overdue = 0
        WHERE id = ?
    """, (new_paid, new_payoff, debt_id))

    conn.commit()
    conn.close()

    return {
        "paid": new_paid,
        "payoff": new_payoff
    }

# --- CREATE DEBT ---
@router.post("/api/debts")
async def create_debt(debt: DebtCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        payoff = None
        overdue = 0
        if debt.nextPayment:
            overdue = int(
                datetime.strptime(debt.nextPayment, "%Y-%m-%d").date() < date.today()
            )
        if debt.paid >= debt.total and debt.total > 0:
            debt.paid = debt.total
            payoff = date.today().isoformat()
            overdue = 0
        cursor.execute("""
            INSERT INTO Debt 
            (userID, name, type, total, paid, monthly, interest, nextPayment, payoff, overdue)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            debt.userID,
            debt.name,
            debt.type,
            debt.total,
            debt.paid,
            debt.monthly,
            debt.interest,
            debt.nextPayment,
            payoff,
            overdue
        ))

        conn.commit()
        return {"id": cursor.lastrowid, "message": "Debt created"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/api/debts/{user_id}")
async def get_debts(user_id: int):
    update_overdue_for_user(user_id)
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM Debt
            WHERE userID = ?
            ORDER BY overdue DESC, nextPayment ASC
        """, (user_id,))

        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

@router.delete("/api/debts/{debt_id}")
async def delete_debt(debt_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM Debt WHERE id = ?", (debt_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Debt not found")

        conn.commit()
        return {"status": "success", "message": "Debt deleted"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


