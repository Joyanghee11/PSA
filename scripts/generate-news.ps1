# =====================================================
# 다이브저널 매일 아침 6시 자동 기사 생성 (10건)
# PowerShell 스크립트 — Windows 작업 스케줄러용
# =====================================================

$ErrorActionPreference = "Continue"
$LOGFILE = "C:\Users\joyan\PSA\scripts\generate-news.log"

# 로그 시작
"========================================" | Out-File $LOGFILE
"  다이브저널 자동 기사 생성 (10건)" | Out-File $LOGFILE -Append
"  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File $LOGFILE -Append
"========================================" | Out-File $LOGFILE -Append

Set-Location "C:\Users\joyan\PSA"

$env:PATH = "C:\Users\joyan\AppData\Roaming\npm;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;$env:PATH"

$CLAUDE = "C:\Users\joyan\AppData\Roaming\npm\claude.cmd"
$TODAY = Get-Date -Format "yyyy/MM/dd"
$TODAY_DASH = Get-Date -Format "yyyy-MM-dd"

# 버전 확인
"[CHECK] Claude version:" | Out-File $LOGFILE -Append
& $CLAUDE --version 2>&1 | Out-File $LOGFILE -Append

# ===== PART 1: 뉴스 + 스쿠버 + 다이빙포인트 + 레시피 + 트레이닝 (8건) =====
"[1/2] 기사 8건 생성 중..." | Out-File $LOGFILE -Append

& $CLAUDE -p "10개 기사를 content/articles/$TODAY/ 폴더에 JSON으로 생성해줘. 공통: JSON 형식은 content/articles/2026/04/15/garmin-descent-mk3i-new-color.json 참고. publishedAt: $TODAY_DASH. 이미지: Unsplash 실사만(AI 금지). 기존 content/articles/와 중복 안되게. A. 뉴스 3개: RSS(https://www.deeperblue.com/feed/ 와 https://news.google.com/rss/search?q=freediving+OR+scuba+diving&hl=en) 기반. 팩트체크 필수. 원본 이미지 있으면 사용. category: scuba-news/freediving-competition/freediving-records/freediving-training/freediving-safety/environment/people/science 중. B. 스쿠버 장비 1개: category: scuba-equipment. C. 다이빙 포인트 2개: 교통/숙박/식사 포함. category: diving-spot. 해당 국가 관광청 사진 우선. D. 레시피 1개: category: recipe. E. 트레이닝 1개: category: workout." --allowedTools "Bash,Read,Write,Edit" --max-turns 40 2>&1 | Out-File $LOGFILE -Append

# ===== PART 2: 유튜브 영상 2건 =====
"[2/2] 유튜브 영상 2건 생성 중..." | Out-File $LOGFILE -Append

& $CLAUDE -p "프리다이빙/스쿠버 관련 유튜브 영상 2개를 찾아 각각 기사로 작성해줘. content/articles/$TODAY/ 폴더에 JSON 저장. 더블케이/PADI 제외. 기존 content/articles/의 video와 중복 안되게. 반드시 curl로 https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=영상ID&format=json 확인하여 200인 것만 사용. 본문에 유튜브 임베드. imageUrl: https://img.youtube.com/vi/영상ID/maxresdefault.jpg. category: video." --allowedTools "Bash,Read,Write,Edit" --max-turns 20 2>&1 | Out-File $LOGFILE -Append

# ===== 유튜브 검증 =====
"[검증] 유튜브 영상 확인..." | Out-File $LOGFILE -Append
& node -e "const fs=require('fs'),path=require('path');function w(d){if(!fs.existsSync(d))return[];const r=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())r.push(...w(f));else if(e.name.endsWith('.json'))r.push(f);}return r;}(async()=>{for(const f of w('content/articles')){const a=JSON.parse(fs.readFileSync(f,'utf8'));if(a.category!=='video')continue;const m=a.en.body.match(/embed\/([a-zA-Z0-9_-]+)/);if(!m)continue;const id=m[1];const r=await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+id+'&format=json');if(r.status!==200){console.log('REMOVING:',a.slug);fs.unlinkSync(f);}else{console.log('OK:',a.slug);}}})();" 2>&1 | Out-File $LOGFILE -Append

# ===== Git 커밋 및 푸시 =====
"[GIT] 커밋 중..." | Out-File $LOGFILE -Append

& git add content/
$hasChanges = & git diff --cached --quiet 2>&1; $LASTEXITCODE
if ($LASTEXITCODE -ne 0) {
    & git commit -m "feat: daily 10 articles $TODAY_DASH"
    & git push
    "GitHub 푸시 완료!" | Out-File $LOGFILE -Append
} else {
    "새 기사가 없습니다." | Out-File $LOGFILE -Append
}

"========================================" | Out-File $LOGFILE -Append
"  완료: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File $LOGFILE -Append
"========================================" | Out-File $LOGFILE -Append
