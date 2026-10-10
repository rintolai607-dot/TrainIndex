// Add or edit entries here to grow the dashboard without changing its layout.
const categories = [
  { id: "live-departures", title: "Live Departures", group: "live", icon: "⏱️", description: "Live National Rail and TfL times", nav: "Live departures" },
  { id: "scr-trains", title: "SCR Trains", group: "scr", icon: "🚆", description: "Fleet, classes and train details", nav: "Trains" },
  { id: "scr-stations", title: "SCR Stations", group: "scr", icon: "🚉", description: "Stations, facilities and locations", nav: "Stations" },
  { id: "scr-routes", title: "SCR Routes", group: "scr", icon: "🛤️", description: "Lines, connections and journeys", nav: "Routes" },
  { id: "bus-routes", title: "Bus Routes", group: "croydon", icon: "🚌", description: "Routes serving Croydon and beyond", nav: "Bus routes" },
  { id: "bus-types", title: "Bus Types", group: "croydon", icon: "🚍", description: "Vehicles, operators and fleet info", nav: "Bus types" },
  { id: "bus-stops", title: "Bus Stops", group: "croydon", icon: "🚏", description: "Stops, locations and connections", nav: "Bus stops" },
  { id: "tfl-bus-routes", title: "TfL Bus Routes", group: "tfl", icon: "🚍", description: "Real-world London bus routes from TfL", nav: "TfL bus routes" },
  { id: "custom-bus-routes", title: "My Bus Routes", group: "personal", icon: "✎", description: "Create and save your own named routes", nav: "My bus routes" },
  { id: "custom-train-routes", title: "My Train Routes", group: "personal", icon: "🚆", description: "Plot and save your own train routes", nav: "My train routes" },
  { id: "tfl-bus-fleet", title: "TfL Bus Fleet", group: "tfl", icon: "🚌", description: "Bus types, powertrains and fleet facts", nav: "TfL bus fleet" },
  { id: "tfl-rail-fleet", title: "TfL Trains", group: "tfl", icon: "🚈", description: "Elizabeth line and London Overground train fleets", nav: "TfL trains" },
  { id: "mainline-stations", title: "Mainline Stations", group: "mainline", icon: "🚉", description: "National Rail stations and facilities", nav: "Mainline stations" },
  { id: "mainline-lines", title: "Mainline Lines", group: "mainline", icon: "🛤️", description: "Britain's principal railway routes", nav: "Mainline lines" },
  { id: "mainline-fleet", title: "Mainline Fleet", group: "mainline", icon: "🚆", description: "Real-world train classes and operators", nav: "Mainline fleet" },
  { id: "lu-stations", title: "London Underground Stations", group: "tfl", icon: "🚉", description: "Stations, interchanges and facilities", nav: "LU stations" },
  { id: "lu-lines", title: "London Underground Lines", group: "tfl", icon: "🚇", description: "Lines, termini and station sequences", nav: "LU lines" },
  { id: "lu-fleet", title: "London Underground Fleet", group: "tfl", icon: "🚇", description: "Tube stock grouped by line", nav: "LU fleet" }
];

const appView = document.querySelector("#app-view");
const sidebar = document.querySelector("#sidebar-categories");
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const breadcrumbs = document.querySelector("#breadcrumbs");
const profileDialog = document.querySelector("#profile-dialog");
const profileForm = document.querySelector("#profile-form");
const recordDialog = document.querySelector("#record-dialog");
const recordForm = document.querySelector("#record-form");
const profileDefaults = { profileId: "", name: "", handle: "", color: "#087e78", pictureUrl: "", pictureId: "", pictureTitle: "" };
let profile = loadProfile();
let offlineFriends = loadOfflineFriends();
let selectedProfilePicture = { url: "", id: "", title: "" };
let database = loadDatabase();
try { localStorage.removeItem("transitIndexOpenTabs"); } catch { /* Previous tab preference is no longer used. */ }
let sidebarCollapsed = false;
try { sidebarCollapsed = localStorage.getItem("transitIndexSidebarCollapsed") === "true"; } catch { /* Default to an expanded sidebar. */ }
let editingRecordId = null;
let tflFetchActive = false;
let selectedOperator = "All";
let detailViewToken = 0;
let currentOpenDetail = null;
let routeBuilderMap = null;
let detailRouteMap = null;

function loadDatabase() {
  try {
    const saved = JSON.parse(localStorage.getItem("transitIndexRecords") || "null");
    if (saved && typeof saved === "object") {
      saved.deletedRecords ||= {};
      const legacyTrainIds = { "scr-train-165": "scr-train-waterline-165", "scr-train-168": "scr-train-stepford-connect-168", "scr-train-170": "scr-train-stepford-connect-170" };
      if (Array.isArray(saved["scr-trains"])) saved["scr-trains"] = saved["scr-trains"].map(entry => legacyTrainIds[entry.id] ? { ...entry, id: legacyTrainIds[entry.id], operator: entry.operator || (entry.id === "scr-train-165" ? "Waterline" : "Stepford Connect") } : entry);
      for (const [categoryId, entries] of Object.entries(window.TRANSPORT_SEED || {})) {
        if (!Array.isArray(saved[categoryId])) saved[categoryId] = JSON.parse(JSON.stringify(entries));
        else {
          const deleted = new Set(saved.deletedRecords[categoryId] || []);
          for (const entry of JSON.parse(JSON.stringify(entries))) {
            const index = saved[categoryId].findIndex(existing => existing.id === entry.id);
            if (index < 0 && !deleted.has(entry.id)) saved[categoryId].push(entry);
            else {
              const isUneditedSeed = !saved[categoryId][index].origin;
              if (isUneditedSeed && categoryId === "bus-routes") {
                for (const field of ["origin", "destination", "routeNumber", "axis"]) {
                  if (entry[field] !== undefined && saved[categoryId][index][field] === undefined) saved[categoryId][index][field] = entry[field];
                }
                if (entry.sourceUrl && saved[categoryId][index].sourceUrl?.endsWith("/Bus_Routes")) {
                  saved[categoryId][index].sourceUrl = entry.sourceUrl;
                  saved[categoryId][index].sourceTitle = entry.sourceTitle;
                  saved[categoryId][index].directoryTitle = entry.directoryTitle;
                  saved[categoryId][index].directoryUrl = entry.directoryUrl;
                }
              }
              if (isUneditedSeed && categoryId === "scr-routes" && entry.sourceUrl && saved[categoryId][index].sourceUrl?.endsWith("/List_of_Routes")) {
                saved[categoryId][index].sourceUrl = entry.sourceUrl;
                saved[categoryId][index].sourceTitle = entry.sourceTitle;
              }
              if (isUneditedSeed && categoryId === "mainline-fleet" && /^(rail-fleet-great-western-railway-175|rail-fleet-scotrail-385)$/.test(entry.id)) {
                for (const field of ["title", "details", "status", "imageUrl", "imageSourceUrl", "imageArtist", "imageQuery", "sourceTitle", "sourceUrl", "directoryTitle", "directoryUrl"]) {
                  if (entry[field] !== undefined) saved[categoryId][index][field] = entry[field];
                }
              }
              if (isUneditedSeed && categoryId === "tfl-rail-fleet") {
                for (const field of ["title", "details", "sourceTitle", "sourceUrl", "directoryTitle", "directoryUrl"]) {
                  if (entry[field] !== undefined) saved[categoryId][index][field] = entry[field];
                }
              }
              if (isUneditedSeed && categoryId === "scr-trains" && /latest (model|remesh)/i.test(entry.status || "")) {
                saved[categoryId][index].status = entry.status;
                saved[categoryId][index].details = entry.details;
              }
              if (!saved[categoryId][index].operator && entry.operator) saved[categoryId][index].operator = entry.operator;
              if (!saved[categoryId][index].directoryTitle && entry.directoryTitle) saved[categoryId][index].directoryTitle = entry.directoryTitle;
              if (!saved[categoryId][index].directoryUrl && entry.directoryUrl) saved[categoryId][index].directoryUrl = entry.directoryUrl;
              if (!saved[categoryId][index].stops && entry.stops) saved[categoryId][index].stops = entry.stops;
              if (!saved[categoryId][index].axis && entry.axis) saved[categoryId][index].axis = entry.axis;
              if (!saved[categoryId][index].lineId && entry.lineId) saved[categoryId][index].lineId = entry.lineId;
              if (!saved[categoryId][index].status && entry.status) saved[categoryId][index].status = entry.status;
            }
          }
        }
      }
      const oldCroydonOperatorCards = new Set(["croydon-operator-alighted", "croydon-operator-centro", "croydon-operator-croycoach", "croydon-operator-go-travel"]);
      const oldTfLBusSummaryCards = new Set(["tfl-bus-fleet-electric", "tfl-bus-fleet-hydrogen", "tfl-bus-fleet-hybrid", "tfl-bus-fleet-accessibility"]);
      if (Array.isArray(saved["bus-types"])) saved["bus-types"] = saved["bus-types"].filter(record => !oldCroydonOperatorCards.has(record.id) || record.origin === "custom");
      const currentTfLBusModelIds = new Set((window.TRANSPORT_SEED["tfl-bus-fleet"] || []).map(record => record.id));
      if (Array.isArray(saved["tfl-bus-fleet"])) saved["tfl-bus-fleet"] = saved["tfl-bus-fleet"].filter(record => (currentTfLBusModelIds.has(record.id) || !record.id.startsWith("tfl-bus-") && !oldTfLBusSummaryCards.has(record.id)) || record.origin === "custom");
      for (const entry of saved["mainline-lines"] || []) {
        if (["LNER and other operators", "Avanti West Coast and other operators"].includes(entry.operator)) entry.operator = "Network overview";
      }
      if (Array.isArray(saved["tfl-bus-routes"])) {
        saved["tfl-bus-routes"] = groupTfLRoutesByLine(saved["tfl-bus-routes"]);
        const deletedIds = [...(saved["tfl-bus-routes-deleted"] || []), ...(saved.deletedRecords["tfl-bus-routes"] || [])];
        saved["tfl-bus-routes-deleted"] = [...new Set(deletedIds.map(id => {
          if (String(id).startsWith("tfl-route-")) return id;
          if (!String(id).startsWith("tfl-")) return id;
          const lineId = String(id).replace(/^tfl-/, "").split("-")[0];
          return lineId ? `tfl-route-${normalizeTflRouteKey(lineId)}` : id;
        }))];
        saved.deletedRecords["tfl-bus-routes"] = saved["tfl-bus-routes-deleted"];
      }
      const tflFleetIds = new Set(["rail-fleet-elizabeth-line-345", "rail-fleet-london-overground-378", "rail-fleet-london-overground-710"]);
      if (Array.isArray(saved["mainline-fleet"])) saved["mainline-fleet"] = saved["mainline-fleet"].filter(entry => !tflFleetIds.has(entry.id) || entry.origin === "custom");
      return saved;
    }
  } catch { /* Start with the bundled community-wiki examples. */ }
  return JSON.parse(JSON.stringify(window.TRANSPORT_SEED || {}));
}

