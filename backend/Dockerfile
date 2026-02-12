FROM python:3.12-slim

WORKDIR /app

# 依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# RailwayはPORT環境変数でポートを指定
# gunicorn (uvicorn worker) で本番起動
CMD gunicorn -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:${PORT:-8000} --workers 1
