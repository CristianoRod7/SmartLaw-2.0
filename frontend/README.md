# SmartLaw 2.0 로컬 실행 가이드

## 1. 사전 준비

- Python 3.11+
- Node.js 20+
- Docker Desktop 또는 로컬 PostgreSQL

## 2. 환경 변수

루트와 프론트엔드 환경 파일을 예시 파일에서 복사합니다.

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

AI 분석/문서 작성 기능을 사용하려면 루트 `.env`의 `GEMINI_API_KEY`를 입력하세요. 키가 비어 있어도 백엔드 서버는 로컬에서 실행되지만 AI 호출 API는 503을 반환합니다.

## 3. DB 실행

```bash
docker compose up -d db
```

기본 DB 접속 문자열은 다음과 같습니다.

```text
postgresql+asyncpg://user:password@localhost:5432/nextlaw
```

## 4. 백엔드 실행

프로젝트 루트에서 실행합니다.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
npm run dev:api
```

백엔드 API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

## 5. 프론트엔드 실행

새 터미널에서 실행합니다.

```bash
npm install --prefix frontend
npm run dev:frontend
```

프론트엔드는 기본적으로 `http://localhost:8000` 백엔드 API를 호출합니다. 다른 주소를 쓰려면 `frontend/.env`의 `VITE_API_BASE_URL` 값을 바꾸세요.

## 6. Git 추적에서 로컬 생성물 제거

`.env`, `.venv`, `node_modules`, `__pycache__`는 커밋하면 안 됩니다. 이미 Git에 올라간 적이 있다면 아래처럼 인덱스에서만 제거하세요.

```bash
git rm --cached .env frontend/.env 2>/dev/null || true
git rm -r --cached .venv venv node_modules frontend/node_modules __pycache__ 2>/dev/null || true
find . -type d -name __pycache__ -prune -exec git rm -r --cached {} + 2>/dev/null || true
```

그 다음 `.gitignore`가 적용됐는지 확인합니다.

```bash
git status --short
```
