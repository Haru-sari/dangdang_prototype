// 앱 문구에 쓰면 안 되는 표현을 src/ 전체(주석 포함)와 index.html에서 찾습니다.
// 하나라도 있으면 실패(exit 1)합니다. `npm run check`에 포함되어 있습니다.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BANNED = ['치료', '진단', '점수', '분석', '우울증', '모니터링', '상태 판정'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md']);

function* walk(path) {
  if (statSync(path).isDirectory()) {
    for (const name of readdirSync(path)) yield* walk(join(path, name));
  } else if (EXTENSIONS.has(extname(path))) {
    yield path;
  }
}

const hits = [];
for (const file of [...walk(join(ROOT, 'src')), join(ROOT, 'index.html')]) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const word of BANNED) {
        if (line.includes(word)) hits.push(`${relative(ROOT, file)}:${i + 1}  "${word}"  ${line.trim()}`);
      }
    });
}

if (hits.length > 0) {
  console.error(`금지어가 ${hits.length}곳에서 발견되었습니다:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log('금지어 검사 통과');
