import fitz  # PyMuPDF
import easyocr
import numpy as np
from PIL import Image
import io
import ssl
from pathlib import Path
from docx import Document

ssl._create_default_https_context = ssl._create_unverified_context


class DocumentService:
    def __init__(self):
        self.reader = easyocr.Reader(["ko", "en"])

    async def process_file(self, file_bytes: bytes, filename: str) -> str:
        ext = Path(filename).suffix.lower()

        # 1. PDF
        if ext == ".pdf":
            return await self._process_pdf(file_bytes)

        # 2. TXT
        if ext == ".txt":
            return await self._process_txt(file_bytes)

        # 3. DOCX
        if ext == ".docx":
            return await self._process_docx(file_bytes)

        # 4. 이미지
        if ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp"]:
            return await self._process_image(file_bytes)

        raise ValueError(f"지원하지 않는 파일 형식입니다: {ext}")

    async def _process_pdf(self, file_bytes: bytes) -> str:
        pdf_file = fitz.open(stream=file_bytes, filetype="pdf")
        full_text = ""

        for page in pdf_file:
            text = page.get_text()
            if text.strip():
                full_text += text + " "
            else:
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                full_text += await self._process_image(img_bytes) + " "

        return full_text.strip()

    async def _process_txt(self, file_bytes: bytes) -> str:
        return file_bytes.decode("utf-8", errors="ignore").strip()

    async def _process_docx(self, file_bytes: bytes) -> str:
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        return " ".join(paragraphs).strip()

    async def _process_image(self, img_bytes: bytes) -> str:
        image = Image.open(io.BytesIO(img_bytes))
        image_np = np.array(image)
        result = self.reader.readtext(image_np)
        return " ".join([res[1] for res in result])


document_service = DocumentService()