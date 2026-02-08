from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import uuid
import os
import re
import io
from datetime import date
from pyzbar.pyzbar import decode
from PIL import Image, ImageOps, ImageEnhance
import openfoodfacts
import pytesseract
import debt;
# Import các router cục bộ
import Expense
import auth
import Budget
import AI
import payment
import dashboard
app = FastAPI()

# --- CẤU HÌNH MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ĐĂNG KÝ ROUTER ---
app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(Expense.router)
app.include_router(Budget.router)
app.include_router(AI.router)
app.include_router(payment.router)
app.include_router(debt.router)

# --- KHỞI TẠO AI MODEL & API ---
# Tải model whisper một lần khi khởi động server
model = whisper.load_model("base")
off_api = openfoodfacts.API(user_agent="WindycraftApp/1.0")

# --- ENDPOINT: QUÉT MÃ VẠCH ---
@app.post("/api/scan-barcode")
async def scan_barcode(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="File trống")

            
        original_image = Image.open(io.BytesIO(contents))
        
        # 1. Thử quét ảnh gốc
        barcodes = decode(original_image)
        


        original_image = Image.open(io.BytesIO(contents))

        # 1. Thử quét ảnh gốc
        barcodes = decode(original_image)


        # 2. Cải thiện nhận diện nếu quét gốc thất bại
        if not barcodes:
            gray_img = ImageOps.grayscale(original_image)
            enhancer = ImageEnhance.Contrast(gray_img)
            enhanced_img = enhancer.enhance(2.0)
            barcodes = decode(enhanced_img)

            
        if not barcodes:
            raise HTTPException(status_code=400, detail="Không thể đọc được mã vạch. Hãy thử chụp rõ nét hơn!")

        barcode_data = barcodes[0].data.decode("utf-8")

        if not barcodes:
            raise HTTPException(
                status_code=400,
                detail="Không thể đọc được mã vạch. Hãy thử chụp rõ nét hơn!"
            )

        barcode_data = barcodes[0].data.decode("utf-8")
        # Mặc định nếu không tìm thấy thông tin sản phẩm
        name = f"Sản phẩm {barcode_data}"
        category = "Shopping"
        icon = "🛒"

        try:
            product_info = off_api.product.get(barcode_data)
            if product_info and product_info.get("status") == 1:
                p = product_info.get("product", {})
                # Ưu tiên lấy tên tiếng Việt
                name = p.get("product_name_vi") or p.get("product_name") or name

                category = "Food & Dining"
                icon = "🍕"
        except Exception as api_err:
            print(f"OpenFoodFacts API Error: {api_err}")

        return {
            "name": name,
            "amount": 0.0,
            "category": category,
            "date": date.today().isoformat(),
            "note": f"Mã: {barcode_data}",
            "icon": icon
        }

    except HTTPException as he:
        raise he

    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# --- ENDPOINT: CHI TIÊU GIỌNG NÓI ---
@app.post("/api/voice-expense")
async def voice_expense(file: UploadFile = File(...)):
    temp_path = f"temp_{uuid.uuid4()}.wav"

    try:
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        result = model.transcribe(temp_path)
        text = result["text"].strip()

        # Tìm con số đầu tiên trong văn bản để làm số tiền
        amount = 0.0
        nums = re.findall(r"\d+(\.\d+)?", text)
        if nums:
            amount = float(nums[0])


        return {
            "name": "Chi tiêu giọng nói",
            "category": "Others",
            "amount": amount,
            "date": date.today().isoformat(),
            "note": text,

            "icon": "🎤"
        }


    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# --- KHỞI CHẠY ---
if __name__ == "__main__":
    import uvicorn
    # Khuyên dùng cổng 8000 để khớp với Frontend bạn đang gọi

    uvicorn.run(app, host="0.0.0.0", port=8000)

    uvicorn.run(app, host="0.0.0.0", port=8000)


# --- KHỞI CHẠY ---
if __name__ == "__main__":
    import uvicorn

    # Khuyên dùng cổng 8000 để khớp với Frontend bạn đang gọi
    uvicorn.run(app, host="0.0.0.0", port=8000)

