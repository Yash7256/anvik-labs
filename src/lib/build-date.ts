// Refreshed at build time so generated SEO metadata never advertises a stale date.
const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");

export const buildDate = `${now.getFullYear()}-${month}-${day}`;
