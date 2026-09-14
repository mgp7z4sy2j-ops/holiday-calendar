const TIMEZONE = 'Australia/Melbourne';

// 订阅地址的唯一来源。ICS 文件名改动会让全家已有的订阅失效。
const SITE = 'https://mgp7z4sy2j-ops.github.io/holiday-calendar';
const ICS = 'alvin-anthony-holidays.ics';

const RANGE = { start: '2026-09-14', end: '2026-10-11' };

const KIDS = {
  alvin:   { name: 'Alvin',   zh: '哥哥', en: 'older',   short: 'AL' },
  anthony: { name: 'Anthony', zh: '弟弟', en: 'younger', short: 'AN' },
};

const TYPES = {
  game:     { zh: '比赛', en: 'Game' },
  camp:     { zh: '营队', en: 'Camp' },
  class:    { zh: '课程', en: 'Class' },
  training: { zh: '训练', en: 'Training' },
  tryout:   { zh: '选拔', en: 'Tryout' },
  health:   { zh: '就医', en: 'Appointment' },
  team:     { zh: '团建', en: 'Team' },
  ai:       { zh: 'AI 课', en: 'AI' },
  reading:  { zh: '阅读', en: 'Reading' },
  fitness:  { zh: '体能', en: 'Conditioning' },
  shooting: { zh: '投篮', en: 'Shooting' },
  strength: { zh: '力量', en: 'Strength' },
};

const MARKERS = [
  {
    date: '2026-09-19',
    text: '学校假期开始（Term 3 到 9/18 结束）',
    text_en: 'School holidays start (Term 3 ends 18 Sep)',
  },
  {
    date: '2026-10-04',
    text: '夏令时开始 · 时钟前调 1 小时，早上的选拔按新时间算',
    text_en: 'Daylight saving starts · clocks forward 1 hour; the morning tryouts use the new time',
  },
];

const AI_NOTE = { note: '北京时间 9:00–11:00', note_en: '9:00–11:00 Beijing time' };

