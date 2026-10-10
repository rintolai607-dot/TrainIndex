// Live departures, bus times and a live vehicle map.
// TfL's Unified API works from the browser with no key. National Rail needs a free Darwin token (see settings).
(() => {
  const SETTINGS_KEY = "transitIndexLiveSettings";
  const FAVOURITES_KEY = "transitIndexLiveFavourites";
  const REFRESH_SECONDS = 30;
  const TFL_BASE = "https://api.tfl.gov.uk";
  const DEFAULT_RAIL_BASE = "https://national-rail-api.davwheat.dev";
  const RAIL_MAP_MODES = "tube,overground,elizabeth-line,dlr";
  // Open dataset of every National Rail station with coordinates, used to draw rail service maps.
  const STATIONS_URL = "https://raw.githubusercontent.com/davwheat/uk-railway-stations/main/stations.json";

  const MODES = {
    rail: { label: "National Rail", placeholder: "Station name or code, e.g. East Croydon or ECR" },
    tube: { label: "Tube, Overground & Elizabeth line", placeholder: "Station name, e.g. Oxford Circus", tflModes: RAIL_MAP_MODES, nearTypes: "NaptanMetroStation,NaptanRailStation" },
    bus: { label: "Buses", placeholder: "Bus stop name or route number, e.g. West Croydon or 50", tflModes: "bus", nearTypes: "NaptanPublicBusCoachTram" }
  };

  const LINE_COLOURS = {
    bakerloo: "#B36305", central: "#E32017", circle: "#C9A400", district: "#00782A", dlr: "#00A4A7", "elizabeth": "#6950A1",
    "hammersmith-city": "#D77C95", jubilee: "#7D8286", metropolitan: "#9B0056", northern: "#222222", piccadilly: "#003688",
    victoria: "#0098D4", "waterloo-city": "#5FA896", liberty: "#61686B", lioness: "#E59A00", mildmay: "#0077AD",
    suffragette: "#3FA75F", weaver: "#9B4F9B", windrush: "#DC241F"
  };
  const lineColour = (lineId, isBus) => LINE_COLOURS[String(lineId || "").toLowerCase()] || (isBus ? "#DC241F" : "#087e78");

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const clock = date => date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

  function readStore(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value ?? fallback; }
    catch { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }
  const loadSettings = () => ({ railBase: DEFAULT_RAIL_BASE, railToken: "", ...readStore(SETTINGS_KEY, {}) });
  const loadFavourites = () => { const saved = readStore(FAVOURITES_KEY, []); return Array.isArray(saved) ? saved : []; };

  async function getJson(url, signal) {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal });
    if (!response.ok) {
      const error = new Error(`Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function railUrl(settings, path) {
    const base = (settings.railBase || DEFAULT_RAIL_BASE).replace(/\/+$/, "");
    const token = settings.railToken ? `${path.includes("?") ? "&" : "?"}accessToken=${encodeURIComponent(settings.railToken)}` : "";
    return `${base}${path}${token}`;
  }

  // ---- Pure parsing helpers (kept separate from the DOM so they are easy to test) ----

  function normaliseRailBoard(payload) {
    const services = Array.isArray(payload?.trainServices) ? payload.trainServices : [];
    const rows = services.map(service => {
      const estimate = String(service.etd || "");
      const cancelled = Boolean(service.isCancelled) || /cancel/i.test(estimate);
      const onTime = /on time/i.test(estimate);
      const delayed = !cancelled && !onTime && estimate !== "";
      const destination = Array.isArray(service.destination) ? service.destination.map(place => place.locationName).filter(Boolean).join(" & ") : "";
      const via = Array.isArray(service.destination) ? service.destination[0]?.via : "";
      return {
        time: service.std || "–",
        subtime: delayed && /^\d/.test(estimate) ? `Exp ${estimate}` : "",
        line: service.operator || "",
        colour: "",
        destination: destination || "Unknown destination",
        via: via || "",
        platform: service.platform || "",
        serviceId: service.serviceIdUrl || service.serviceID || "",
        group: service.platform ? `Platform ${service.platform}` : "Platform to be confirmed",
        status: cancelled ? "cancelled" : delayed ? "delayed" : "ontime",
        statusText: cancelled ? "Cancelled" : delayed ? (/^\d/.test(estimate) ? "Delayed" : estimate) : "On time",
        note: service.cancelReason || service.delayReason || "",
        length: service.length ? `${service.length} coaches` : ""
      };
    });
    const notices = Array.isArray(payload?.nrccMessages) ? payload.nrccMessages.map(message => String(message.value || message).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean) : [];
    return { title: payload?.locationName || "Station", rows, notices, updated: payload?.generatedAt ? new Date(payload.generatedAt) : new Date() };
  }

  function normaliseTflArrivals(payload, limit = 20, isBus = false) {
    const arrivals = Array.isArray(payload) ? [...payload].sort((a, b) => a.timeToStation - b.timeToStation).slice(0, limit) : [];
    const rows = arrivals.map(arrival => {
      const minutes = Math.round((arrival.timeToStation || 0) / 60);
      const direction = arrival.direction ? arrival.direction.charAt(0).toUpperCase() + arrival.direction.slice(1) : "";
      const platform = arrival.platformName && arrival.platformName !== "null" ? arrival.platformName : "";
      // Each direction (or platform, on the Tube) gets its own section so opposite directions are never mixed.
      const group = isBus ? `${arrival.lineName || "Bus"} · ${direction || "Services"}` : `${arrival.lineName || "Line"} · ${platform || direction || "Services"}`;
      return {
        group,
        vehicleId: arrival.vehicleId || "",
        lineId: arrival.lineId || "",
        direction: arrival.direction || "",
        naptanId: arrival.naptanId || "",
        towards: arrival.towards || "",
        time: (arrival.timeToStation || 0) < 60 ? "Due" : `${minutes} min`,
        subtime: arrival.expectedArrival ? clock(new Date(arrival.expectedArrival)) : "",
        line: arrival.lineName || "",
        colour: lineColour(arrival.lineId, isBus),
        destination: arrival.destinationName || arrival.towards || "Unknown destination",
        via: "",
        platform: arrival.platformName && arrival.platformName !== "null" ? arrival.platformName : "",
        status: "live",
        statusText: "Live",
        note: arrival.currentLocation || "",
        length: ""
      };
    });
    const first = Array.isArray(payload) ? payload[0] : null;
    return { title: first?.stationName || "", rows, notices: [], updated: new Date() };
  }

  // Estimated vehicle positions: each vehicle is placed at the next stop it is predicted to reach.
  function estimateVehicles(arrivals, stopsById) {
    const nextByVehicle = new Map();
    for (const arrival of Array.isArray(arrivals) ? arrivals : []) {
      const key = arrival.vehicleId || `${arrival.destinationName}-${arrival.timeToStation}`;
      const existing = nextByVehicle.get(key);
      if (!existing || arrival.timeToStation < existing.timeToStation) nextByVehicle.set(key, arrival);
    }
    const crowding = new Map();
    const vehicles = [];
    for (const [vehicleId, arrival] of nextByVehicle) {
      const stop = stopsById.get(arrival.naptanId);
      if (!stop) continue;
      const count = crowding.get(arrival.naptanId) || 0;
      crowding.set(arrival.naptanId, count + 1);
      vehicles.push({
        vehicleId,
        lat: stop.lat + count * 0.00028,
        lon: stop.lon + count * 0.00028,
        destination: arrival.destinationName || arrival.towards || "",
        nextStop: arrival.stationName || stop.name,
        minutes: Math.max(0, Math.round((arrival.timeToStation || 0) / 60)),
        location: arrival.currentLocation || "",
        direction: arrival.direction || ""
      });
    }
    return vehicles;
  }

  function parseLineStrings(sequence) {
    const lines = [];
    for (const text of Array.isArray(sequence?.lineStrings) ? sequence.lineStrings : []) {
      try {
        const parsed = JSON.parse(text);
        for (const path of parsed) lines.push(path.map(([lon, lat]) => [lat, lon]));
      } catch { /* skip malformed geometry */ }
    }
    return lines;
  }

  const looksLikeBusRoute = text => /^[a-z]{0,2}\d{1,3}[a-z]?$/i.test(text.trim());

  async function searchPlaces(mode, query, settings, signal) {
    const text = query.trim();
    if (text.length < 2) return [];
    if (mode === "rail") {
      const results = [];
      if (/^[a-z]{3}$/i.test(text)) results.push({ id: text.toUpperCase(), name: `Station code ${text.toUpperCase()}` });
      try {
        const matches = await getJson(railUrl(settings, `/crs/${encodeURIComponent(text)}`), signal);
        for (const match of Array.isArray(matches) ? matches.slice(0, 8) : []) {
          if (match.crsCode && !results.some(item => item.id === match.crsCode)) results.push({ id: match.crsCode, name: `${match.stationName} (${match.crsCode})` });
        }
      } catch (error) {
        if (error.name === "AbortError") throw error;
        if (!results.length) throw error;
      }
      return results;
    }
    const results = [];
    if (mode === "bus" && looksLikeBusRoute(text)) results.push({ kind: "route", id: text.trim().toLowerCase(), name: `Route ${text.trim().toUpperCase()} · live buses on a map` });
    const data = await getJson(`${TFL_BASE}/StopPoint/Search?query=${encodeURIComponent(text)}&modes=${MODES[mode].tflModes}&includeHubs=false&maxResults=8`, signal);
    for (const match of data.matches || []) if (match.id) results.push({ id: match.id, name: match.name });
    return results;
  }

  async function nearbyPlaces(mode, position, signal) {
    const { latitude, longitude } = position.coords;
    const data = await getJson(`${TFL_BASE}/StopPoint?lat=${latitude}&lon=${longitude}&stopTypes=${MODES[mode].nearTypes}&radius=600&useStopPointHierarchy=false&returnLines=true`, signal);
    return (data.stopPoints || []).filter(stop => stop.id).sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, 10).map(stop => {
      const lines = [...new Set((stop.lines || []).map(line => line.name))].slice(0, 6).join(", ");
      const stopName = stop.indicator ? `${stop.commonName} (${stop.indicator})` : stop.commonName;
      return { id: stop.id, name: stopName, detail: `${Math.round(stop.distance || 0)} m${lines ? ` · ${lines}` : ""}` };
    });
  }

  async function fetchBoard(mode, place, settings, signal) {
    if (mode === "rail") {
      const payload = await getJson(railUrl(settings, `/departures/${encodeURIComponent(place.id)}/12?expand=true`), signal);
      return normaliseRailBoard(payload);
    }
    const board = normaliseTflArrivals(await getJson(`${TFL_BASE}/StopPoint/${encodeURIComponent(place.id)}/Arrivals`, signal), 30, mode === "bus");
    if (!board.title) board.title = place.name;
    return board;
  }


  const TRAIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="14" rx="3.5"/><rect x="8.5" y="6" width="7" height="4" rx="1"/><circle cx="9.5" cy="13.5" r=".9" class="solid"/><circle cx="14.5" cy="13.5" r=".9" class="solid"/><path d="M8.5 20.5l1.8-3M15.5 20.5l-1.8-3"/></svg>';
  const BUS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="4" width="15" height="14" rx="3"/><path d="M4.5 11h15"/><rect x="7" y="6" width="10" height="3.5" rx=".8"/><circle cx="8.5" cy="14.5" r=".9" class="solid"/><circle cx="15.5" cy="14.5" r=".9" class="solid"/><path d="M7 18v2M17 18v2"/></svg>';
  function vehicleIcon(kind, colour) {
    const safe = /^#[0-9a-f]{6}$/i.test(colour) ? colour : "#087e78";
    return window.L.divIcon({ className: "live-vehicle-wrap", html: `<span class="live-vehicle" style="background:${safe}">${kind === "bus" ? BUS_SVG : TRAIN_SVG}</span>`, iconSize: [28, 28], iconAnchor: [14, 14], tooltipAnchor: [0, -14] });
  }

  const stopCache = new Map();
  async function loadLineStops(lineId, signal) {
    if (stopCache.has(lineId)) return stopCache.get(lineId);
    const list = await getJson(`${TFL_BASE}/Line/${encodeURIComponent(lineId)}/StopPoints`, signal);
    const byId = new Map();
    for (const stop of Array.isArray(list) ? list : []) {
      const id = stop.naptanId || stop.id;
      if (id && typeof stop.lat === "number") byId.set(id, { lat: stop.lat, lon: stop.lon, name: stop.commonName });
    }
    stopCache.set(lineId, byId);
    return byId;
  }

  function friendlyError(error, mode) {
    if (error?.name === "AbortError") return "";
    if (error?.status === 401 || error?.status === 403) return "National Rail needs a valid access token. Open “Data source settings” below and add yours.";
    if (error?.status === 429) return "Too many requests right now. Wait a minute, then refresh.";
    if (error?.status === 404) return mode === "map" ? "TfL has no live data for that route or line." : "No board found for that station or stop.";
    if (!navigator.onLine) return "You appear to be offline. Reconnect to see live times.";
    return mode === "rail" ? "Couldn’t reach the National Rail feed. Check the data source settings, or try again shortly." : "Couldn’t reach TfL. Try again shortly.";
  }

  // ---- Service details: previous stops, next stops, times and coordinates ----

  let stationIndex = null;
  async function loadStations() {
    if (stationIndex) return stationIndex;
    let list = null;
    try { list = JSON.parse(sessionStorage.getItem("transitIndexStationsV1") || "null"); } catch { list = null; }
    if (!Array.isArray(list)) {
      list = await getJson(STATIONS_URL);
      try { sessionStorage.setItem("transitIndexStationsV1", JSON.stringify(list.map(s => [s.crsCode, s.lat, s.long]))); } catch { /* optional cache */ }
      stationIndex = new Map(list.map(s => [s.crsCode, { lat: s.lat, lon: s.long }]));
    } else stationIndex = new Map(list.map(([crs, lat, lon]) => [crs, { lat, lon }]));
    return stationIndex;
  }

  const hhmm = value => (/^\d{1,2}:\d{2}/.test(String(value || "")) ? String(value).slice(0, 5) : "");

  // Turns a Huxley /service response into previous / current / next stops.
  async function fetchRailService(settings, row, boardTitle, signal) {
    if (!row.serviceId) throw Object.assign(new Error("No service id"), { status: 404 });
    const data = await getJson(railUrl(settings, `/service/${encodeURIComponent(row.serviceId)}`), signal);
    const flat = list => (Array.isArray(list) ? list : []).flatMap(group => group.callingPoint || []);
    const describe = (point, past) => {
      const actual = hhmm(point.at);
      const estimate = String(point.et || "");
      const cancelled = Boolean(point.isCancelled) || /cancel/i.test(estimate);
      let note = "";
      if (cancelled) note = "Cancelled";
      else if (past && actual) note = `Departed ${actual}`;
      else if (/on time/i.test(estimate)) note = "On time";
      else if (/^\d/.test(estimate)) note = `Expected ${estimate}`;
      else if (estimate) note = estimate;
      return { name: point.locationName, crs: point.crs, time: hhmm(point.st) || "–", note, cancelled, state: past ? "prev" : "next" };
    };
    const here = {
      name: data.locationName || boardTitle, crs: data.crs, state: "here", cancelled: false,
      time: hhmm(data.std) || hhmm(data.sta) || row.time,
      note: [data.platform ? `Platform ${data.platform}` : "", /^\d/.test(data.etd || data.eta || "") ? `Expected ${data.etd || data.eta}` : (data.etd || data.eta || "")].filter(Boolean).join(" · ")
    };
    const stops = [...flat(data.previousCallingPoints).map(p => describe(p, true)), here, ...flat(data.subsequentCallingPoints).map(p => describe(p, false))];
    let coords = new Map();
    try { coords = await loadStations(); } catch { /* the list still works without coordinates */ }
    for (const stopItem of stops) { const point = coords.get(stopItem.crs); if (point) { stopItem.lat = point.lat; stopItem.lon = point.lon; } }
    return {
      title: `${row.line ? `${row.line} · ` : ""}${row.time} to ${row.destination}`,
      subtitle: [data.operator || row.line, data.length ? `${data.length} coaches` : row.length, data.delayReason || data.cancelReason || ""].filter(Boolean).join(" · "),
      stops, source: "National Rail Darwin"
    };
  }

  // TfL: upcoming stops with predicted times from the vehicle, earlier stops from the line's route sequence.
  async function fetchTflService(row, boardTitle, signal) {
    const [vehicle, sequence] = await Promise.all([
      row.vehicleId ? getJson(`${TFL_BASE}/Vehicle/${encodeURIComponent(row.vehicleId)}/Arrivals`, signal).catch(() => []) : Promise.resolve([]),
      row.lineId && row.direction ? getJson(`${TFL_BASE}/Line/${encodeURIComponent(row.lineId)}/Route/Sequence/${encodeURIComponent(row.direction)}`, signal).catch(() => null) : Promise.resolve(null)
    ]);
    const upcoming = (Array.isArray(vehicle) ? vehicle : []).filter(item => !row.lineId || item.lineId === row.lineId).sort((a, b) => a.timeToStation - b.timeToStation);
    const branches = (sequence?.stopPointSequences || []).map(branch => (branch.stopPoint || []).map(point => ({ id: point.id, name: point.name || point.commonName, lat: point.lat, lon: point.lon })));
    const firstId = upcoming[0]?.naptanId || row.naptanId;
    const firstName = String(upcoming[0]?.stationName || "").toLowerCase();
    const matchIndex = (branch, id, name) => { const byId = branch.findIndex(point => point.id === id); return byId >= 0 ? byId : branch.findIndex(point => name && String(point.name).toLowerCase().includes(name.replace(/ (underground|rail|dlr) station$/, "").replace(/ station$/, ""))); };
    let branch = branches.find(item => matchIndex(item, firstId, firstName) >= 0) || branches[0] || [];
    const cut = Math.max(0, matchIndex(branch, firstId, firstName));
    const coordById = new Map(branches.flat().map(point => [point.id, point]));
    const previous = branch.slice(Math.max(0, cut - 10), cut).map(point => ({ name: point.name, lat: point.lat, lon: point.lon, state: "prev", time: "", note: "Already called (estimated)", cancelled: false }));
    const next = upcoming.map(item => ({
      name: String(item.stationName || item.naptanId).replace(/ (Underground|Rail|DLR) Station$/i, ""),
      lat: coordById.get(item.naptanId)?.lat, lon: coordById.get(item.naptanId)?.lon,
      state: "next", time: item.expectedArrival ? clock(new Date(item.expectedArrival)) : "",
      note: item.timeToStation < 60 ? "Due" : `${Math.round(item.timeToStation / 60)} min`, cancelled: false
    }));
    const here = next.find(stopItem => stopItem.name.toLowerCase() === String(boardTitle).toLowerCase().replace(/ (underground|rail|dlr) station$/, ""));
    if (here) here.state = "here";
    return {
      title: `${row.line} to ${row.destination}`,
      subtitle: [row.direction ? row.direction[0].toUpperCase() + row.direction.slice(1) : "", row.note ? `Now: ${row.note}` : ""].filter(Boolean).join(" · "),
      stops: [...previous, ...next], source: "TfL Unified API",
      previousNote: previous.length ? "" : "TfL doesn’t publish earlier stops for this vehicle."
    };
  }

  // ---- Interface ----

  let activeTimers = [];
  let activeController = null;
  let liveMap = null;
  let serviceMap = null;

  function stop() {
    activeTimers.forEach(clearInterval);
    activeTimers = [];
    activeController?.abort();
    activeController = null;
    if (liveMap) { liveMap.remove(); liveMap = null; }
    if (serviceMap) { serviceMap.remove(); serviceMap = null; }
  }

  function tableForRows(items, mode) {
    const lineHeading = mode === "rail" ? "Operator" : mode === "bus" ? "Route" : "Line";
    return `<div class="live-table-wrap"><table class="live-table"><thead><tr><th>${mode === "rail" ? "Due" : "Arrives"}</th><th>${lineHeading}</th><th>Destination</th><th>${mode === "bus" ? "Stop" : "Platform"}</th><th>Status</th><th><span class="sr-only">Details</span></th></tr></thead><tbody>${items.map(({ row, rowIndex }, index) => `<tr class="live-row live-row-click ${esc(row.status)}${index === 0 ? " next" : ""}" data-row="${rowIndex}" tabindex="0" role="button" aria-label="Show stops and map for the ${esc(row.time)} to ${esc(row.destination)}"><td class="live-time"><strong>${esc(row.time)}</strong>${row.subtime ? `<small>${esc(row.subtime)}</small>` : ""}</td><td class="live-line">${/^#[0-9a-f]{6}$/i.test(row.colour) ? `<span class="live-dot" style="background:${row.colour}"></span>` : ""}${esc(row.line)}</td><td><strong>${esc(row.destination)}</strong>${row.via ? `<small>${esc(row.via)}</small>` : ""}${row.length ? `<small>${esc(row.length)}</small>` : ""}</td><td>${esc(row.platform) || "–"}</td><td><span class="live-status ${esc(row.status)}">${esc(row.statusText)}</span>${row.note ? `<small>${esc(row.note)}</small>` : ""}</td><td class="live-chevron" aria-hidden="true">›</td></tr>`).join("")}</tbody></table></div>`;
  }

  // Each direction (TfL, bus) or platform (rail) gets its own table so opposite directions never mix.
  function boardTableMarkup(board, mode, lineFilter, groupFilter) {
    const indexed = board.rows.map((row, rowIndex) => ({ row, rowIndex })).filter(item => (!lineFilter || item.row.line === lineFilter) && (!groupFilter || item.row.group === groupFilter));
    if (!indexed.length) return `<p class="detail-muted live-empty">No services are listed at the moment.</p>`;
    const groups = new Map();
    for (const item of indexed) { const key = item.row.group || "Services"; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); }
    const names = [...groups.keys()].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    return names.map(name => {
      const items = groups.get(name);
      const towards = mode === "rail" ? "" : [...new Set(items.map(item => item.row.towards).filter(Boolean))].slice(0, 1)[0] || "";
      return `<section class="live-direction"><h3 class="live-direction-title">${esc(name)}${towards ? `<small>towards ${esc(towards)}</small>` : ""}</h3>${tableForRows(items, mode)}</section>`;
    }).join("");
  }

  function mount(root) {
    stop();
    const settings = loadSettings();
    let favourites = loadFavourites();
    let mode = "rail";
    let tab = "departures";
    let selected = null;
    let lastBoard = null;
    let lineFilter = "";
    let groupFilter = "";
    let boardRequest = 0;
    let secondsLeft = REFRESH_SECONDS;
    let searchTimer = null;
    const mapState = { kind: "rail", lineId: "", label: "", colour: "#087e78", fitted: false, secondsLeft: REFRESH_SECONDS, request: 0, layer: null, routeLayer: null, stopLayer: null, direction: "", vehicles: [], routes: { outbound: [], inbound: [] }, linesLoaded: false };

    root.innerHTML = `<section class="live-panel" aria-label="Live transport">
      <div class="live-tabs" role="tablist" aria-label="Live view"><button type="button" role="tab" class="live-tab selected" data-tab="departures" aria-selected="true">Departures</button><button type="button" role="tab" class="live-tab" data-tab="map" aria-selected="false">Live map</button></div>
      <div id="live-tab-departures">
        <div class="operator-filters live-modes" id="live-modes" role="group" aria-label="Choose a network">${Object.entries(MODES).map(([key, item]) => `<button type="button" class="operator-chip ${key === mode ? "selected" : ""}" data-mode="${key}" aria-pressed="${key === mode}">${esc(item.label)}</button>`).join("")}</div>
        <form class="live-search" id="live-search-form" autocomplete="off"><label class="record-search-wrap"><span aria-hidden="true">⌕</span><input id="live-query" type="search" aria-label="Search for a station or stop" placeholder="${esc(MODES[mode].placeholder)}"></label><button class="button-primary" type="submit">Search</button><button class="button-secondary" type="button" id="live-nearby" hidden>◎ Near me</button></form>
        <div class="live-results" id="live-results" aria-live="polite"></div>
        <div class="live-favourites" id="live-favourites" aria-label="Saved boards"></div>
        <section class="live-board" id="live-board" hidden>
          <div class="live-board-head"><div><h2 id="live-board-title"></h2><p class="live-board-meta" id="live-board-meta" role="status"></p></div><div class="live-board-actions"><button class="button-secondary" type="button" id="live-save">☆ Save board</button><button class="button-secondary" type="button" id="live-refresh">↻ Refresh</button></div></div>
          <div id="live-notices"></div><div class="operator-filters live-line-filters" id="live-line-filters" aria-label="Filter by route"></div><div class="operator-filters live-direction-filters" id="live-direction-filters" aria-label="Choose a direction"></div><div id="live-board-body"></div>
          <section class="live-service" id="live-service" hidden aria-live="polite"></section>
        </section>
        <p class="live-empty-hint detail-muted" id="live-hint">Search for a station or stop, or use Near me, to see live times. Boards refresh every ${REFRESH_SECONDS} seconds while this page is open.</p>
      </div>
      <div id="live-tab-map" hidden>
        <div class="operator-filters" id="live-map-kind" role="group" aria-label="Choose what to map"><button type="button" class="operator-chip selected" data-kind="rail" aria-pressed="true">Tube, Overground &amp; Elizabeth line</button><button type="button" class="operator-chip" data-kind="bus" aria-pressed="false">Bus route</button></div>
        <div class="operator-filters live-map-direction" id="live-map-direction" role="group" aria-label="Choose a direction"><span class="operator-filter-label">Direction</span><button type="button" class="operator-chip selected" data-dir="" aria-pressed="true">Both</button><button type="button" class="operator-chip" data-dir="outbound" aria-pressed="false">Outbound</button><button type="button" class="operator-chip" data-dir="inbound" aria-pressed="false">Inbound</button></div>
        <div class="live-map-pick"><select class="profile-input" id="live-map-line" aria-label="Choose a line"><option value="">Loading lines…</option></select><input class="profile-input" id="live-map-route" placeholder="Bus route, e.g. 50" maxlength="6" aria-label="Bus route number" hidden><button class="button-primary" type="button" id="live-map-go">Show on map</button></div>
        <p class="live-board-meta" id="live-map-meta" role="status">Pick a line or bus route to see where its vehicles are.</p>
        <div id="live-map" class="live-map" aria-label="Map of live vehicles"></div>
        <p class="data-note">Positions are estimates: each marker sits at the next stop that vehicle is predicted to reach, from TfL arrival predictions. National Rail doesn’t publish train positions in a form a web page can use.</p>
      </div>
      <details class="live-settings"><summary>Data source settings</summary>
        <p class="detail-muted">TfL times need no setup. National Rail times come from a Darwin Live Departure Boards proxy (Huxley 2) and usually need a free access token from National Rail Enquiries. Your token stays in this browser.</p>
        <label class="field-label" for="live-rail-base">Huxley 2 address</label><input class="profile-input" id="live-rail-base" type="url" value="${esc(settings.railBase)}" placeholder="${DEFAULT_RAIL_BASE}">
        <label class="field-label" for="live-rail-token">National Rail access token (optional)</label><input class="profile-input" id="live-rail-token" type="password" autocomplete="off" value="${esc(settings.railToken)}" placeholder="Paste token">
        <div class="friend-share-actions"><button class="button-secondary" type="button" id="live-settings-save">Save settings</button><span class="detail-muted" id="live-settings-status" role="status"></span></div>
      </details>
      <p class="data-note">Live data: Transport for London Unified API and National Rail Enquiries (Darwin). SCR is a Roblox game, so it has no real-world live feed; use the journey-time references in the SCR categories.</p>
    </section>`;

    const el = id => root.querySelector(`#${id}`);
    const syncModeChips = () => {
      root.querySelectorAll("#live-modes .operator-chip").forEach(chip => { const on = chip.dataset.mode === mode; chip.classList.toggle("selected", on); chip.setAttribute("aria-pressed", String(on)); });
      el("live-query").placeholder = MODES[mode].placeholder;
      el("live-nearby").hidden = mode === "rail" || !navigator.geolocation;
    };

    function renderFavourites() {
      const container = el("live-favourites");
      container.innerHTML = favourites.length ? `<span class="operator-filter-label">Saved</span>${favourites.map((fav, index) => `<span class="live-fav"><button type="button" class="operator-chip" data-fav="${index}">${esc(fav.name)}</button><button type="button" class="live-fav-remove" data-remove="${index}" aria-label="Remove ${esc(fav.name)}">×</button></span>`).join("")}` : "";
      updateSaveButton();
    }
    const isSaved = () => selected && favourites.some(fav => fav.mode === mode && fav.id === selected.id);
    function updateSaveButton() { const button = el("live-save"); if (button) button.textContent = isSaved() ? "★ Saved" : "☆ Save board"; }

    function paintBoard() {
      if (!lastBoard) return;
      const lines = [...new Set(lastBoard.rows.map(row => row.line).filter(Boolean))];
      if (lineFilter && !lines.includes(lineFilter)) lineFilter = "";
      el("live-line-filters").innerHTML = mode !== "rail" && lines.length > 1 ? `<span class="operator-filter-label">${mode === "bus" ? "Route" : "Line"}</span><button type="button" class="operator-chip ${lineFilter ? "" : "selected"}" data-line="">All</button>${lines.map(line => `<button type="button" class="operator-chip ${lineFilter === line ? "selected" : ""}" data-line="${esc(line)}">${esc(line)}</button>`).join("")}` : "";
      const scoped = lineFilter ? lastBoard.rows.filter(row => row.line === lineFilter) : lastBoard.rows;
      const groups = [...new Set(scoped.map(row => row.group).filter(Boolean))].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
      if (groupFilter && !groups.includes(groupFilter)) groupFilter = "";
      el("live-direction-filters").innerHTML = groups.length > 1 ? `<span class="operator-filter-label">${mode === "rail" ? "Platform" : "Direction"}</span><button type="button" class="operator-chip ${groupFilter ? "" : "selected"}" data-group="" aria-pressed="${!groupFilter}">All</button>${groups.map(name => `<button type="button" class="operator-chip ${groupFilter === name ? "selected" : ""}" data-group="${esc(name)}" aria-pressed="${groupFilter === name}">${esc(name)}</button>`).join("")}` : "";
      el("live-board-body").innerHTML = boardTableMarkup(lastBoard, mode, lineFilter, groupFilter);
    }

    async function loadBoard(manual = false) {
      if (!selected) return;
      const requestId = ++boardRequest;
      activeController?.abort();
      activeController = new AbortController();
      el("live-board").hidden = false;
      el("live-hint").hidden = true;
      el("live-board-title").textContent = selected.name;
      if (manual || !el("live-board-body").innerHTML) el("live-board-meta").textContent = "Loading live times…";
      try {
        const result = await fetchBoard(mode, selected, settings, activeController.signal);
        if (requestId !== boardRequest) return;
        lastBoard = result;
        if (result.title) el("live-board-title").textContent = result.title;
        el("live-notices").innerHTML = result.notices.map(text => `<p class="live-notice">${esc(text)}</p>`).join("");
        paintBoard();
        if (openRow) { const match = result.rows.find(r => (openRow.serviceId && r.serviceId === openRow.serviceId) || (openRow.vehicleId && r.vehicleId === openRow.vehicleId)); if (match && !manual) openService(match, true); }
        secondsLeft = REFRESH_SECONDS;
        el("live-board-meta").dataset.updated = clock(result.updated);
        updateMeta();
      } catch (error) {
        if (requestId !== boardRequest) return;
        const message = friendlyError(error, mode);
        if (!message) return;
        el("live-board-meta").textContent = "";
        el("live-board-body").innerHTML = `<p class="live-error" role="alert">${esc(message)}</p>`;
      }
    }
    function updateMeta() {
      const meta = el("live-board-meta");
      if (meta?.dataset.updated) meta.textContent = `Updated ${meta.dataset.updated} · refreshing in ${secondsLeft}s`;
    }
    function selectPlace(place) {
      closeService();
      selected = place; lastBoard = null; lineFilter = ""; groupFilter = "";
      el("live-results").innerHTML = "";
      el("live-board-body").innerHTML = ""; el("live-notices").innerHTML = ""; el("live-line-filters").innerHTML = ""; el("live-direction-filters").innerHTML = "";
      el("live-board-meta").dataset.updated = "";
      updateSaveButton();
      loadBoard(true);
    }

    function showResults(places) {
      const results = el("live-results");
      results.innerHTML = places.length ? places.map((place, index) => `<button type="button" class="live-result${place.kind === "route" ? " route" : ""}" data-result="${index}"><strong>${esc(place.name)}</strong>${place.detail ? `<small>${esc(place.detail)}</small>` : ""}</button>`).join("") : `<p class="detail-muted">No matches. Try a different spelling.</p>`;
      results.querySelectorAll("[data-result]").forEach(button => button.addEventListener("click", () => {
        const place = places[Number(button.dataset.result)];
        if (place.kind === "route") { openMapFor("bus", place.id); return; }
        selectPlace(place);
      }));
    }

    async function runSearch() {
      const query = el("live-query").value;
      const results = el("live-results");
      if (query.trim().length < 2) { results.innerHTML = ""; return; }
      results.innerHTML = `<p class="detail-muted">Searching…</p>`;
      const controller = new AbortController();
      runSearch.controller?.abort();
      runSearch.controller = controller;
      try { showResults(await searchPlaces(mode, query, settings, controller.signal)); }
      catch (error) { const message = friendlyError(error, mode); if (message) results.innerHTML = `<p class="live-error" role="alert">${esc(message)}</p>`; }
    }

    function findNearby() {
      const results = el("live-results");
      results.innerHTML = `<p class="detail-muted">Finding your location…</p>`;
      navigator.geolocation.getCurrentPosition(async position => {
        try { showResults(await nearbyPlaces(mode, position, undefined)); }
        catch (error) { results.innerHTML = `<p class="live-error" role="alert">${esc(friendlyError(error, mode) || "Couldn’t look up nearby stops.")}</p>`; }
      }, () => { results.innerHTML = `<p class="live-error" role="alert">Location is turned off for this site. Allow it in your browser settings, or search by name instead.</p>`; }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
    }

    // ---- Service details ----
    let openRow = null;
    let serviceRequest = 0;
    let serviceController = null;

    function closeService() {
      openRow = null; serviceRequest += 1;
      serviceController?.abort();
      if (serviceMap) { serviceMap.remove(); serviceMap = null; }
      el("live-service").hidden = true; el("live-service").innerHTML = "";
      el("live-board-body").hidden = false; el("live-line-filters").hidden = false; el("live-direction-filters").hidden = false;
    }

    function serviceMarkup(detail) {
      const timeline = detail.stops.map(item => `<li class="live-stop ${esc(item.state)}${item.cancelled ? " cancelled" : ""}"><span class="live-stop-time">${esc(item.time || "")}</span><span class="live-stop-dot" aria-hidden="true"></span><span class="live-stop-name"><strong>${esc(item.name)}</strong>${item.note ? `<small>${esc(item.note)}</small>` : ""}${item.state === "here" ? `<small>You are looking at this stop</small>` : ""}</span></li>`).join("");
      return `<div class="live-service-head"><button type="button" class="button-secondary" id="live-service-back">← All departures</button><div><h3>${esc(detail.title)}</h3>${detail.subtitle ? `<p class="detail-muted">${esc(detail.subtitle)}</p>` : ""}</div></div>
        <div class="live-service-body"><div><h4 class="live-service-sub">Stops</h4>${detail.previousNote ? `<p class="detail-muted">${esc(detail.previousNote)}</p>` : ""}<ol class="live-timeline">${timeline}</ol></div><div><h4 class="live-service-sub">Map</h4><div id="live-service-map" class="live-map live-service-map" aria-label="Map of this service's stops"></div></div></div>
        <p class="data-note">Source: ${esc(detail.source)}. Times are scheduled with expected times where available.</p>`;
    }

    function drawServiceMap(detail) {
      const node = el("live-service-map");
      if (!node) return;
      const points = detail.stops.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lon));
      if (!window.L || points.length < 1) { node.outerHTML = `<p class="detail-muted">${window.L ? "No map coordinates are available for these stops." : "The map library didn’t load."}</p>`; return; }
      serviceMap = window.L.map(node, { zoomControl: true });
      window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: 'Sources: <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, HERE, Garmin, USGS, Intermap, and the GIS user community' }).addTo(serviceMap);
      const colours = { prev: "#8a9a95", here: "#d1392b", next: "#087e78" };
      const prev = points.filter(item => item.state === "prev"), rest = points.filter(item => item.state !== "prev");
      const lastPrev = prev[prev.length - 1];
      if (prev.length > 1) window.L.polyline(prev.map(item => [item.lat, item.lon]), { color: colours.prev, weight: 4, dashArray: "6 6" }).addTo(serviceMap);
      const ahead = lastPrev ? [lastPrev, ...rest] : rest;
      if (ahead.length > 1) window.L.polyline(ahead.map(item => [item.lat, item.lon]), { color: colours.next, weight: 4 }).addTo(serviceMap);
      points.forEach(item => window.L.circleMarker([item.lat, item.lon], { radius: item.state === "here" ? 8 : 5, color: "#fff", weight: 2, fillColor: colours[item.state], fillOpacity: 1 }).bindTooltip(`<strong>${esc(item.name)}</strong>${item.time ? `<br>${esc(item.time)}` : ""}`).addTo(serviceMap));
      serviceMap.fitBounds(points.map(item => [item.lat, item.lon]), { padding: [24, 24], maxZoom: 15 });
      setTimeout(() => serviceMap?.invalidateSize(), 50);
    }

    async function openService(row, quiet = false) {
      openRow = row;
      const requestId = ++serviceRequest;
      serviceController?.abort();
      serviceController = new AbortController();
      const panel = el("live-service");
      el("live-board-body").hidden = true; el("live-line-filters").hidden = true; el("live-direction-filters").hidden = true; panel.hidden = false;
      if (!quiet) panel.innerHTML = `<div class="live-service-head"><button type="button" class="button-secondary" id="live-service-back">← All departures</button></div><p class="detail-muted">Loading stops and times…</p>`;
      try {
        const detail = mode === "rail" ? await fetchRailService(settings, row, selected?.name || "", serviceController.signal) : await fetchTflService(row, selected?.name || "", serviceController.signal);
        if (requestId !== serviceRequest) return;
        if (serviceMap) { serviceMap.remove(); serviceMap = null; }
        panel.innerHTML = serviceMarkup(detail);
        drawServiceMap(detail);
      } catch (error) {
        if (requestId !== serviceRequest || error?.name === "AbortError") return;
        const message = error?.status === 404 ? "This service is no longer listed, or its details aren’t available." : "Couldn’t load details for this service. Try again shortly.";
        panel.innerHTML = `<div class="live-service-head"><button type="button" class="button-secondary" id="live-service-back">← All departures</button></div><p class="live-error" role="alert">${esc(message)}</p>`;
      }
    }

    // ---- Live map ----
    async function ensureLineList() {
      if (mapState.linesLoaded) return;
      const select = el("live-map-line");
      try {
        const lines = await getJson(`${TFL_BASE}/Line/Mode/${RAIL_MAP_MODES}`);
        lines.sort((a, b) => a.name.localeCompare(b.name));
        select.innerHTML = `<option value="">Choose a line…</option>${lines.map(line => `<option value="${esc(line.id)}">${esc(line.name)}</option>`).join("")}`;
        mapState.linesLoaded = true;
      } catch { select.innerHTML = `<option value="">Couldn’t load lines. Try again.</option>`; }
    }
    function ensureMap() {
      if (liveMap) return true;
      if (!window.L) { el("live-map-meta").textContent = "The map library didn’t load. Check your connection and reload."; return false; }
      liveMap = window.L.map(el("live-map"), { zoomControl: true }).setView([51.5074, -0.1278], 10);
      window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: 'Sources: <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, HERE, Garmin, USGS, Intermap, and the GIS user community' }).addTo(liveMap);
      mapState.layer = window.L.layerGroup().addTo(liveMap);
      mapState.routeLayer = window.L.layerGroup().addTo(liveMap);
      mapState.stopLayer = window.L.layerGroup().addTo(liveMap);
      return true;
    }
    async function refreshMap(first) {
      if (!mapState.lineId || !ensureMap()) return;
      const requestId = ++mapState.request;
      const meta = el("live-map-meta");
      if (first) meta.textContent = "Loading vehicles…";
      try {
        const signal = undefined;
        const [stops, arrivals] = await Promise.all([loadLineStops(mapState.lineId, signal), getJson(`${TFL_BASE}/Line/${encodeURIComponent(mapState.lineId)}/Arrivals`, signal)]);
        if (requestId !== mapState.request || !liveMap) return;
        if (first) {
          mapState.routeLayer.clearLayers(); mapState.stopLayer.clearLayers(); mapState.routes = { outbound: [], inbound: [] };
          for (const direction of ["outbound", "inbound"]) {
            getJson(`${TFL_BASE}/Line/${encodeURIComponent(mapState.lineId)}/Route/Sequence/${direction}`).then(sequence => {
              if (requestId !== mapState.request || !liveMap) return;
              mapState.routes[direction] = parseLineStrings(sequence); drawMapRoutes();
            }).catch(() => { /* route geometry is optional */ });
          }
          if (stops.size < 500) for (const stopInfo of stops.values()) window.L.circleMarker([stopInfo.lat, stopInfo.lon], { radius: 3, color: "#fff", weight: 1, fillColor: "#6f817c", fillOpacity: 0.8 }).bindTooltip(esc(stopInfo.name)).addTo(mapState.stopLayer);
        }
        mapState.vehicles = estimateVehicles(arrivals, stops);
        const vehicles = drawMapVehicles();
        if (!mapState.fitted) {
          const points = mapState.vehicles.length ? mapState.vehicles.map(v => [v.lat, v.lon]) : [...stops.values()].map(s => [s.lat, s.lon]);
          if (points.length) liveMap.fitBounds(points, { padding: [30, 30], maxZoom: 15 });
          mapState.fitted = true;
        }
        mapState.secondsLeft = REFRESH_SECONDS;
        mapState.updated = clock(new Date());
        mapState.count = vehicles.length;
        updateMapMeta();
      } catch (error) {
        if (requestId !== mapState.request) return;
        const message = friendlyError(error, "map");
        if (message) meta.textContent = message;
      }
    }
    function drawMapRoutes() {
      if (!mapState.routeLayer) return;
      mapState.routeLayer.clearLayers();
      for (const direction of ["outbound", "inbound"]) {
        if (mapState.direction && mapState.direction !== direction) continue;
        mapState.routes[direction].forEach(path => window.L.polyline(path, { color: mapState.colour, weight: 3, opacity: 0.45, dashArray: direction === "inbound" && !mapState.direction ? "4 6" : null }).addTo(mapState.routeLayer));
      }
    }
    function drawMapVehicles() {
      const vehicles = mapState.vehicles.filter(vehicle => !mapState.direction || vehicle.direction === mapState.direction);
      mapState.layer.clearLayers();
      for (const vehicle of vehicles) {
        window.L.marker([vehicle.lat, vehicle.lon], { icon: vehicleIcon(mapState.kind, mapState.colour), title: vehicle.destination || mapState.label, keyboard: false })
          .bindTooltip(`<strong>${esc(vehicle.destination || mapState.label)}</strong><br>${vehicle.direction ? `${esc(vehicle.direction[0].toUpperCase() + vehicle.direction.slice(1))} · ` : ""}Next: ${esc(vehicle.nextStop)} · ${vehicle.minutes < 1 ? "due" : `${vehicle.minutes} min`}${vehicle.location ? `<br>${esc(vehicle.location)}` : ""}`).addTo(mapState.layer);
      }
      mapState.count = vehicles.length;
      return vehicles;
    }
    function updateMapMeta() {
      if (!mapState.updated) return;
      el("live-map-meta").textContent = `${mapState.label}${mapState.direction ? ` (${mapState.direction})` : ""}: ${mapState.count} vehicle${mapState.count === 1 ? "" : "s"} · updated ${mapState.updated} · refreshing in ${mapState.secondsLeft}s`;
    }
    function startMap(kind, lineId, label) {
      mapState.kind = kind; mapState.lineId = lineId; mapState.label = label; mapState.fitted = false; mapState.updated = ""; mapState.count = 0;
      mapState.colour = lineColour(lineId, kind === "bus");
      ensureMap();
      mapState.layer?.clearLayers(); mapState.routeLayer?.clearLayers(); mapState.stopLayer?.clearLayers();
      refreshMap(true);
    }
    function setMapKind(kind) {
      mapState.kind = kind;
      root.querySelectorAll("#live-map-kind .operator-chip").forEach(chip => { const on = chip.dataset.kind === kind; chip.classList.toggle("selected", on); chip.setAttribute("aria-pressed", String(on)); });
      el("live-map-line").hidden = kind === "bus";
      el("live-map-route").hidden = kind !== "bus";
    }
    function switchTab(next) {
      tab = next;
      root.querySelectorAll(".live-tab").forEach(button => { const on = button.dataset.tab === tab; button.classList.toggle("selected", on); button.setAttribute("aria-selected", String(on)); });
      el("live-tab-departures").hidden = tab !== "departures";
      el("live-tab-map").hidden = tab !== "map";
      if (tab === "map") { ensureLineList(); ensureMap(); setTimeout(() => liveMap?.invalidateSize(), 50); }
    }
    function openMapFor(kind, lineId) {
      switchTab("map");
      setMapKind(kind);
      if (kind === "bus") el("live-map-route").value = lineId.toUpperCase();
      startMap(kind, lineId, kind === "bus" ? `Route ${lineId.toUpperCase()}` : lineId);
    }

    root.querySelector(".live-tabs").addEventListener("click", event => { const button = event.target.closest("[data-tab]"); if (button) switchTab(button.dataset.tab); });
    el("live-map-direction").addEventListener("click", event => {
      const chip = event.target.closest("[data-dir]");
      if (!chip) return;
      mapState.direction = chip.dataset.dir;
      root.querySelectorAll("#live-map-direction .operator-chip").forEach(item => { const on = item.dataset.dir === mapState.direction; item.classList.toggle("selected", on); item.setAttribute("aria-pressed", String(on)); });
      if (!mapState.layer) return;
      const shown = drawMapVehicles(); drawMapRoutes();
      if (shown.length && liveMap) liveMap.fitBounds(shown.map(v => [v.lat, v.lon]), { padding: [30, 30], maxZoom: 15 });
      updateMapMeta();
    });
    el("live-map-kind").addEventListener("click", event => { const button = event.target.closest("[data-kind]"); if (button) setMapKind(button.dataset.kind); });
    el("live-map-go").addEventListener("click", () => {
      if (mapState.kind === "bus") {
        const route = el("live-map-route").value.trim().toLowerCase();
        if (!route) { el("live-map-meta").textContent = "Enter a bus route number, like 50."; return; }
        startMap("bus", route, `Route ${route.toUpperCase()}`);
      } else {
        const select = el("live-map-line");
        if (!select.value) { el("live-map-meta").textContent = "Choose a line first."; return; }
        startMap("rail", select.value, select.options[select.selectedIndex].text);
      }
    });
    el("live-map-route").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); el("live-map-go").click(); } });

    el("live-modes").addEventListener("click", event => {
      const button = event.target.closest("[data-mode]");
      if (!button || button.dataset.mode === mode) return;
      mode = button.dataset.mode;
      closeService();
      syncModeChips();
      el("live-query").value = "";
      el("live-results").innerHTML = "";
      el("live-query").focus();
    });
    el("live-search-form").addEventListener("submit", event => { event.preventDefault(); runSearch(); });
    el("live-query").addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 350); });
    el("live-nearby").addEventListener("click", findNearby);
    el("live-refresh").addEventListener("click", () => loadBoard(true));
    el("live-direction-filters").addEventListener("click", event => { const chip = event.target.closest("[data-group]"); if (chip) { groupFilter = chip.dataset.group; paintBoard(); } });
    el("live-line-filters").addEventListener("click", event => { const chip = event.target.closest("[data-line]"); if (chip) { lineFilter = chip.dataset.line; paintBoard(); } });
    const openFromRow = target => { const tr = target.closest("[data-row]"); const row = tr && lastBoard?.rows[Number(tr.dataset.row)]; if (row) openService(row); };
    el("live-board-body").addEventListener("click", event => openFromRow(event.target));
    el("live-board-body").addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openFromRow(event.target); } });
    el("live-service").addEventListener("click", event => { if (event.target.closest("#live-service-back")) closeService(); });
    el("live-save").addEventListener("click", () => {
      if (!selected) return;
      if (isSaved()) favourites = favourites.filter(fav => !(fav.mode === mode && fav.id === selected.id));
      else favourites = [...favourites, { mode, id: selected.id, name: selected.name }].slice(-12);
      writeStore(FAVOURITES_KEY, favourites);
      renderFavourites();
    });
    el("live-favourites").addEventListener("click", event => {
      const open = event.target.closest("[data-fav]");
      const remove = event.target.closest("[data-remove]");
      if (remove) { favourites.splice(Number(remove.dataset.remove), 1); writeStore(FAVOURITES_KEY, favourites); renderFavourites(); return; }
      if (open) {
        const fav = favourites[Number(open.dataset.fav)];
        if (!fav) return;
        mode = fav.mode;
        syncModeChips();
        selectPlace({ id: fav.id, name: fav.name });
      }
    });
    el("live-settings-save").addEventListener("click", () => {
      settings.railBase = el("live-rail-base").value.trim() || DEFAULT_RAIL_BASE;
      settings.railToken = el("live-rail-token").value.trim();
      const saved = writeStore(SETTINGS_KEY, { railBase: settings.railBase, railToken: settings.railToken });
      el("live-settings-status").textContent = saved ? "Saved." : "Couldn’t save in this browser; settings apply until you leave this page.";
      if (selected && mode === "rail") loadBoard(true);
    });

    // One timer ticks every second and refreshes whichever view is open, only while the page is visible.
    activeTimers.push(setInterval(() => {
      if (!root.isConnected) { stop(); return; }
      if (document.hidden) return;
      if (tab === "departures" && selected) {
        secondsLeft -= 1;
        if (secondsLeft <= 0) { secondsLeft = REFRESH_SECONDS; loadBoard(false); } else updateMeta();
      } else if (tab === "map" && mapState.lineId) {
        mapState.secondsLeft -= 1;
        if (mapState.secondsLeft <= 0) { mapState.secondsLeft = REFRESH_SECONDS; refreshMap(false); } else updateMapMeta();
      }
    }, 1000));

    syncModeChips();
    renderFavourites();
  }

  window.TransitLive = { mount, stop, normaliseRailBoard, normaliseTflArrivals, estimateVehicles, parseLineStrings };
})();
