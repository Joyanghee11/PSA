@echo off
:: =====================================================
:: 다이브저널 자동 기사 생성 (Windows)
:: 매일 자동으로 프리다이빙 뉴스를 수집하고 기사를 생성합니다.
:: =====================================================

set PATH=C:\Users\joyan\AppData\Roaming\npm;C:\Program Files\nodejs;C:\Program Files\GitHub CLI;%PATH%

cd /d C:\Users\joyan\PSA

echo ========================================
echo   다이브저널 자동 기사 생성
echo   %date% %time%
echo ========================================

claude -p "다음 작업을 수행해줘: 1) 아래 RSS 피드에서 최신 프리다이빙/다이빙 뉴스를 수집해: https://www.deeperblue.com/feed/ 와 https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en 와 https://news.google.com/rss/search?q=프리다이빙&hl=ko&gl=KR&ceid=KR:ko 2) 수집한 뉴스 중 기존 content/articles/ 폴더에 없는 가장 중요한 3개를 선별해. 3) 각 뉴스에 대해 content/articles/ 아래 오늘 날짜 폴더에 JSON 파일을 생성해. 기존 기사 파일(content/articles/2026/04/15/molchanov-ice-freediving-record-baikal.json)과 동일한 JSON 형식으로. 4) imageUrl은 반드시 Pollinations AI 이미지를 사용해. 기사 내용을 분석해서 구체적인 영문 프롬프트를 만들고, https://image.pollinations.ai/prompt/여기에URL인코딩된프롬프트?width=800&height=450&nologo=true 형태로 넣어. 예: https://image.pollinations.ai/prompt/freediver%20diving%20deep%20blue%20ocean?width=800&height=450&nologo=true 5) 본문은 각 언어로 300-500단어 HTML로 작성. 원본을 복사하지 말고 새로운 기사 작성. 6) 이미 같은 slug 파일이 있으면 건너뛰어." --allowedTools "Bash,Read,Write,Edit" --max-turns 20

echo.
echo 기사 생성 완료! Git 커밋 중...

git add content/
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "feat: add daily freediving news articles %date:~0,10%"
    git push
    echo GitHub 푸시 완료!
) else (
    echo 새 기사가 없습니다.
)

echo.
echo ========================================
echo   완료: %date% %time%
echo ========================================