function normalizeTflRouteKey(lineId) {
  return String(lineId || "route").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function groupTfLRoutesByLine(records) {
  const custom = records.filter(record => record.origin === "custom" || !record.lineId);
  const byLine = new Map();
  for (const record of records.filter(item => item.origin !== "custom" && item.lineId)) {
    const key = String(record.lineId).toLowerCase();
    if (!byLine.has(key)) byLine.set(key, []);
    byLine.get(key).push(record);
  }
  const grouped = [...byLine.values()].map(routeRecords => {
    const first = routeRecords[0];
    const directions = routeRecords.map(record => {
      const titleDirection = record.title?.match(/(?:·|–|-)\s*(inbound|outbound)\b/i)?.[1];
      const direction = record.direction || titleDirection || "Route details";
      return `${direction.charAt(0).toUpperCase()}${direction.slice(1)}: ${record.details || ""}`;
    });
    const edited = routeRecords.find(record => record.origin === "tfl-edited");
    let cleanTitle = String(edited?.title || first.title || first.lineId).replace(/\s*(?:·|–|-)\s*(?:inbound|outbound)\b.*$/i, "").replace(/:\s*.+$/, "").trim();
    if (!/^route\b/i.test(cleanTitle)) cleanTitle = `Route ${cleanTitle}`;
    return {
      ...first,
      ...(edited || {}),
      id: `tfl-route-${normalizeTflRouteKey(first.lineId)}`,
      title: cleanTitle || String(first.lineId),
      details: [...new Set(directions)].join("\n\n"),
      lineId: first.lineId,
      direction: "",
      origin: edited ? "tfl-edited" : "tfl"
    };
  });
  return [...custom, ...grouped].sort((a, b) => a.title.localeCompare(b.title, "en-GB", { numeric: true, sensitivity: "base" }));
}

function saveDatabase() {
  localStorage.setItem("transitIndexRecords", JSON.stringify(database));
}

function safeSourceUrl(value) {
  if (!value || !value.trim()) return "";
  try {
    const url = new URL(value, location.href);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}

function safeProfileImage(value) {
  if (typeof value === "string" && value.length <= 500000 && /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(value)) return value;
  return safeSourceUrl(typeof value === "string" ? value : "");
}

const trainImageCategories = new Set(["scr-trains", "mainline-fleet", "tfl-rail-fleet", "lu-fleet", "bus-types", "tfl-bus-fleet"]);
const commonsImageCacheKey = "transitIndexVehiclePhotosV9";

function trainImageMarkup(record, category) {
  const userImageRoute = ["custom-bus-routes", "custom-train-routes"].includes(category.id);
  const imageUrl = safeProfileImage(record.imageUrl || "");
  if (!trainImageCategories.has(category.id) && !userImageRoute && !imageUrl) return "";
  if (userImageRoute && !imageUrl) return "";
  const isBus = ["bus-types", "tfl-bus-fleet", "custom-bus-routes", "bus-routes", "tfl-bus-routes"].includes(category.id);
  const cleanTitle = String(record.title || (isBus ? "bus" : "train")).split(" · ")[0];
  const query = record.imageQuery || (isBus ? (record.modelName || cleanTitle) : `${cleanTitle} ${record.operator || "railway"}`);
  const wikiClass = (record.title || "").match(/Class\s+([A-Za-z0-9]+(?:\/[A-Za-z0-9]+)?)/i)?.[1] || "";
  const usesScrWiki = category.id === "scr-trains" && wikiClass;
  const usesCentroWiki = category.id === "bus-types";
  const imageQuery = usesScrWiki ? wikiClass : usesCentroWiki ? (record.modelName || String(record.title || "bus").split(" · ")[0]) : query;
  const scrImageMode = /variant/i.test(record.status || "") ? "double variant" : /remesh/i.test(record.status || "") ? "remesh" : "new model";
  const scrOperatorCode = ({ "Stepford Connect": "CN", AirLink: "AL", Waterline: "WL", "Stepford Express": "EX", Metro: "MT" })[record.operator] || "";
  const scrUpdateQuery = usesScrWiki ? `${wikiClass} ${record.operator || ""} ${scrOperatorCode} ${record.status ? `${scrImageMode} ${record.status.match(/SCR v([\d.]+)/)?.[1] || "latest"}` : ""}` : "";
  const imageSource = usesScrWiki ? `data-scr-wiki-class="${escapeHTML(imageQuery)}" data-scr-wiki-search="${escapeHTML(scrUpdateQuery)}" data-scr-wiki-operator="${escapeHTML(scrOperatorCode)}"` : usesCentroWiki ? `data-centro-wiki-bus="${escapeHTML(imageQuery)}"` : `data-commons-query="${escapeHTML(imageQuery)}" data-image-subject="${isBus ? "bus" : "train"}"`;
  const sourceAttributes = userImageRoute || (imageUrl && !trainImageCategories.has(category.id)) ? "" : usesScrWiki ? imageSource : usesCentroWiki ? imageSource : `data-commons-query="${escapeHTML(imageQuery)}" data-image-subject="${isBus ? "bus" : "train"}"`;
  const sourceLink = safeSourceUrl(record.imageSourceUrl || "");
  const sourceLabel = record.imageArtist || (usesScrWiki || usesCentroWiki ? "Wiki image source ↗" : "Photo source ↗");
  return `<div class="record-image-block"><div class="record-image-frame"><div class="record-image-placeholder" aria-live="polite"><small>${imageUrl ? "Loading image…" : usesScrWiki || usesCentroWiki ? "Loading in-game Wiki image…" : `Loading real ${isBus ? "bus" : "train"} photo…`}</small></div><img class="record-image" ${imageUrl ? `src="${escapeHTML(imageUrl)}" data-full-image="${escapeHTML(imageUrl)}"` : ""} ${sourceAttributes} alt="${escapeHTML(record.title || (isBus ? "Bus" : "Train"))}" loading="lazy"></div><a class="record-image-source" ${sourceLink ? `href="${escapeHTML(sourceLink)}"` : "hidden"} target="_blank" rel="noopener noreferrer">${escapeHTML(sourceLabel)}</a></div>`;
}

function getCommonsImageCache() {
  try { return JSON.parse(localStorage.getItem(commonsImageCacheKey) || "{}"); }
  catch { return {}; }
}

async function findCommonsTrainImage(query, subject = "train") {
  const cache = getCommonsImageCache();
  const cacheKey = `${subject}:${query}`;
  if (Object.hasOwn(cache, cacheKey)) return cache[cacheKey];
  const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
  const search = async terms => {
    endpoint.search = new URLSearchParams({ action: "query", generator: "search", gsrsearch: terms, gsrnamespace: "6", gsrlimit: "12", prop: "imageinfo", iiprop: "url|mime|extmetadata", iiurlwidth: "640", format: "json", origin: "*" }).toString();
    const payload = await fetchImageJson(endpoint, "Wikimedia Commons");
    return Object.values(payload.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  };
  const plainText = value => { const element = document.createElement("span"); element.innerHTML = value || ""; return element.textContent.trim(); };
  const suitable = item => {
    const info = item.imageinfo?.[0];
    const summary = `${item.title || ""} ${info?.extmetadata?.ObjectName?.value || ""} ${info?.extmetadata?.ImageDescription?.value || ""}`.toLowerCase();
    return (info?.thumburl || info?.url) && /^image\/(jpeg|png|webp|gif)$/i.test(info.mime || "") && !/(map|diagram|logo|drawing|model|schematic|icon|render|cgi|artist.?s impression|computer.?generated|ai.?generated|graffiti|vandal|tagged|great british railways|gbr livery)/i.test(summary);
  };
  const describe = subject === "bus" ? `${query} London bus front three-quarter` : `${query} ${subject} front three-quarter`;
  let pages = await search(describe);
  let page = pages.find(suitable);
  if (!page) {
    pages = await search(subject === "bus" ? `${query} London bus` : `${query} ${subject}`);
    page = pages.find(suitable);
  }
  const info = page?.imageinfo?.[0];
  const image = info ? { url: info.thumburl || info.url, fullUrl: info.url, source: info.descriptionurl || "https://commons.wikimedia.org/", artist: plainText(info.extmetadata?.Artist?.value || ""), license: plainText(info.extmetadata?.LicenseShortName?.value || "") } : null;
  if (image) { cache[cacheKey] = image; try { localStorage.setItem(commonsImageCacheKey, JSON.stringify(cache)); } catch { /* Image caching is optional. */ } }
  return image;
}

async function fetchImageJson(url, service) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`${service} returned ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  throw lastError || new Error(`${service} image lookup failed`);
}

async function findCentroWikiBusImage(modelName) {
  const cacheKey = `Centro Wiki bus · ${modelName}`;
  const cache = getCommonsImageCache();
  if (Object.hasOwn(cache, cacheKey)) return cache[cacheKey];
  const api = new URL("https://centro.fandom.com/api.php");
  api.search = new URLSearchParams({ action: "query", titles: modelName.replaceAll(" ", "_"), prop: "images", imlimit: "50", format: "json", origin: "*" }).toString();
  const payload = await fetchImageJson(api, "Centro Wiki");
  const files = Object.values(payload.query?.pages || {}).flatMap(page => page.images || []).map(image => image.title)
    .filter(name => /\.(jpe?g|png|webp|gif)$/i.test(name) && !/(logo|icon|map|diagram|badge|thumbnail)/i.test(name));
  if (!files.length) return null;
  const infoApi = new URL("https://centro.fandom.com/api.php");
  infoApi.search = new URLSearchParams({ action: "query", titles: files.join("|"), prop: "imageinfo", iiprop: "url|mime", iiurlwidth: "640", format: "json", origin: "*" }).toString();
  const infoPayload = await fetchImageJson(infoApi, "Centro Wiki image lookup");
  const info = Object.values(infoPayload.query?.pages || {}).map(page => page.imageinfo?.[0]).find(item => item && /^image\/(jpeg|png|webp|gif)$/i.test(item.mime || "") && (item.thumburl || item.url));
  const image = info ? { url: info.thumburl || info.url, fullUrl: info.url, source: `https://centro.fandom.com/wiki/${encodeURIComponent(modelName.replaceAll(" ", "_"))}` } : null;
  if (image) { cache[cacheKey] = image; try { localStorage.setItem(commonsImageCacheKey, JSON.stringify(cache)); } catch { /* Optional photo cache. */ } }
  return image;
}

async function findScrWikiTrainImage(classNumber) {
  const cacheKey = `SCR Wiki main image · Class ${classNumber}`;
  const cache = getCommonsImageCache();
  if (Object.hasOwn(cache, cacheKey)) return cache[cacheKey];
  const callWiki = async params => {
    const api = new URL("https://scr.fandom.com/api.php");
    api.search = new URLSearchParams({ ...params, format: "json", origin: "*" }).toString();
    return fetchImageJson(api, "SCR Wiki");
  };
  const payload = await callWiki({ action: "query", titles: `Class_${classNumber.replaceAll("/", "_")}`, prop: "pageimages", piprop: "thumbnail|original", pithumbsize: "1280" });
  const page = Object.values(payload.query?.pages || {})[0];
  const image = page?.thumbnail?.source || page?.original?.source ? {
    url: page.thumbnail?.source || page.original.source,
    fullUrl: page.original?.source || page.thumbnail?.source,
    source: `https://scr.fandom.com/wiki/Class_${classNumber.replaceAll("/", "_")}`
  } : null;
  if (image) { cache[cacheKey] = image; try { localStorage.setItem(commonsImageCacheKey, JSON.stringify(cache)); } catch { /* Image caching is optional. */ } }
  return image;
}

function hydrateTrainImages(root) {
  const images = [...root.querySelectorAll("img[data-commons-query], img[data-scr-wiki-class], img[data-centro-wiki-bus]")];
  const findImage = image => image.dataset.scrWikiClass ? findScrWikiTrainImage(image.dataset.scrWikiClass) : image.dataset.centroWikiBus ? findCentroWikiBusImage(image.dataset.centroWikiBus) : findCommonsTrainImage(image.dataset.commonsQuery, image.dataset.imageSubject || "train");
  const cacheKeyFor = image => image.dataset.scrWikiClass ? `SCR Wiki main image · Class ${image.dataset.scrWikiClass}` : image.dataset.centroWikiBus ? `Centro Wiki bus · ${image.dataset.centroWikiBus}` : `${image.dataset.imageSubject || "train"}:${image.dataset.commonsQuery}`;
  const loadResult = async (image, retry = false) => {
    const frame = image.closest(".record-image-frame");
    if (!frame || (frame.dataset.lookupStarted && !retry)) return;
    frame.dataset.lookupStarted = "true";
    try {
      const isScr = Boolean(image.dataset.scrWikiClass);
      const isCentro = Boolean(image.dataset.centroWikiBus);
      const isBus = image.dataset.imageSubject === "bus" || isCentro;
      if (retry) {
        const cache = getCommonsImageCache();
        delete cache[cacheKeyFor(image)];
        try { localStorage.setItem(commonsImageCacheKey, JSON.stringify(cache)); } catch { /* Image cache is optional. */ }
      }
      const result = await findImage(image);
      if (!result?.url) { frame.classList.add("image-unavailable"); return; }
      image.dataset.retryCount = String(Number(image.dataset.retryCount || 0));
      image.dataset.imageSource = result.source || "";
      image.src = result.url;
      image.dataset.fullImage = result.fullUrl || result.url;
      const source = frame.querySelector(".record-image-source");
      if (source) { source.href = result.source; source.textContent = isScr ? "In-game image · SCR Wiki ↗" : isCentro ? "In-game image · Centro Wiki ↗" : `Photo: ${result.artist || "Wikimedia Commons"}${result.license ? ` · ${result.license}` : ""} ↗`; source.hidden = false; }
    } catch { frame.classList.add("image-unavailable"); }
  };
  const watch = image => {
    image.addEventListener("load", () => {
      const frame = image.closest(".record-image-frame");
      frame?.classList.remove("image-unavailable");
      frame?.classList.add("has-image");
      const option = frame?.closest(".profile-picture-option");
      if (option) option.disabled = false;
    });
    image.addEventListener("error", () => {
      const frame = image.closest(".record-image-frame");
      frame?.classList.remove("has-image");
      if (Number(image.dataset.retryCount || 0) < 1 && (image.dataset.commonsQuery || image.dataset.scrWikiClass || image.dataset.centroWikiBus)) {
        image.dataset.retryCount = String(Number(image.dataset.retryCount || 0) + 1);
        frame?.classList.remove("image-unavailable");
        image.removeAttribute("src");
        loadResult(image, true);
      } else frame?.classList.add("image-unavailable");
    });
  };
  root.querySelectorAll("img.record-image[src]").forEach(image => {
    watch(image);
    if (image.complete && image.naturalWidth > 0) image.closest(".record-image-frame")?.classList.add("has-image");
    else if (image.complete) setTimeout(() => {
      if (image.isConnected && image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event("error"));
    }, 1000);
  });
  images.filter(image => !image.getAttribute("src")).forEach(watch);
  if (!("IntersectionObserver" in window)) { images.forEach(image => { if (!image.getAttribute("src")) loadResult(image); }); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if (!entry.target.getAttribute("src")) loadResult(entry.target);
  }), { rootMargin: "180px" });
  images.forEach(image => observer.observe(image));
}

function loadProfile() {
  try {
    const saved = { ...profileDefaults, ...JSON.parse(localStorage.getItem("transitIndexProfile") || "{}") };
    saved.profileId ||= createLocalId();
    return saved;
  } catch { return { ...profileDefaults, profileId: createLocalId() }; }
}

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() || `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadOfflineFriends() {
  try {
    const saved = JSON.parse(localStorage.getItem("transitIndexOfflineFriends") || "[]");
    return Array.isArray(saved) ? saved.filter(friend => friend && typeof friend.name === "string") : [];
  } catch { return []; }
}

function saveOfflineFriends() {
  localStorage.setItem("transitIndexOfflineFriends", JSON.stringify(offlineFriends));
  renderOfflineFriends();
}

function renderOfflineFriends() {
  const list = document.querySelector("#offline-friend-list");
  if (!list) return;
  if (!offlineFriends.length) {
    list.innerHTML = '<p class="offline-friends-empty">No friend cards added yet.</p>';
    return;
  }
  list.innerHTML = offlineFriends.map((friend, index) => {
    const picture = safeProfileImage(friend.pictureUrl || "");
    const initials = friend.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join("") || "?";
    return `<article class="offline-friend"><span class="offline-friend-avatar" style="--friend-color:${escapeHTML(friend.color || "#087e78")}">${picture ? `<img src="${escapeHTML(picture)}" alt="">` : escapeHTML(initials)}</span><span class="offline-friend-name"><strong>${escapeHTML(friend.name)}</strong>${friend.handle ? `<small>${escapeHTML(friend.handle)}</small>` : ""}</span><button type="button" class="record-action delete-action" data-remove-friend="${index}" aria-label="Remove ${escapeHTML(friend.name)}">Remove</button></article>`;
  }).join("");
  list.querySelectorAll("[data-remove-friend]").forEach(button => button.addEventListener("click", () => {
    const friend = offlineFriends[Number(button.dataset.removeFriend)];
    if (!friend || !confirm(`Remove ${friend.name} from your offline friends list?`)) return;
    offlineFriends.splice(Number(button.dataset.removeFriend), 1);
    saveOfflineFriends();
  }));
}

function updateProfileUI() {
  const initials = profile.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join("") || "TD";
  const button = document.querySelector("#profile-button");
  const caption = document.querySelector("#profile-caption");
  const pictureUrl = safeProfileImage(profile.pictureUrl || "");
  button.innerHTML = pictureUrl ? `<img src="${escapeHTML(pictureUrl)}" alt="">` : initials;
  button.classList.toggle("has-picture", Boolean(pictureUrl));
  caption.innerHTML = profile.name ? `<strong>${escapeHTML(profile.name)}</strong>${profile.handle ? `<small>${escapeHTML(profile.handle)}</small>` : ""}` : "";
  button.title = profile.name ? `${profile.name}${profile.handle ? ` · ${profile.handle}` : ""}` : "Open profile settings";
  button.setAttribute("aria-label", profile.name ? `Open profile settings for ${profile.name}` : "Open profile settings");
  document.documentElement.style.setProperty("--teal", profile.color);
  document.documentElement.style.setProperty("--teal-dark", profile.color);
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function openProfile() {
  const feedback = document.querySelector("#profile-save-status");
  feedback.hidden = true;
  feedback.textContent = "";
  document.querySelector("#profile-name").value = profile.name;
  document.querySelector("#profile-handle").value = profile.handle;
  selectedProfilePicture = { url: safeProfileImage(profile.pictureUrl || ""), id: profile.pictureId || "", title: profile.pictureTitle || "" };
  document.querySelectorAll(".color-swatch").forEach(swatch => swatch.classList.toggle("selected", swatch.dataset.color === profile.color));
  renderProfilePicturePicker();
  updateProfileUploadPreview();
  renderOfflineFriends();
  profileDialog.showModal();
}

function profilePictureRecords() {
  const byId = new Map(categories.map(category => [category.id, category]));
  const recordsFor = categoryId => (database[categoryId] || []).filter(record => record && record.title);
  const representativeOperators = ["Stepford Connect", "AirLink", "Waterline", "Metro", "Stepford Express"];
  const scrTrains = representativeOperators.map(operator => recordsFor("scr-trains").find(record => record.operator === operator && /latest|new model/i.test(record.status || "")) || recordsFor("scr-trains").find(record => record.operator === operator)).filter(Boolean);
  const croydonBuses = ["Enviro 200", "Enviro 400", "MCV Evoseti", "Citaro G"].map(model => recordsFor("bus-types").find(record => (record.modelName || record.title).toLowerCase().includes(model.toLowerCase()))).filter(Boolean);
  const realTrains = [
    ...recordsFor("mainline-fleet").filter(record => /Class (390|800|801|185|220|221)/i.test(record.title)).slice(0, 2),
    ...recordsFor("tfl-rail-fleet").slice(0, 2),
    ...recordsFor("lu-fleet").slice(0, 2)
  ];
  const realBuses = recordsFor("tfl-bus-fleet").filter(record => /Enviro200|Enviro400|BD11|Routemaster|StreetDeck/i.test(record.title)).slice(0, 6);
  return [
    { title: "SCR trains", records: scrTrains, category: byId.get("scr-trains") },
    { title: "Croydon buses", records: croydonBuses, category: byId.get("bus-types") },
    { title: "Real-world trains", records: realTrains, category: byId.get("mainline-fleet") },
    { title: "Real-world buses", records: realBuses, category: byId.get("tfl-bus-fleet") }
  ];
}

function renderProfilePicturePicker() {
  const picker = document.querySelector("#profile-picture-picker");
  picker.innerHTML = profilePictureRecords().map(section => {
    const choices = section.records.map(record => {
      const id = `${section.category.id}:${record.id}`;
      const template = document.createElement("template");
      template.innerHTML = trainImageMarkup(record, section.category);
      const image = template.content.querySelector("img.record-image");
      if (!image) return "";
      image.removeAttribute("loading");
      image.classList.add("profile-choice-image");
      return `<button type="button" class="profile-picture-option ${selectedProfilePicture.id === id ? "selected" : ""}" data-picture-id="${escapeHTML(id)}" data-picture-title="${escapeHTML(record.title)}" aria-label="Choose ${escapeHTML(record.title)} profile picture" title="${escapeHTML(record.title)}" disabled><span class="record-image-frame profile-picture-frame"><span class="record-image-placeholder"><small>Loading photo…</small></span>${image.outerHTML}</span><span class="profile-picture-option-title">${escapeHTML(record.title)}</span></button>`;
    }).join("");
    return choices ? `<section class="profile-picture-group"><h3>${escapeHTML(section.title)}</h3><div class="profile-picture-options">${choices}</div></section>` : "";
  }).join("");
  const setSelection = option => {
    picker.querySelectorAll(".profile-picture-option").forEach(item => item.classList.toggle("selected", item === option));
    selectedProfilePicture = { id: option.dataset.pictureId, title: option.dataset.pictureTitle, url: option.querySelector("img")?.dataset.fullImage || option.querySelector("img")?.currentSrc || "" };
    updateProfileUploadPreview();
  };
  picker.onclick = event => {
    const option = event.target.closest(".profile-picture-option");
    if (option && !option.disabled) setSelection(option);
  };
  document.querySelector("#profile-picture-clear").onclick = () => {
    selectedProfilePicture = { url: "", id: "", title: "" };
    picker.querySelectorAll(".profile-picture-option").forEach(item => item.classList.remove("selected"));
    updateProfileUploadPreview();
  };
  hydrateTrainImages(picker);
}

function updateProfileUploadPreview() {
  const preview = document.querySelector("#profile-upload-preview");
  const image = document.querySelector("#profile-upload-preview-image");
  const title = document.querySelector("#profile-upload-preview-name");
  const picture = safeProfileImage(selectedProfilePicture.url);
  const isUpload = selectedProfilePicture.id === "upload" && picture;
  if (!preview || !image || !title) return;
  preview.hidden = !isUpload;
  if (isUpload) { image.src = picture; title.textContent = `Selected: ${selectedProfilePicture.title || "uploaded picture"}`; }
}

document.querySelector("#profile-picture-upload").addEventListener("click", () => document.querySelector("#profile-picture-file").click());
document.querySelector("#profile-picture-file").addEventListener("change", async event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const status = document.querySelector("#profile-save-status");
  try {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP picture.");
    if (file.size > 12 * 1024 * 1024) throw new Error("Choose a picture smaller than 12 MB.");
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 400, 400);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 400, 400);
    bitmap.close?.();
    selectedProfilePicture = { url: canvas.toDataURL("image/jpeg", 0.78), id: "upload", title: file.name.slice(0, 100) };
    document.querySelectorAll(".profile-picture-option").forEach(option => option.classList.remove("selected"));
    updateProfileUploadPreview();
    status.textContent = "Picture selected. Save your profile to keep it on this device.";
    status.hidden = false;
  } catch (error) {
    status.textContent = error.message || "Could not use that picture.";
    status.hidden = false;
  }
});

