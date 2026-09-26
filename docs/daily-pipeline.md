# 매일 기사 5편 자동 발행 절차

Mac mini 의 Claude 앱 예약 작업이 매일 한국 시각 오전 7시에 이 문서를 따라 실행한다.
사람이 손으로 돌릴 때도 같은 절차를 따른다.

기사 5편을 쓰고, 평가 기준([evaluation-rubric.md](evaluation-rubric.md))을 통과시키고,
사진을 검증해 붙이고, 커밋·푸시해 Vercel 자동 배포까지 확인한다.

---

## 0. 실행 여부 판단 (가장 먼저)

Mac mini 는 시간대가 America/Los_Angeles 라 예약을 현지 14시·15시 두 번 건다.
한국은 서머타임이 없고 LA 는 있어서, 한 번만 걸면 11월~3월에 한 시간이 밀린다.
그래서 매번 아래 두 가지를 확인하고 해당하면 **아무것도 하지 않고 끝낸다.**

```bash
cd ~/github001/PSA
KST_DATE=$(TZ=Asia/Seoul date +%Y-%m-%d)
KST_HOUR=$(TZ=Asia/Seoul date +%H)
git fetch -q origin
git log origin/main --oneline --grep "daily articles ${KST_DATE}" | head -1
```

- `KST_HOUR` 가 07 보다 작으면 → 아직 이르다. 종료.
- 위 `git log` 에 줄이 나오면 → 오늘 분은 이미 발행됐다. 종료.

## 1. 저장소 준비

```bash
git pull --ff-only origin main
```

- 실패하면(로컬 커밋이 원격과 갈라짐 등) 멈추고 상황만 보고한다. 강제로 맞추지 않는다.
- 작업 트리에 이미 수정된 파일이 있어도 건드리지 않는다(stash·checkout·reset 금지).
  커밋할 때 오늘 기사 파일만 경로로 지정해 담는다.
- 오늘 폴더: `content/articles/YYYY/MM/DD` — **날짜는 한국 날짜**(`TZ=Asia/Seoul`).

## 2. 주제 5개 고르기

뉴스를 먼저 모은다. WebFetch 로 읽는다.

- https://www.deeperblue.com/feed/
- https://divernet.com/feed/
- https://news.google.com/rss/search?q=freediving&hl=en-US&gl=US&ceid=US:en
- https://news.google.com/rss/search?q=scuba+diving&hl=en-US&gl=US&ceid=US:en
- https://news.google.com/rss/search?q=%ED%94%84%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%B9%99&hl=ko&gl=KR&ceid=KR:ko
- https://news.google.com/rss/search?q=%EC%8A%A4%EC%BF%A0%EB%B2%84%EB%8B%A4%EC%9D%B4%EB%B9%99&hl=ko&gl=KR&ceid=KR:ko

고르는 규칙

- 최근 7일 안의 뉴스를 우선한다. 프리다이빙 관련을 2편 이상 넣는다.
- 이미 다룬 주제는 뺀다. `content/articles` 전체의 `slug`·제목·`sourceUrls` 와 대조한다.
- 쓸 만한 새 뉴스가 5편에 못 미치면 상시 기사로 채운다
  (카테고리 `freediving-training`, `freediving-safety`, `science`, `diving-spot`,
  `workout`, `recipe` 등. 이미 쓴 주제와 겹치지 않게).
- 카테고리는 [src/lib/types.ts](../src/lib/types.ts) 의 `Category` 값만 쓴다.
  레거시로 표시된 값은 쓰지 않는다.

## 3. 기사 쓰기와 평가

형식은 기존 기사(예: `content/articles/2026/06/16/mammalian-dive-reflex-body-designed-for-water.json`)와 같다.
`slug, publishedAt, updatedAt, status, category, tags, sourceUrls, imageUrl, imageAlt, en, ko, evaluation`.

- 뉴스 기사는 원문을 WebFetch 로 실제로 읽고 쓴다. RSS 요약만 보고 쓰지 않는다.
  확인하지 못한 수치·인용·날짜는 넣지 않는다(하드 게이트 H1).
