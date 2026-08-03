const fs = require("fs");
const path = require("path");

const articles = [
  {
    file: "commute-cost-analysis.html",
    tag: "시간 비용 분석",
    title: "출퇴근 시간이 내 삶의 가치와 시급에 미치는 경제적 영향",
    desc: "하루 왕복 2시간 출퇴근이 1년에 500시간을 버리는 이유. 이동 시간을 자산으로 바꾸는 전략.",
    minutes: 6,
    sections: [
      {
        h: "1. 출퇴근 시간은 '공짜'가 아니다",
        p: "계약서에 적힌 근무시간은 하루 8시간이지만, 실제 하루를 직장에 바치는 시간은 출퇴근을 포함하면 9.5~11시간에 달합니다. 왕복 2시간 출퇴근은 주 5일 기준으로 연간 약 500시간입니다. 연봉 4,500만 원 직장인의 표면 시급(약 21,600원)으로 환산하면 연간 1,000만 원 이상의 시간 자산이 이동에만 쓰이는 셈입니다.",
      },
      {
        h: "2. 실질 시급 공식에 출퇴근을 넣는 이유",
        p: "진짜 시급(True Hourly Rate)은 세후 소득에서 직장 유지 비용을 뺀 뒤, 근무시간+출퇴근+준비시간으로 나눕니다. 출퇴근 1.5시간을 반영하면 같은 연봉이라도 시급이 15~25% 하락하는 경우가 흔합니다. 즉 연봉 협상만으로는 삶의 질이 오르지 않는 구조적 이유가 생깁니다.",
      },
      {
        h: "3. 출퇴근 시간을 줄이는 현실적 전략",
        p: "완전 이사가 어렵다면 단계적으로 접근하세요. ① 주 1~2회 재택/유연근무 협상 ② 피크타임 회피 출근 ③ 환승 최소화 노선 재설계 ④ 출퇴근 중 학습·독서 등 '생산 전환' ⑤ 직주근접 이직 시 연봉 100만 원 인상보다 왕복 1시간 단축이 실질 시급에 더 유리한지 계산. 계산기에서 출퇴근 시간을 바꿔 가며 시급 변화를 바로 확인해 보세요.",
      },
      {
        h: "4. 한 줄 결론",
        p: "출퇴근은 감정 문제가 아니라 재무 문제입니다. 연봉 인상폭보다 이동 시간 단축이 실질 시급과 여가 시간을 동시에 올리는 경우가 많습니다.",
      },
    ],
  },
  {
    file: "hidden-work-costs.html",
    tag: "직장 지출 가이드",
    title: "직장인이 통장에서 놓치는 숨은 노동 비용 7가지",
    desc: "커피값, 스트레스성 야식, 품위유지비... 일하기 위해 쓰는 돈을 아끼는 실전 직장인 재테크.",
    minutes: 7,
    sections: [
      {
        h: "1. '일하려고 쓰는 돈'이 시급을 깎는다",
        p: "세후 월급이 늘어도 직장 유지를 위한 지출이 함께 늘면 실질 시급은 제자리입니다. TrueHourlyRate는 순소득에서 직장 유지 비용을 빼기 때문에, 숨은 지출을 줄이는 것이 곧 시급 인상과 같습니다.",
      },
      {
        h: "2. 놓치기 쉬운 7가지 비용",
        p: "① 출퇴근 교통비·주유비 ② 직장 근처 식사·커피(습관적 지출) ③ 정장·헤어·화장품 등 품위유지비 ④ 스트레스성 배달·유흥 ⑤ 야근 택시·야식 ⑥ 업무용 구독·클라우드·장비 개인 부담 ⑦ 경조사·회식 관련 지출. 항목별로 월 평균을 적어 연간으로 환산해 보세요. 생각보다 연 200~400만 원이 나오는 경우가 많습니다.",
      },
      {
        h: "3. 줄일 때 우선순위",
        p: "모든 지출을 없앨 필요는 없습니다. ① 빈도 높은 소액 반복(커피·배달) ② 감정 소모 후 보상 지출 ③ 회사 복지로 대체 가능한 항목 순으로 손보세요. 월 10만 원 절감은 연 120만 원이며, 연 2,500시간 노동 기준으로 시급 약 480원 상승 효과가 있습니다.",
      },
      {
        h: "4. 계산기에 넣는 법",
        p: "계산기의 '직장 유지 비용' 칸에 위 항목의 연간 합계를 입력하세요. 같은 연봉이라도 비용 가정이 달라지면 진짜 시급이 크게 달라집니다. 숫자로 확인해야 협상·이직·소비 결정이 선명해집니다.",
      },
    ],
  },
  {
    file: "time-value-optimization.html",
    tag: "생산성 극대화",
    title: "노동 가치와 시급을 20% 높이는 직장인 시급 최적화 5단계",
    desc: "무급 야근 줄이기, 업무 자동화 툴 활용, 이직 협상 시 진짜 시급 활용법 총정리.",
    minutes: 9,
    sections: [
      {
        h: "1. 시급을 올리는 두 축: 분자와 분모",
        p: "진짜 시급 = (세후 소득 − 직장 비용) ÷ 총 투입 시간. 시급을 올리려면 분자를 키우거나(소득↑·비용↓) 분모를 줄여야 합니다(불필요 근무·이동 시간↓). 연봉만 올리는 전략은 한쪽 축만 건드리는 경우가 많습니다.",
      },
      {
        h: "2. 5단계 실행 체크리스트",
        p: "① 무급 야근 기록: 2주간 실제 퇴근 시각을 기록해 '숨은 근무시간'을 수치화 ② 업무 자동화: 반복 보고서·메일·정리 작업을 템플릿/스크립트로 전환 ③ 미팅 다이어트: 목적·아젠다 없는 회의 거절 또는 30분 상한 ④ 출퇴근 최적화: 재택·시차 출근으로 연 100시간 이상 회수 목표 ⑤ 협상 언어 바꾸기: '연봉 몇 %'가 아니라 '실질 시급·총 투입시간' 기준으로 제안.",
      },
      {
        h: "3. 이직·협상에서 쓰는 법",
        p: "연봉 200만 원 인상보다 주 4일 재택이 실질 시급을 더 올릴 수 있습니다. 제안 시 '현재 진짜 시급 X원 → 제안 조건 시 Y원'처럼 숫자로 비교하면 협상이 구체화됩니다. 본 사이트 계산기로 Before/After를 캡처해 두는 것을 추천합니다.",
      },
      {
        h: "4. 20% 향상이 가능한 이유",
        p: "많은 직장인은 분모(시간)에 방치된 낭비가 큽니다. 주 5시간 야근 감소 + 월 10만 원 직장 비용 절감만으로도 실질 시급 10~20% 개선 사례가 흔합니다. 완벽한 이직이 아니어도, 이번 주부터 측정과 작은 실험이 가능합니다.",
      },
    ],
  },
  {
    file: "2026-salary-breakdown-table.html",
    tag: "2026 통계 표준",
    title: "2026년 연봉별 실수령액 및 진짜 시급 표준 비교표",
    desc: "연봉 3,000만원부터 1억원까지, 평균 출퇴근 시간 반영 시 실수령 시급 완전 비교 데이터.",
    minutes: 10,
    sections: [
      {
        h: "1. 비교 기준 (가정)",
        p: "아래 표는 이해를 위한 표준 시나리오입니다. 가정: 주 40시간 근무, 연 2080시간, 왕복 출퇴근 1.5시간(연 약 390시간), 준비 30분(연 약 130시간), 직장 유지 비용 연 240만 원, 세후 비율은 연봉 구간에 따라 대략 78~88%로 단순화. 실제 세액·지역·부양가족에 따라 달라지므로 계산기로 개인화하세요.",
      },
      {
        h: "2. 연봉별 대략 비교 (참고용)",
        p: "연봉 3,000만 원 → 표면 시급 약 1.4만 원대, 출퇴근·비용 반영 시 1.0~1.2만 원대. 연봉 4,500만 원 → 표면 약 2.1만 원, 실질 1.4~1.6만 원대. 연봉 6,000만 원 → 표면 약 2.8만 원, 실질 1.9~2.2만 원대. 연봉 8,000만 원 → 표면 약 3.8만 원, 실질 2.5~2.9만 원대. 연봉 1억 원 → 표면 약 4.8만 원, 실질 3.2~3.7만 원대. (출퇴근이 왕복 3시간이면 전 구간 실질 시급이 추가로 크게 하락합니다.)",
      },
      {
        h: "3. 표가 말해주는 것",
        p: "연봉이 올라가도 출퇴근·야근·비용 구조가 나쁘면 체감 시급은 정체됩니다. 반대로 연봉이 조금 낮아도 직주근접·재택·낮은 직장 비용이면 실질 시급이 더 높을 수 있습니다. '연봉 랭킹'만 보면 선택의 질이 떨어집니다.",
      },
      {
        h: "4. 내 숫자로 다시 계산",
        p: "표준표는 출발점입니다. 본인 세후 월급, 실제 출퇴근, 야근, 직장 비용을 입력하면 개인화된 진짜 시급이 나옵니다. 이직·이사·투잡 결정을 감이 아니라 시급 단위로 비교해 보세요.",
      },
    ],
  },
];