document.querySelector("#profile-button").addEventListener("click", openProfile);
document.querySelector("#ask-chatgpt").addEventListener("click", () => {
  const dialog = document.querySelector("#record-detail-dialog");
  const sections = [];
  if (currentOpenDetail && dialog.open) {
    const { category, record } = currentOpenDetail;
    sections.push(`Current entry: ${record.title || "Untitled"}`, `Category: ${category.title}`);
    if (record.operator) sections.push(`Operator: ${record.operator}`);
    if (record.status) sections.push(`Status: ${record.status}`);
    if (record.details) sections.push(`Directory details: ${record.details}`);
    const listedStops = document.querySelector("#detail-stops-content")?.innerText?.trim();
    if (listedStops) sections.push(`Stops shown in the app: ${listedStops}`);
    const sourceUrl = safeSourceUrl(record.sourceUrl || "");
    if (sourceUrl) sections.push(`Source page: ${sourceUrl}`);
  } else {
    const categoryId = location.hash.replace(/^#/, "");
    const category = categories.find(item => item.id === categoryId);
    if (category) {
      sections.push(`Current directory category: ${category.title}`);
      const search = document.querySelector("#record-search")?.value.trim().toLowerCase() || "";
      const matchingRecords = (database[category.id] || []).filter(record => !search || [record.title, record.operator, record.status, record.details].join(" ").toLowerCase().includes(search)).slice(0, 10);
      if (matchingRecords.length) sections.push(`Matching entries from the local directory:\n${matchingRecords.map(record => `• ${record.title}${record.operator ? ` — ${record.operator}` : ""}${record.status ? ` (${record.status})` : ""}${record.details ? `: ${record.details}` : ""}`).join("\n")}`);
    } else sections.push("The user is on the Transport Database home dashboard.");
  }
  let context = sections.join("\n").slice(0, 5500) || "No transport entry is currently selected.";
  const prompt = `I am using a personal Transport Database for transport information. Help answer my transport questions clearly. Treat the directory context below as user-provided reference material that may be incomplete or out of date. Distinguish it from verified facts, and when current details matter, check reliable official or primary sources.\n\nDirectory context:\n${context}\n\nI will type my question in ChatGPT.`;
  const chatUrl = new URL("https://chatgpt.com/");
  chatUrl.searchParams.set("q", prompt);
  const chatWindow = window.open(chatUrl.toString(), "_blank");
  if (chatWindow) chatWindow.opener = null;
  else alert("Your browser blocked the ChatGPT tab. Allow pop-ups for this page, then try again.");
});
document.querySelector("#profile-close").addEventListener("click", () => profileDialog.close());
document.querySelectorAll(".color-swatch").forEach(swatch => swatch.addEventListener("click", () => {
  document.querySelectorAll(".color-swatch").forEach(item => item.classList.remove("selected"));
  swatch.classList.add("selected");
}));
profileForm.addEventListener("submit", event => {
  event.preventDefault();
  profile = {
    name: document.querySelector("#profile-name").value.trim(),
    profileId: profile.profileId || createLocalId(),
    handle: document.querySelector("#profile-handle").value.trim(),
    color: document.querySelector(".color-swatch.selected")?.dataset.color || profileDefaults.color,
    pictureUrl: safeProfileImage(selectedProfilePicture.url),
    pictureId: selectedProfilePicture.id,
    pictureTitle: selectedProfilePicture.title
  };
  localStorage.setItem("transitIndexProfile", JSON.stringify(profile));
  updateProfileUI();
  const feedback = document.querySelector("#profile-save-status");
  feedback.textContent = "Saved on this device. Your profile will be here when you reopen the site in this browser.";
  feedback.hidden = false;
});
document.querySelector("#profile-reset").addEventListener("click", () => {
  profile = { ...profileDefaults, profileId: createLocalId() };
  localStorage.removeItem("transitIndexProfile");
  updateProfileUI();
  profileDialog.close();
});

function makeFriendCard() {
  const name = document.querySelector("#profile-name").value.trim();
  if (!name) throw new Error("Add a display name before sharing your profile.");
  profile.profileId ||= createLocalId();
  return { format: "transport-index-friend-card", version: 1, profile: {
    profileId: profile.profileId,
    name,
    handle: document.querySelector("#profile-handle").value.trim(),
    color: document.querySelector(".color-swatch.selected")?.dataset.color || profileDefaults.color,
    pictureUrl: safeProfileImage(selectedProfilePicture.url),
    pictureTitle: selectedProfilePicture.title || ""
  } };
}

function addFriendFromCard(card) {
  const friend = card && card.format === "transport-index-friend-card" && card.version === 1 ? card.profile : null;
  if (!friend || typeof friend.name !== "string" || !friend.name.trim()) throw new Error("That is not a valid Transport Database friend card.");
  if (friend.profileId && friend.profileId === profile.profileId) throw new Error("That is your own profile card.");
  if (offlineFriends.some(item => item.profileId && item.profileId === friend.profileId)) throw new Error("That friend is already on your list.");
  const added = { profileId: String(friend.profileId || createLocalId()), name: friend.name.trim().slice(0, 48), handle: typeof friend.handle === "string" ? friend.handle.slice(0, 32) : "", color: /^#[0-9a-f]{6}$/i.test(friend.color || "") ? friend.color : "#087e78", pictureUrl: safeProfileImage(typeof friend.pictureUrl === "string" ? friend.pictureUrl : ""), pictureTitle: typeof friend.pictureTitle === "string" ? friend.pictureTitle.slice(0, 100) : "" };
  offlineFriends.push(added);
  saveOfflineFriends();
  return added;
}

function encodeFriendCode(card) {
  const bytes = new TextEncoder().encode(JSON.stringify(card));
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeFriendCode(code) {
  const normalized = code.trim().replace(/-/g, "+").replace(/_/g, "/");
  if (!normalized || normalized.length > 700000) throw new Error("Paste a valid friend code.");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, character => character.charCodeAt(0))));
}

document.querySelector("#copy-friend-code").addEventListener("click", async () => {
  const feedback = document.querySelector("#profile-save-status");
  try {
    const code = encodeFriendCode(makeFriendCard());
    try { await navigator.clipboard.writeText(code); }
    catch {
      const input = document.querySelector("#friend-code-input");
      input.value = code;
      input.focus();
      input.select();
      if (!document.execCommand("copy")) throw new Error("Copy the selected code in the box below.");
    }
    feedback.textContent = "Friend code copied. Send it to your friend so they can add you.";
  } catch (error) { feedback.textContent = error.message || "Could not create the friend code."; }
  feedback.hidden = false;
});

document.querySelector("#add-friend-code").addEventListener("click", () => {
  const feedback = document.querySelector("#profile-save-status");
  try {
    const friend = addFriendFromCard(decodeFriendCode(document.querySelector("#friend-code-input").value));
    document.querySelector("#friend-code-input").value = "";
    feedback.textContent = friend.name + " was added to your offline friends list.";
  } catch (error) { feedback.textContent = error.message || "Could not add that friend."; }
  feedback.hidden = false;
});

document.querySelector("#export-friend-card").addEventListener("click", () => {
  const name = document.querySelector("#profile-name").value.trim();
  if (!name) { document.querySelector("#profile-name").focus(); document.querySelector("#profile-save-status").textContent = "Add a display name before exporting your profile card."; document.querySelector("#profile-save-status").hidden = false; return; }
  profile.profileId ||= createLocalId();
  try { localStorage.setItem("transitIndexProfile", JSON.stringify(profile)); } catch { /* Profile card export still works if storage is unavailable. */ }
  const card = {
    format: "transport-index-friend-card",
    version: 1,
    profile: {
      profileId: profile.profileId || createLocalId(),
      name,
      handle: document.querySelector("#profile-handle").value.trim(),
      color: document.querySelector(".color-swatch.selected")?.dataset.color || profileDefaults.color,
      pictureUrl: safeProfileImage(selectedProfilePicture.url),
      pictureTitle: selectedProfilePicture.title || ""
    }
  };
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "transport-profile"}-friend-card.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  const feedback = document.querySelector("#profile-save-status");
  feedback.textContent = "Profile card exported. Send that file to a friend so they can add you.";
  feedback.hidden = false;
});

document.querySelector("#import-friend-card").addEventListener("click", () => document.querySelector("#friend-card-file").click());
document.querySelector("#friend-card-file").addEventListener("change", async event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const feedback = document.querySelector("#profile-save-status");
  try {
    const card = JSON.parse(await file.text());
    const friend = card?.format === "transport-index-friend-card" && card.version === 1 ? card.profile : null;
    if (!friend || typeof friend.name !== "string" || !friend.name.trim()) throw new Error("That file is not a valid Transport Database profile card.");
    if (friend.profileId && friend.profileId === profile.profileId) throw new Error("That is your own profile card.");
    if (offlineFriends.some(item => item.profileId && item.profileId === friend.profileId)) throw new Error("That friend is already on your list.");
    offlineFriends.push({ profileId: String(friend.profileId || createLocalId()), name: friend.name.trim().slice(0, 48), handle: typeof friend.handle === "string" ? friend.handle.slice(0, 32) : "", color: /^#[0-9a-f]{6}$/i.test(friend.color || "") ? friend.color : "#087e78", pictureUrl: safeProfileImage(typeof friend.pictureUrl === "string" ? friend.pictureUrl : ""), pictureTitle: typeof friend.pictureTitle === "string" ? friend.pictureTitle.slice(0, 100) : "" });
    saveOfflineFriends();
    feedback.textContent = `${friend.name.trim()} was added from the shared profile card.`;
  } catch (error) { feedback.textContent = error.message || "Could not read that profile card."; }
  feedback.hidden = false;
});

document.querySelector("#export-app-backup").addEventListener("click", () => {
  const backup = {
    format: "transport-index-full-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    payload: {
      records: database,
      profile,
      friends: offlineFriends,
      sidebarCollapsed
    }
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transport-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  const count = categories.reduce((total, category) => total + (database[category.id]?.length || 0), 0);
  const status = document.querySelector("#backup-status");
  status.textContent = `Backup downloaded with ${count.toLocaleString()} entries, your profile, and ${offlineFriends.length} offline friends.`;
  status.hidden = false;
});

document.querySelector("#import-app-backup").addEventListener("click", () => document.querySelector("#app-backup-file").click());
document.querySelector("#app-backup-file").addEventListener("change", async event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const status = document.querySelector("#backup-status");
  try {
    if (file.size > 20 * 1024 * 1024) throw new Error("That backup is too large to restore (maximum 20 MB).");
    const backup = JSON.parse(await file.text());
    const payload = backup?.format === "transport-index-full-backup" && backup.version === 1 ? backup.payload : null;
    if (!payload || !payload.records || typeof payload.records !== "object" || Array.isArray(payload.records) || !payload.profile || typeof payload.profile !== "object" || !Array.isArray(payload.friends)) throw new Error("That file is not a valid Transport Database backup.");
    for (const category of categories) {
      const entries = payload.records[category.id];
      if (!Array.isArray(entries) || entries.some(entry => !entry || typeof entry !== "object" || Array.isArray(entry))) throw new Error("This backup is missing a valid category: " + category.title + ".");
    }
    if (typeof payload.profile.name !== "string" || payload.friends.some(friend => !friend || typeof friend.name !== "string")) throw new Error("The profile or friend list in this backup is invalid.");
    const count = categories.reduce((total, category) => total + payload.records[category.id].length, 0);
    const confirmed = confirm(`Restore ${count.toLocaleString()} entries, your profile, and ${payload.friends.length} offline friends? This replaces the saved data in this browser.`);
    if (!confirmed) return;
    const keys = ["transitIndexRecords", "transitIndexProfile", "transitIndexOfflineFriends", "transitIndexSidebarCollapsed"];
    const previous = Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)]));
    try {
      localStorage.setItem("transitIndexRecords", JSON.stringify(payload.records));
      localStorage.setItem("transitIndexProfile", JSON.stringify({ ...profileDefaults, ...payload.profile, profileId: payload.profile.profileId || createLocalId() }));
      localStorage.setItem("transitIndexOfflineFriends", JSON.stringify(payload.friends));
      localStorage.setItem("transitIndexSidebarCollapsed", String(Boolean(payload.sidebarCollapsed)));
    } catch (error) {
      keys.forEach(key => previous[key] === null ? localStorage.removeItem(key) : localStorage.setItem(key, previous[key]));
      throw error;
    }
    status.textContent = "Backup restored. Reloading your directory…";
    status.hidden = false;
    window.location.reload();
  } catch (error) {
    status.textContent = error.message || "Could not restore that backup.";
    status.hidden = false;
  }
});

function categoryHref(id) { return `#${id}`; }

function setSidebarCollapsed(collapsed) {
  sidebarCollapsed = Boolean(collapsed);
  appShell.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  sidebarToggle.textContent = sidebarCollapsed ? "»" : "«";
  sidebarToggle.setAttribute("aria-label", sidebarCollapsed ? "Restore sidebar" : "Collapse sidebar");
  sidebarToggle.title = sidebarCollapsed ? "Restore sidebar" : "Collapse sidebar";
  try { localStorage.setItem("transitIndexSidebarCollapsed", String(sidebarCollapsed)); }
  catch { /* The sidebar still works if preferences cannot be saved. */ }
}

function renderSidebar(activeId = "") {
  sidebar.innerHTML = categories.map(category => `<a class="nav-link ${activeId === category.id ? "active" : ""}" href="${categoryHref(category.id)}" ${activeId === category.id ? 'aria-current="page"' : ""} title="${escapeHTML(category.nav)}"><span class="nav-emoji" aria-hidden="true">${category.icon}</span><span class="sidebar-nav-text">${category.nav}</span></a>`).join("");
  document.querySelector("[data-home-link]").classList.toggle("active", !activeId);
}

function renderCard(category) {
  return `<a class="category-card" data-group="${category.group}" href="${categoryHref(category.id)}" aria-label="Open ${category.title}">
    <span class="card-top"><span class="card-icon" aria-hidden="true">${category.icon}</span><span class="card-arrow" aria-hidden="true">↗</span></span>
    <h3>${category.title}</h3><p>${category.description}</p>
    <span class="card-bottom"><span class="card-status">Ready to explore</span><span class="card-open">OPEN</span></span>
  </a>`;
}

function renderHome() {
  renderSidebar();
  breadcrumbs.innerHTML = `<span>Workspace</span><span class="crumb-slash">/</span><strong>Overview</strong>`;
  appView.innerHTML = `
    <div class="main-view">
      <div class="eyebrow"><span class="eyebrow-line"></span>YOUR TRANSPORT HUB</div>
      <section class="hero" aria-labelledby="page-title">
      <div><h1 id="page-title">Transport<br><span>Database</span></h1><p>A personal directory for transport routes, stations, fleets and networks.</p></div>
      </section>
      <section class="metrics" aria-label="Directory overview"><div class="metric"><span class="metric-icon">▦</span><div><strong>${categories.length}</strong><small>DATABASE CATEGORIES</small></div></div><div class="metric"><span class="metric-icon">⌁</span><div><strong>4</strong><small>TRANSPORT NETWORKS</small></div></div><div class="metric"><span class="metric-icon">＋</span><div><strong>∞</strong><small>ROOM TO GROW</small></div></div></section>
      <section class="group-section"><div class="section-heading"><div><h2>Live</h2><p>Real-time departures and arrivals</p></div><span class="section-kicker">LIVE DATA</span></div><div class="cards-grid">${categories.filter(c => c.group === "live").map(renderCard).join("")}</div></section>
      <section class="group-section"><div class="section-heading"><div><h2>Stepford County Railway</h2><p>Train fleet, stations and routes</p></div><span class="section-kicker">SCR · ROBLOX</span></div><div class="cards-grid">${categories.filter(c => c.group === "scr").map(renderCard).join("")}</div></section>
      <section class="group-section"><div class="section-heading"><div><h2>Croydon</h2><p>Bus routes, vehicles and stops</p></div><span class="section-kicker">CROYDON · ROBLOX</span></div><div class="cards-grid">${categories.filter(c => c.group === "croydon").map(renderCard).join("")}</div></section>
      <section class="group-section"><div class="section-heading"><div><h2>TfL</h2><p>London buses, Underground, Elizabeth line and Overground</p></div><span class="section-kicker">TRANSPORT FOR LONDON</span></div><div class="cards-grid">${categories.filter(c => c.group === "tfl").map(renderCard).join("")}</div></section>
      <section class="group-section"><div class="section-heading"><div><h2>My routes</h2><p>Your bus and train routes, saved in this browser</p></div><span class="section-kicker">YOUR DIRECTORY</span></div><div class="cards-grid">${categories.filter(c => c.group === "personal").map(renderCard).join("")}</div></section>
      <section class="group-section"><div class="section-heading"><div><h2>Mainline Rail</h2><p>National Rail stations, lines and train fleets</p></div><span class="section-kicker">GREAT BRITAIN</span></div><div class="cards-grid">${categories.filter(c => c.group === "mainline").map(renderCard).join("")}</div></section>
    </div>`;
}

