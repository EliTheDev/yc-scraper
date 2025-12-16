(() => {
  function normalizeBatch(batchText) {
    if (!batchText) return "";

    const match = batchText.match(/(winter|spring|summer|fall)\s+(\d{4})/i);
    if (!match) return "";

    const seasonMap = {
      winter: "W",
      spring: "X",
      summer: "S",
      fall: "F"
    };

    const seasonKey = match[1].toLowerCase();
    const season = seasonMap[seasonKey];
    if (!season) return "";

    const year = match[2].slice(-2);
    return `${season}${year}`;
  }

  const rows = [];
  rows.push(["Name", "Location", "Description", "URL"].join(","));

  document.querySelectorAll('a[href^="/companies/"]').forEach(card => {
    const name =
      card.querySelector("._coName_i9oky_470")?.innerText.trim() || "";
    if (!name) return;

    const location =
      card.querySelector("._coLocation_i9oky_486")?.innerText.trim() || "";

    const description =
      card.querySelector("div.text-sm span")?.innerText.trim() || "";

    const batchText = [...card.querySelectorAll("a")]
      .map(a => a.innerText.trim())
      .find(t => /\b(20\d{2})\b/.test(t) && /winter|spring|summer|fall/i.test(t));

    const batch = normalizeBatch(batchText);
    const displayName = batch ? `${name} (${batch})` : name;

    const url = new URL(
      card.getAttribute("href"),
      window.location.origin
    ).href;

    const escapeCSV = v =>
      `"${(v || "").replace(/"/g, '""')}"`;

    rows.push([
      escapeCSV(displayName),
      escapeCSV(location),
      escapeCSV(description),
      escapeCSV(url)
    ].join(","));
  });

  const csv = rows.join("\n");
  console.log(csv);

  // Auto-download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "yc_companies.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})();