- 원문 문장을 그대로 옮기지 않는다(H2). EN 300~500 단어, KO 300 어절 이상.
- 한국어는 번역투 없이 자연스럽게. HTML 은 `<p> <h3> <em> <strong>` 정도만.
- `publishedAt`·`updatedAt` 은 작성 시각(UTC ISO).
- `slug` 는 전체 기사에서 유일해야 한다.
- 평가는 루브릭대로: 하드 게이트 6개 → 100점 채점 → 사실 정확성 외 만점이면 통과.
  실패하면 고쳐서 다시 채점, 최대 3 라운드.
- 3 라운드 안에 통과 못 한 기사는 **파일을 지우고 다른 주제로 대체**한다.
  목표는 `published` 5편이다. 주제 대체는 모두 합쳐 3번까지만 하고,
  그래도 5편이 안 되면 통과한 것만 발행하고 보고한다.

## 4. 사진 (가장 자주 틀리는 곳)

**사진 주소를 기억으로 적지 않는다.** 예전 파이프라인이 그렇게 해서 64편 중 40편이
깨진 주소이거나 전혀 다른 사진이었다(바이칼 얼음 잠수 기사에 열대 산호, 잠수 반사
기사에 자전거). 설명(`imageAlt`)까지 기사에 맞춰 지어내 글만 봐서는 몰랐다.

1. 후보를 찾는다.
   ```bash
   node scripts/find-image.mjs "<구체적인 영어 검색어>" 6
   ```
   유료 사진·이미 쓴 사진·안 열리는 주소는 스크립트가 걸러 준다.
   `description` 은 Unsplash 가 붙인 실제 사진 설명이다.
2. 설명이 가장 맞는 후보 1~2장을 내려받아 **직접 눈으로 본다.**
   ```bash
   curl -s "<imageUrl의 w=800&h=450 를 w=480&h=270 로 바꾼 주소>" -o /tmp/dj-check.jpg
   ```
   Read 도구로 이미지를 열어 기사 주제와 맞는지 확인한다.
   장소 기사는 그 장소처럼 보여야 하고, 장비 기사는 그 장비 종류가 보여야 하고,
   레시피는 그 음식이어야 한다. 도시 풍경·무관한 사물·엉뚱한 지형이면 버린다.
3. 맞는 사진이 없으면 검색어를 바꿔 다시 찾는다. 끝까지 없으면 주제를
   대표하는 일반 수중·프리다이빙 사진을 쓰되, 틀린 사진보다는 일반 사진이 낫다.
4. `imageUrl` 은 스크립트가 준 값을 그대로, `imageAlt` 는 **실제 사진을 묘사**한다
   (기사 내용을 적지 않는다).
5. 기사 파일을 먼저 저장한 뒤 다음 기사의 사진을 찾는다. 그래야 스크립트가 방금 쓴
   사진을 중복 후보에서 뺀다.

## 5. 검증

```bash
node -e "for (const f of require('fs').readdirSync('content/articles/'+process.argv[1])) JSON.parse(require('fs').readFileSync('content/articles/'+process.argv[1]+'/'+f,'utf8'))" YYYY/MM/DD
npm run build
```

빌드가 실패하면 푸시하지 않는다. 원인을 고칠 수 있으면 고치고, 아니면 보고한다.

## 6. 커밋·푸시

```bash
git add content/articles/YYYY/MM/DD
git commit -m "feat: daily articles ${KST_DATE} (published=N)"
git push origin main
```

- 커밋 메시지의 `daily articles YYYY-MM-DD` 는 0단계의 중복 실행 방지에 쓰이니 형식을 바꾸지 않는다.
- 오늘 폴더 밖의 파일은 담지 않는다.

## 7. 배포 확인

Vercel 이 푸시를 받아 자동 배포한다. 방금 커밋의 배포가 끝날 때까지 기다린다(보통 1~3분).

```bash
SHA=$(git rev-parse HEAD)
gh api "repos/Joyanghee11/PSA/deployments?sha=${SHA}" --jq '.[0].id'
gh api "repos/Joyanghee11/PSA/deployments/<id>/statuses" --jq '.[0].state'   # success 가 될 때까지
```

그다음 기사마다 `https://divejournal.co.kr/ko/article/<slug>` 가 200 인지 확인한다.

## 8. 보고

기사별로 제목(한국어) · 카테고리 · 점수 · 통과 라운드 · 사진 설명을 한 줄씩,
그리고 커밋 해시와 배포 결과를 적는다. 대체하거나 빠진 기사가 있으면 이유를 적는다.