function renderCategory(category) {
  const isCustomRouteBuilder = ["custom-bus-routes", "custom-train-routes"].includes(category.id);
  const isTrainRouteBuilder = category.id === "custom-train-routes";
  if (routeBuilderMap?.map) routeBuilderMap.map.remove();
  routeBuilderMap = null;
  selectedOperator = "All";
  renderSidebar(category.id);
  breadcrumbs.innerHTML = `<a href="#home" data-home-link>Workspace</a><span class="crumb-slash">/</span><strong>${category.title}</strong>`;
  document.querySelector("[data-home-link]").addEventListener("click", event => { event.preventDefault(); location.hash = "home"; });
  const networkLabel = { scr: "STEPFORD COUNTY RAILWAY · ROBLOX", croydon: "CROYDON · ROBLOX", tfl: "TRANSPORT FOR LONDON", mainline: "GREAT BRITAIN · MAINLINE RAIL", personal: "YOUR TRANSPORT DIRECTORY", live: "LIVE DATA" }[category.group];
  appView.innerHTML = `<div class="main-view category-view">
    <a class="back-link" href="#home">← <span>Back to overview</span></a>
    <header class="category-header"><span class="category-icon" aria-hidden="true">${category.icon}</span><div><div class="eyebrow"><span class="eyebrow-line"></span>${networkLabel}</div><h1>${category.title}</h1><p>${category.description}</p></div></header>
    <section class="records-section" aria-label="${category.title} entries">
      <div class="records-toolbar"><div><h2>Entries</h2><p id="record-count"></p></div><div class="record-toolbar-actions">${category.id === "tfl-bus-routes" ? '<button class="button-secondary" id="refresh-tfl" type="button">↻ Refresh TfL routes</button>' : ""}<button class="button-primary add-record-button" id="add-record" type="button"><span aria-hidden="true">＋</span> ${category.id === "custom-bus-routes" ? "Create bus route" : isTrainRouteBuilder ? "Create train route" : "Add entry"}</button></div></div>
      ${isCustomRouteBuilder ? `<p class="tfl-load-status">${isTrainRouteBuilder ? "Click to mark stations or route points. Train routes connect directly; road snapping is off." : "Click to add bus route points. Road snapping can be switched on or off."}</p>` : ""}
      ${category.id === "tfl-bus-routes" ? '<p class="tfl-load-status" id="tfl-load-status" role="status">Loading the current route list from TfL…</p>' : ""}
      ${isCustomRouteBuilder ? `<section class="route-builder" aria-labelledby="route-builder-title"><div class="route-builder-heading"><div><h2 id="route-builder-title">Build a ${isTrainRouteBuilder ? "train" : "bus"} route on the map</h2><p id="builder-map-instructions">${isTrainRouteBuilder ? "Click to place stations or route points. The line connects directly between your points." : "Click to add bus route points. Use the switch to snap to roads or draw direct connections."}</p></div><a class="button-secondary satellite-link disabled" id="builder-satellite-link" href="#" target="_blank" rel="noopener noreferrer" aria-disabled="true">◉ Google Satellite</a></div><div class="route-builder-fields"><label><span>Route name</span><input id="builder-route-name" maxlength="100" placeholder="${isTrainRouteBuilder ? "e.g. West Coast Main Line" : "e.g. Riverside route"}" required></label><label><span>Operator or area</span><input id="builder-route-operator" maxlength="80" placeholder="Optional"></label><label><span>Next point name</span><input id="builder-stop-name" maxlength="80" placeholder="${isTrainRouteBuilder ? "Station or point name" : "Optional; defaults to Point 1"}"></label><label><span>Direction</span><select id="builder-route-axis"><option value="west-east">West to East</option><option value="north-south">North to South</option></select></label></div><div class="route-builder-toolbar"><span id="route-builder-summary" role="status">0 points · click anywhere on the map</span><div class="route-builder-actions">${isTrainRouteBuilder ? '<span class="route-snap-on">Road snapping off</span>' : '<label class="route-snap-toggle"><input type="checkbox" id="builder-road-snap" checked><span>Snap to roads</span></label><button class="button-secondary" id="builder-random" type="button">✦ Random journey</button>'}<button class="button-secondary" id="builder-clear" type="button">Clear points</button><button class="button-primary" id="builder-save" type="button" disabled>Save route</button></div></div><div id="route-builder-map" aria-label="Interactive map to place route points"></div><p class="route-builder-distance" id="route-builder-distance">${isTrainRouteBuilder ? "Add two or more points to draw the train route." : "Add two or more street points to route."}</p><p class="route-builder-map-help" id="builder-map-help">${isTrainRouteBuilder ? "Train route points connect directly; road snapping is not used." : "When enabled, road snapping needs an internet connection. Use the map layers control for road names and one-way markings."} Click a marker to remove a point.</p></section>` : ""}
      <div class="operator-filters" id="operator-filters" aria-label="Browse entries by operator"></div>
      <label class="record-search-wrap"><span aria-hidden="true">⌕</span><input id="record-search" type="search" placeholder="Search ${category.title.toLowerCase()}…" aria-label="Search ${category.title}"></label>
      <div class="records-grid" id="records-grid"></div>
      <p class="data-note">${category.id === "mainline-fleet" ? 'Fleet directory is grouped by operator and train class, not individual vehicle numbers. The ORR recorded 15,348 passenger rail vehicles in operation across Great Britain as of 31 March 2025; fleets and allocations change. <a href="https://dataportal.orr.gov.uk/statistics/infrastructure-and-environment/rail-infrastructure-and-assets/" target="_blank" rel="noopener noreferrer">See ORR fleet statistics ↗</a> · Edit entries to keep this directory current.' : category.id === "tfl-bus-fleet" ? 'Browse recognizable TfL bus makes and model families, including Enviro200, Enviro400 MMC and BYD BD11. Filter by operator, edit profiles, and open entries for source links. Photos are searched by model name; if a suitable real photo is unavailable, the profile says so.' : category.id === "bus-types" ? 'Croydon bus profiles follow the Centro Wiki operator fleet lists, including the Pro fleet entries currently published there. Each profile can be edited, and bus images load from the Centro Wiki when available.' : category.id === "scr-routes" ? 'The directory includes the 100 current SCR routes and the five training routes listed by the SCR Wiki. Open a route to load its station sequence from the route page.' : "Entries have source links where available. Check the linked page for current details; every entry can be edited here."}</p>
    </section>
  </div>`;
  document.querySelector("#add-record").addEventListener("click", () => openRecordEditor(category, null));
  document.querySelector("#record-search").addEventListener("input", () => renderRecords(category));
  if (category.id === "tfl-bus-routes") document.querySelector("#refresh-tfl").addEventListener("click", () => refreshTfLRoutes(true));
  renderOperatorFilters(category);
  renderRecords(category);
  if (isCustomRouteBuilder) initializeRouteBuilder(category);
  if (category.id === "tfl-bus-routes") refreshTfLRoutes(false);
}

function initializeRouteBuilder(category) {
  let snapToRoads = category.id === "custom-bus-routes";
  const mapElement = document.querySelector("#route-builder-map");
  if (!mapElement) return;
  if (!window.L) {
    mapElement.innerHTML = '<p class="map-unavailable">The interactive map needs an internet connection. Reload this category while online to build a route.</p>';
    return;
  }
  const map = window.L.map(mapElement).setView(snapToRoads ? [51.505, -0.09] : [54, -2], snapToRoads ? 11 : 6);
  addBaseMapLayerToggle(map);
  const stopLayer = window.L.layerGroup().addTo(map);
  const routeLine = window.L.polyline([], { color: "#087e78", weight: 5, opacity: 0.86 }).addTo(map);
  routeBuilderMap = { map, stops: [], stopLayer, routeLine, routeGeometry: [], routeDistance: null, routeStatus: "", routingTimer: null, routingController: null, routingRequestId: 0, nextRoutingAt: 0, isRouting: false, randomJourney: false };

  const cancelRoadRouting = state => {
    clearTimeout(state.routingTimer);
    state.routingController?.abort();
    state.routingRequestId++;
    state.isRouting = false;
  };
  const scheduleRoadRouting = () => {
    const state = routeBuilderMap;
    if (!state || state.randomJourney) return;
    if (!snapToRoads) {
      state.routeGeometry = state.stops.map(stop => [stop.placedLat ?? stop.lat, stop.placedLon ?? stop.lon]);
      state.routeDistance = null;
      state.routeStatus = `${category.id === "custom-train-routes" ? "Train route" : "Direct bus route"} · points connected in order`;
      state.isRouting = false;
      update();
      return;
    }
    clearTimeout(state.routingTimer);
    state.routingController?.abort();
    const requestId = ++state.routingRequestId;
    state.isRouting = true;
    state.routeDistance = null;
    state.routeStatus = "Following the road network…";
    update();
    const wait = Math.max(1100, state.nextRoutingAt - Date.now());
    state.routingTimer = setTimeout(async () => {
      if (!state.stops.length || requestId !== state.routingRequestId) return;
      state.nextRoutingAt = Date.now() + 1100;
      const controller = new AbortController();
      state.routingController = controller;
      const coordinates = state.stops.map(stop => `${stop.lon},${stop.lat}`).join(";");
      const singlePoint = state.stops.length === 1;
      const url = singlePoint
        ? `https://router.project-osrm.org/nearest/v1/driving/${coordinates}?number=1&radiuses=60`
        : `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false&radiuses=${state.stops.map(() => "60").join(";")}`;
      try {
        const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
        if (!response.ok) throw new Error(`Road routing returned ${response.status}`);
        const payload = await response.json();
        if (requestId !== state.routingRequestId) return;
        if (payload.code !== "Ok") throw new Error("No nearby drivable road was found. Try clicking closer to a street.");
        if (singlePoint) {
          const snapped = payload.waypoints?.[0]?.location;
          if (!snapped) throw new Error("Could not find a nearby road. Try clicking closer to a street.");
          state.stops[0] = { ...state.stops[0], lon: snapped[0], lat: snapped[1], roadName: payload.waypoints[0].name || "" };
          state.routeGeometry = [[snapped[1], snapped[0]]];
          state.routeStatus = `Snapped to ${payload.waypoints[0].name || "nearby road"}. Add another stop.`;
        } else {
          const route = payload.routes?.[0];
          const waypoints = payload.waypoints || [];
          if (!route?.geometry?.coordinates?.length || waypoints.length !== state.stops.length) throw new Error("Could not draw a road route between those points.");
          state.stops = state.stops.map((stop, index) => ({ ...stop, lon: waypoints[index].location[0], lat: waypoints[index].location[1], roadName: waypoints[index].name || "" }));
          state.routeGeometry = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          state.routeDistance = route.distance;
          state.routeStatus = `Snapped to roads · ${waypoints.map(point => point.name).filter(Boolean).join(" → ") || "street route"}`;
        }
        state.isRouting = false;
        update();
      } catch (error) {
        if (error.name === "AbortError" || requestId !== state.routingRequestId) return;
        state.isRouting = false;
        state.routeGeometry = state.stops.map(stop => [stop.lat, stop.lon]);
        state.routeDistance = null;
        state.routeStatus = error.message || "Road routing is temporarily unavailable; showing straight connections.";
        update();
      }
    }, wait);
  };

  const update = () => {
    const state = routeBuilderMap;
    if (!state) return;
    state.stopLayer.clearLayers();
    const coordinates = state.stops.map(stop => [stop.lat, stop.lon]);
    state.routeLine.setLatLngs(state.randomJourney ? [] : state.routeGeometry.length > 1 ? state.routeGeometry : coordinates);
    state.stops.forEach((stop, index) => {
      const marker = state.randomJourney
        ? window.L.circleMarker([stop.lat, stop.lon], { radius: 7, color: "#fff", weight: 2, fillColor: "#d54444", fillOpacity: 0.96, title: stop.name }).addTo(state.stopLayer)
        : window.L.marker([stop.lat, stop.lon], { draggable: true, title: `${index + 1}. ${stop.name}` }).addTo(state.stopLayer);
      marker.bindTooltip(escapeHTML(stop.name), state.randomJourney ? { permanent: true, direction: "top", offset: [0, -6], className: "random-place-label" } : {});
      if (stop.roadName) marker.bindPopup(`<strong>${escapeHTML(stop.name)}</strong><br>Road: ${escapeHTML(stop.roadName)}`);
      marker.on("click", () => {
        state.stops.splice(index, 1);
        state.routeStatus = "";
        update();
        scheduleRoadRouting();
      });
      marker.on("dragend", () => {
        const point = marker.getLatLng();
        state.stops[index] = { ...state.stops[index], lat: point.lat, lon: point.lng, placedLat: point.lat, placedLon: point.lng };
        state.stops[index].roadName = "";
        state.routeStatus = "";
        update();
        scheduleRoadRouting();
      });
    });
    const summary = document.querySelector("#route-builder-summary");
    const distanceLabel = document.querySelector("#route-builder-distance");
    const saveButton = document.querySelector("#builder-save");
    const routeName = document.querySelector("#builder-route-name").value.trim();
    if (summary) summary.textContent = state.routeStatus || `${state.stops.length} ${state.stops.length === 1 ? "point" : "points"} · click the map to add more`;
    if (distanceLabel) {
      distanceLabel.hidden = state.randomJourney;
      distanceLabel.textContent = state.routeDistance !== null ? `Road route: ${(state.routeDistance / 1000).toFixed(2)} km` : state.stops.length > 1 ? `Point-to-point estimate: ${calculateRouteDistance(state.stops).toFixed(2)} km` : `Add two or more ${snapToRoads ? "street points" : "points"} to route.`;
    }
    if (saveButton) saveButton.disabled = !routeName || state.stops.length < 2 || state.isRouting;
    const satellite = document.querySelector("#builder-satellite-link");
    if (satellite) {
      const maps = buildGoogleMapsLinks({ title: routeName || "Custom bus route" }, state.stops);
      satellite.href = maps.satellite;
      satellite.classList.toggle("disabled", state.stops.length < 1);
      satellite.setAttribute("aria-disabled", String(state.stops.length < 1));
    }
  };

  document.querySelector("#builder-road-snap")?.addEventListener("change", event => {
    snapToRoads = event.target.checked;
    const state = routeBuilderMap;
    if (!snapToRoads) {
      cancelRoadRouting(state);
      state.stops = state.stops.map(stop => ({ ...stop, lat: stop.placedLat ?? stop.lat, lon: stop.placedLon ?? stop.lon, roadName: "" }));
      state.routeGeometry = state.stops.map(stop => [stop.lat, stop.lon]);
      state.routeDistance = null;
      state.routeStatus = "Road snapping off · points connected directly.";
      update();
    } else {
      state.routeStatus = "";
      scheduleRoadRouting();
    }
    const help = document.querySelector("#builder-map-help");
    if (help) help.textContent = `${snapToRoads ? "Road snapping is on and needs an internet connection." : "Road snapping is off; points connect directly."} Use the map layers control for road names and one-way markings. Click a marker to remove a point.`;
  });

  if (snapToRoads) map.attributionControl.addAttribution('Road routing by <a href="https://project-osrm.org/" target="_blank" rel="noopener noreferrer">OSRM</a> · OpenStreetMap contributors');

  map.on("click", event => {
    const state = routeBuilderMap;
    const summary = document.querySelector("#route-builder-summary");
    const point = event.latlng;
    state.randomJourney = false;
    const nameInput = document.querySelector("#builder-stop-name");
      const newPoint = { name: nameInput.value.trim() || `Point ${state.stops.length + 1}`, lat: point.lat, lon: point.lng, placedLat: point.lat, placedLon: point.lng, type: "map-point" };
    const alreadyAdded = state.stops.some(existing => map.distance([existing.lat, existing.lon], [newPoint.lat, newPoint.lon]) <= 5);
    if (alreadyAdded) { summary.textContent = `That point is already on the map: ${newPoint.name}.`; return; }
    state.stops.push(newPoint);
    nameInput.value = "";
    state.routeStatus = "";
    update();
    summary.textContent = `${state.stops.length} points · placed ${newPoint.name}`;
    scheduleRoadRouting();
  });
  document.querySelector("#builder-route-name").addEventListener("input", update);
  document.querySelector("#builder-random")?.addEventListener("click", async () => {
    const button = document.querySelector("#builder-random");
    const summary = document.querySelector("#route-builder-summary");
    button.disabled = true;
    summary.textContent = "Picking two places in London…";
    try {
      const londonPlaces = [
        { name: "St Dunstan in the East", lat: 51.5097, lon: -0.0837 }, { name: "Postman's Park", lat: 51.5166, lon: -0.0960 },
        { name: "Barbican Conservatory", lat: 51.5201, lon: -0.0931 }, { name: "Crossbones Graveyard", lat: 51.5018, lon: -0.0924 },
        { name: "Brunel Museum", lat: 51.5010, lon: -0.0528 }, { name: "Surrey Docks Farm", lat: 51.4939, lon: -0.0506 },
        { name: "Limehouse Basin", lat: 51.5121, lon: -0.0394 }, { name: "Chrisp Street Market", lat: 51.5144, lon: -0.0140 },
        { name: "East India Dock Basin", lat: 51.5093, lon: -0.0026 }, { name: "Thames Barrier Park", lat: 51.4993, lon: 0.0330 },
        { name: "Mudchute Park and Farm", lat: 51.4886, lon: -0.0145 }, { name: "Island Gardens", lat: 51.4875, lon: -0.0106 },
        { name: "Walthamstow Wetlands", lat: 51.5884, lon: -0.0395 }, { name: "God's Own Junkyard", lat: 51.5866, lon: -0.0014 },
        { name: "Bruce Castle Museum", lat: 51.6034, lon: -0.0690 }, { name: "Woodberry Wetlands", lat: 51.5708, lon: -0.0917 },
        { name: "Parkland Walk Nature Reserve", lat: 51.5801, lon: -0.1428 }, { name: "Highgate Wood", lat: 51.5834, lon: -0.1470 },
        { name: "Kyoto Garden", lat: 51.5024, lon: -0.2054 }, { name: "Leighton House Museum", lat: 51.5012, lon: -0.2003 },
        { name: "Brompton Cemetery", lat: 51.4864, lon: -0.1842 }, { name: "Fulham Palace", lat: 51.4684, lon: -0.2162 },
        { name: "Chiswick House and Gardens", lat: 51.4827, lon: -0.2654 }, { name: "Gunnersbury Park Museum", lat: 51.4918, lon: -0.2848 },
        { name: "Dulwich Picture Gallery", lat: 51.4451, lon: -0.0870 }, { name: "Nunhead Cemetery", lat: 51.4612, lon: -0.0530 },
        { name: "Horniman Museum Gardens", lat: 51.4419, lon: -0.0627 }, { name: "Crystal Palace Dinosaurs", lat: 51.4195, lon: -0.0750 },
        { name: "Little Venice Puppet Theatre Barge", lat: 51.5219, lon: -0.1795 }, { name: "Paddington Basin Rolling Bridge", lat: 51.5180, lon: -0.1776 }
      ];
      const pairs = [];
      for (let i = 0; i < londonPlaces.length; i++) for (let j = i + 1; j < londonPlaces.length; j++) {
        const distance = map.distance([londonPlaces[i].lat, londonPlaces[i].lon], [londonPlaces[j].lat, londonPlaces[j].lon]);
        if (distance >= 1500 && distance <= 6500) pairs.push([londonPlaces[i], londonPlaces[j]]);
      }
      if (!pairs.length) throw new Error("Could not find a suitable London journey. Try again.");
      const points = pairs[Math.floor(Math.random() * pairs.length)].map(place => ({ ...place }));
      cancelRoadRouting(routeBuilderMap);
      routeBuilderMap.randomJourney = true;
      routeBuilderMap.stops = points;
      routeBuilderMap.routeGeometry = [];
      routeBuilderMap.routeDistance = null;
      routeBuilderMap.routeStatus = "";
      document.querySelector("#builder-route-name").value = `Random journey: ${points[0].name} to ${points[1].name}`.slice(0, 100);
      update();
      map.fitBounds(points.map(stop => [stop.lat, stop.lon]), { padding: [45, 45], maxZoom: 12 });
      summary.textContent = `Random London journey: ${points[0].name} → ${points[1].name}. Place markers only; no distance shown.`;
    } catch (error) {
      summary.textContent = error.message || "Could not generate a random journey. Try again.";
    } finally { button.disabled = false; }
  });
  document.querySelector("#builder-clear").addEventListener("click", () => {
    cancelRoadRouting(routeBuilderMap);
    routeBuilderMap.stops = [];
    routeBuilderMap.randomJourney = false;
    routeBuilderMap.routeGeometry = [];
    routeBuilderMap.routeDistance = null;
    routeBuilderMap.routeStatus = "";
    update();
  });
  document.querySelector("#builder-save").addEventListener("click", () => {
    const title = document.querySelector("#builder-route-name").value.trim();
    if (!title || routeBuilderMap.stops.length < 2) return;
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : `route-${Date.now()}`,
      title,
      operator: document.querySelector("#builder-route-operator").value.trim(),
      status: "Custom route",
      axis: document.querySelector("#builder-route-axis").value,
      randomJourney: routeBuilderMap.randomJourney,
      stops: routeBuilderMap.stops.map(stop => ({ ...stop })),
      routeGeometry: routeBuilderMap.routeGeometry.map(point => [...point]),
      roadRouteDistance: category.id === "custom-bus-routes" && snapToRoads && !routeBuilderMap.randomJourney ? routeBuilderMap.routeDistance : null,
      roadSnapEnabled: category.id === "custom-bus-routes" && snapToRoads,
      hideDistance: routeBuilderMap.randomJourney,
      details: routeBuilderMap.randomJourney ? "Random London journey suggestion. Only the named place markers are shown; there is no connecting route line or distance." : category.id === "custom-train-routes" ? "Custom train route plotted by connecting marked points directly in order. No road snapping is used." : !snapToRoads ? "Custom bus route plotted by connecting marked points directly in order. Road snapping was switched off." : routeBuilderMap.routeDistance !== null ? `Custom bus route following the road network. Road length: ${(routeBuilderMap.routeDistance / 1000).toFixed(2)} km.` : "Custom bus route created on the map. Stops are connected in order; road snapping was unavailable when it was saved.",
      sourceTitle: "Created in your route builder",
      directoryTitle: category.id === "custom-bus-routes" ? "My Bus Routes" : "My Train Routes",
      origin: "custom"
    };
    database[category.id] ||= [];
    database[category.id].unshift(record);
    saveDatabase();
    renderRecords(category);
    cancelRoadRouting(routeBuilderMap);
    routeBuilderMap.stops = [];
    routeBuilderMap.randomJourney = false;
    routeBuilderMap.routeGeometry = [];
    routeBuilderMap.routeDistance = null;
    routeBuilderMap.routeStatus = "";
    document.querySelector("#builder-route-name").value = "";
    document.querySelector("#builder-route-operator").value = "";
    update();
    document.querySelector("#route-builder-summary").textContent = `Saved “${title}” to ${category.title}.`;
  });
  update();
  requestAnimationFrame(() => map.invalidateSize());
}

