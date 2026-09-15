// True Hourly Rate Engine
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const incomeType = document.getElementById('incomeType');
  const incomeVal = document.getElementById('incomeVal');
  const bonusVal = document.getElementById('bonusVal');
  const weeklyHours = document.getElementById('weeklyHours');
  const overtimeHours = document.getElementById('overtimeHours');
  const commuteMinutes = document.getElementById('commuteMinutes');
  const prepMinutes = document.getElementById('prepMinutes');
  const commuteCost = document.getElementById('commuteCost');
  const stressCost = document.getElementById('stressCost');
  const taxRate = document.getElementById('taxRate');

  // Displays
  const trueHourlyDisplay = document.getElementById('trueHourlyDisplay');
  const grossHourlyDisplay = document.getElementById('grossHourlyDisplay');
  const diffPercentageDisplay = document.getElementById('diffPercentageDisplay');
  const annualTrueIncomeDisplay = document.getElementById('annualTrueIncomeDisplay');
  const totalWorkHoursDisplay = document.getElementById('totalWorkHoursDisplay');
  const totalWorkExpensesDisplay = document.getElementById('totalWorkExpensesDisplay');

  // Equivalents
  const eqCoffeeTime = document.getElementById('eqCoffeeTime');
  const eqTaxiTime = document.getElementById('eqTaxiTime');
  const eqPhoneHours = document.getElementById('eqPhoneHours');
  const aiDiagnosisText = document.getElementById('aiDiagnosisText');

  // Input Event Listeners
  const allInputs = [
    incomeType, incomeVal, bonusVal, weeklyHours, overtimeHours,
    commuteMinutes, prepMinutes, commuteCost, stressCost, taxRate
  ];

  allInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateTrueRate);
      input.addEventListener('change', calculateTrueRate);
    }
  });

  // Calculate Function
  function calculateTrueRate() {
    // 1. Income
    let rawIncome = parseFloat(incomeVal.value) || 0;
    let bonus = parseFloat(bonusVal.value) || 0;
    let type = incomeType.value; // 'annual' or 'monthly'

    let grossAnnualIncome = type === 'monthly' ? (rawIncome * 12) + bonus : rawIncome + bonus;
    
    // Tax
    let taxPercent = parseFloat(taxRate.value) || 15;
    let netAnnualIncomeAfterTax = grossAnnualIncome * (1 - taxPercent / 100);

    // 2. Time (per week & annual)
    let wHours = parseFloat(weeklyHours.value) || 40;
    let oHours = parseFloat(overtimeHours.value) || 0;
    let cMinsDaily = parseFloat(commuteMinutes.value) || 60; // roundtrip
    let pMinsDaily = parseFloat(prepMinutes.value) || 30;

    let dailyExtraHours = (cMinsDaily + pMinsDaily) / 60;
    let totalWeeklyHours = wHours + oHours + (dailyExtraHours * 5);
    let totalAnnualHours = totalWeeklyHours * 52;

    // 3. Expenses
    let cCostDaily = parseFloat(commuteCost.value) || 3000;
    let sCostDaily = parseFloat(stressCost.value) || 5000; // coffee/stress

    let annualWorkExpenses = (cCostDaily + sCostDaily) * 5 * 52;

    // 4. Net True Income
    let trueNetAnnualIncome = netAnnualIncomeAfterTax - annualWorkExpenses;

    // 5. Rates
    let grossStandardHours = wHours * 52;
    let grossHourlyRate = grossStandardHours > 0 ? (grossAnnualIncome / grossStandardHours) : 0;
    let trueHourlyRate = totalAnnualHours > 0 ? (trueNetAnnualIncome / totalAnnualHours) : 0;

    if (trueHourlyRate < 0) trueHourlyRate = 0;

    // Difference %
    let diffPercent = grossHourlyRate > 0 
      ? Math.round(((trueHourlyRate - grossHourlyRate) / grossHourlyRate) * 100)
      : 0;

    // Format & Render
    trueHourlyDisplay.textContent = Math.round(trueHourlyRate).toLocaleString() + ' 원';
    grossHourlyDisplay.textContent = Math.round(grossHourlyRate).toLocaleString() + ' 원';
    annualTrueIncomeDisplay.textContent = Math.round(trueNetAnnualIncome / 10000).toLocaleString() + ' 만원';
    totalWorkHoursDisplay.textContent = Math.round(totalAnnualHours).toLocaleString() + ' 시간';
    totalWorkExpensesDisplay.textContent = Math.round(annualWorkExpenses / 10000).toLocaleString() + ' 만원';

    // Diff Badge
    if (diffPercentageDisplay) {
      diffPercentageDisplay.textContent = `${diffPercent}% (표면 시급 대비 차이)`;
      if (diffPercent < 0) {
        diffPercentageDisplay.className = 'result-diff negative';
      } else {
        diffPercentageDisplay.className = 'result-diff positive';
      }
    }

    // Equivalent Items
    if (trueHourlyRate > 0) {
      let minsPerCoffee = Math.round((5000 / trueHourlyRate) * 60);
      let minsPerTaxi = Math.round((5000 / trueHourlyRate) * 60);
      let hoursPerPhone = (1500000 / trueHourlyRate).toFixed(1);

      eqCoffeeTime.textContent = `${minsPerCoffee} 분`;
      eqTaxiTime.textContent = `${minsPerTaxi} 분`;
      eqPhoneHours.textContent = `${hoursPerPhone} 시간`;
    }

    // AI Diagnosis Text Generation
    generateAIDiagnosis(trueHourlyRate, grossHourlyRate, cMinsDaily, sCostDaily);
    updateShareHook(trueHourlyRate, grossHourlyRate);
  }

  function generateAIDiagnosis(trueRate, grossRate, commuteMins, stressCostVal) {
    if (!aiDiagnosisText) return;

    let gap = grossRate - trueRate;
    let minWage2026 = 10320; // 2026 minimum wage reference

    let advice = '';
    if (trueRate < minWage2026) {
      advice = `⚠️ <strong>경고:</strong> 출퇴근 시간과 직장 스트레스 비용을 포함한 실제 시급(${Math.round(trueRate).toLocaleString()}원)이 2026년 최저시급(10,320원)보다 낮습니다! 출퇴근 시간 단축이나 고정비 절감이 시급합니다.`;
    } else if (gap > 5000) {
      advice = `💡 <strong>개선 필요:</strong> 표면 시급과 실제 시급 차이가 시간당 ${Math.round(gap).toLocaleString()}원이나 발생하고 있습니다. 일일 출퇴근 시간(${commuteMins}분)과 무의식적 직장 스트레스 지출을 줄이면 실질 소득이 크게 늘어납니다.`;
    } else {
      advice = `✅ <strong>양호:</strong> 시간 관리와 지출 효율성이 뛰어난 편입니다! 주당 노동 시간과 이동 시간이 합리적으로 통제되고 있습니다.`;
    }

    aiDiagnosisText.innerHTML = advice;
  }

  const MIN_WAGE_2026 = 10320;
  const shareHookLine = document.getElementById('shareHookLine');
  const shareHint = document.getElementById('shareHint');

  function updateShareHook(trueRate, grossRate) {
    if (!shareHookLine) return;
    const trueRounded = Math.round(trueRate);
    const grossRounded = Math.round(grossRate);
    let line = '';
    if (trueRounded < MIN_WAGE_2026) {
      line = `진짜 시급 ${trueRounded.toLocaleString()}원 — 2026 최저시급(10,320원)보다 낮아요.`;
    } else if (grossRounded > 0 && trueRounded < grossRounded) {
      const drop = grossRounded - trueRounded;
      line = `명목 ${grossRounded.toLocaleString()}원 → 진짜 ${trueRounded.toLocaleString()}원 (시간·비용으로 ${drop.toLocaleString()}원 깎임).`;
    } else if (grossRounded > 0) {
      line = `진짜 시급 ${trueRounded.toLocaleString()}원 — 명목(${grossRounded.toLocaleString()}원)과 비슷하게 지켜지고 있어요.`;
    } else {
      line = `진짜 시급 ${trueRounded.toLocaleString()}원. 숫자를 넣으면 명목·최저시급과 비교돼요.`;
    }
    shareHookLine.textContent = line;
  }

  function sharePayload() {
    const rateText = trueHourlyDisplay ? trueHourlyDisplay.textContent : '';
    const hook = shareHookLine ? shareHookLine.textContent : '';
    return {
      title: '내 진짜 시급 | POMYJO',
      text: hook || `내 진짜 시급은 ${rateText}입니다. 출퇴근·비용을 넣으면 숫자가 달라져요.`,
      url: 'https://true-hourly-rate.pomyjo.com/',
    };
  }

  function showShareHint(msg) {
    if (!shareHint) return;
    shareHint.hidden = false;
    shareHint.textContent = msg;
    clearTimeout(showShareHint._t);
    showShareHint._t = setTimeout(() => { shareHint.hidden = true; }, 2200);
  }

  async function copyShareLink() {
    const { text, url } = sharePayload();
    const clip = `${text}\n${url}`;
    try {
      await navigator.clipboard.writeText(clip);
      showShareHint('결과 한 줄 + 링크를 복사했어요.');
    } catch (e) {
      showShareHint('복사에 실패했어요. 주소창 링크를 직접 공유해 주세요.');
    }
  }

  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const payload = sharePayload();
      if (navigator.share) {
        try {
          await navigator.share(payload);
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return;
        }
      }
      await copyShareLink();
    });
  }

  const copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => { copyShareLink(); });
  }

  // Initial Calculation (after share hook helpers exist)
  calculateTrueRate();
});
