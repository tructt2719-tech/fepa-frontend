import uvicorn
import sqlite3
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router

# Import router và hàm khởi tạo gộp từ module Budget
# Lưu ý: init_tables trong Budget.py sẽ lo cả Budget và SavingsGoal
from Budget import router as budget_router, init_tables
from Expense import router as expense_router
from AI import router as AI_router

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/fepa.sqlite'))
from payment import router as payment_router
from debt import router as debt_router
from dashboard import router as dashboard_router
def init_db():
    print("--- 🚀 KHỞI TẠO HỆ THỐNG FEPA ---")

DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../database/fepa.sqlite")
)

from payment import router as payment_router
from debt import router as debt_router
from dashboard import router as dashboard_router

def init_db():
    print("--- 🚀 KHỞI TẠO HỆ THỐNG FEPA ---")

    # Đảm bảo thư mục database tồn tại
    db_dir = os.path.dirname(DB_PATH)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
        
    conn = sqlite3.connect(DB_PATH)
    try:
        # 1. Khởi tạo bảng User (Bắt buộc có trước để làm khóa ngoại)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        print("✅ Bảng User đã sẵn sàng.")

        # 2. Gọi hàm khởi tạo tất cả các bảng từ Budget.py (Budget & SavingsGoal)
        init_tables()

        # 3. Khởi tạo bảng Expense (Nếu file Expense.py có hàm này)
        # Nếu đã gộp vào init_tables() thì có thể bỏ qua dòng này
        from Expense import init_expense_table
        init_expense_table(conn)

        
    except Exception as e:
        print(f"❌ Lỗi khởi tạo database: {e}")

    except Exception as e:
        print(f"❌ Lỗi khởi tạo database: {e}")

    finally:
        conn.close()
        print(f"✅ Database đã sẵn sàng tại: {DB_PATH}")


# Khởi tạo FastAPI app
app = FastAPI()

# Khởi tạo FastAPI app
app = FastAPI()
app.include_router(dashboard_router)
# Cấu hình CORS để React không bị lỗi kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(AI_router)
app.include_router(budget_router)
app.include_router(expense_router)
app.include_router(auth_router)
app.include_router(payment_router)
app.include_router(debt_router)
app.include_router(dashboard_router)


if __name__ == "__main__":
    init_db() # Chạy khởi tạo database trước
    
    # Khởi động server
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    print("📡 Server đang khởi động...")
    uvicorn.run("run:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    init_db()  # Chạy khởi tạo database trước

    # Khởi động server
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    print("📡 Server đang khởi động...")

    uvicorn.run(
        "run:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
