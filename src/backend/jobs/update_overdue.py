import sqlite3
import os
from datetime import date

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "fepa.sqlite")


def update_overdue_debts():
    """
    Update overdue cho TẤT CẢ debts trong hệ thống
    Rule:
    overdue = 1 nếu:
      - nextPayment < today
      - paid < total
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        today = date.today().isoformat()

        cursor.execute("""
            UPDATE Debt
            SET overdue = 1
            WHERE nextPayment IS NOT NULL
              AND nextPayment < ?
              AND paid < total
        """, (today,))

        conn.commit()
        print(f"✅ Overdue updated (system-wide) at {today}")

    except Exception as e:
        print("❌ update_overdue_debts error:", e)
    finally:
        conn.close()


if __name__ == "__main__":
    update_overdue_debts()
