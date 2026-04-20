#!/bin/bash

# HTMLファイルを高品質PDFに変換するスクリプト
# 使い方: ./convert-to-pdf.sh brochure-security.html

# 必要なツール: Google Chrome または Chromium
# インストール方法（Mac）: brew install chromium

FILE="$1"
OUTPUT="${FILE%.html}.pdf"

# Chromeのパスを検索
CHROME_PATH=""
if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [ -f "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
    CHROME_PATH="/Applications/Chromium.app/Contents/MacOS/Chromium"
else
    echo "Error: Chrome or Chromium not found"
    exit 1
fi

# HTMLからPDFに変換
"$CHROME_PATH" \
    --headless \
    --disable-gpu \
    --print-to-pdf="$OUTPUT" \
    --print-to-pdf-no-header \
    --no-margins \
    "file://$(pwd)/$FILE"

echo "✅ PDF created: $OUTPUT"
