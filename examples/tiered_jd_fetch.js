// tiered_jd_fetch.js
// Real detection logic, trimmed from fetch_page_text.js: how JOS decides
// whether a job-description fetch actually succeeded, versus quietly
// hitting a login wall or a bot-detection page and returning junk.
//
// Context: job boards vary wildly in how they block automated fetches.
// Some redirect to a login page, some serve a bot-wall interstitial with
// a normal HTTP 200, some just render nothing useful. Treating any of
// these as "success" would feed the qualification step garbage text and
// silently produce wrong filtering decisions. Each fetch goes through
// three tiers before giving up on a listing entirely: a pre-fetched JD
// (from an earlier board scrape), an email-alert snippet as fallback,
// then a live fetch, checked with the logic below before it's trusted.

const LOGIN_URL_PATTERNS = ['/login', '/authwall', '/checkpoint', '/uas/login', '/signin', '/sign-in'];
const BOT_WALL_MARKERS = [
  'access denied', 'request unsuccessful', 'verify you are human',
  'are you a robot', 'captcha', 'cloudflare', 'pardon our interruption',
];

function detectLogin(finalUrl, bodyText) {
  const urlHit = LOGIN_URL_PATTERNS.some(p => finalUrl.toLowerCase().includes(p));
  const t = (bodyText || '').slice(0, 600).toLowerCase();
  // A short page that also *talks* like a login page (in English or
  // Hebrew) counts too: some boards don't bother with a distinct URL.
  const textHit = (bodyText || '').length < 800 &&
    (t.includes('sign in') || t.includes('log in') || t.includes('התחבר'));
  return urlHit || textHit;
}

function detectBotWall(bodyText) {
  const t = (bodyText || '').slice(0, 1000).toLowerCase();
  // Gate on page length too: a long page that happens to mention
  // "captcha" somewhere isn't a bot-wall; a genuine bot-wall page is short.
  return (bodyText || '').length < 1500 && BOT_WALL_MARKERS.some(m => t.includes(m));
}

// Called after a fetch completes. A bot-wall gets one automatic retry with
// a fresh browser launch (not the same navigation) before falling back,
// since some boards only bot-wall the first hit from a cold session. A
// genuine login wall doesn't get retried; the caller falls back to
// whatever snippet it already captured from the original alert email.
function classifyFetchResult(finalUrl, bodyText) {
  if (detectLogin(finalUrl, bodyText)) return 'login-required';
  if (detectBotWall(bodyText)) return 'bot-wall';
  return 'ok';
}

module.exports = { detectLogin, detectBotWall, classifyFetchResult };