function addBaseMapLayerToggle(map) {
  const roadMap = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: 'Sources: <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, HERE, Garmin, USGS, Intermap, and the GIS user community'
  }).addTo(map);
  const satellite = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: 'Imagery: <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community'
  });
  const roadNames = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    opacity: 0.68,
    attribution: 'Road labels: Esri, HERE, Garmin, and <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
  });
  const oneWayLayer = window.L.layerGroup();
  let directionsActive = true;
  let refreshTimer = null;
  let requestController = null;
  let requestId = 0;
  const roadCache = new Map();
  const clearOneWayRoads = () => oneWayLayer.clearLayers();
  const drawOneWayRoads = ways => {
    clearOneWayRoads();
    ways.forEach(way => {
      let geometry = Array.isArray(way.geometry) ? way.geometry.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lon)).map(point => [point.lat, point.lon]) : [];
      if (way.tags?.oneway === "-1") geometry = geometry.reverse();
      if (geometry.length < 2) return;
      window.L.polyline(geometry, { color: "#ffc857", weight: 3, opacity: 0.48, interactive: false, bubblingMouseEvents: false }).addTo(oneWayLayer);
      const screenPoints = geometry.map(point => map.latLngToLayerPoint(point));
      let carry = 55;
      for (let index = 1; index < screenPoints.length; index++) {
        const start = screenPoints[index - 1];
        const end = screenPoints[index];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const segmentLength = Math.hypot(dx, dy);
        if (segmentLength < 1) continue;
        while (carry < segmentLength) {
          const fraction = carry / segmentLength;
          const point = map.layerPointToLatLng([start.x + dx * fraction, start.y + dy * fraction]);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          const icon = window.L.divIcon({ className: "oneway-arrow-icon", html: `<span class="oneway-arrow" style="transform:rotate(${angle}deg)">➤</span>`, iconSize: [16, 16], iconAnchor: [8, 8] });
          window.L.marker(point, { icon, interactive: false, keyboard: false, bubblingMouseEvents: false }).addTo(oneWayLayer);
          carry += 105;
        }
        carry -= segmentLength;
      }
    });
    if (directionsActive && !map.hasLayer(oneWayLayer)) oneWayLayer.addTo(map);
  };
  const refreshOneWayRoads = () => {
    clearTimeout(refreshTimer);
    if (!directionsActive) return;
    refreshTimer = setTimeout(async () => {
      if (map.getZoom() < 12) { clearOneWayRoads(); return; }
      const bounds = map.getBounds();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const east = bounds.getEast();
      if (north - south > 0.3 || east - west > 0.3) { clearOneWayRoads(); return; }
      const key = [map.getZoom(), south, west, north, east].map(value => Number(value).toFixed(3)).join(":");
      if (roadCache.has(key)) { drawOneWayRoads(roadCache.get(key)); return; }
      requestController?.abort();
      requestController = new AbortController();
      const thisRequest = ++requestId;
      const query = `[out:json][timeout:20];(way[highway][oneway~"^(yes|1|-1)$"](${south},${west},${north},${east});way[highway~"^(motorway|motorway_link)$"](${south},${west},${north},${east});way[junction=roundabout][oneway!="no"](${south},${west},${north},${east}););out tags geom;`;
      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", Accept: "application/json" }, body: `data=${encodeURIComponent(query)}`, signal: requestController.signal });
        if (!response.ok) throw new Error(`Road data returned ${response.status}`);
        const payload = await response.json();
        if (thisRequest !== requestId || !directionsActive) return;
        const ways = (payload.elements || []).filter(element => element.type === "way" && Array.isArray(element.geometry) && (element.tags?.oneway === "yes" || element.tags?.oneway === "1" || element.tags?.oneway === "-1" || /^motorway(_link)?$/.test(element.tags?.highway || "") || element.tags?.junction === "roundabout")).slice(0, 1000);
        roadCache.set(key, ways);
        if (roadCache.size > 12) roadCache.delete(roadCache.keys().next().value);
        drawOneWayRoads(ways);
      } catch (error) {
        if (error.name !== "AbortError") console.info("One-way road arrows are temporarily unavailable", error);
      }
    }, 450);
  };
  map.attributionControl.addAttribution('One-way road data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>');
  roadNames.addTo(map);
  oneWayLayer.addTo(map);
  map.on("baselayerchange", () => refreshOneWayRoads());
  map.on("overlayadd", event => {
    if (event.layer === oneWayLayer) {
      directionsActive = true;
      refreshOneWayRoads();
    }
  });
  map.on("overlayremove", event => {
    if (event.layer === oneWayLayer) {
      directionsActive = false;
      clearTimeout(refreshTimer);
      requestController?.abort();
      requestId++;
      map.removeLayer(oneWayLayer);
      clearOneWayRoads();
    }
  });
  map.on("moveend zoomend", refreshOneWayRoads);
  window.L.control.layers({ "Road map": roadMap, "Satellite": satellite }, { "Road names": roadNames, "One-way directions & markings": oneWayLayer }, { collapsed: true, position: "topright" }).addTo(map);
  addMapFullscreenControl(map);
  return { roadMap, satellite, roadNames, oneWayLayer };
}

function addMapFullscreenControl(map) {
  const container = map.getContainer();
  const control = window.L.control({ position: "topright" });
  let fallbackFullscreen = false;
  let button;
  const isFullscreen = () => document.fullscreenElement === container || fallbackFullscreen;
  const sync = () => {
    if (!button) return;
    const full = isFullscreen();
    button.textContent = full ? "×" : "⛶";
    button.title = full ? "Close full-screen map" : "View map full screen";
    button.setAttribute("aria-label", button.title);
    requestAnimationFrame(() => map.invalidateSize());
  };
  control.onAdd = () => {
    const wrapper = window.L.DomUtil.create("div", "leaflet-bar map-fullscreen-control");
    button = window.L.DomUtil.create("button", "map-fullscreen-button", wrapper);
    button.type = "button";
    button.textContent = "⛶";
    button.title = "View map full screen";
    button.setAttribute("aria-label", button.title);
    window.L.DomEvent.disableClickPropagation(wrapper);
    window.L.DomEvent.on(button, "click", async event => {
      window.L.DomEvent.stop(event);
      try {
        if (isFullscreen()) {
          if (document.fullscreenElement === container && document.exitFullscreen) await document.exitFullscreen();
          else { fallbackFullscreen = false; container.classList.remove("map-fullscreen-fallback"); sync(); }
        } else if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else {
          fallbackFullscreen = true;
          container.classList.add("map-fullscreen-fallback");
          sync();
        }
      } catch {
        fallbackFullscreen = true;
        container.classList.add("map-fullscreen-fallback");
        sync();
      }
    });
    return wrapper;
  };
  control.addTo(map);
  const onFullscreenChange = () => {
    if (document.fullscreenElement !== container && fallbackFullscreen) {
      fallbackFullscreen = false;
      container.classList.remove("map-fullscreen-fallback");
    }
    sync();
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);
  map.on("unload", () => document.removeEventListener("fullscreenchange", onFullscreenChange));
}

function renderOperatorFilters(category) {
  const container = document.querySelector("#operator-filters");
  if (!container) return;
  const records = database[category.id] || [];
  const hasNewestFilter = ["scr-trains", "mainline-fleet", "tfl-rail-fleet", "lu-fleet"].includes(category.id) && records.some(record => /latest model|latest variant|latest remesh|new model|newer fleet|new fleet|new train|recent fleet/i.test(record.status || ""));
  const operators = [...new Set(records.flatMap(record => String(record.operator || "").split(",").map(name => name.trim()).filter(Boolean)))].sort((a, b) => a.localeCompare(b));
  if (!operators.length) { container.innerHTML = ""; return; }
  const filters = ["All", ...(hasNewestFilter ? ["Newest models"] : []), ...operators];
  container.innerHTML = `<span class="operator-filter-label">${hasNewestFilter ? "Browse newest models or operator" : "Browse by operator"}</span>${filters.map(operator => `<button type="button" class="operator-chip ${selectedOperator === operator ? "selected" : ""}" data-operator="${escapeHTML(operator)}">${escapeHTML(operator === "All" ? "All entries" : operator)}</button>`).join("")}`;
  container.querySelectorAll(".operator-chip").forEach(button => button.addEventListener("click", () => {
    selectedOperator = button.dataset.operator;
    container.querySelectorAll(".operator-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
    renderRecords(category);
  }));
}

async function refreshTfLRoutes(force) {
  if (tflFetchActive) return;
  tflFetchActive = true;
  const status = document.querySelector("#tfl-load-status");
  if (!status) { tflFetchActive = false; return; }
  status.textContent = "Loading the current route list from TfL…";
  try {
    const headers = { Accept: "application/json" };
    const [routeResult, lineResult] = await Promise.allSettled([
      fetch("https://api.tfl.gov.uk/Line/Mode/bus/Route", { headers }),
      fetch("https://api.tfl.gov.uk/Line/Mode/bus", { headers })
    ]);
    const routeResponse = routeResult.status === "fulfilled" ? routeResult.value : null;
    const lineResponse = lineResult.status === "fulfilled" ? lineResult.value : null;
    const routePayload = routeResponse?.ok ? await routeResponse.json() : null;
    const linePayload = lineResponse?.ok ? await lineResponse.json() : null;
    if (!routePayload && !linePayload) throw new Error(`TfL route list unavailable${routeResponse ? ` (${routeResponse.status})` : ""}${lineResponse ? ` (${lineResponse.status})` : ""}.`);
    const collectLines = payload => {
      if (!payload) return [];
      const groups = Array.isArray(payload) ? payload : (payload.lines || payload.lineGroups || payload.routes || []);
      return groups.flatMap(group => Array.isArray(group.lines) ? group.lines : [group]);
    };
    const lineIndex = new Map();
    for (const line of [...collectLines(linePayload), ...collectLines(routePayload)]) {
      const id = String(line?.id || line?.lineId || line?.name || line?.lineName || "");
      if (id) lineIndex.set(id, { ...(lineIndex.get(id) || {}), ...line });
    }
    const lines = [...lineIndex.values()];
    const response = routeResponse?.ok ? routeResponse : lineResponse;
    const imported = [];
    for (const line of lines) {
      if (!line || !(line.id || line.lineId || line.name || line.lineName)) continue;
      const lineId = String(line.id || line.lineId || line.name || line.lineName);
      const lineName = String(line.name || line.lineName || lineId);
      const sections = Array.isArray(line.routeSections) ? line.routeSections : [];
      const directionDetails = sections.map(section => {
        const direction = section?.direction ? `${section.direction.charAt(0).toUpperCase()}${section.direction.slice(1)}` : "Route section";
        const endpoints = [section?.originationName || section?.originName || "", section?.destinationName || ""].filter(Boolean).join(" → ");
        const extras = [section?.routeCode ? `route code ${section.routeCode}` : "", section?.via ? `via ${section.via}` : "", section?.serviceType || ""].filter(Boolean).join(" · ");
        return `${direction}${endpoints ? `: ${endpoints}` : ""}${extras ? ` (${extras})` : ""}`;
      });
      const routeCodes = [...new Set(sections.map(section => section?.routeCode).filter(Boolean))];
      const routeDetails = [`TfL route ${lineId}${routeCodes.length ? ` · ${routeCodes.join(", ")}` : ""}`, ...directionDetails];
      imported.push({
        id: `tfl-route-${normalizeTflRouteKey(lineId)}`,
        title: /^route\b/i.test(lineName) ? lineName : `Route ${lineName}`,
        details: routeDetails.join("\n"),
        sourceTitle: "TfL Unified API · bus route data",
        sourceUrl: response.url || "https://api.tfl.gov.uk/Line/Mode/bus",
        lineId,
        direction: "",
        origin: "tfl"
      });
    }
    // TfL's live endpoint only includes active routes. Keep the former 10 in
    // the directory as a clearly labelled archive entry so route numbers are
    // not silently missing from searches for the 1–100 series.
    imported.push({
      id: "tfl-route-10-archive",
      title: "Route 10 (withdrawn)",
      status: "Withdrawn · 24 November 2018",
      details: "Former London United route between Hammersmith bus station and King's Cross station. Service ended on 24 November 2018; part of the Hammersmith–Marble Arch section was replaced by route 23. Stops listed here are the route's former primary locations, not a current timetable.",
      stops: [
        "Hammersmith bus station", "Hammersmith Broadway", "Brook Green", "Kensington (Olympia) station",
        "High Street Kensington station", "Kensington Palace", "Royal Albert Hall", "Knightsbridge station",
        "Hyde Park Corner station", "Marble Arch station", "Selfridges", "Oxford Circus station",
        "Tottenham Court Road station", "British Museum", "Russell Square station", "Euston bus station",
        "British Library", "St Pancras International station", "King's Cross station"
      ],
      sourceTitle: "London Buses route 10 (1988–2018)",
      sourceUrl: "https://en.wikipedia.org/wiki/London_Buses_route_10",
      directoryTitle: "Former route 10 stop list",
      directoryUrl: "https://en.wikipedia.org/wiki/London_Buses_route_10#Former_route",
      origin: "archive"
    });
    if (!imported.length) throw new Error("The TfL route response was empty or in an unexpected format.");
    const oldRecords = Array.isArray(database["tfl-bus-routes"]) ? database["tfl-bus-routes"] : [];
    const overrides = new Map(oldRecords.filter(record => record.origin === "tfl-edited").map(record => [record.lineId, record]));
    const deleted = new Set(database["tfl-bus-routes-deleted"] || []);
    const remote = imported.filter(record => !deleted.has(record.id)).map(record => {
      const edited = overrides.get(record.lineId);
      if (!edited) return record;
      const savedNote = edited.savedNote || edited.details || "";
      return { ...record, ...edited, id: record.id, title: record.title, details: [record.details, savedNote ? `Saved note: ${savedNote}` : ""].filter(Boolean).join("\n\n"), savedNote, lineId: record.lineId, direction: "", origin: "tfl-edited" };
    })
      .sort((a, b) => a.title.localeCompare(b.title, "en-GB", { numeric: true, sensitivity: "base" }));
    const custom = oldRecords.filter(record => record.origin === "custom");
    database["tfl-bus-routes"] = [...custom, ...remote];
    database["tfl-bus-routes-updated"] = new Date().toISOString();
    saveDatabase();
    renderRecords(categories.find(item => item.id === "tfl-bus-routes"));
    const currentStatus = document.querySelector("#tfl-load-status");
    if (currentStatus) currentStatus.textContent = `Loaded ${remote.length.toLocaleString()} TfL bus routes, each grouped with inbound and outbound directions · refreshed ${new Date().toLocaleString()}. Your edits are kept on this device.`;
  } catch (error) {
    const currentStatus = document.querySelector("#tfl-load-status");
    const cached = Array.isArray(database["tfl-bus-routes"]) ? database["tfl-bus-routes"].length : 0;
    if (currentStatus) currentStatus.textContent = cached ? `TfL could not refresh right now. Showing your saved list of ${cached.toLocaleString()} entries.` : "TfL route data could not be reached. Check your connection, try Refresh, or add an entry manually.";
    console.warn("TfL route directory refresh failed", error);
  } finally {
    tflFetchActive = false;
  }
}

function renderRecords(category) {
  const grid = document.querySelector("#records-grid");
  if (!grid) return;
  const query = document.querySelector("#record-search").value.trim().toLowerCase();
  const allRecords = Array.isArray(database[category.id]) ? database[category.id] : [];
  const visible = allRecords.filter(record => {
    const recordOperators = String(record.operator || "").split(",").map(name => name.trim());
    const matchesOperator = selectedOperator === "All" || (selectedOperator === "Newest models" ? /latest model|latest variant|new model|newer fleet|new fleet|new train|recent fleet/i.test(record.status || "") : recordOperators.includes(selectedOperator));
    const stopTerms = Array.isArray(record.stops) ? record.stops.map(stop => typeof stop === "string" ? stop : stop.name || stop.commonName || "") : typeof record.stops === "string" ? record.stops.split(/\r?\n/) : [];
    const searchable = [record.title, record.operator, record.status, record.details, record.sourceTitle, record.sourceUrl, record.directoryTitle, record.directoryUrl, ...stopTerms].join(" ").toLowerCase();
    return matchesOperator && searchable.includes(query);
  });
  document.querySelector("#record-count").textContent = `${visible.length.toLocaleString()} of ${allRecords.length.toLocaleString()} ${allRecords.length === 1 ? "entry" : "entries"}${selectedOperator === "All" ? "" : ` · ${selectedOperator}`}`;
  if (!visible.length) {
    grid.innerHTML = `<div class="empty-panel records-empty"><span class="empty-symbol" aria-hidden="true">${allRecords.length ? "⌕" : "＋"}</span><h2>${allRecords.length ? "No matching entries" : "No entries yet"}</h2><p>${allRecords.length ? "Try a different search, or clear the search box." : "Add the first record to this category using the button above."}</p></div>`;
    return;
  }
  const renderCard = record => {
    const url = safeSourceUrl(record.sourceUrl || "");
    const directoryUrl = safeSourceUrl(record.directoryUrl || "");
    const stopsPreview = Array.isArray(record.stops) && record.stops.length ? `<p class="record-stop-preview"><strong>${record.stops.length}</strong> ${["custom-bus-routes", "custom-train-routes"].includes(category.id) ? "map points" : "listed stops"} · open for details</p>` : "";
    const operatorLabel = category.id === "tfl-bus-fleet" ? (record.manufacturer || "TfL bus model") : record.operator;
    return `<article class="record-card record-card-clickable" data-open-record="${escapeHTML(record.id)}" role="button" tabindex="0" aria-label="Open details for ${escapeHTML(record.title || "entry")}">${trainImageMarkup(record, category)}<div class="record-card-top"><div><h3>${escapeHTML(record.title || "Untitled entry")}</h3>${operatorLabel ? `<span class="record-operator-tag">${escapeHTML(operatorLabel)}</span>` : ""}${record.status ? `<span class="record-status-tag">${escapeHTML(record.status)}</span>` : ""}</div><div class="record-actions"><button class="record-action" type="button" data-action="edit" data-id="${escapeHTML(record.id)}" aria-label="Edit ${escapeHTML(record.title)}">Edit</button><button class="record-action delete-action" type="button" data-action="delete" data-id="${escapeHTML(record.id)}" aria-label="Delete ${escapeHTML(record.title)}">Delete</button></div></div><p class="record-details">${escapeHTML(record.details || "No details added yet.")}</p>${stopsPreview}<div class="record-references">${url ? `<a class="record-source" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">↗ ${escapeHTML(record.sourceTitle || "Source page")}</a>` : `<span class="record-source source-missing">User-added entry</span>`}${directoryUrl ? `<a class="record-directory" href="${escapeHTML(directoryUrl)}" target="_blank" rel="noopener noreferrer">Directory ↗</a>` : ""}</div></article>`;
  };
  const groupByOperator = ["scr-trains", "scr-routes", "bus-types", "mainline-fleet", "mainline-lines"].includes(category.id);
  if (groupByOperator && ["All", "Newest models"].includes(selectedOperator)) {
    const groups = new Map();
    visible.forEach(record => {
      const operator = record.operator || "Other / unassigned";
      if (!groups.has(operator)) groups.set(operator, []);
      groups.get(operator).push(record);
    });
    grid.innerHTML = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([operator, records]) => `<section class="operator-record-group"><header class="operator-record-heading"><h2>${escapeHTML(operator)}</h2><span>${records.length.toLocaleString()} ${records.length === 1 ? "entry" : "entries"}</span></header><div class="operator-record-grid">${records.map(renderCard).join("")}</div></section>`).join("");
  } else {
    grid.innerHTML = visible.map(renderCard).join("");
  }
  hydrateTrainImages(grid);
  grid.querySelectorAll("[data-open-record]").forEach(card => {
    const open = event => {
      if (event.target.closest("button, a")) return;
      const record = allRecords.find(item => item.id === card.dataset.openRecord);
      if (record) openRecordDetail(category, record);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(event); } });
  });
  grid.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const record = allRecords.find(item => item.id === button.dataset.id);
    if (!record) return;
    if (button.dataset.action === "edit") openRecordEditor(category, record);
    if (button.dataset.action === "delete") {
      const confirmDialog = document.querySelector("#delete-confirm-dialog");
      document.querySelector("#delete-confirm-message").textContent = `Delete “${record.title}”? This cannot be undone.`;
      confirmDialog.dataset.category = category.id;
      confirmDialog.dataset.recordId = record.id;
      confirmDialog.showModal();
    }
  }));
}

