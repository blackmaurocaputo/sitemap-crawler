function extractUrlsFromSitemap(xmlText) {
  const urlPattern = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlPattern.exec(xmlText)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

module.exports = { extractUrlsFromSitemap };
