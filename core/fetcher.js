function isvalidUrl(url) {
  try {
    const trimmedUrl = url.trim();

    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.protocol !== "https:") {
      console.log(`⚠️ URL deve essere HTTPS: ${url}`);
      return false;
    }

    if (parsedUrl.search) {
      console.log(`⚠️ URL contiene parametri: ${url}`);
      return false;
    }

    if (parsedUrl.hash) {
      console.log(`⚠️ URL contiene hash: ${url}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(`❌ URL malformata: ${url}`);
    return false;
  }
}

async function getSiteMap(url) {
  try {
    if (!isvalidUrl(url)) {
      console.log(`❌ URL non valida: ${url}`);
      return null;
    }

    await new Promise((resolve) => {
      console.log("attesa di 300 ms");
      setTimeout(resolve, 300);
    });

    const response = await fetch(url);
    if (!response.ok) {
      console.log(`❌ Errore HTTP ${response.status} per ${url}`);
      return null;
    } else {
      const xmlText = await response.text();
      console.log(`✅ Sitemap recuperata da ${url}`);
      return xmlText;
    }
  } catch (error) {
    console.log(
      `❌ Errore nel recupero della sitemap da ${url}:`,
      error.message
    );
    return null;
  }
}

module.exports = { getSiteMap };
