# ai_router.py - Router riêng cho Gemini AI chat (tách khỏi auth.py)
# Không dùng .env, hard-code API key trực tiếp

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
import traceback

router = APIRouter(prefix="/api", tags=["AI Chat"])

# ----- GEMINI CLIENT -----
GEMINI_API_KEY = "AIzaSyAjt_S2DQPp-UC-5aBjYBLadQESODBtC9A"

client = genai.Client(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat-gemini")
async def chat_gemini(data: ChatRequest):
    """
    Endpoint chat với Gemini AI.
    - Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
    - Model: gemini-2.5-flash (stable, nhanh, giá rẻ năm 2026)
    """
    try:
        print(f"[GEMINI] Nhận tin nhắn từ user: {data.message[:100]}...")

        response = client.models.generate_content(
            model="gemini-2.5-flash",  # Model đã test OK ở test_gemini.py
            # Nếu vẫn 404, thử thay bằng: "gemini-flash-latest" hoặc "gemini-2.5-flash-preview-06-25"
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "Bạn là trợ lý FEPA Assistant – một AI thân thiện, hữu ích của ứng dụng FEPA. "
                                "Hãy trả lời ngắn gọn, vui vẻ, bằng tiếng Việt. Không dài dòng, tập trung vào nội dung chính."
                            )
                        },
                        {
                            "text": data.message
                        }
                    ]
                }
            ]
        )

        # Lấy reply an toàn (hỗ trợ cả format mới/cũ của SDK)
        reply = ""
        if hasattr(response, "text") and response.text:
            reply = response.text.strip()
        elif response.candidates and response.candidates[0].content.parts:
            reply = response.candidates[0].content.parts[0].text.strip()

        if not reply:
            reply = "Ồ, mình đang nghĩ... Thử hỏi lại nhé! 😅"

        print(f"[GEMINI] Trả lời: {reply[:100]}...")
        return {"reply": reply}

    except Exception as e:
        error_detail = traceback.format_exc()
        print("[GEMINI ERROR]\n", error_detail)

        error_msg = str(e)
        if "404" in error_msg or "not found" in error_msg.lower():
            error_msg += " (Model không tồn tại hoặc chưa hỗ trợ với key này. Kiểm tra https://ai.google.dev/gemini-api/docs/models để xem list model mới nhất)"

        raise HTTPException(status_code=500, detail=f"Lỗi kết nối AI: {error_msg}")
