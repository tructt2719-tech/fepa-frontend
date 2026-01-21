from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import uuid
from pydantic import BaseModel
from typing import List, Optional
import base64
import re
import pytesseract
from PIL import Image
import io
from datetime import date

app = FastAPI()

class Expense(BaseModel):
    id: int
    name: str
    category: str
    amount: float
    date: str
    icon: Optional[str] = None
    voiceText: Optional[str] = None

# CORS cho frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
expenses_db: List[Expense] = []
model = whisper.load_model("base")  # tiny / base / small

def resize_base64_image(b64, max_w=1260, max_h=540):
    header, data = b64.split(",", 1)
    img = Image.open(io.BytesIO(base64.b64decode(data)))
    img.thumbnail((max_w, max_h))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    new_b64 = base64.b64encode(buf.getvalue()).decode()

    return f"{header},{new_b64}"

def parse_expense(text: str):
    text_lower = text.lower()

    # parse amount (basic)
    import re
    match = re.search(r"(\d+(\.\d+)?)", text_lower)
    amount = -float(match.group(1)) if match else -0.0

    category = "Others"
    if "food" in text_lower or "eat" in text_lower:
        category = "Food & Dining"
    if "transport" in text_lower or "taxi" in text_lower:
        category = "Transportation"

    return {
        "id": int(date.today().strftime("%s")),
        "name": "Voice Expense",
        "category": category,
        "amount": amount,
        "date": date.today().isoformat(),
        "voiceText": text,
        "icon": "🎤",
    }

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    content = await file.read()

    # 🔹 Resize ảnh về tối đa 1260x540
    image = Image.open(io.BytesIO(content))
    image.thumbnail((1260, 540))

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    resized_bytes = buffer.getvalue()

    # 🔹 OCR
    text = pytesseract.image_to_string(image)

    # 🔹 Parse amount (demo)
    amount = 0.0
    match = re.search(r"(\d+[.,]?\d*)", text)
    if match:
        amount = -float(match.group(1).replace(",", "."))

    # 🔹 Encode ảnh để frontend chỉ hiện khi cần
    base64_image = base64.b64encode(resized_bytes).decode("utf-8")

    expense = {
        "id": int(date.today().strftime("%s")),
        "name": "Scanned Receipt",
        "category": "Others",
        "amount": amount,
        "date": date.today().isoformat(),
        "receiptImage": f"data:image/jpeg;base64,{base64_image}",
        "icon": "🧾",
    }

    return expense

@app.post("/voice-expense")
async def voice_expense(file: UploadFile = File(...)):
    # 1. Lưu audio tạm
    temp_name = f"/tmp/{uuid.uuid4()}.webm"
    with open(temp_name, "wb") as f:
        f.write(await file.read())

    # 2. Speech to text
    result = model.transcribe(temp_name, language="en")
    text = result["text"].strip()

    # 3. Parse text → expense (demo)
    # ví dụ user nói: "Lunch cost 12 dollars"
    amount = -0.0
    if "dollar" in text:
        import re
        nums = re.findall(r"\d+(\.\d+)?", text)
        if nums:
            amount = -float(nums[0])

    expense = {
        "id": int(uuid.uuid4().int % 1e9),
        "name": "Voice Expense",
        "category": "Others",
        "amount": amount,
        "date": date.today().isoformat(),
        "voiceText": text,
        "icon": "🎤"
    }
    return expense
@app.post("/api/expenses")
def create_expense(expense: Expense):
    expenses_db.append(expense)
    return expense

@app.get("/api/expenses")
def get_expenses() -> List[Expense]:
    return expenses_db