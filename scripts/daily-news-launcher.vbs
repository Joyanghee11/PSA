' 다이브저널 자동 기사 생성 런처
' 매일 06:00에 실행 (사용자 세션에서 실행되므로 Claude 인증 유지)

Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

' 현재 시간이 06:00~06:05 사이인지 확인 (또는 강제 실행)
Dim currentHour, currentMin
currentHour = Hour(Now)
currentMin = Minute(Now)

' PowerShell 스크립트 실행 (숨김 창)
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\Users\joyan\PSA\scripts\generate-news.ps1", 0, False

Set WshShell = Nothing
