#!/bin/bash
# =====================================================
# 다이브저널 자동 기사 생성 스크립트
# claude -p를 활용하여 매일 프리다이빙 뉴스 기사를 생성합니다.
#
# 사용법:
#   bash scripts/generate-news.sh
#
# Windows 작업 스케줄러 등록:
#   schtasks /create /tn "DiveJournal" /tr "bash C:\Users\joyan\PSA\scripts\generate-news.sh" /sc daily /st 09:00
# =====================================================

set -e

# 프로젝트 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "========================================"
echo "  다이브저널 자동 기사 생성"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# 기존 기사에서 이미 사용된 이미지 URL을 모두 추출 (중복 이미지 방지)
USED_IMAGES=$(find content/articles -name "*.json" -exec grep -h '"imageUrl"' {} \; 2>/dev/null \
  | sed 's/^[[:space:]]*"imageUrl":[[:space:]]*"//' \
  | sed 's/",*$//' \
  | sort -u)

# claude -p로 기사 생성
claude -p "다음 작업을 수행해줘:

1. 아래 RSS 피드에서 최신 프리다이빙/다이빙 뉴스를 수집해줘:
   - https://www.deeperblue.com/feed/
   - https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en
   - https://news.google.com/rss/search?q=%ED%94%84%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%B9%99&hl=ko&gl=KR&ceid=KR:ko

2. 수집한 뉴스 중 가장 중요한 3개를 선별해줘.

3. 각 뉴스에 대해 content/articles/$(date +%Y)/$(date +%m)/$(date +%d)/ 폴더에 JSON 파일을 생성해줘.
   JSON 형식은 기존 기사 파일(예: content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json)과 동일한 형식으로.
   - slug, publishedAt, updatedAt, status(published), category, tags
   - en: title, summary, body(HTML), metaDescription
   - ko: title, summary, body(HTML), metaDescription
   - imageUrl: Unsplash에서 관련 이미지 URL (https://images.unsplash.com/photo-xxx?w=800&h=450&fit=crop&q=80 형태)
   - sourceUrls: 원본 뉴스 URL

4. 기사 본문은 각 언어로 300-500단어, HTML <p> 태그로 작성해줘.
   원본 뉴스를 그대로 복사하지 말고, 원본 정보를 바탕으로 새로운 기사를 작성해줘.

5. 이미 같은 slug의 파일이 있으면 건너뛰어줘.

6. [중요] 아래 URL들은 이미 다른 기사에서 사용 중이므로 절대 그대로 재사용하지 마.
   새 기사마다 서로 다른 Unsplash 이미지를 골라서 imageUrl 중복이 생기지 않도록 해.
   가능하면 기사 주제(카테고리, 태그)와 관련된 이미지를 선택할 것.
이미 사용 중인 이미지 URL 목록:
${USED_IMAGES}" \
  --allowedTools "Bash,Read,Write,Edit" \
  --max-turns 20

echo ""
echo "기사 생성 완료!"

# Git 변경사항 확인 및 커밋
if [ -n "$(git status --porcelain content/)" ]; then
  echo "새 기사가 생성되었습니다. 커밋합니다..."
  git add content/
  git commit -m "feat: add daily freediving news articles $(date +%Y-%m-%d)"
  git push
  echo "GitHub 푸시 완료! Vercel이 자동 배포합니다."
else
  echo "새로 생성된 기사가 없습니다."
fi

echo ""
echo "========================================"
echo "  완료: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
