const { getSiteMap } = require("./core/fetcher");
const { extractUrlsFromSitemap } = require("./core/parsers");
const { Indexer } = require("./core/indexer");
const fs = require("node:fs/promises");
const path = require("path");

async function main() {
  const dbPath = path.join(__dirname, "database");
  const urlsFile = path.join(dbPath, "urls.json");

  const indexer = new Indexer(dbPath);
  await indexer.load();

  const urlsData = await fs.readFile(urlsFile, "utf-8");
  const { urls } = JSON.parse(urlsData);

  console.log(`\n🚀 Inizio crawling di ${urls.length} siti...\n`);

  for (let i = 0; i < urls.length; i++) {
    console.log(`\n[${i + 1}/${urls.length}] Processing: ${urls[i]}\n`);

    const sitemap = await getSiteMap(urls[i]);

    if (sitemap) {
      const extractedUrls = extractUrlsFromSitemap(sitemap);
      console.log(`📊 Trovati ${extractedUrls.length} URL`);

      await indexer.addSite(urls[i], extractedUrls);
    }
  }

  await indexer.save();

  const stats = indexer.getStats();
  console.log(`\n✅ Crawling completato!`);
  console.log(`📈 Statistiche:`);
  console.log(`   - Siti processati: ${stats.totalSites}`);
  console.log(`   - URL totali: ${stats.totalUrls}`);
  console.log(`   - Media URL per sito: ${stats.averageUrlsPerSite}`);
  console.log(`   - Ultimo aggiornamento: ${stats.lastUpdate}`);
}

main().catch(console.error);
