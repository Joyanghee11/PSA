# 다이브저널 · DiveJournal — Design System

이 폴더는 다이브저널 서비스의 브랜드 자산과 디자인 스펙을 보관한다.
**컨셉**: 깊은 바다의 절제된 느낌 + 저널리즘의 신뢰감
**톤앤매너**: 조용한(quiet), 정돈된(tidy), 전문적인(professional)

---

## 파일 구조

```
design/
├── README.md            ← 이 문서
├── palette.md           ← 색상 시스템과 CSS 변수 매핑
├── logo.svg             ← 마크 (아이콘 단독, 1:1)
├── logo-full.svg        ← 마크 + 한영 워드마크 (가로)
├── logo-dark.svg        ← 다크 모드용 마크
└── mocks/
    ├── mock-home.html   ← 홈 화면 시안
    └── mock-article.html ← 기사 페이지 시안
```

## 디자인 원칙

1. **절제가 먼저**
   빨간 포인트를 남발하던 과거 한국 신문 감성 대신,
   공백·타이포그래피·얇은 선으로 정보 위계를 만든다.

2. **물의 색을 기본으로**
   남색·시안·안개색의 3계열로 구성. 빨간색은 완전 배제,
   대신 "경고/삭제" 같은 상태 전용으로만 보존.

3. **이중 언어 공존**
   한글(Pretendard 계열)과 영문(Inter/시스템 산세리프)이
   같은 줄에 있을 때 자간·굵기가 자연스럽도록 한다.

4. **깊이는 색의 명도로 표현**
   표면에 가까울수록 옅은 색, 깊을수록 진한 색.
   헤드라인 = 가장 깊은 색, 본문 < 헤드라인 < 부제.

## 적용 범위

- **색상**: `src/app/globals.css`의 CSS custom properties
- **로고**: `src/components/layout/Header.tsx`의 텍스트 로고 자리
- **카드·버튼**: Tailwind 유틸리티 그대로, 색 변수만 교체
- **이메일**: `Confirm sign up` 템플릿에 이미 반영됨 (Supabase 대시보드)
