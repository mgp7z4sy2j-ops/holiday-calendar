# Alvin & Anthony 假期日程

2026 年 9/14 – 10/11 学校假期的双人日程表。中英文可切换，可打印成 A4 横版一页，可订阅到手机日历。

- **网页**：https://mgp7z4sy2j-ops.github.io/holiday-calendar/
- **日历订阅**：`https://mgp7z4sy2j-ops.github.io/holiday-calendar/alvin-anthony-holidays.ics`

时区 `Australia/Melbourne`。10/4 是澳洲夏令时开始（时钟前调 1 小时），ics 里带了完整 VTIMEZONE，那天早上的选拔时间由日历客户端自行换算。

## 文件

| 文件 | 作用 |
|---|---|
| `events.js` | **唯一数据源**。所有事件、人名、类型、标记都在这里 |
| `index.html` | 网页 + 打印样式（同一份，`@media print` 切换） |
| `gen-ics.mjs` | 由 `events.js` 生成 ics |
| `build-artifact.mjs` | 剥掉 HTML 外壳，生成 Claude Artifact 用的片段 |
| `alvin-anthony-holidays.ics` | 生成物。**文件名不能改** —— 订阅地址绑死在它上面，改名会让全家已有的订阅全部失效 |

## 改内容

编辑 `events.js`，然后：

```sh
git commit -am "说明"    # pre-commit 钩子会自动重新生成 ics 并加进这次提交
git push                 # GitHub Pages 约 1 分钟后生效
```

订阅过的手机会自己刷新（Apple 按 ics 里的 12 小时提示，Google 自行约 8–24 小时一次，不可控）。想马上看到就在日历里手动刷新。

### 加一个普通事件

```js
{ date: '2026-10-05', who: 'alvin', start: '16:00', end: '17:00', type: 'training',
  title: '投篮训练', title_en: 'Shooting Practice', venue: 'MSAC' },
```

`who` 是 `alvin` 或 `anthony`。`type` 见 `events.js` 里的 `TYPES`（已备好 阅读 / 体能 / 投篮 / 力量）。
`venue` 可选，会显示在卡片上并写进 ics 的 `LOCATION`（手机上能点开导航）。
同一个人时间重叠会自动在页面上标红框，不用自己核对。

### 加重复事件

别逐天列，用 `ROUTINES`（`weekdays` 里 0 = 周日，`from` / `to` 含两端）：

```js
{ who: 'alvin', title: '阅读', title_en: 'Reading', type: 'reading',
  start: '19:30', end: '20:00',
  from: '2026-09-26', to: '2026-10-11', weekdays: [1,2,3,4,5] },
```

### 补一个待定时间

删掉 `tbd: true` 和 `when` / `when_en`，换成 `start` / `end`：

```js
// 改前
{ date: '2026-10-03', who: 'alvin', tbd: true, when: '下午 + 晚上，时间待定', ... }
// 改后
{ date: '2026-10-03', who: 'alvin', start: '14:00', end: '20:00', ... }
```

目前还有 3 个待定项：9/20 Anthony 的决赛（要等 9/19 是否晋级）、10/3 和 10/4 的 Alpha Wolf 团建。

补时间**不会**让订阅方把事件删掉重建 —— ics 的 `UID` 只由 `日期 + 人 + 标题` 推导（见 `gen-ics.mjs` 里的 `uidFor`），与数组顺序、与时间都无关，所以补时间算"更新同一个事件"。
**反过来说，改标题会换掉事件身份。** 已经发布的事件尽量别改 `title`，要改就接受订阅方那一条被删掉重建。

## 更新 Claude Artifact 版

`index.html` 是完整 HTML 文档（GitHub Pages 需要 doctype，否则浏览器进怪异模式），而 Artifact 要的是不带外壳的片段。所以：

```sh
node build-artifact.mjs    # 生成 .artifact/index.html
```

然后用 `.artifact/index.html` 发布，`files` 里带上 `events.js`。两个渠道共用同一份源文件，不会漂移。

订阅链接在 Artifact 版里点了没反应 —— Artifact 沙箱会拦外部协议跳转，属预期，GitHub Pages 上正常。

## 不用 GitHub Actions 的原因

当前 gh token 没有 `workflow` scope，推 `.github/workflows/` 会被拒。ics 的同步靠本地 `.git/hooks/pre-commit` 保证。要改用 Actions 得先 `gh auth refresh -s workflow`。
