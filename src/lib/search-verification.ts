// Verification tokens come from each search engine's webmaster console.
// Add the matching Vite env var in Vercel, then redeploy; empty values render no tag.
export const searchVerification = {
  google:
    import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ??
    "YKwDO53XArYWQP27b8PIS4l1ALXtKu3OeDreuFCzuN4",
  bing: import.meta.env.VITE_BING_SITE_VERIFICATION ?? "",
  yandex: import.meta.env.VITE_YANDEX_SITE_VERIFICATION ?? "",
  baidu: import.meta.env.VITE_BAIDU_SITE_VERIFICATION ?? "",
  naver: import.meta.env.VITE_NAVER_SITE_VERIFICATION ?? "",
  pinterest: import.meta.env.VITE_PINTEREST_SITE_VERIFICATION ?? "",
};
