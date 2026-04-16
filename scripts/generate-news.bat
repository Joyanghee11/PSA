@echo off
:: =====================================================
:: 다이브저널 매일 아침 6시 자동 기사 생성 (10건)
:: - 뉴스 4건
:: - 다이빙 포인트 2건
:: - 다이버 레시피 1건
:: - 트레이닝 1건
:: - 유튜브 영상 2건
:: =====================================================

set PATH=C:\Users\joyan\AppData\Roaming\npm;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;%PATH%

cd /d C:\Users\joyan\PSA

echo ========================================
echo   다이브저널 자동 기사 생성 (10건)
echo   %date% %time%
echo ========================================

:: ===== PART 1: 뉴스 기사 (4건) =====
echo [1/5] 뉴스 기사 4건 생성 중...
claude -p "다음 작업을 수행해줘: 1) RSS 피드에서 최신 프리다이빙/다이빙 뉴스를 수집해: https://www.deeperblue.com/feed/ 와 https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en 와 https://news.google.com/rss/search?q=freediving+OR+apnea+diving&hl=en&gl=US&ceid=US:en 와 https://news.google.com/rss/search?q=프리다이빙&hl=ko&gl=KR&ceid=KR:ko 2) 기존 content/articles/ 폴더의 기사와 중복되지 않는 뉴스 4개를 선별해. 3) 각 뉴스를 content/articles/ 아래 기사 발생 날짜(RSS의 pubDate) 폴더에 JSON 파일로 생성해. publishedAt은 원본 기사의 발행일 사용. 4) 기존 기사 형식(content/articles/2026/04/15/garmin-descent-mk3i-new-color.json) 참고. category는 반드시 competition, records, training, safety, equipment, science, environment, people 중 하나. 5) 이미지: 원본 기사에 이미지가 있으면 그 URL 사용. 없으면 Unsplash 실사 사진 사용(https://images.unsplash.com/photo-ID?w=800&h=450&fit=crop&q=80). AI 생성 이미지 절대 사용 금지. 6) 저작권: 원본을 복사하지 말고 핵심 사실만 추출하여 새 문장으로 작성. 7) 팩트체크: 날짜, 수치, 인명 정확히 확인." --allowedTools "Bash,Read,Write,Edit" --max-turns 25

:: ===== PART 2: 다이빙 포인트 (2건) =====
echo [2/5] 다이빙 포인트 2건 생성 중...
claude -p "전 세계의 멋진 다이빙/프리다이빙 포인트 2곳을 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 diving-spot 카테고리 기사와 중복되지 않는 장소로. JSON 형식은 content/articles/2026/04/15/garmin-descent-mk3i-new-color.json 참고. 각 기사에 포함: 1) 포인트 소개 및 특별한 점(수중 지형, 해양 생물, 시야, 수온) 2) 교통정보(한국에서 가는 방법) 3) 숙박 추천 4) 식사 추천 5) 최적 방문 시기. category: diving-spot. publishedAt: 오늘 날짜. 이미지 중요: 해당 다이빙 포인트의 실제 사진을 찾아줘. 해당 국가의 관광청 공식 사이트나 위키미디어 커먼즈에서 해당 장소의 실제 사진 URL을 찾아서 사용해. 예: 몰디브는 visitmaldives.com, 팔라우는 pristineparadisepalau.com, 인도네시아는 wonderful.id 등. 찾을 수 없으면 Unsplash에서 해당 장소명으로 검색한 실사 사진 사용(https://images.unsplash.com/photo-ID?w=800&h=450&fit=crop&q=80). AI 생성 이미지 절대 금지. content/articles/의 오늘 날짜 폴더에 저장해." --allowedTools "Bash,Read,Write,Edit" --max-turns 20

:: ===== PART 3: 다이버 레시피 (1건) =====
echo [3/5] 다이버 레시피 1건 생성 중...
claude -p "프리다이빙에 좋은 음식 레시피 1개를 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 recipe 카테고리와 중복 안되게. JSON 형식 참고. 포함: 영양학적 근거, 재료, 조리법, 먹는 타이밍. category: recipe. publishedAt: 오늘. imageUrl: Unsplash 실사 사진만(https://images.unsplash.com/photo-ID?w=800&h=450&fit=crop&q=80). AI 이미지 금지. content/articles/의 오늘 날짜 폴더에 저장." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== PART 4: 트레이닝 (1건) =====
echo [4/5] 트레이닝 1건 생성 중...
claude -p "프리다이빙 도움 트레이닝 1개를 소개하는 기사를 작성해줘. 기존 content/articles/ 폴더의 workout 카테고리와 중복 안되게. JSON 형식 참고. 포함: 단계별 방법, 주의사항, 난이도별 변형. category: workout. publishedAt: 오늘. imageUrl: Unsplash 실사 사진만(https://images.unsplash.com/photo-ID?w=800&h=450&fit=crop&q=80). AI 이미지 금지. content/articles/의 오늘 날짜 폴더에 저장." --allowedTools "Bash,Read,Write,Edit" --max-turns 15

:: ===== PART 5: 유튜브 추천 영상 (2건) =====
echo [5/5] 유튜브 영상 2건 생성 중...
claude -p "프리다이빙 관련 유튜브 영상 2개를 찾아서 각각 소개하는 기사를 작성해줘. 조건: 1) 더블케이(Double K), 패디(PADI) 채널 절대 제외. 2) 기존 content/articles/ 폴더의 video 카테고리와 중복 안되게. 3) 반드시 각 영상마다 curl로 https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=영상ID&format=json 확인하여 HTTP 200인 것만 사용. 200 아니면 다른 영상 찾아. 4) 각 기사 본문에 유튜브 임베드: <div style='position:relative;padding-bottom:56.25%%;height:0;overflow:hidden;max-width:100%%;margin:1.5rem 0'><iframe src='https://www.youtube.com/embed/영상ID' style='position:absolute;top:0;left:0;width:100%%;height:100%%;border:0' allowfullscreen></iframe></div> 5) imageUrl: https://img.youtube.com/vi/영상ID/maxresdefault.jpg 6) category: video. content/articles/의 오늘 날짜 폴더에 저장." --allowedTools "Bash,Read,Write,Edit" --max-turns 20

:: ===== PART 6: 유튜브 검증 =====
echo [검증] 유튜브 영상 재생 가능 여부 확인 중...
node -e "const fs=require('fs'),path=require('path');function w(d){if(!fs.existsSync(d))return[];const r=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())r.push(...w(f));else if(e.name.endsWith('.json'))r.push(f);}return r;}(async()=>{for(const f of w('content/articles')){const a=JSON.parse(fs.readFileSync(f,'utf8'));if(a.category!=='video')continue;const m=a.en.body.match(/embed\/([a-zA-Z0-9_-]+)/);if(!m)continue;const id=m[1];const r=await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+id+'&format=json');if(r.status!==200){console.log('REMOVING invalid video:',a.slug,'id:',id);fs.unlinkSync(f);}else{console.log('OK:',a.slug,'id:',id);}}})();"

:: ===== Git 커밋 및 푸시 =====
echo.
echo 기사 생성 완료! Git 커밋 중...

git add content/
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "feat: daily 10 articles %date:~0,10% - 4 news, 2 spots, 1 recipe, 1 workout, 2 videos"
    git push
    echo GitHub 푸시 완료! Vercel 자동 배포됩니다.
) else (
    echo 새 기사가 없습니다.
)

echo.
echo ========================================
echo   완료: %date% %time%
echo ========================================