function deleteRecord(categoryId, recordId) {
    const category = categories.find(item => item.id === categoryId);
    const allRecords = database[categoryId] || [];
    const record = allRecords.find(item => item.id === recordId);
    if (!category || !record) return;
      database[categoryId] = allRecords.filter(item => item.id !== record.id);
      database.deletedRecords ||= {};
      database.deletedRecords[categoryId] ||= [];
      if (!database.deletedRecords[categoryId].includes(record.id)) database.deletedRecords[categoryId].push(record.id);
      if (categoryId === "tfl-bus-routes" && record.origin !== "custom") {
        database["tfl-bus-routes-deleted"] ||= [];
        if (!database["tfl-bus-routes-deleted"].includes(record.id)) database["tfl-bus-routes-deleted"].push(record.id);
      }
      saveDatabase();
      renderCategory(category);
}

document.querySelector("#delete-cancel").addEventListener("click", () => document.querySelector("#delete-confirm-dialog").close());
document.querySelector("#delete-confirm").addEventListener("click", () => {
  const dialog = document.querySelector("#delete-confirm-dialog");
  const { category, recordId } = dialog.dataset;
  dialog.close();
  deleteRecord(category, recordId);
});

function openRecordEditor(category, record) {
  editingRecordId = record?.id || null;
  document.querySelector("#record-dialog-title").textContent = record ? "Edit entry" : "Add an entry";
  document.querySelector("#record-title").value = record?.title || "";
  document.querySelector("#record-operator").value = record?.operator || "";
  document.querySelector("#record-status").value = record?.status || "";
  document.querySelector("#record-axis").value = record?.axis || (["tfl-bus-routes", "bus-routes", "custom-bus-routes"].includes(category.id) ? "west-east" : "north-south");
  document.querySelector("#record-details").value = record?.details || "";
  document.querySelector("#record-image-url").value = record?.imageUrl || "";
  updateRecordImagePreview();
  document.querySelector("#record-image-upload-status").textContent = "Or copy an image, then press Ctrl+V while this editor is open.";
  document.querySelector("#record-stops").value = Array.isArray(record?.stops) ? record.stops.map(stop => typeof stop === "string" ? stop : `${stop.name || stop.commonName || "Stop"}${stop.lat != null && stop.lon != null ? ` | ${stop.lat} | ${stop.lon}` : ""}`).join("\n") : (record?.stops || "");
  document.querySelector("#record-source-title").value = record?.sourceTitle || "";
  document.querySelector("#record-source-url").value = record?.sourceUrl || "";
  document.querySelector("#record-directory-title").value = record?.directoryTitle || "";
  document.querySelector("#record-directory-url").value = record?.directoryUrl || "";
  recordDialog.dataset.category = category.id;
  recordDialog.showModal();
}

function updateRecordImagePreview() {
  const preview = document.querySelector("#record-image-preview");
  const url = safeProfileImage(document.querySelector("#record-image-url")?.value.trim() || "");
  if (!preview) return;
  preview.hidden = !url;
  preview.src = url;
}

async function encodeRecordImage(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP picture.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Choose a picture smaller than 12 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 960 / bitmap.width, 720 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  let quality = 0.72;
  let encoded = canvas.toDataURL("image/jpeg", quality);
  while (encoded.length > 480000 && quality > 0.42) {
    quality -= 0.1;
    encoded = canvas.toDataURL("image/jpeg", quality);
  }
  if (encoded.length > 500000) throw new Error("That picture is too large to store in this browser. Choose a smaller image.");
  return encoded;
}

async function useRecordImage(file, label = file?.name || "Pasted image") {
  const status = document.querySelector("#record-image-upload-status");
  try {
    const encoded = await encodeRecordImage(file);
    document.querySelector("#record-image-url").value = encoded;
    updateRecordImagePreview();
    status.textContent = `Picture ready: ${String(label).slice(0, 80)}. Save entry to keep it.`;
  } catch (error) {
    status.textContent = error.message || "Could not use that picture.";
  }
}

document.querySelector("#record-image-upload").addEventListener("click", () => document.querySelector("#record-image-file").click());
document.querySelector("#record-image-file").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (file) useRecordImage(file);
});
document.querySelector("#record-image-url").addEventListener("input", updateRecordImagePreview);
recordDialog.addEventListener("paste", event => {
  const file = [...(event.clipboardData?.items || [])].find(item => item.type.startsWith("image/"))?.getAsFile();
  if (!file) return;
  event.preventDefault();
  useRecordImage(file, "pasted image");
});

const MAINLINE_STATION_COORDS = {
  "london king's cross": [51.5320, -0.1233], "london kings cross": [51.5320, -0.1233], "london euston": [51.5282, -0.1337], "london paddington": [51.5154, -0.1755],
  "peterborough": [52.5748, -0.2508], "york": [53.9581, -1.0930], "darlington": [54.5203, -1.5475], "newcastle": [54.9685, -1.6174], "edinburgh waverley": [55.9520, -3.1890],
  "milton keynes central": [52.0345, -0.7740], "rugby": [52.3782, -1.2505], "birmingham new street": [52.4778, -1.9003], "crewe": [53.0890, -2.4328], "preston": [53.7569, -2.7081], "carlisle": [54.8906, -2.9335], "glasgow central": [55.8597, -4.2583],
  "reading": [51.4584, -0.9716], "didcot parkway": [51.6105, -1.2428], "swindon": [51.5650, -1.7850], "bristol parkway": [51.5139, -2.5420], "bristol temple meads": [51.4491, -2.5813],
  "maidenhead": [51.5186, -0.7229], "slough": [51.5119, -0.5915], "hayes & harlington": [51.5031, -0.4208], "ealing broadway": [51.5148, -0.3010], "bond street": [51.5142, -0.1494], "tottenham court road": [51.5165, -0.1310], "farringdon": [51.5203, -0.1053], "liverpool street": [51.5178, -0.0823], "stratford": [51.5416, -0.0033], "romford": [51.5756, 0.1830], "shenfield": [51.6303, 0.3309],
  "richmond": [51.4632, -0.3015], "kew gardens": [51.4771, -0.2854], "gunnersbury": [51.4917, -0.2751], "acton central": [51.5088, -0.2634], "willesden junction": [51.5322, -0.2445], "kensal rise": [51.5342, -0.2208], "camden road": [51.5418, -0.1385], "highbury & islington": [51.5461, -0.1041], "dalston junction": [51.5450, -0.0752], "canada water": [51.4982, -0.0502], "new cross gate": [51.4752, -0.0403]
};