function page(a) {
  const sections = a.sections
    .map(
      (s) => `
      <h2 style="font-size: 1.6rem; font-weight: 700; color: var(--accent-cyan); margin: 36px 0 16px;">
        ${s.h}
      </h2>
      <p style="margin-bottom: 20px;">
        ${s.p}
      </p>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.title} | TrueHourlyRate</title>
  <meta name="description" content="${a.desc}">
  <link rel="canonical" href="https://true-hourly-rate.pomyjo.com/articles/${a.file}">
  <meta name="google-adsense-account" content="ca-pub-9992037844935954">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9992037844935954" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <nav class="navbar">
    <div class="container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
      <a href="../index.html" class="nav-brand">
        <i class="fa-solid fa-calculator" style="color:var(--primary);"></i>
        <span>TrueHourly<span style="color:var(--primary);">Rate</span></span>
      </a>
      <ul class="nav-links">
        <li><a href="../index.html">계산기 홈</a></li>
        <li><a href="../index.html#articles">가이드 목록</a></li>
      </ul>
    </div>
  </nav>

  <main class="container" style="padding: 60px 0; max-width: 860px;">
    <span class="article-tag">${a.tag}</span>
    <h1 style="font-size: 2.4rem; font-weight:800; margin: 12px 0 20px; line-height:1.3;">
      ${a.title}
    </h1>
    <div class="article-meta" style="margin-bottom: 32px; padding-bottom: 16px; border-bottom:1px solid var(--border-color);">
      <span>작성자: TrueHourlyRate 재무분석팀</span> • 
      <span>읽는 시간: 약 ${a.minutes}분</span> • 
      <span>발행일: 2026년 7월 30일</span>
    </div>

    <article style="line-height: 1.8; font-size: 1.05rem; color: var(--text-main);">
      <p style="margin-bottom: 24px;">
        ${a.desc}
      </p>
      ${sections}
      <div style="margin-top: 40px; text-align: center;">
        <a href="../index.html#calculator" class="btn btn-primary" style="width: auto; padding: 14px 32px;">
          <i class="fa-solid fa-calculator"></i> 지금 내 진짜 시급 계산하기
        </a>
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="container" style="text-align:center;">
      &copy; 2026 TrueHourlyRate. All rights reserved. · <a href="https://pomyjo.com" style="color:inherit;">pomyjo.com</a>
    </div>
  </footer>
</body>
</html>
`;
}

const dir = path.join(__dirname, "articles");
for (const a of articles) {
  const out = path.join(dir, a.file);
  fs.writeFileSync(out, page(a), "utf8");
  console.log("wrote", a.file, fs.statSync(out).size);
}

// fix canonical on existing guide
const guide = path.join(dir, "true-hourly-rate-guide.html");
let g = fs.readFileSync(guide, "utf8");
g = g.replace(
  /https:\/\/pomyjo\.com\/articles\//g,
  "https://true-hourly-rate.pomyjo.com/articles/"
);
fs.writeFileSync(guide, g, "utf8");
console.log("fixed guide canonical");
