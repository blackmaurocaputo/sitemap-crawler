const fs = require("node:fs/promises");
const path = require("path");

class Indexer {
  constructor(dbPath) {
    this.IndexPath = path.join(dbPath, "indice.json");
    this.index = {
      sites: [],
      totalUrls: 0,
      lastUpdate: null,
    };
  }

  async load() {
    try {
      const data = await fs.readFile(this.IndexPath, "utf-8");
      this.index = JSON.parse(data);
      console.log(`📂 Indice caricato: ${this.index.totalUrls} URL totali`);
    } catch (error) {
      console.log("📝 Creazione nuovo indice");
      this.index = {
        sites: [],
        totalUrls: 0,
        lastUpdate: null,
      };
    }
  }

  async addSite(siteUrl, urls) {
    const uniqueUrls = [...new Set(urls)];

    const existingSiteIndex = this.index.sites.findIndex(
      (site) => site.source === siteUrl
    );

    const siteData = {
      source: siteUrl,
      urls: uniqueUrls,
      urlCount: uniqueUrls.length,
      lastCrawled: new Date().toISOString(),
    };

    if (existingSiteIndex >= 0) {
      console.log(`🔄 Aggiornamento sito esistente: ${siteUrl}`);
      this.index.sites[existingSiteIndex] = siteData;
    } else {
      console.log(`➕ Nuovo sito aggiunto: ${siteUrl}`);
      this.index.sites.push(siteData);
    }

    this.index.totalUrls = this.index.sites.reduce(
      (sum, site) => sum + site.urlCount,
      0
    );

    this.index.lastUpdate = new Date().toISOString();
  }

  async save() {
    try {
      await fs.writeFile(
        this.IndexPath,
        JSON.stringify(this.index, null, 2),
        "utf-8"
      );
      console.log(
        `💾 Indice salvato: ${this.index.sites.length} siti, ${this.index.totalUrls} URL totali`
      );
    } catch (error) {
      console.error("❌ Errore nel salvataggio dell'indice:", error.message);
    }
  }

  getStats() {
    return {
      totalSites: this.index.sites.length,
      totalUrls: this.index.totalUrls,
      lastUpdate: this.index.lastUpdate,
      averageUrlsPerSite:
        Math.round(this.index.totalUrls / this.index.sites.length) || 0,
    };
  }
}

module.exports = { Indexer };
