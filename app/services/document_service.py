import fitz  # PyMuPDF
import easyocr
import numpy as np
from PIL import Image
import io
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

class DocumentService:
    def __init__(self):
        # OCR 엔진은 그대로 유지
        self.reader = easyocr.Reader(['ko', 'en'])

    async def process_file(self, file_bytes: bytes, filename: str) -> str:
        # 1. PDF 파일인 경우
        if filename.lower().endswith('.pdf'):
            return await self._process_pdf(file_bytes)
        
        # 2. 이미지 파일인 경우 (기존 로직)
        else:
            return await self._process_image(file_bytes)

    async def _process_pdf(self, file_bytes: bytes) -> str:
        pdf_file = fitz.open(stream=file_bytes, filetype="pdf")
        full_text = ""

        for page in pdf_file:
            # 우선 텍스트 추출 시도 (디지털 PDF용)
            text = page.get_text()
            if text.strip():
                full_text += text + " "
            else:
                # 텍스트가 없으면 스캔된 PDF임 -> 페이지를 이미지로 변환 후 OCR
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                full_text += await self._process_image(img_bytes) + " "
        
        return full_text.strip()

    async def _process_image(self, img_bytes: bytes) -> str:
        image = Image.open(io.BytesIO(img_bytes))
        image_np = np.array(image)
        result = self.reader.readtext(image_np)
        return " ".join([res[1] for res in result])

document_service = DocumentService()