const EVENTS = [
  { date: '2026-09-18', who: 'anthony', start: '18:30', end: '19:30', type: 'game',
    title: '锦标赛 ① 第 1 场', title_en: 'Tournament 1 · Game 1' },

  { date: '2026-09-19', who: 'alvin', tbd: true, when: '时间待定', when_en: 'Time TBC', type: 'game',
    title: 'Grand Final 两场', title_en: 'Grand Final · 2 games' },
  { date: '2026-09-19', who: 'anthony', start: '12:40', end: '13:40', type: 'game',
    title: '锦标赛 ① 第 2 场', title_en: 'Tournament 1 · Game 2' },
  { date: '2026-09-19', who: 'anthony', start: '15:10', end: '16:10', type: 'game',
    title: '锦标赛 ① 第 3 场', title_en: 'Tournament 1 · Game 3' },

  { date: '2026-09-20', who: 'anthony', start: '08:30', end: '09:30', type: 'game',
    title: '锦标赛 ① 第 4 场', title_en: 'Tournament 1 · Game 4' },
  { date: '2026-09-20', who: 'anthony', tbd: true, when: '下午待定', when_en: 'Afternoon, TBC', type: 'game',
    title: '锦标赛 ① 决赛（若晋级）', title_en: 'Tournament 1 · Final (if through)' },

  { date: '2026-09-21', who: 'alvin',   start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ①', title_en: 'AI Training 1', ...AI_NOTE },
  { date: '2026-09-21', who: 'anthony', start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ①', title_en: 'AI Training 1', ...AI_NOTE },

  { date: '2026-09-22', who: 'alvin',   start: '09:00', end: '11:00', type: 'camp',
    title: 'Tigers Camp', title_en: 'Tigers Camp' },
  { date: '2026-09-22', who: 'anthony', start: '11:30', end: '13:30', type: 'camp',
    title: 'Tigers Camp', title_en: 'Tigers Camp' },

  { date: '2026-09-23', who: 'alvin',   start: '09:00', end: '10:00', type: 'health',
    title: '牙医', title_en: 'Dentist' },
  { date: '2026-09-23', who: 'alvin',   start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ②', title_en: 'AI Training 2', ...AI_NOTE },
  { date: '2026-09-23', who: 'anthony', start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ②', title_en: 'AI Training 2', ...AI_NOTE },

  { date: '2026-09-24', who: 'alvin',   start: '09:00', end: '11:00', type: 'camp',
    title: 'Tigers Camp', title_en: 'Tigers Camp' },
  { date: '2026-09-24', who: 'anthony', start: '11:30', end: '13:30', type: 'camp',
    title: 'Tigers Camp', title_en: 'Tigers Camp' },

  { date: '2026-09-25', who: 'anthony', start: '08:00', end: '09:00', type: 'game',
    title: '锦标赛 ② 第 1 场', title_en: 'Tournament 2 · Game 1' },
  { date: '2026-09-25', who: 'anthony', start: '11:20', end: '12:20', type: 'game',
    title: '锦标赛 ② 第 2 场', title_en: 'Tournament 2 · Game 2' },
  { date: '2026-09-25', who: 'anthony', start: '15:30', end: '16:30', type: 'game',
    title: '锦标赛 ② 第 3 场', title_en: 'Tournament 2 · Game 3' },

  { date: '2026-09-26', who: 'anthony', start: '08:00', end: '09:00', type: 'game',
    title: '锦标赛 ② 第 4 场', title_en: 'Tournament 2 · Game 4' },

  { date: '2026-09-27', who: 'alvin',   start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ③', title_en: 'AI Training 3', ...AI_NOTE },
  { date: '2026-09-27', who: 'anthony', start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ③', title_en: 'AI Training 3', ...AI_NOTE },

  { date: '2026-09-28', who: 'anthony', start: '10:00', end: '14:00', type: 'camp',
    title: '篮球假期班', title_en: 'Basketball Holiday Camp' },
  { date: '2026-09-28', who: 'alvin',   start: '13:30', end: '16:30', type: 'class',
    title: '英语假期班', title_en: 'English Holiday Class' },
  { date: '2026-09-29', who: 'anthony', start: '10:00', end: '14:00', type: 'camp',
    title: '篮球假期班', title_en: 'Basketball Holiday Camp' },
  { date: '2026-09-29', who: 'alvin',   start: '13:30', end: '16:30', type: 'class',
    title: '英语假期班', title_en: 'English Holiday Class' },
  { date: '2026-09-30', who: 'anthony', start: '10:00', end: '14:00', type: 'camp',
    title: '篮球假期班', title_en: 'Basketball Holiday Camp' },
  { date: '2026-09-30', who: 'alvin',   start: '13:30', end: '16:30', type: 'class',
    title: '英语假期班', title_en: 'English Holiday Class' },
  { date: '2026-10-01', who: 'alvin',   start: '13:30', end: '16:30', type: 'class',
    title: '英语假期班', title_en: 'English Holiday Class' },

  { date: '2026-10-02', who: 'anthony', start: '12:30', end: '13:30', type: 'training',
    title: '个人训练', title_en: 'Individual Training' },
  { date: '2026-10-02', who: 'anthony', start: '18:45', end: '20:25', type: 'tryout',
    title: 'Tigers Tryout 第 1 轮', title_en: 'Tigers Tryout · Round 1' },
  { date: '2026-10-02', who: 'alvin',   start: '20:30', end: '22:15', type: 'tryout',
    title: 'Tigers Tryout 第 1 轮', title_en: 'Tigers Tryout · Round 1' },

  { date: '2026-10-03', who: 'alvin',   start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ④', title_en: 'AI Training 4', ...AI_NOTE },
  { date: '2026-10-03', who: 'anthony', start: '11:00', end: '13:00', type: 'ai',
    title: 'AI 专项训练 ④', title_en: 'AI Training 4', ...AI_NOTE },
  { date: '2026-10-03', who: 'alvin', tbd: true, when: '下午 + 晚上，时间待定',
    when_en: 'Afternoon + evening, TBC', type: 'team',
    title: 'Alpha Wolf 团建', title_en: 'Alpha Wolf Team Event' },

  { date: '2026-10-04', who: 'anthony', start: '08:00', end: '10:00', type: 'tryout',
    title: 'Tigers Tryout 第 2 轮', title_en: 'Tigers Tryout · Round 2' },
  { date: '2026-10-04', who: 'alvin',   start: '10:00', end: '12:00', type: 'tryout',
    title: 'Tigers Tryout 第 2 轮', title_en: 'Tigers Tryout · Round 2' },
  { date: '2026-10-04', who: 'anthony', tbd: true, when: '晚上待定', when_en: 'Evening, TBC', type: 'team',
    title: 'Alpha Wolf 团建', title_en: 'Alpha Wolf Team Event' },
];

// weekdays: 0=周日 … 6=周六；from / to 含两端
const ROUTINES = [
  // { who: 'alvin', title: '阅读', title_en: 'Reading', type: 'reading',
  //   start: '19:30', end: '20:00',
  //   from: '2026-09-26', to: '2026-10-11', weekdays: [0,1,2,3,4,5,6] },
];

function expandRoutines(routines) {
  const out = [];
  for (const r of routines) {
    const [fy, fm, fd] = r.from.split('-').map(Number);
    const [ty, tm, td] = r.to.split('-').map(Number);
    const cur = new Date(fy, fm - 1, fd);
    const end = new Date(ty, tm - 1, td);
    while (cur <= end) {
      if (!r.weekdays || r.weekdays.includes(cur.getDay())) {
        const iso = cur.getFullYear() + '-' +
          String(cur.getMonth() + 1).padStart(2, '0') + '-' +
          String(cur.getDate()).padStart(2, '0');
        out.push(Object.assign({}, r, { date: iso, routine: true }));
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
  return out;
}

const ALL_EVENTS = EVENTS.concat(expandRoutines(ROUTINES)).sort(function (a, b) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const as = a.start || '99:99', bs = b.start || '99:99';
  return as < bs ? -1 : as > bs ? 1 : 0;
});
