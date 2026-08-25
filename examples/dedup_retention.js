// dedup_retention.js
// Real code, lightly trimmed from sheetsReader.js: how JOS builds the
// deduplication reference the agent checks every new posting against,
// without letting that reference file grow forever.
//
// Context: every Phase 1 run needs to know "have I already applied to
// this?", checked against a live Google Sheet of tracked applications.
// Naively dumping the whole sheet every run works at first, but the file
// gets re-read into the agent's context on every single run, so it grows
// (and costs more) forever as application history accumulates over years.
// The fix: cap retention well past the window the dedup *decision* logic
// actually needs, so repost-detection for older applications keeps
// working, but the file stops growing unboundedly.

function parseDate(raw) {
  if (!raw) return null;
  const s = raw.trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);           // YYYY-MM-DD
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);              // MM/DD/YYYY
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
  return null;
}

// Called before every Phase 1 run. The agent never talks to the Sheets
// API directly, which keeps that MCP connection out of its context entirely.
async function dumpDedupKeys(sheetsClient, config) {
  const result = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: `${config.SHEET_TAB_JOBS}!A2:D`,
  });

  const retentionMonths = config.DEDUP_FILE_RETENTION_MONTHS || 18;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - retentionMonths);
  cutoff.setHours(0, 0, 0, 0); // midnight: parseDate() always returns midnight,
  // so comparing against "now" (with today's time-of-day still attached)
  // would wrongly exclude a row dated exactly `retentionMonths` ago.

  const rawRows = result.data.values || [];
  const rows = rawRows
    // Compact array rows, not objects: this file is read into the agent's
    // context every run, so repeated JSON keys per row are pure waste.
    .map(r => [(r[0] || '').trim(), (r[1] || '').trim(), (r[2] || '').trim(), (r[3] || '').trim()])
    .filter(r => r[1] || r[2] || r[3])
    .filter(r => {
      const d = parseDate(r[0]);
      // Keep anything with an unparseable/blank date rather than silently
      // dropping something that might be real, the same "when unsure,
      // don't discard" principle the qualification rules use throughout.
      return !d || d >= cutoff;
    });

  return {
    generatedAt: new Date().toISOString(),
    retentionMonths,
    columns: ['date', 'company', 'url', 'title'],
    rows,
  };
}

module.exports = { parseDate, dumpDedupKeys };
