#!/bin/bash
# =====================================================
# 다이브저널 자동 기사 생성 + 평가 파이프라인
# claude -p로 RSS 수집 → 기사 작성 → 루브릭 평가 → 감점 시 수정 → 재평가 루프
# 게이트 통과 시 status="published", 최대 3 라운드 후에도 실패하면 status="draft"
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
echo "  다이브저널 자동 기사 생성 + 평가"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# 기존 기사에서 이미 사용된 이미지 URL을 모두 추출 (중복 이미지 방지)
USED_IMAGES=$(find content/articles -name "*.json" -exec grep -h '"imageUrl"' {} \; 2>/dev/null \
  | sed 's/^[[:space:]]*"imageUrl":[[:space:]]*"//' \
  | sed 's/",*$//' \
  | sort -u)

# 평가 루브릭 문서를 프롬프트에 주입 (사람과 AI가 같은 기준 공유)
RUBRIC=$(cat docs/evaluation-rubric.md)

TODAY_DIR="content/articles/$(date +%Y)/$(date +%m)/$(date +%d)"
mkdir -p "${TODAY_DIR}"

# claude -p로 생성 + 평가 루프 실행
claude -p "다이브저널 일일 기사 파이프라인을 실행해줘.

## 단계 1. 뉴스 수집

아래 RSS 피드에서 최신 프리다이빙/스쿠버 다이빙 뉴스를 수집한 뒤, 가장 중요한 3건을 선정해.
- https://www.deeperblue.com/feed/
- https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en
- https://news.google.com/rss/search?q=%ED%94%84%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%B9%99&hl=ko&gl=KR&ceid=KR:ko

## 단계 2. 각 기사에 대한 생성-평가-수정 루프

각 기사를 ${TODAY_DIR}/<slug>.json 경로에 저장한다.
JSON 형식은 기존 기사 (예: content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json) 와 동일하며,
status, category, tags, sourceUrls, en, ko, imageUrl, imageAlt 필드를 포함하고
**추가로 evaluation 필드도 반드시 포함**한다.

각 기사에 대해 아래 흐름을 수행한다.

  R1) 초안 작성 (status=\"draft\", evaluation 미포함 상태로 임시 저장)
  R2) 하드 게이트 6개 체크 → 하나라도 실패면 status=\"draft\" 유지, evaluation에 gate=\"fail\" 기록 후 다음 기사로 (수정 시도 안 함)
  R3) 100점 만점 채점 → 게이트 판정
       - 통과: status=\"published\", evaluation 기록, 완료
       - 실패: 감점 항목 분석 → 기사 수정 → 재채점 (R3 반복, 최대 3 라운드)
  R4) 최대 3 라운드 후에도 실패면 status=\"draft\" 유지, 마지막 evaluation 기록

기사 본문 요건:
  - en/ko 둘 다 작성. 한국어는 직역이 아닌 자연스러운 한국어.
  - HTML 태그 (<p>, <h3>, <em>, <strong>) 적절히 사용.
  - 본문 길이: EN 300~500 단어, KO 300+ 어절.
  - 원본 뉴스를 그대로 복사하지 말고 자기 표현으로 재구성.
  - 같은 slug의 파일이 이미 있으면 그 기사는 건너뛰어.

## 단계 3. 평가 루브릭 적용

아래 루브릭에 따라 매 라운드마다 점수를 매기고, evaluation.breakdown 에 섹션별 합계,
evaluation.notes 에 라운드 진행 내역(어떤 항목을 수정했는지)을 기록한다.

────────── 루브릭 시작 ──────────
${RUBRIC}
────────── 루브릭 끝 ──────────

## 단계 4. 이미지 중복 방지

imageUrl로 Unsplash 이미지를 선택할 때 https://images.unsplash.com/photo-xxx?w=800&h=450&fit=crop&q=80 형식 사용.
**아래 URL들은 다른 기사에서 이미 사용 중이므로 절대 재사용하지 마.**
가능하면 기사 주제(카테고리, 태그)와 관련된 이미지를 골라.

────────── 사용 중 이미지 URL 목록 ──────────
${USED_IMAGES}
────────── 목록 끝 ──────────

## 단계 5. 최종 보고

작업이 끝나면 각 기사별로 다음을 콘솔에 출력해:
  - slug
  - 최종 status (published/draft)
  - 최종 score
  - 라운드 수 (예: 'pass at round 2')
  - 마지막까지 감점된 항목 (있을 경우)
" \
  --allowedTools "Bash,Read,Write,Edit" \
  --max-turns 80

echo ""
echo "기사 생성 + 평가 완료!"

# Git 변경사항 확인 및 커밋
if [ -n "$(git status --porcelain content/)" ]; then
  echo "새 기사가 생성되었습니다. 커밋합니다..."
  git add content/

  # 커밋 메시지에 published/draft 통계 포함
  PUBLISHED_COUNT=$(grep -l '"status": "published"' "${TODAY_DIR}"/*.json 2>/dev/null | wc -l | tr -d ' ')
  DRAFT_COUNT=$(grep -l '"status": "draft"' "${TODAY_DIR}"/*.json 2>/dev/null | wc -l | tr -d ' ')

  git commit -m "feat: daily articles $(date +%Y-%m-%d) (published=${PUBLISHED_COUNT}, draft=${DRAFT_COUNT})"
  git push
  echo "GitHub 푸시 완료! Vercel이 자동 배포합니다."
  echo "오늘의 결과: published ${PUBLISHED_COUNT}건 · draft ${DRAFT_COUNT}건 (게이트 미통과)"
else
  echo "새로 생성된 기사가 없습니다."
fi

echo ""
echo "========================================"
echo "  완료: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
