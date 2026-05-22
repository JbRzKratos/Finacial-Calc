/** Centralized logging for calculator calculations */
export function logCalculatorUsage(calcId: string, result: string, inputsSummary?: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateStr = now.toISOString().split("T")[0];

  try {
    // 1. Update last used (single entry per calculator ID for backward compatibility)
    const rawLast = localStorage.getItem("calc_last_used") || "{}";
    const lastUsed = JSON.parse(rawLast);
    lastUsed[calcId] = { result, timestamp, dateStr, inputsSummary };
    localStorage.setItem("calc_last_used", JSON.stringify(lastUsed));

    // 2. Append to chronological list history
    const rawList = localStorage.getItem("calc_history_list") || "[]";
    const historyList = JSON.parse(rawList);

    // Throttling rapid reactive changes (e.g. typing or dragging sliders)
    const lastEntry = historyList[historyList.length - 1];
    const nowMillis = Date.now();

    if (lastEntry && lastEntry.calcId === calcId && (nowMillis - lastEntry.timestampMillis) < 2000) {
      lastEntry.result = result;
      lastEntry.inputsSummary = inputsSummary;
      lastEntry.timestamp = timestamp;
      lastEntry.dateStr = dateStr;
      lastEntry.timestampMillis = nowMillis;
    } else {
      historyList.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        calcId,
        result,
        inputsSummary,
        timestamp,
        dateStr,
        timestampMillis: nowMillis
      });
    }

    localStorage.setItem("calc_history_list", JSON.stringify(historyList));
  } catch {
    // silent — localStorage may be unavailable in private browsing
  }
}

