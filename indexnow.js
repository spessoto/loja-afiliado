import { SITE_URL } from "./seo.js";

export const INDEXNOW_KEY = "112bdd29f34c44699320e2e8ff960709";

export function submitToIndexNow(paths) {
  const list = (Array.isArray(paths) ? paths : [paths]).map(p => (p.startsWith("http") ? p : `${SITE_URL}${p}`));
  if (list.length === 0) return;
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: list
    })
  }).catch(() => {});
}
