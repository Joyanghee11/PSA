#!/usr/bin/env node
/**
 * 기사 대표 사진 후보 찾기.
 *
 *   node scripts/find-image.mjs "<검색어>" [개수=8]
 *
 * Unsplash 검색 결과를 실제 사진 설명(alt_description)과 함께 JSON 으로 낸다.
 *
 * 왜 필요한가: 예전 파이프라인은 모델이 사진 주소(photo-xxxx)를 기억으로 적어 넣게
 * 했다. 그러면 없는 주소(404)가 나오거나, 주소는 살아 있는데 전혀 다른 사진이 붙는다.
 * 2026-09-26 점검에서 64편 중 40편이 그랬다(바이칼 얼음 잠수 기사에 열대 산호,
 * 포유류 잠수 반사 기사에 자전거). 사진 설명까지 기사에 맞춰 지어낸 탓에 글만
 * 봐서는 알 수 없었다. 이 스크립트가 주는 후보 중에서만 고를 것.
 *
 * 걸러내는 것
 *   - Unsplash+ 유료 사진(plus.unsplash.com) — 무료 라이선스가 아니다
 *   - content/articles 에서 이미 쓴 사진 — 같은 사진이 두 기사에 붙지 않게
 *   - 실제로 열리지 않는 주소
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const query = process.argv[2];
const want = Number(process.argv[3] ?? 8);
if (!query) {
  console.error('사용법: node scripts/find-image.mjs "<검색어>" [개수]');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 이미 쓴 사진의 고유 번호(photo-xxxx) 모음 */
function usedPhotoIds() {
  const ids = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.json')) {
        const m = readFileSync(p, 'utf8').match(/images\.unsplash\.com\/(photo-[\w-]+)/);
        if (m) ids.add(m[1]);
      }
    }
  };
  walk(join(root, 'content', 'articles'));
  return ids;
}

const used = usedPhotoIds();
const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30`;
// 브라우저 UA 를 달면 봇 차단 페이지로 돌려보낸다. 짧은 시간에 수십 번 검색하면 429 로
// 잠시 막히므로 1분씩 쉬며 세 번까지 다시 시도한다.
let res;
for (let attempt = 0; attempt < 4; attempt++) {
  res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (res.status !== 429) break;
  console.error(`Unsplash 가 잠시 막음(429) — 60초 뒤 다시 시도 (${attempt + 1}/3)`);
  await new Promise((r) => setTimeout(r, 60_000));
}
if (!res.ok) {
  console.error(`Unsplash 검색 실패: HTTP ${res.status}`);
  process.exit(2);
}
const { results = [] } = await res.json();

const out = [];
for (const r of results) {
  if (out.length >= want) break;
  if (r.premium || r.plus || !r.urls?.raw?.startsWith('https://images.unsplash.com/')) continue;
  const photoId = r.urls.raw.match(/images\.unsplash\.com\/(photo-[\w-]+)/)?.[1];
  if (!photoId || used.has(photoId)) continue;
  const imageUrl = `https://images.unsplash.com/${photoId}?w=800&h=450&fit=crop&q=80`;
  const head = await fetch(imageUrl, { method: 'HEAD' }).catch(() => null);
  if (!head?.ok) continue;
  out.push({
    imageUrl,
    description: r.alt_description ?? r.description ?? '',
    photographer: r.user?.name ?? '',
    page: r.links?.html ?? '',
  });
}

console.log(JSON.stringify(out, null, 2));
if (!out.length) process.exit(3);
