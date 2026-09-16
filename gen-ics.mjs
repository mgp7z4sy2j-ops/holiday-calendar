import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, 'events.js'), 'utf8');
const { TIMEZONE, KIDS, TYPES, ALL_EVENTS } = new Function(
  src + '\nreturn { TIMEZONE, KIDS, TYPES, ALL_EVENTS };'
)();

const bi = (zh, en) => (!en || en === zh ? zh : `${zh} ${en}`);

// UID 是订阅方认定的事件身份，必须与数组顺序、与时间都无关：
// 按"当天第几条"编号的话，插入一条事件会让后面所有事件的 UID 漂移，
// 订阅方会把同一个活动删掉重建。这里只用 日期 + 人 + 标题 推导，
// 所以补一个待定时间是"更新"而不是"换一个事件"。
function fnv1a(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const uidSeen = new Map();
function uidFor(e) {
  const base = `${e.date}-${e.who}-${fnv1a(e.title)}`;
  const n = (uidSeen.get(base) || 0) + 1;
  uidSeen.set(base, n);
  return `${n === 1 ? base : `${base}-${n}`}@holiday-calendar`;
}

const STAMP = '20260914T000000Z';

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TIMEZONE}`,
  'BEGIN:STANDARD',
  'DTSTART:19700405T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU',
  'TZOFFSETFROM:+1100',
  'TZOFFSETTO:+1000',
  'TZNAME:AEST',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'DTSTART:19701004T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU',
  'TZOFFSETFROM:+1000',
  'TZOFFSETTO:+1100',
  'TZNAME:AEDT',
  'END:DAYLIGHT',
  'END:VTIMEZONE',
];

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const compact = (iso) => iso.replace(/-/g, '');
const stamp = (date, hm) => `${compact(date)}T${hm.replace(':', '')}00`;

function nextDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + 1);
  return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}`;
}

function fold(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 73) return line;
  const out = [];
  let cut = 0;
  while (cut < bytes.length) {
    let take = Math.min(cut === 0 ? 73 : 72, bytes.length - cut);
    while (take > 1 && (bytes[cut + take] & 0xc0) === 0x80) take--;
    out.push((cut === 0 ? '' : ' ') + bytes.subarray(cut, cut + take).toString('utf8'));
    cut += take;
  }
  return out.join('\r\n');
}

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//holiday-calendar//Alvin & Anthony//ZH',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:Alvin & Anthony 假期日程 Holiday Schedule',
  `X-WR-TIMEZONE:${TIMEZONE}`,
  'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
  'X-PUBLISHED-TTL:PT12H',
  ...VTIMEZONE,
];

const rows = [];

for (const e of ALL_EVENTS) {
  const kid = KIDS[e.who];
  const t = TYPES[e.type] || {};
  const kind = bi(t.zh || '', t.en);
  const summary = `${kid.name} · ${bi(e.title, e.title_en)}` +
    (e.tbd ? ' （待定 TBC）' : '');

  const ev = [
    'BEGIN:VEVENT',
    `UID:${uidFor(e)}`,
    `DTSTAMP:${STAMP}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(
      `${kind} · ${kid.name}（${kid.zh} / ${kid.en}）` +
      (e.note ? `\n${bi(e.note, e.note_en)}` : '') +
      (e.tbd ? `\n${bi(e.when || '时间待定', e.when_en)}` : '')
    )}`,
    `CATEGORIES:${esc(kind)}`,
  ];

  if (e.venue) ev.push(`LOCATION:${esc(e.venue)}`);

  if (e.tbd) {
    ev.push(`DTSTART;VALUE=DATE:${compact(e.date)}`, `DTEND;VALUE=DATE:${nextDay(e.date)}`);
  } else {
    ev.push(
      `DTSTART;TZID=${TIMEZONE}:${stamp(e.date, e.start)}`,
      `DTEND;TZID=${TIMEZONE}:${stamp(e.date, e.end)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'TRIGGER:-PT30M',
      `DESCRIPTION:${esc(summary)}`,
      'END:VALARM'
    );
  }
  ev.push('END:VEVENT');
  lines.push(...ev);

  rows.push(
    `${e.date}  ${DOWS(e.date)}  ${kid.short}  ` +
    `${(e.tbd ? '待定'.padEnd(11) : `${e.start}-${e.end}`).padEnd(13)}${kind}  ${e.title}` +
    (e.venue ? `  @${e.venue}` : '')
  );
}

lines.push('END:VCALENDAR');

function DOWS(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(y, m - 1, d).getDay()];
}

const out = join(here, 'alvin-anthony-holidays.ics');
writeFileSync(out, lines.map(fold).join('\r\n') + '\r\n');

console.log(rows.join('\n'));
console.log(`\n共 ${ALL_EVENTS.length} 条事件 → ${out}`);
console.log(`时区 ${TIMEZONE}（含 VTIMEZONE，10/4 夏令时切换由日历客户端处理）`);
