# 🕷️ Finder - Sitemap Web Crawler

Un crawler leggero e modulare che esplora il web attraverso le sitemap dei siti, indicizzando automaticamente migliaia di URL in modo organizzato.

## 📋 Indice

- [Descrizione](#-descrizione)
- [Caratteristiche](#-caratteristiche)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Installazione](#-installazione)
- [Configurazione](#-configurazione)
- [Utilizzo](#-utilizzo)
- [API Moduli](#-api-moduli)
- [Formato Dati](#-formato-dati)
- [Esempi](#-esempi)
- [Limitazioni](#-limitazioni)
- [Roadmap](#-roadmap)

---

## 🎯 Descrizione

**Finder** è un web crawler basato su sitemap che permette di:
- Scoprire automaticamente URL da sitemap XML
- Indicizzare i risultati in modo strutturato
- Evitare duplicati e gestire errori
- Rispettare i server target con rate limiting

Ideale per:
- Ricerca di contenuti specifici su più siti
- Analisi SEO e struttura siti
- Aggregazione contenuti
- Monitoraggio cambiamenti sitemap

---

## ✨ Caratteristiche

### Core
- ✅ **Crawling automatico** di sitemap XML
- ✅ **Validazione URL** (solo HTTPS, no parametri/hash)
- ✅ **Rate limiting** (300ms tra richieste)
- ✅ **Gestione errori** robusta (HTTP, rete, parsing)
- ✅ **Deduplicazione** automatica URL

### Indice
- ✅ **Salvataggio strutturato** in JSON
- ✅ **Metadati** per ogni sito (data crawling, conteggio URL)
- ✅ **Statistiche** aggregate (totali, medie)
- ✅ **Aggiornamento incrementale** siti esistenti

### Performance
- ⚡ **Esecuzione sequenziale** controllata
- 📊 **Log dettagliati** in tempo reale
- 💾 **Persistenza** su disco

---

## 📂 Struttura del Progetto

```
finder/
├── index.js                 # Entry point principale
├── core/                    # Moduli core
│   ├── fetcher.js          # Download sitemap
│   ├── parsers.js          # Parsing XML → URL
│   ├── indexer.js          # Indicizzazione e salvataggio
│   └── searcher.js         # Ricerca (futuro)
├── database/               # Storage dati
│   ├── urls.json          # Lista siti da crawlare
│   └── indice.json        # Indice risultati
├── package.json
└── README.md
```

---

## 🚀 Installazione

### Prerequisiti
- **Node.js** >= 18.0.0 (per supporto `fetch` nativo)
- **npm** o **yarn**

### Setup

```bash
# Clone repository
git clone https://github.com/blackmaurocaputo/sitemap-crawler.git
cd scrapling-sitemap

# Installa dipendenze (se necessario)
npm install

# Verifica installazione
node --version  # Deve essere >= 18
```

---

## ⚙️ Configurazione

### 1. Configura Lista Siti

Modifica `database/urls.json`:

```json
{
  "urls": [
    "https://example.com/sitemap.xml",
    "https://another-site.com/sitemap.xml",
    "https://blog.example.org/sitemap_index.xml"
  ]
}
```

### 2. Parametri Rate Limiting (opzionale)

In `core/fetcher.js`, modifica il delay:

```javascript
// Cambia da 300ms a valore desiderato
setTimeout(resolve, 300);  // ← Modifica qui
```

---

## 💻 Utilizzo

### Esecuzione Base

```bash
node index.js
```

### Output Esempio

```
🚀 Inizio crawling di 3 siti...

[1/3] Processing: https://example.com/sitemap.xml

⏳ Attesa di 300 ms
✅ Sitemap recuperata da https://example.com/sitemap.xml
📊 Trovati 1247 URL
➕ Nuovo sito aggiunto: https://example.com/sitemap.xml

[2/3] Processing: https://another-site.com/sitemap.xml
...

💾 Indice salvato: 3 siti, 3891 URL totali

✅ Crawling completato!
📈 Statistiche:
   - Siti processati: 3
   - URL totali: 3891
   - Media URL per sito: 1297
   - Ultimo aggiornamento: 2025-10-17T10:30:45.123Z
```

---

## 🔧 API Moduli

### `fetcher.js`

#### `getSiteMap(url)`
Scarica una sitemap da URL.

```javascript
const { getSiteMap } = require('./core/fetcher');

const sitemap = await getSiteMap('https://example.com/sitemap.xml');
// Returns: XML string o null se errore
```

**Validazioni:**
- ✅ Solo HTTPS
- ✅ Nessun parametro query
- ✅ Nessun hash/fragment

---

### `parsers.js`

#### `extractUrlsFromSitemap(xmlText)`
Estrae array di URL da XML sitemap.

```javascript
const { extractUrlsFromSitemap } = require('./core/parsers');

const urls = extractUrlsFromSitemap(xmlText);
// Returns: ['https://example.com/page1', 'https://example.com/page2', ...]
```

---

### `indexer.js`

#### `Indexer`
Classe per gestione indice.

```javascript
const { Indexer } = require('./core/indexer');

const indexer = new Indexer('./database');

// Carica indice esistente
await indexer.load();

// Aggiungi sito
await indexer.addSite('https://example.com/sitemap.xml', ['url1', 'url2']);

// Salva su disco
await indexer.save();

// Ottieni statistiche
const stats = indexer.getStats();
console.log(stats);
// {
//   totalSites: 5,
//   totalUrls: 12847,
//   lastUpdate: "2025-10-17T...",
//   averageUrlsPerSite: 2569
// }
```

---

## 📊 Formato Dati

### `database/urls.json` (Input)

```json
{
  "urls": [
    "https://site1.com/sitemap.xml",
    "https://site2.com/sitemap.xml"
  ]
}
```

### `database/indice.json` (Output)

```json
{
  "sites": [
    {
      "source": "https://site1.com/sitemap.xml",
      "urls": [
        "https://site1.com/page1",
        "https://site1.com/page2"
      ],
      "urlCount": 2,
      "lastCrawled": "2025-10-17T10:30:45.123Z"
    }
  ],
  "totalUrls": 2,
  "lastUpdate": "2025-10-17T10:30:45.123Z"
}
```

---

## 📝 Esempi

### Crawl Singolo Sito

```javascript
const { getSiteMap } = require('./core/fetcher');
const { extractUrlsFromSitemap } = require('./core/parsers');

const sitemap = await getSiteMap('https://example.com/sitemap.xml');
const urls = extractUrlsFromSitemap(sitemap);

console.log(`Trovati ${urls.length} URL`);
```

### Filtra URL per Keyword

```javascript
const urls = extractUrlsFromSitemap(sitemap);
const blogPosts = urls.filter(url => url.includes('/blog/'));

console.log(`Trovati ${blogPosts.length} articoli blog`);
```

### Aggiorna Solo un Sito

```javascript
const indexer = new Indexer('./database');
await indexer.load();

const sitemap = await getSiteMap('https://example.com/sitemap.xml');
const urls = extractUrlsFromSitemap(sitemap);

await indexer.addSite('https://example.com/sitemap.xml', urls);
await indexer.save();
```

---

## ⚠️ Limitazioni

### Attuali
- ❌ **Crawling sequenziale** - Un sito alla volta (lento con molti URL)
- ❌ **Solo sitemap** - Non esplora link all'interno delle pagine
- ❌ **Nessun contenuto** - Raccoglie solo URL, non scarica pagine 
- ❌ **Storage JSON** - Non scalabile per milioni di URL

### Considerazioni
- **Rate limiting fisso** (300ms) - Non adattivo al server
- **Timeout assente** - Fetch può bloccarsi su server lenti
- **Nessun retry** - Un errore = sito saltato

---

## 🗺️ Roadmap

### v1.1 (Prossimo)
- [ ] Implementare `searcher.js` per ricerca keyword
- [ ] Crawling parallelo controllato (3-5 richieste simultanee)
- [ ] Timeout configurabile per fetch
- [ ] Retry logic su errori temporanei

### v1.2
- [ ] Cache sitemap per evitare re-download
- [ ] Export risultati in CSV/Excel
- [ ] Filtri avanzati (per dominio, data, tipo file)
- [ ] Progress bar durante crawling

### v2.0
- [ ] Download e analisi contenuto pagine
- [ ] Estrazione metadati (title, description, keywords)
- [ ] Database SQLite per performance
- [ ] Crawling ricorsivo controllato

### v3.0
- [ ] API REST per query remote
- [ ] Dashboard web per visualizzazione
- [ ] Scheduling automatico (cron jobs)
- [ ] Clustering per grandi volumi

---

## 📄 Licenza

MIT License - Vedi `LICENSE` file per dettagli.

---

## 🤝 Contributi

Contributi benvenuti! Per favore:
1. Fai fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

---

## 📧 Contatti

Per domande, bug report o feature request, apri una issue su GitHub.

---

**Buon crawling! 🕷️**