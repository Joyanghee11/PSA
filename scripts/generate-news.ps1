# =====================================================
# 다이브저널 매일 자동 기사 생성 (4건)
# - 뉴스 2건 (프리다이빙/스쿠버)
# - 다이빙 포인트 OR 레시피 OR 트레이닝 (1건, 로테이션)
# - 유튜브 영상 1건
# =====================================================

$ErrorActionPreference = "Continue"
$LOGFILE = "C:\Users\joyan\PSA\scripts\generate-news.log"

"========================================" | Out-File $LOGFILE
"  다이브저널 자동 기사 생성 (4건)" | Out-File $LOGFILE -Append
"  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File $LOGFILE -Append
"========================================" | Out-File $LOGFILE -Append

Set-Location "C:\Users\joyan\PSA"

$env:PATH = "C:\Users\joyan\AppData\Roaming\npm;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;$env:PATH"
$CLAUDE = "C:\Users\joyan\AppData\Roaming\npm\claude.cmd"
$TODAY = Get-Date -Format "yyyy/MM/dd"
$TODAY_DASH = Get-Date -Format "yyyy-MM-dd"
$DAY_OF_MONTH = (Get-Date).Day

# 날짜에 따라 콘텐츠 로테이션 (1일=다이빙포인트, 2일=레시피, 3일=트레이닝, 반복)
$ROTATE = $DAY_OF_MONTH % 3
if ($ROTATE -eq 1) { $EXTRA_CAT = "diving-spot"; $EXTRA_DESC = "다이빙 포인트 1곳 소개 (교통/숙박/식사 포함). category: diving-spot" }
elseif ($ROTATE -eq 2) { $EXTRA_CAT = "recipe"; $EXTRA_DESC = "프리다이빙에 좋은 음식 레시피 1개 (영양학적 근거, 재료, 조리법). category: recipe" }
else { $EXTRA_CAT = "workout"; $EXTRA_DESC = "프리다이빙 도움 트레이닝 1개 (단계별, 난이도별). category: workout" }

"[CHECK] Claude version:" | Out-File $LOGFILE -Append
& $CLAUDE --version 2>&1 | Out-File $LOGFILE -Append

# ===== 뉴스 2건 + 로테이션 콘텐츠 1건 (총 3건) =====
"[1/2] 뉴스 2건 + $EXTRA_CAT 1건 생성 중..." | Out-File $LOGFILE -Append

& $CLAUDE -p "3개 기사를 content/articles/$TODAY/ 폴더에 JSON으로 생성해줘. 공통: JSON 형식은 content/articles/2026/04/15/garmin-descent-mk3i-new-color.json 참고. publishedAt: $TODAY_DASH. 이미지: Unsplash 실사만(AI 금지). 기존 content/articles/와 중복 안되게. A. 뉴스 2개: RSS(https://www.deeperblue.com/feed/ 와 https://news.google.com/rss/search?q=freediving+OR+scuba+diving&hl=en) 기반. 팩트체크 필수. category: competition/equipment/scuba-news/environment/people/science 중. B. $EXTRA_DESC. 이미지: 해당 장소 실제 사진 우선, 없으면 Unsplash." --allowedTools "Bash,Read,Write,Edit" --max-turns 25 2>&1 | Out-File $LOGFILE -Append

# ===== 유튜브 영상 1건 =====
"[2/2] 유튜브 영상 1건 생성 중..." | Out-File $LOGFILE -Append

& $CLAUDE -p "프리다이빙/스쿠버 관련 유튜브 영상 1개를 찾아 기사로 작성해줘. content/articles/$TODAY/ 폴더에 JSON 저장. 더블케이/PADI 제외. 기존 content/articles/의 video와 중복 안되게. 반드시 curl로 oembed 검증(HTTP 200). 본문에 유튜브 임베드. imageUrl: 유튜브 썸네일. category: video." --allowedTools "Bash,Read,Write,Edit" --max-turns 15 2>&1 | Out-File $LOGFILE -Append

# ===== 유튜브 검증 =====
"[검증] 유튜브 확인..." | Out-File $LOGFILE -Append
& node -e "const fs=require('fs'),path=require('path');function w(d){if(!fs.existsSync(d))return[];const r=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())r.push(...w(f));else if(e.name.endsWith('.json'))r.push(f);}return r;}(async()=>{for(const f of w('content/articles')){const a=JSON.parse(fs.readFileSync(f,'utf8'));if(a.category!=='video')continue;const m=a.en.body.match(/embed\/([a-zA-Z0-9_-]+)/);if(!m)continue;const id=m[1];const r=await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+id+'&format=json');if(r.status!==200){console.log('REMOVING:',a.slug);fs.unlinkSync(f);}else{console.log('OK:',a.slug);}}})();" 2>&1 | Out-File $LOGFILE -Append

# ===== Git =====
"[GIT] 커밋 중..." | Out-File $LOGFILE -Append
& git add content/
$null = & git diff --cached --quiet 2>&1
if ($LASTEXITCODE -ne 0) {
    & git commit -m "feat: daily 4 articles $TODAY_DASH"
    & git push
    "GitHub 푸시 완료!" | Out-File $LOGFILE -Append
} else {
    "새 기사가 없습니다." | Out-File $LOGFILE -Append
}

"완료: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File $LOGFILE -Append