function resolveMainlineCoordinates(stops) {
  return stops.map(stop => {
    const name = typeof stop === "string" ? stop : stop?.name || stop?.commonName || "";
    const normalized = name.toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/[’']/g, "").trim();
    const point = MAINLINE_STATION_COORDS[normalized];
    return point ? { name, lat: point[0], lon: point[1] } : null;
  }).filter(Boolean);
}

function getScrWikiSpecCache() {
  try { return JSON.parse(localStorage.getItem("transitIndexScrWikiSpecsV1") || "{}"); }
  catch { return {}; }
}

async function loadScrWikiTrainSpecifications(record, token) {
  const classNumber = (record.title || "").match(/Class\s+([A-Za-z0-9]+(?:\/[A-Za-z0-9]+)?)/i)?.[1];
  const status = document.querySelector("#scr-wiki-spec-status");
  const block = document.querySelector("#scr-wiki-spec-block");
  if (!classNumber || !status || !block) return;
  const cache = getScrWikiSpecCache();
  let sections = cache[classNumber];
  if (!sections) {
    try {
      const endpoint = new URL("https://scr.fandom.com/api.php");
      endpoint.search = new URLSearchParams({ action: "parse", page: `Class_${classNumber.replaceAll("/", "_")}`, prop: "text", format: "json", origin: "*" }).toString();
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`SCR Wiki returned ${response.status}`);
      const payload = await response.json();
      const html = payload.parse?.text?.["*"] || payload.parse?.text || "";
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const root = parsed.querySelector(".mw-parser-output") || parsed.body;
      const wanted = /^(train information|service information|variants?|train variants)$/i;
      const headings = [...root.querySelectorAll("h2, h3")];
      const cleanHeading = heading => heading.textContent.replace(/\s*\[edit\]\s*$/i, "").trim();
      sections = headings.filter(heading => wanted.test(cleanHeading(heading))).map(heading => {
        const title = cleanHeading(heading);
        const content = [];
        const walker = parsed.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        walker.currentNode = heading;
        let node;
        while ((node = walker.nextNode())) {
          if (node.tagName === "H2") break;
          if (node.matches("table")) {
            for (const row of node.querySelectorAll("tr")) {
              const cells = [...row.querySelectorAll("th, td")].map(cell => cell.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
              for (let index = 0; index < cells.length; index += 2) {
                if (cells[index + 1]) content.push(`${cells[index]}: ${cells[index + 1]}`);
                else if (cells[index]) content.push(cells[index]);
              }
            }
          } else if (node.matches("p, ul, ol")) {
            const text = node.textContent.replace(/\s+/g, " ").trim();
            if (text) content.push(text);
          }
        }
        return { title, content: [...new Set(content)] };
      }).filter(section => section.content.length);
      if (sections.length) {
        cache[classNumber] = sections;
        try { localStorage.setItem("transitIndexScrWikiSpecsV1", JSON.stringify(cache)); } catch { /* Wiki detail caching is optional. */ }
      }
    } catch (error) {
      if (token === detailViewToken && status.isConnected) status.textContent = "The Wiki specifications could not load just now. The class page is linked below; try again while online.";
      return;
    }
  }
  if (token !== detailViewToken || !status.isConnected) return;
  if (!sections?.length) {
    status.textContent = "No specification table was available on the Wiki page. Open the class source below for its full entry.";
    return;
  }
  block.innerHTML = `<h3>SCR Wiki train information</h3>${sections.map(section => `<div class="scr-spec-section"><h4>${escapeHTML(section.title)}</h4><dl>${section.content.map(line => `<div><dt>${escapeHTML(line.split(": ")[0])}</dt><dd>${escapeHTML(line.includes(": ") ? line.slice(line.indexOf(": ") + 2) : "")}</dd></div>`).join("")}</dl></div>`).join("")}`;
}

function openRecordDetail(category, record) {
  const dialog = document.querySelector("#record-detail-dialog");
  const content = document.querySelector("#record-detail-content");
  currentOpenDetail = { category, record };
  const token = ++detailViewToken;
  const sourceUrl = safeSourceUrl(record.sourceUrl || "");
  const directoryUrl = safeSourceUrl(record.directoryUrl || "");
  const detailDescription = category.id === "custom-bus-routes" ? (record.randomJourney ? "Random London journey suggestion. Only the named place markers are shown; there is no connecting route line or distance." : record.roadRouteDistance != null ? `Your route follows the road network. Road length: ${(record.roadRouteDistance / 1000).toFixed(2)} km.` : record.details || "Your map points are connected in the order you placed them.") : record.details || "No additional details have been added yet.";
  const stops = Array.isArray(record.stops) ? record.stops : (typeof record.stops === "string" ? record.stops.split(/\r?\n/).filter(Boolean) : []);
  const isMappedRoute = ["scr-routes", "bus-routes", "tfl-bus-routes", "mainline-lines", "lu-lines", "custom-train-routes"].includes(category.id);
  const routeAxis = record.axis || (["tfl-bus-routes", "bus-routes", "custom-bus-routes", "custom-train-routes"].includes(category.id) ? "west-east" : "north-south");
  const directionLabel = category.id === "tfl-bus-routes" ? "Inbound & outbound" : routeAxis === "west-east" ? "West → East" : "North → South";
  const isRouteEntry = ["scr-routes", "bus-routes", "custom-bus-routes", "custom-train-routes", "tfl-bus-routes", "mainline-lines", "lu-lines"].includes(category.id);
  const routeMap = ["bus-routes", "tfl-bus-routes", "mainline-lines", "lu-lines", "custom-bus-routes", "custom-train-routes"].includes(category.id) && !record.randomJourney ? buildGoogleMapsLinks(record, stops) : null;
  const stopCoordinates = getCoordinates(stops);
  const coordinates = stopCoordinates.length > 1 ? stopCoordinates : ["mainline-lines", "custom-train-routes"].includes(category.id) ? resolveMainlineCoordinates(stops) : stopCoordinates;
  const measuredDistance = calculateRouteDistance(coordinates);
  content.innerHTML = `<div class="dialog-top"><div><div class="eyebrow"><span class="eyebrow-line"></span>${escapeHTML(category.title)}</div><h2 id="detail-title">${escapeHTML(record.title || "Entry details")}</h2></div><button class="dialog-close" id="detail-close" type="button" aria-label="Close details">×</button></div>
    ${record.operator ? `<div class="detail-operator">${escapeHTML(record.operator)}</div>` : ""}${record.status ? `<div class="detail-status">${escapeHTML(record.status)}</div>` : ""}
    ${trainImageMarkup(record, category)}
    <section class="detail-block"><h3>Information</h3><p class="detail-copy" id="record-detail-description">${escapeHTML(detailDescription)}</p></section>
    ${category.id === "scr-trains" ? '<section class="detail-block" id="scr-wiki-spec-block"><h3>SCR Wiki train information</h3><p class="detail-muted" id="scr-wiki-spec-status" role="status">Loading class specifications…</p></section>' : ""}
    ${isRouteEntry ? `<section class="detail-block route-detail-block"><div class="route-detail-heading"><h3>Route · ${directionLabel}</h3><button id="reverse-route" class="button-secondary reverse-route" type="button">⇄ Reverse route</button></div><div id="detail-stops-content">${["custom-bus-routes", "custom-train-routes"].includes(category.id) ? "" : stops.length ? renderStopList(stops) : (record.lineId || category.id === "bus-routes") ? '<p class="detail-muted">Loading stop sequence and map…</p>' : '<p class="detail-muted">No stop sequence is listed yet. Add stop names with Edit entry.</p>'}</div>${!record.hideDistance ? (record.roadRouteDistance != null ? `<p class="measured-distance">Road route length: <strong>${(record.roadRouteDistance / 1000).toFixed(2)} km</strong></p>` : measuredDistance ? `<p class="measured-distance">Point-to-point distance: <strong>${measuredDistance.toFixed(2)} km</strong></p>` : coordinates.length ? '<p class="measured-distance">Add at least two points with coordinates to measure this route.</p>' : "") : ""}<div id="route-schematic-container">${(["custom-bus-routes", "custom-train-routes", "mainline-lines"].includes(category.id) && coordinates.length > 1) || record.lineId ? '<div id="detail-route-map" class="custom-route-detail-map" aria-label="Interactive map of this route"></div>' : (isMappedRoute && stops.length > 1 ? renderRouteSchematic(stops) : "")}</div></section>` : ""}
    ${routeMap && !record.randomJourney ? `<section class="detail-block route-map-block"><h3>Google Maps</h3><a class="google-maps-link" id="google-maps-directions" href="${escapeHTML(routeMap.directions)}" target="_blank" rel="noopener noreferrer">↗ Open route directions in Google Maps</a><a class="google-maps-link" id="google-maps-satellite" href="${escapeHTML(routeMap.satellite)}" target="_blank" rel="noopener noreferrer">◉ View transit on Google Maps Satellite ↗</a><p class="detail-muted">Satellite view opens with Google’s transit layer. ${record.hideDistance ? "The map shows your place markers and route." : "The in-app map follows the stop order."}</p></section>` : ""}
    <section class="detail-directory"><span class="directory-label">DIRECTORY / SOURCE</span>${directoryUrl ? `<a href="${escapeHTML(directoryUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(record.directoryTitle || "Browse the full directory")} ↗</a>` : sourceUrl ? `<a href="${escapeHTML(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(record.sourceTitle || "Open original source")} ↗</a>` : '<span class="detail-muted">User-added entry</span>'}${directoryUrl && sourceUrl ? `<a class="specific-source" href="${escapeHTML(sourceUrl)}" target="_blank" rel="noopener noreferrer">Specific source page: ${escapeHTML(record.sourceTitle || "Open source")} ↗</a>` : ""}</section>
    <div class="detail-actions"><button class="button-secondary" id="detail-done" type="button">Close</button><button class="button-primary" id="detail-edit" type="button">Edit entry</button></div>`;
  dialog.showModal();
  dialog.addEventListener("close", () => { currentOpenDetail = null; }, { once: true });
  hydrateTrainImages(content);
  content.querySelectorAll(".record-image").forEach(image => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Show full photo: ${image.alt}`);
  });
  const openFullPhoto = event => {
    const image = event.target.closest(".record-image");
    if (!image || image.closest(".image-unavailable") || !image.closest(".record-image-frame")?.classList.contains("has-image")) return;
    const viewer = document.querySelector("#photo-viewer-dialog");
    const largeImage = document.querySelector("#photo-viewer-image");
    const sourceLink = document.querySelector("#photo-viewer-source");
    largeImage.src = image.dataset.fullImage || image.currentSrc || image.src;
    largeImage.alt = image.alt;
    document.querySelector("#photo-viewer-title").textContent = image.alt || "Full photo";
    const source = safeSourceUrl(image.dataset.imageSource || "");
    sourceLink.href = source || "#";
    sourceLink.hidden = !source;
    viewer.showModal();
  };
  content.onclick = openFullPhoto;
  content.onkeydown = event => {
    if (event.target.matches(".record-image") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openFullPhoto(event);
    }
  };
  if (category.id === "bus-types") loadCentroWikiBusDescription(record, token);
  if (category.id === "scr-trains") loadScrWikiTrainSpecifications(record, token);
  if (category.id === "scr-routes" && (!stops.length || stops.length < 2)) loadScrWikiRouteDetails(record, token);
  if ((["custom-bus-routes", "custom-train-routes", "mainline-lines"].includes(category.id) && coordinates.length > 1) || record.lineId) {
    const mappedStops = record.lineId ? [] : coordinates.map(point => ({ ...point, name: point.name }));
    detailRouteMap = mappedStops.length > 1 ? initializeSavedRouteMap("detail-route-map", mappedStops, { placeOnly: Boolean(record.randomJourney), routeGeometry: record.routeGeometry }) : null;
    if (mappedStops.length > 1 && !record.routeGeometry?.length) updateSavedRouteMap(detailRouteMap, mappedStops);
    dialog.addEventListener("close", () => { detailRouteMap?.map.remove(); detailRouteMap = null; }, { once: true });
  }
  document.querySelector("#detail-close").addEventListener("click", () => dialog.close());
  document.querySelector("#detail-done").addEventListener("click", () => dialog.close());
  document.querySelector("#detail-edit").addEventListener("click", () => { dialog.close(); openRecordEditor(category, record); });
  document.querySelector("#reverse-route")?.addEventListener("click", () => {
    const stopContent = document.querySelector("#detail-stops-content");
    const reversed = stopContent.dataset.reversed !== "true";
    stopContent.dataset.reversed = String(reversed);
    const directionGroups = [...stopContent.querySelectorAll(".stop-sequence")];
    let currentStops;
    if (["custom-bus-routes", "custom-train-routes"].includes(category.id)) {
      currentStops = reversed ? [...stops].reverse() : stops;
    } else if (stops.length) {
      currentStops = reversed ? [...stops].reverse() : stops;
      stopContent.innerHTML = renderStopList(currentStops);
    } else if (directionGroups.length) {
      directionGroups.forEach(group => {
        const list = group.querySelector("ol.detail-stop-list");
        if (!list) return;
        const items = [...list.children];
        for (const item of items.reverse()) list.append(item);
      });
      const firstList = stopContent.querySelector("ol.detail-stop-list");
      currentStops = firstList ? [...firstList.querySelectorAll("li")].map(item => item.querySelector("strong")?.textContent || item.textContent.trim()) : [];
    } else {
      const listedStops = [...stopContent.querySelectorAll("ol.detail-stop-list li")].map(item => item.querySelector("strong")?.textContent || item.textContent.trim());
      currentStops = reversed ? [...listedStops].reverse() : listedStops;
      if (currentStops.length) stopContent.innerHTML = renderStopList(currentStops);
    }
    document.querySelector(".route-detail-heading h3").textContent = category.id === "tfl-bus-routes" ? `Route · ${directionLabel}${reversed ? " · reversed" : ""}` : `Route · ${reversed ? `${directionLabel.split(" → ")[1]} → ${directionLabel.split(" → ")[0]}` : directionLabel}`;
    if (routeMap && currentStops.length) {
      const links = buildGoogleMapsLinks(record, currentStops);
      document.querySelector("#google-maps-directions").href = links.directions;
      document.querySelector("#google-maps-satellite").href = links.satellite;
    }
    const orderedStops = currentStops;
    if (detailRouteMap) {
      const orderedGeometry = detailRouteMap.routeGeometry?.length ? (reversed ? [...detailRouteMap.routeGeometry].reverse() : detailRouteMap.routeGeometry) : null;
      updateSavedRouteMap(detailRouteMap, reversed ? [...detailRouteMap.stops].reverse() : detailRouteMap.stops, orderedGeometry);
    }
    const mapContainer = document.querySelector("#route-schematic-container");
    if (mapContainer && orderedStops.length > 1 && !detailRouteMap) mapContainer.innerHTML = renderRouteSchematic(orderedStops);
  });
  if (record.lineId) loadTfLStopSequences(record, token, category);
  if (category.id === "bus-routes") loadCroydonRouteDetails(record, token);
}

async function loadCentroWikiBusDescription(record, token) {
  const output = document.querySelector("#record-detail-description");
  if (!output || !record.sourceUrl) return;
  try {
    const page = decodeURIComponent(record.sourceUrl.split("/wiki/").pop()).replaceAll(" ", "_");
    const response = await fetch(`https://centro.fandom.com/api.php?action=parse&page=${encodeURIComponent(page)}&prop=text&format=json&origin=*`, { headers: { Accept: "application/json" } });
    if (!response.ok) return;
    const payload = await response.json();
    const html = payload?.parse?.text?.["*"];
    if (!html) return;
    const documentNode = new DOMParser().parseFromString(html, "text/html");
    const paragraphs = [...documentNode.querySelectorAll(".mw-parser-output > p")].map(node => node.textContent.trim().replace(/\s+/g, " ")).filter(text => text.length > 55);
    if (token !== detailViewToken || !paragraphs.length) return;
    output.textContent = `${paragraphs.slice(0, 2).join(" ")}\n\nIn-game operator: ${record.operator}. The Centro Wiki source is linked below for variants and current game details.`;
  } catch { /* Keep the bundled profile description if the Wiki is unavailable. */ }
}

async function loadScrWikiRouteDetails(record, token) {
  const destination = document.querySelector("#detail-stops-content");
  if (!destination) return;
  destination.innerHTML = '<p class="detail-muted">Loading the station sequence from the SCR Wiki…</p>';
  try {
    const pageName = record.sourceUrl?.split("/wiki/").pop() || record.id.replace("scr-route-", "").toUpperCase();
    let html = "";
    for (const page of [pageName, `Routes/${pageName}`]) {
      const response = await fetch(`https://scr.fandom.com/api.php?action=parse&page=${encodeURIComponent(decodeURIComponent(page))}&prop=text&format=json&origin=*`, { headers: { Accept: "application/json" } });
      if (!response.ok) continue;
      const payload = await response.json();
      html = payload?.parse?.text?.["*"] || "";
      if (html) break;
    }
    if (!html) throw new Error("No route page content");
    const documentNode = new DOMParser().parseFromString(html, "text/html");
    const stops = parseScrWikiRouteStops(documentNode);
    if (token !== detailViewToken) return;
    if (!stops.length) {
      destination.innerHTML = '<p class="detail-muted">No station table was available on this SCR Wiki page. Open the source below or use Edit entry to add the stations.</p>';
      return;
    }
    destination.innerHTML = renderStopList(stops);
    const container = document.querySelector("#route-schematic-container");
    if (container) container.innerHTML = renderRouteSchematic(stops);
  } catch {
    if (token === detailViewToken) destination.innerHTML = '<p class="detail-muted">Could not load the SCR Wiki route table right now. Try again while online, or use Edit entry to add the station list.</p>';
  }
}

function parseScrWikiRouteStops(documentNode) {
  const table = [...documentNode.querySelectorAll("table")].find(candidate => /station/i.test(candidate.querySelector("tr")?.textContent || ""));
  if (!table) return [];
  const rows = [...table.querySelectorAll("tr")].slice(1);
  const stops = rows.map(row => {
    const firstCell = row.querySelector("th,td");
    const name = firstCell?.textContent.trim().replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ") || "";
    return /^(starting point|terminus|station|stations|to\b)/i.test(name) || name.length < 2 ? "" : name;
  }).filter(Boolean);
  return [...new Set(stops)];
}

async function loadCroydonRouteDetails(record, token) {
  const destination = document.querySelector("#detail-stops-content");
  if (!destination) return;
  const savedStops = Array.isArray(record.stops) ? record.stops : [];
  if (record.stopsEdited && savedStops.length) {
    const coordinates = getCoordinates(savedStops);
    const mapped = coordinates.length > 1 ? coordinates : await geocodeCroydonStops(savedStops);
    if (token !== detailViewToken) return;
    destination.innerHTML = renderStopList(savedStops);
    const container = document.querySelector("#route-schematic-container");
    if (mapped.length > 1 && container) {
      container.innerHTML = '<div id="detail-route-map" class="custom-route-detail-map" aria-label="Interactive edited Croydon route map"></div><p class="detail-muted">Map follows the stop list you saved. Click a marker for its name.</p>';
      detailRouteMap = initializeSavedRouteMap("detail-route-map", mapped);
      document.querySelector("#record-detail-dialog")?.addEventListener("close", () => { detailRouteMap?.map.remove(); detailRouteMap = null; }, { once: true });
    }
    const links = buildGoogleMapsLinks(record, mapped.length ? mapped : savedStops);
    const directionsLink = document.querySelector("#google-maps-directions");
    const satelliteLink = document.querySelector("#google-maps-satellite");
    if (directionsLink) directionsLink.href = links.directions;
    if (satelliteLink) satelliteLink.href = links.satellite;
    return;
  }
  try {
    const page = record.sourceUrl?.split("/wiki/")[1] || `Route_${encodeURIComponent(record.routeNumber || "")}`;
    const url = `https://centro.fandom.com/api.php?action=parse&page=${encodeURIComponent(decodeURIComponent(page))}&prop=text&format=json&origin=*`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Wiki unavailable");
    const payload = await response.json();
    const html = payload?.parse?.text?.["*"];
    if (!html) throw new Error("No route page content");
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const stopGroups = parseCroydonWikiStops(parsed);
    if (token !== detailViewToken) return;
    const completeStops = stopGroups.flatMap(group => group.stops);
    if (stopGroups.length) {
      destination.innerHTML = stopGroups.map(group => `<details class="stop-sequence" open><summary>${escapeHTML(group.label)}</summary>${renderStopList(group.stops)}</details>`).join("");
    } else if (!Array.isArray(record.stops) || !record.stops.length) {
      destination.innerHTML = '<p class="detail-muted">The Centro Wiki page did not expose a stop table. The route termini are mapped below; use Edit entry to add or correct the stop list.</p>';
    }
    const mapStops = await geocodeCroydonStops(completeStops.length ? completeStops : croydonTermini(record));
    if (token !== detailViewToken) return;
    const container = document.querySelector("#route-schematic-container");
    if (mapStops.length > 1 && container) {
      detailRouteMap?.map.remove();
      container.innerHTML = '<div id="detail-route-map" class="custom-route-detail-map" aria-label="Interactive Croydon route map"></div><p class="detail-muted">Stops are placed from Centro Wiki names. Select a marker to see its stop name.</p>';
      detailRouteMap = initializeSavedRouteMap("detail-route-map", mapStops);
      document.querySelector("#record-detail-dialog")?.addEventListener("close", () => { detailRouteMap?.map.remove(); detailRouteMap = null; }, { once: true });
    } else if (container) {
      container.innerHTML = '<p class="detail-muted">A mapped stop sequence is not available for this route yet. Add stops in Edit entry to map it.</p>';
    }
    const directions = buildGoogleMapsLinks(record, mapStops.length ? mapStops : completeStops.length ? completeStops : croydonTermini(record));
    const directionsLink = document.querySelector("#google-maps-directions");
    const satelliteLink = document.querySelector("#google-maps-satellite");
    if (directionsLink) directionsLink.href = directions.directions;
    if (satelliteLink) satelliteLink.href = directions.satellite;
  } catch {
    if (token !== detailViewToken) return;
    const stops = croydonTermini(record);
    const destination = document.querySelector("#detail-stops-content");
    if (destination && (!Array.isArray(record.stops) || !record.stops.length)) destination.innerHTML = `<p class="detail-muted">Could not load the live Centro Wiki stop table. Showing the published route termini. Add a stop list in Edit entry for a complete map.</p>${renderStopList(stops)}`;
    const mapped = await geocodeCroydonStops(Array.isArray(record.stops) && record.stops.length ? record.stops : stops);
    if (token !== detailViewToken) return;
    const directions = buildGoogleMapsLinks(record, mapped.length ? mapped : stops);
    const directionsLink = document.querySelector("#google-maps-directions");
    const satelliteLink = document.querySelector("#google-maps-satellite");
    if (directionsLink) directionsLink.href = directions.directions;
    if (satelliteLink) satelliteLink.href = directions.satellite;
    const container = document.querySelector("#route-schematic-container");
    if (mapped.length > 1 && container) {
      container.innerHTML = '<div id="detail-route-map" class="custom-route-detail-map" aria-label="Interactive Croydon route termini map"></div><p class="detail-muted">Map shows route termini; the Wiki stop sequence could not be loaded.</p>';
      detailRouteMap = initializeSavedRouteMap("detail-route-map", mapped);
      document.querySelector("#record-detail-dialog")?.addEventListener("close", () => { detailRouteMap?.map.remove(); detailRouteMap = null; }, { once: true });
    }
  }
}

function parseCroydonWikiStops(documentNode) {
  const groups = [];
  const headings = [...documentNode.querySelectorAll("h2,h3,h4")];
  for (const heading of headings) {
    const label = heading.textContent.trim().replace(/\[edit\]/gi, "");
    if (!/stop/i.test(label)) continue;
    let node = heading.parentElement?.nextElementSibling || heading.nextElementSibling;
    while (node && !/^H[2-4]$/.test(node.tagName)) {
      if (node.matches?.("table")) {
        const rows = [...node.querySelectorAll("tr")].slice(1);
        const stops = rows.map(row => {
          const cells = [...row.querySelectorAll("td")].map(cell => cell.textContent.trim().replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " "));
          if (!cells.length) return null;
          const name = cells.find((value, index) => value && !/^[-↓↑\[\]]+$/.test(value) && !/^\d+\s*(min|minute)/i.test(value) && (index === 0 || /stop|name/i.test(value)));
          return name && !/^(start|terminal|terminus)$/i.test(name) ? name : null;
        }).filter(Boolean);
        const cleaned = [...new Set(stops)];
        if (cleaned.length > 1) groups.push({ label, stops: cleaned });
      }
      node = node.nextElementSibling;
    }
  }
  return groups;
}

function croydonTermini(record) {
  const values = [record.origin, record.destination].filter(Boolean);
  if (values.length > 1) return values;
  const match = String(record.details || "").match(/^([^\n↔]+)\s*↔\s*([^\n]+)/);
  return match ? [match[1].trim(), match[2].trim()] : (record.stops || []).slice(0, 2);
}

async function geocodeCroydonStops(stops) {
  const names = stops.map(stop => typeof stop === "string" ? stop : stop?.name || "").filter(Boolean);
  const points = [];
  for (const name of names) {
    const key = `transport-geocode:${name.toLowerCase()}`;
    let point;
    try { point = JSON.parse(localStorage.getItem(key) || "null"); } catch { point = null; }
    if (!point) {
      try {
        const query = encodeURIComponent(`${name}, Croydon, London, UK`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`, { headers: { Accept: "application/json" } });
        const results = response.ok ? await response.json() : [];
        if (results[0]) {
          point = { name, lat: Number(results[0].lat), lon: Number(results[0].lon) };
          localStorage.setItem(key, JSON.stringify(point));
        }
      } catch { /* A map can still be opened from the Google Maps links. */ }
      await new Promise(resolve => setTimeout(resolve, 1050));
    }
    if (point && Number.isFinite(point.lat) && Number.isFinite(point.lon)) points.push({ ...point, name });
  }
  return points;
}

function buildGoogleMapsLinks(record, stops) {
  const cleanStop = stop => typeof stop === "string" ? stop : stop?.name || stop?.commonName || "";
  let first = cleanStop(stops[0]);
  let last = cleanStop(stops[stops.length - 1]);
  if (!first || !last) {
    const from = String(record.details || "").match(/(?:From|Origin|Starts at):\s*([^\n]+)/i)?.[1];
    const to = String(record.details || "").match(/(?:To|Destination|Ends at):\s*([^\n]+)/i)?.[1];
    first ||= from || "";
    last ||= to || "";
  }
  first ||= record.origin || "London";
  last ||= record.destination || record.title || "London";
  const waypoints = stops.slice(1, -1).map(cleanStop).filter(Boolean).slice(0, 3);
  const waypointQuery = waypoints.length ? `&waypoints=${encodeURIComponent(waypoints.map(stop => `${stop}, London, UK`).join("|"))}` : "";
  const directions = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(first + ", London, UK")}&destination=${encodeURIComponent(last + ", London, UK")}${waypointQuery}&travelmode=transit`;
  const coords = getCoordinates(stops);
  const center = coords.length ? `${coords[0].lat},${coords[0].lon}` : "51.5074,-0.1278";
  const satellite = `https://www.google.com/maps/@?api=1&map_action=map&center=${encodeURIComponent(center)}&zoom=12&basemap=satellite&layer=transit`;
  return { directions, satellite };
}

function getCoordinates(stops) {
  return stops.map(stop => ({ lat: Number(stop?.lat), lon: Number(stop?.lon), name: stop?.name || stop?.commonName || "" })).filter(stop => Number.isFinite(stop.lat) && Number.isFinite(stop.lon) && Math.abs(stop.lat) <= 90 && Math.abs(stop.lon) <= 180);
}

function calculateRouteDistance(points) {
  if (points.length < 2) return 0;
  const radians = degrees => degrees * Math.PI / 180;
  return points.slice(1).reduce((distance, point, index) => {
    const previous = points[index];
    const dLat = radians(point.lat - previous.lat);
    const dLon = radians(point.lon - previous.lon);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(previous.lat)) * Math.cos(radians(point.lat)) * Math.sin(dLon / 2) ** 2;
    return distance + 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, 0);
}

function initializeSavedRouteMap(elementId, stops, options = {}) {
  const element = document.getElementById(elementId);
  if (!element || stops.length < 2) return null;
  if (!window.L) {
    element.innerHTML = '<p class="map-unavailable">The interactive route map could not load. Check your connection and reopen this route.</p>';
    return null;
  }
  const map = window.L.map(element, { scrollWheelZoom: false });
  addBaseMapLayerToggle(map);
  const routeGeometry = Array.isArray(options.routeGeometry) && options.routeGeometry.length > 1 ? options.routeGeometry.map(point => [Number(point[0]), Number(point[1])]) : null;
  const route = options.placeOnly ? null : window.L.polyline(routeGeometry || stops.map(stop => [Number(stop.lat), Number(stop.lon)]), { color: "#087e78", weight: 5, opacity: 0.9 }).addTo(map);
  const markers = options.placeOnly ? addSavedPlaceMarkers(map, stops) : addSavedRouteMarkers(map, stops);
  map.fitBounds(stops.map(stop => [Number(stop.lat), Number(stop.lon)]), { padding: [24, 24] });
  requestAnimationFrame(() => map.invalidateSize());
  return { map, route, markers, stops: stops.map(stop => ({ ...stop })), routeGeometry, placeOnly: Boolean(options.placeOnly) };
}

function addSavedPlaceMarkers(map, stops) {
  return stops.map(stop => {
    const name = escapeHTML(stop.name || stop.commonName || "Place");
    return window.L.circleMarker([Number(stop.lat), Number(stop.lon)], { radius: 7, color: "#fff", weight: 2, fillColor: "#d54444", fillOpacity: 0.96 }).addTo(map).bindTooltip(name, { permanent: true, direction: "top", offset: [0, -6], className: "random-place-label" });
  });
}

function addSavedRouteMarkers(map, stops) {
  return stops.map((stop, index) => {
    const name = escapeHTML(stop.name || stop.commonName || "Stop");
    return window.L.circleMarker([Number(stop.lat), Number(stop.lon)], { radius: 6, color: "#fff", weight: 2, fillColor: "#087e78", fillOpacity: 1 }).addTo(map).bindTooltip(`${index + 1}. ${name}`).bindPopup(`<strong>${index + 1}. ${name}</strong>`);
  });
}

function updateSavedRouteMap(routeMap, stops, geometry = null) {
  if (!routeMap || stops.length < 2) return;
  if (routeMap.placeOnly) {
    routeMap.markers?.forEach(marker => routeMap.map.removeLayer(marker));
    routeMap.markers = addSavedPlaceMarkers(routeMap.map, stops);
    routeMap.map.fitBounds(stops.map(stop => [Number(stop.lat), Number(stop.lon)]), { padding: [24, 24] });
    routeMap.stops = stops.map(stop => ({ ...stop }));
    return;
  }
  const line = geometry?.length > 1 ? geometry : routeMap.routeGeometry || stops.map(stop => [Number(stop.lat), Number(stop.lon)]);
  routeMap.route.setLatLngs(line);
  routeMap.markers?.forEach(marker => routeMap.map.removeLayer(marker));
  routeMap.markers = addSavedRouteMarkers(routeMap.map, stops);
  routeMap.map.fitBounds(routeMap.route.getBounds(), { padding: [24, 24] });
  routeMap.stops = stops.map(stop => ({ ...stop }));
}

function renderSchematicMap(points) {
  const minLat = Math.min(...points.map(point => point.lat));
  const maxLat = Math.max(...points.map(point => point.lat));
  const minLon = Math.min(...points.map(point => point.lon));
  const maxLon = Math.max(...points.map(point => point.lon));
  const x = point => 20 + ((point.lon - minLon) / (maxLon - minLon || 1)) * 360;
  const y = point => 20 + ((maxLat - point.lat) / (maxLat - minLat || 1)) * 120;
  const plotted = points.map(point => `${x(point)},${y(point)}`).join(" ");
  return `<div class="route-schematic"><span class="directory-label">IN-APP ROUTE SKETCH</span><svg viewBox="0 0 400 160" role="img" aria-label="Schematic map of this route"><polyline points="${plotted}"/><circle cx="${x(points[0])}" cy="${y(points[0])}" r="6"/><circle cx="${x(points[points.length - 1])}" cy="${y(points[points.length - 1])}" r="6"/>${points.map(point => `<circle class="route-waypoint" cx="${x(point)}" cy="${y(point)}" r="3"/>`).join("")}</svg><div class="route-map-endpoints"><span>${escapeHTML(points[0].name || "Start")}</span><span>${escapeHTML(points[points.length - 1].name || "End")}</span></div><small>Station order schematic; add coordinates for a distance measurement.</small></div>`;
}

function renderRouteSchematic(stops) {
  const coordinates = getCoordinates(stops);
  if (coordinates.length > 1) return renderSchematicMap(coordinates);
  const names = stops.map(stop => typeof stop === "string" ? stop : stop?.name || stop?.commonName || "Stop");
  const points = names.map((name, index) => ({ name, lat: 80 + Math.sin(index * 1.2) * 25, lon: 20 + (index / (names.length - 1)) * 360 }));
  return renderSchematicMap(points);
}

function renderStopList(stops) {
  return `<ol class="detail-stop-list">${stops.map(stop => {
    const item = typeof stop === "string" ? { name: stop } : stop;
    const metadata = [item.stopCode, item.indicator ? `Stop ${item.indicator}` : "", item.routes?.length ? `Routes ${item.routes.join(", ")}` : ""].filter(Boolean).join(" · ");
    return `<li><span><strong>${escapeHTML(item.name || item.commonName || "Unnamed stop")}</strong>${metadata ? `<small>${escapeHTML(metadata)}</small>` : ""}</span></li>`;
  }).join("")}</ol>`;
}

async function loadTfLStopSequences(record, token, category) {
  const destination = document.querySelector("#detail-stops-content");
  if (!destination) return;
  try {
    const directions = [...new Set([record.direction, "outbound", "inbound"].filter(Boolean))];
    const results = await Promise.all(directions.map(async direction => {
      const url = `https://api.tfl.gov.uk/Line/${encodeURIComponent(record.lineId)}/Route/Sequence/${encodeURIComponent(direction)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) return { direction, groups: [] };
      const data = await response.json();
      return { direction, groups: data.stopPointSequences || [] };
    }));
    if (token !== detailViewToken) return;
    const sections = results.flatMap(result => result.groups.map((group, index) => {
      const names = (group.stopPoint || group.stopPoints || []).map(point => point.commonName || point.name || point.id).filter(Boolean);
      const orderedNames = document.querySelector("#detail-stops-content")?.dataset.reversed === "true" ? [...names].reverse() : names;
      return names.length ? `<details class="stop-sequence" open><summary>${escapeHTML(result.direction)}${result.groups.length > 1 ? ` · branch ${index + 1}` : ""}</summary>${renderStopList(orderedNames)}</details>` : "";
    })).filter(Boolean);
    const currentDestination = document.querySelector("#detail-stops-content");
    if (currentDestination && token === detailViewToken) {
      currentDestination.innerHTML = sections.length ? sections.join("") : '<p class="detail-muted">TfL did not return stop names for this route. Open the source link for route details.</p>';
      const firstGroup = results.flatMap(result => result.groups).find(group => (group.stopPoint || group.stopPoints || []).length > 1);
      const sequenceStops = (firstGroup?.stopPoint || firstGroup?.stopPoints || []).map(point => ({ name: point.commonName || point.name || point.id, lat: point.lat, lon: point.lon }));
      const orderedStops = currentDestination.dataset.reversed === "true" ? [...sequenceStops].reverse() : sequenceStops;
      const mapContainer = document.querySelector("#route-schematic-container");
      const mappedStops = getCoordinates(sequenceStops);
      if (mapContainer && mappedStops.length > 1) {
        detailRouteMap?.map.remove();
        mapContainer.innerHTML = '<div id="detail-route-map" class="custom-route-detail-map" aria-label="Interactive map of this TfL route"></div>';
        detailRouteMap = initializeSavedRouteMap("detail-route-map", mappedStops);
        updateSavedRouteMap(detailRouteMap, currentDestination.dataset.reversed === "true" ? [...mappedStops].reverse() : mappedStops);
      } else if (mapContainer) mapContainer.innerHTML = '<p class="detail-muted">TfL did not return coordinates for this route map.</p>';
      const measured = calculateRouteDistance(getCoordinates(sequenceStops));
      const measurementLabel = document.querySelector(".measured-distance");
      if (measurementLabel && measured) measurementLabel.innerHTML = `Measured route distance: <strong>${measured.toFixed(2)} km</strong>`;
      const links = buildGoogleMapsLinks(record, orderedStops);
      const directionsLink = document.querySelector("#google-maps-directions");
      const satelliteLink = document.querySelector("#google-maps-satellite");
      if (directionsLink) directionsLink.href = links.directions;
      if (satelliteLink) satelliteLink.href = links.satellite;
    }
  } catch {
    if (token === detailViewToken) {
      const currentDestination = document.querySelector("#detail-stops-content");
      if (currentDestination) currentDestination.innerHTML = '<p class="detail-muted">Could not load the TfL stops right now. Try again while online or open the source link.</p>';
    }
  }
}

document.querySelector("#record-close").addEventListener("click", () => recordDialog.close());
document.querySelector("#record-cancel").addEventListener("click", () => recordDialog.close());
document.querySelector("#photo-viewer-close").addEventListener("click", () => document.querySelector("#photo-viewer-dialog").close());
recordForm.addEventListener("submit", event => {
  event.preventDefault();
  const categoryId = recordDialog.dataset.category;
  const title = document.querySelector("#record-title").value.trim();
  if (!title || !categoryId) return;
  const previous = editingRecordId ? database[categoryId]?.find(item => item.id === editingRecordId) : null;
  const editedStops = document.querySelector("#record-stops").value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const [name, lat, lon] = line.split("|").map(part => part.trim());
    return lat && lon && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon)) ? { name, lat: Number(lat), lon: Number(lon) } : name;
  });
  const stopsEdited = Boolean(previous?.stopsEdited || (categoryId === "bus-routes" && (!previous || JSON.stringify(previous.stops || []) !== JSON.stringify(editedStops))));
  const stopSignature = stop => typeof stop === "string" ? stop.trim() : `${stop?.name || stop?.commonName || "Stop"}|${stop?.lat ?? ""}|${stop?.lon ?? ""}`;
  const previousStops = Array.isArray(previous?.stops) ? previous.stops : [];
  const stopsUnchanged = Boolean(previous && previousStops.length === editedStops.length && previousStops.every((stop, index) => stopSignature(stop) === stopSignature(editedStops[index])));
  const editedRoutePoints = editedStops.filter(stop => typeof stop === "object" && Number.isFinite(stop.lat) && Number.isFinite(stop.lon)).map(stop => [stop.lat, stop.lon]);
  const record = {
    id: editingRecordId || (crypto.randomUUID ? crypto.randomUUID() : `record-${Date.now()}`),
    title,
    operator: document.querySelector("#record-operator").value.trim(),
    status: document.querySelector("#record-status").value.trim(),
    details: document.querySelector("#record-details").value.trim(),
    imageUrl: safeProfileImage(document.querySelector("#record-image-url").value.trim()),
    imageSourceUrl: previous?.imageSourceUrl || "",
    imageArtist: previous?.imageArtist || "",
    roadSnapEnabled: previous?.roadSnapEnabled || false,
    stops: editedStops,
    routeGeometry: categoryId === "custom-train-routes" && editedRoutePoints.length > 1 ? editedRoutePoints : categoryId === "custom-bus-routes" && stopsUnchanged ? previous?.routeGeometry || [] : [],
    roadRouteDistance: categoryId === "custom-bus-routes" && stopsUnchanged ? previous?.roadRouteDistance ?? null : null,
    stopsEdited,
    axis: document.querySelector("#record-axis").value,
    sourceTitle: document.querySelector("#record-source-title").value.trim(),
    sourceUrl: safeSourceUrl(document.querySelector("#record-source-url").value.trim()),
    directoryTitle: document.querySelector("#record-directory-title").value.trim(),
    directoryUrl: safeSourceUrl(document.querySelector("#record-directory-url").value.trim()),
    modelName: previous?.modelName || title,
    manufacturer: previous?.manufacturer || "",
    lineId: previous?.lineId || "",
    direction: previous?.direction || "",
    origin: categoryId === "tfl-bus-routes" ? (editingRecordId && previous?.origin !== "custom" ? "tfl-edited" : "custom") : (previous?.origin || "custom")
  };
  database[categoryId] ||= [];
  if (editingRecordId) database[categoryId] = database[categoryId].map(item => item.id === editingRecordId ? record : item);
  else database[categoryId].unshift(record);
  saveDatabase();
  recordDialog.close();
  const category = categories.find(item => item.id === categoryId);
  if (category) renderCategory(category);
});

function renderLive(category) {
  if (routeBuilderMap?.map) routeBuilderMap.map.remove();
  routeBuilderMap = null;
  renderSidebar(category.id);
  breadcrumbs.innerHTML = `<a href="#home" data-home-link>Workspace</a><span class="crumb-slash">/</span><strong>${category.title}</strong>`;
  document.querySelector("[data-home-link]").addEventListener("click", event => { event.preventDefault(); location.hash = "home"; });
  appView.innerHTML = `<div class="main-view category-view">
    <a class="back-link" href="#home">← <span>Back to overview</span></a>
    <header class="category-header"><span class="category-icon" aria-hidden="true">${category.icon}</span><div><div class="eyebrow"><span class="eyebrow-line"></span>LIVE DATA</div><h1>${category.title}</h1><p>${category.description}</p></div></header>
    <div id="live-root"></div>
  </div>`;
  if (window.TransitLive) window.TransitLive.mount(document.querySelector("#live-root"));
  else document.querySelector("#live-root").innerHTML = '<p class="live-error" role="alert">Live departures could not load. Check that live.js is in the same folder as index.html.</p>';
}

function render() {
  window.TransitLive?.stop();
  const selectedId = decodeURIComponent(location.hash.slice(1));
  const category = categories.find(item => item.id === selectedId);
  if (category?.id === "live-departures") renderLive(category);
  else if (category) renderCategory(category); else renderHome();
}

window.addEventListener("hashchange", render);
sidebarToggle.addEventListener("click", () => setSidebarCollapsed(!sidebarCollapsed));
updateProfileUI();
setSidebarCollapsed(sidebarCollapsed);
render();

// ---- Install as an app (PWA) ----
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { /* The site still works without offline support. */ }));
}
(function setUpInstallCard() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const bottom = document.querySelector(".sidebar-bottom");
  if (standalone || !bottom) return;
  let dismissed = false;
  try { dismissed = localStorage.getItem("transitIndexInstallDismissed") === "1"; } catch { /* ignore */ }
  if (dismissed) return;
  const card = document.createElement("div");
  card.className = "install-card";
  card.hidden = true;
  bottom.prepend(card);
  const hide = () => { card.hidden = true; try { localStorage.setItem("transitIndexInstallDismissed", "1"); } catch { /* ignore */ } };
  let deferred = null;
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferred = event;
    card.innerHTML = '<strong>Install Transit Index</strong><small>Open it like an app, with offline support.</small><div><button type="button" class="button-primary" data-install>Install</button><button type="button" class="button-secondary" data-dismiss>Not now</button></div>';
    card.hidden = false;
  });
  card.addEventListener("click", async event => {
    if (event.target.closest("[data-dismiss]")) hide();
    if (event.target.closest("[data-install]") && deferred) { deferred.prompt(); await deferred.userChoice.catch(() => {}); deferred = null; card.hidden = true; }
  });
  window.addEventListener("appinstalled", () => { card.hidden = true; });
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIos) {
    card.innerHTML = '<strong>Add to Home Screen</strong><small>In Safari, tap Share, then “Add to Home Screen”.</small><div><button type="button" class="button-secondary" data-dismiss>Got it</button></div>';
    card.hidden = false;
  }
})();
