@echo off
:: =====================================================
:: 다이브저널 자동 기사 생성 (Windows)
:: =====================================================

set PATH=C:\Users\joyan\AppData\Roaming\npm;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;%PATH%

cd /d C:\Users\joyan\PSA

echo ========================================
echo   다이브저널 자동 기사 생성
echo   %date% %time%
echo ========================================

:: ===== PART 1: 뉴스 기사 (3건) =====
echo [1/4] 뉴스 기사 생성 중...
claude -p "다음 작업을 수행해줘: 1) RSS 피드에서 최신 프리다이빙/다이빙 뉴스를 수집해: https://www.deeperblue.com/feed/ 와 https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en 와 https://news.google.com/rss/search?q=프리다이빙&hl=ko&gl=KR&ceid=KR:ko 2) 기존 content/articles/ 폴더의 기사와 중복되지 않는 중요한 뉴스 3개를 선별해. 3) 각 뉴스를 기반으로 content/articles/ 아래 기사 발생 날짜(RSS의 pubDate) 폴더에 JSON 파일을 생성해. publishedAt은 원본 기사의 발행일을 사용해. 4) 기존 기사 형식(content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json) 참고. category는 반드시 competition, records, training, safety, equipment, science, environment, people 중 하나여야 해. 5) 이미지: 원본 기사에 이미지가 있으면 그 URL을 imageUrl에 넣어. 없으면 Pollinations AI로 생성해(https://image.pollinations.ai/prompt/영문프롬프트URL인코딩?width=800&height=450&nologo=true). 6) 저작권 주의: 원본 기사를 그대로 번역하거나 복사하지 마. 핵심 사실만 추출하고 완전히 새로운 문장으로 기사를 작성해. 인용은 짧은 직접 인용구만 사용해. 7) 팩트체크: 날짜, 수치, 인명, 기록 등 사실관계를 원본과 대조해서 정확한지 확인해. 틀린 내용이 있으면 수정하거나 해당 내용을 제외해." --allowedTools "Bash,Read,Write,Edit" --max-turns 20

:: ===== PART 2: 다이빙 포인트 (1건) =====
echo [2/4] 오늘의 다이빙 포인트 기사 생성 중...
claude -p "전 세계의 멋진 다이빙/프리다이빙 포인트 1곳을 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 diving-spot 카테고리 기사와 중복되지 않는 장소로. JSON 형식은 content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json 참고. 반드시 포함할 내용: 1) 포인트 소개 및 특별한 점(수중 지형, 해양 생물, 시야, 수온 등) 2) 교통정보: 한국에서 가는 방법(항공편, 공항, 이동수단) 3) 숙박: 주변 추천 숙소 유형과 가격대 4) 식사: 현지 맛집이나 추천 음식 5) 최적 방문 시기와 팁. category는 diving-spot으로. publishedAt은 오늘 날짜로. imageUrl은 Pollinations AI로 해당 장소를 묘사한 이미지를 생성해(https://image.pollinations.ai/prompt/영문프롬프트URL인코딩?width=800&height=450&nologo=true). content/articles/의 오늘 날짜 폴더에 저장해." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== PART 3: 다이버 레시피 (1건) =====
echo [3/4] 오늘의 다이버 레시피 기사 생성 중...
claude -p "프리다이빙에 좋은 음식 레시피 1개를 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 recipe 카테고리 기사와 중복되지 않는 레시피로. JSON 형식은 content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json 참고. 포함할 내용: 1) 이 음식이 프리다이빙에 좋은 이유(영양학적 근거: 철분, 산소운반능력, 폐활량, 혈류 등) 2) 재료 목록 3) 조리법 단계별 설명 4) 영양 정보 5) 다이빙 전/후 언제 먹으면 좋은지. category는 recipe로. publishedAt은 오늘 날짜로. imageUrl은 Pollinations AI로 해당 음식 사진을 생성해(https://image.pollinations.ai/prompt/영문프롬프트URL인코딩?width=800&height=450&nologo=true). content/articles/의 오늘 날짜 폴더에 저장해." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== PART 4: 트레이닝 팁 (1건) =====
echo [4/4] 오늘의 트레이닝 기사 생성 중...
claude -p "프리다이빙에 도움이 되는 트레이닝/운동법 1개를 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 workout 카테고리 기사와 중복되지 않는 내용으로. JSON 형식은 content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json 참고. 포함할 내용: 1) 이 트레이닝이 프리다이빙에 도움되는 이유 2) 준비물 3) 단계별 운동 방법(세트수, 시간 포함) 4) 주의사항 5) 초보자/중급자/고급자 난이도별 변형. category는 workout으로. publishedAt은 오늘 날짜로. imageUrl은 Pollinations AI로 해당 운동 장면을 생성해(https://image.pollinations.ai/prompt/영문프롬프트URL인코딩?width=800&height=450&nologo=true). content/articles/의 오늘 날짜 폴더에 저장해." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== PART 5: 유튜브 추천 영상 (1건) =====
echo [5/5] 오늘의 추천 유튜브 영상 기사 생성 중...
claude -p "흥미로운 프리다이�� 관련 유튜브 영상 1개를 찾아서 소개하는 기사를 작성해줘. 조건: 1) 더블케이(Double K), 패디(PADI) 채널의 영상은 절대 제외. 2) 기존 content/articles/ 폴더의 video 카테고리 기사에서 이미 소개한 영상과 중복되지 않는 것으로. 3) 실제 존재하는 유튜브 영상이어야 함. 유튜브 영상 ID를 정확히 확인해. 4) 기사 본문에 유튜브 임베드 삽입: <div style='position:relative;padding-bottom:56.25%%;height:0;overflow:hidden;max-width:100%%;margin:1.5rem 0'><iframe src='https://www.youtube.com/embed/영상ID' style='position:absolute;top:0;left:0;width:100%%;height:100%%;border:0' allowfullscreen></iframe></div> 5) imageUrl은 https://img.youtube.com/vi/영상ID/maxresdefault.jpg 로. 6) 영상 내용을 간추려 소개 글 작성 (300-500단어). 왜 프리다이버가 봐야 하는지 설명. 7) category는 video로. 8) JSON 형식은 content/articles/2026/04/15/video-guillaume-nery-one-breath-around-the-world.json 참고. content/articles/의 오늘 날짜 폴더에 저장해." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== Git 커밋 및 푸시 =====
echo.
echo 기사 생성 완료! Git 커밋 중...

git add content/
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "feat: daily articles %date:~0,10% - news, diving spot, recipe, workout, video"
    git push
    echo GitHub 푸시 완료! Vercel 자동 배포됩니다.
) else (
    echo 새 기사가 없습니다.
)

echo.
echo ========================================
echo   완료: %date% %time%
echo ========================================
