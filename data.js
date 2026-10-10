// Starter facts adapted from the linked community wiki pages.
// Keep each record's source beside it so entries can be checked and updated.
window.TRANSPORT_SEED = {
  "scr-trains": [
    { id: "scr-train-waterline-165", title: "Class 165 · Waterline", operator: "Waterline", details: "In-game details\n• Two-car train\n• Maximum speed: 90 mph\n• Listed price: 2,250 points", sourceTitle: "Class 165 · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/Class_165" },
    { id: "scr-train-stepford-connect-168", title: "Class 168 · Stepford Connect", operator: "Stepford Connect", details: "In-game details\n• Four-car train\n• Maximum speed: 100 mph\n• Listed price: 1,500 points", sourceTitle: "Class 168 · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/Class_168" },
    { id: "scr-train-stepford-connect-170", title: "Class 170 · Stepford Connect", operator: "Stepford Connect", details: "In-game details\n• Two-, three- and four-car formations\n• Maximum speed: 100 mph\n• Diesel multiple unit", sourceTitle: "Class 170 · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/Class_170" }
  ],
  "scr-stations": [
    { id: "scr-station-stepford-central", title: "Stepford Central", details: "Station code: SCN\nPlatforms: 20 (8 Connect, 4 Express, 4 AirLink, 4 Metro)\nRoutes served: 55\nStep-free access via lifts", sourceTitle: "Stepford Central · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/Stepford_Central" },
    { id: "scr-station-st-helens", title: "St Helens Bridge", details: "Active platforms: 7\nRoutes served: 47", sourceTitle: "List of Stations/Statistics · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Stations/Statistics" },
    { id: "scr-station-benton", title: "Benton", details: "Active platforms: 13\nRoutes served: 42", sourceTitle: "List of Stations/Statistics · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Stations/Statistics" }
  ],
  "scr-routes": [
    { id: "scr-route-r001", title: "R001 · Stepford Central to Stepford Airport Central", operator: "Stepford Connect", stops: ["Stepford Central", "Stepford East", "St Helens Bridge", "Angel Pass", "Bodin", "Coxly", "Benton", "Benton Bridge", "Stepford Airport Parkway", "Stepford Airport Central"], details: "Operator: Stepford Connect\nListed journey time: 18 minutes\nListed route cost: 450 points", sourceTitle: "R001 · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/Routes/R001" },
    { id: "scr-route-r003", title: "R003 · Stepford Central to Leighton City", operator: "Stepford Connect", details: "Operator: Stepford Connect\nListed journey time: 22–23 minutes\nListed route cost: 300 points", sourceTitle: "List of Routes · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Routes" },
    { id: "scr-route-r004", title: "R004 · St Helens Bridge to Edgemead", operator: "Stepford Connect", details: "Operator: Stepford Connect\nListed journey time: 16–18 minutes\nListed route cost: 450 points", sourceTitle: "List of Routes · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Routes" }
  ],
  "scr-timetables": [
    { id: "scr-time-r001", title: "R001 · journey-time reference", details: "Stepford Central ↔ Stepford Airport Central\nThe wiki lists an 18-minute route time. This is a route duration reference, not a live departure time.", sourceTitle: "List of Routes · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Routes" },
    { id: "scr-time-r003", title: "R003 · journey-time reference", details: "Stepford Central ↔ Leighton City\nThe wiki lists a 22–23-minute route time. This is a route duration reference, not a live departure time.", sourceTitle: "List of Routes · SCR Wiki", sourceUrl: "https://scr.fandom.com/wiki/List_of_Routes" }
  ],
  "bus-routes": [
    { id: "croydon-route-50", title: "Route 50", operator: "Arriva (real-world operator)", stops: ["Thornton Heath Parchmore Road", "Thornton Heath Clock Tower", "Talbot Road", "Pawsons Road", "The Crescent / Beaconsfield Road", "Devonshire Road / Cromwell Road", "Hogarth Crescent", "Bedford Hall", "St Mary's Church / Delta Point", "Lunar House", "Whitgift Centre", "Fairfield Halls"], details: "Thornton Heath, Parchmore Road ↔ Croydon Town Centre (Fairfield Halls)\n12 stops towards Croydon Town Centre; 10 stops towards Thornton Heath", sourceTitle: "Route 50 · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Route_50" },
    { id: "croydon-route-450", title: "Route 450", operator: "Go-Ahead (real-world operator)", stops: ["West Croydon Bus Station", "Bedford Hall", "Hogarth Crescent", "Devonshire Road", "Windmill Road", "Windmill Grove", "Kimberly Road", "Fairgreen Road", "Bert Road", "Torridge Road", "Thornton Heath Library", "Brook Road", "Thornton Heath Station", "Parchmore Road"], details: "West Croydon Bus Station ↔ Thornton Heath, Parchmore Road\n14 stops towards Thornton Heath Parchmore Road\nListed journey time: 11 minutes", sourceTitle: "Route 450 · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Route_450" },
    { id: "croydon-route-289", title: "Route 289", details: "Waddon Marsh ↔ Elmers End\nThe wiki notes 34 stops and a journey of up to 30 minutes.", sourceTitle: "Bus Routes · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Bus_Routes" }
  ],
  "bus-types": [
    { id: "croydon-operator-alighted", title: "Alighted · Arriva", details: "One of Croydon's four free-to-access main operators.\nExample fleet types listed: Enviro 200, Enviro 400, Cadet, Metrocity and Streetlite.", sourceTitle: "Buses · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Croydon_Buses" },
    { id: "croydon-operator-centro", title: "Centro Transport · Transport UK", details: "One of Croydon's four free-to-access main operators. The wiki lists Transport UK as its real-world counterpart.", sourceTitle: "Buses · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Buses" },
    { id: "croydon-operator-croycoach", title: "Croycoach · Stagecoach", details: "One of Croydon's four free-to-access main operators. The wiki lists Stagecoach as its real-world counterpart.", sourceTitle: "Buses · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Buses" },
    { id: "croydon-operator-go-travel", title: "Go Travel · Go-Ahead London", details: "One of Croydon's four free-to-access main operators. The wiki lists Go-Ahead London as its real-world counterpart.", sourceTitle: "Buses · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Buses" }
  ],
  "bus-stops": [
    { id: "croydon-stop-fairfield", title: "Fairfield Halls", details: "Area: Croydon Town Centre\nRoutes served include 50, 60, 75, 109, 119, 166, 197, 250, 264, 312, 403, 405, 407, 433, 466, 468 and N250.\nThe wiki lists five stop positions.", sourceTitle: "Fairfield Halls Bus Stop · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Fairfield_Halls_Bus_Stop" },
    { id: "croydon-stop-hospital", title: "Croydon Hospital", details: "Area: Thornton Heath\nRoutes served include 60, 64, 109, 198, 250, 289 and N250.\nTwo main-road stops, plus a custom-company terminus stop in the hospital grounds.", sourceTitle: "Croydon Hospital Bus Stop · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Croydon_Hospital_Bus_Stop" },
    { id: "croydon-stop-torridge", title: "Torridge Road", details: "Area: Thornton Heath\nA one-way stop on route 450, between Thornton Heath and Hogarth Crescent.", sourceTitle: "Torridge Road Bus Stop · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Torridge_Road_Bus_Stop" }
  ],
  "bus-timetables": [
    { id: "croydon-shifts", title: "Hourly shifts", details: "A route is selected at random by the server each hour. Private-server owners with an active Pro subscription can also choose a route for a shift.", sourceTitle: "Croydon: London Bus Simulator · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Croydon%3A_London_Bus_Simulator" },
    { id: "croydon-rush-hours", title: "Peak-hour windows", details: "Morning rush: 07:00–10:00 GMT\nEvening rush: 16:00–19:00 GMT\nThese in-game windows increase passenger numbers at stops; the wiki notes that the schedule does not adjust for BST.", sourceTitle: "Croydon: London Bus Simulator · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Croydon%3A_London_Bus_Simulator" }
  ],
  "mainline-stations": [
    { id: "rail-all-stations-map", title: "Explore every National Rail station", details: "The official National Rail interactive map covers all stations, lines and train-company routes in Great Britain. It includes station facility and accessibility information.", sourceTitle: "National Rail Interactive Route Map", sourceUrl: "https://railmap.nationalrail.co.uk/" },
    { id: "rail-station-euston", title: "London Euston (EUS)", details: "Managed by Network Rail\nStep-free access to all platforms\nTube connections: Northern and Victoria lines", sourceTitle: "London Euston · National Rail", sourceUrl: "https://www.nationalrail.co.uk/stations/london-euston/" },
    { id: "rail-station-kings-cross", title: "London King's Cross (KGX)", details: "A major London terminus for East Coast Main Line services. LNER operates long-distance services from the station.", sourceTitle: "All Stations Route Map · National Rail", sourceUrl: "https://www.nationalrail.co.uk/travel-information/maps-of-the-national-rail-network/" },
    { id: "rail-station-paddington", title: "London Paddington (PAD)", details: "London terminus for Great Western Railway mainline services, including routes towards Bristol, Cardiff, Exeter and the South West.", sourceTitle: "GWR train times and routes", sourceUrl: "https://www.gwr.com/travel-information/train-times" }
  ],
  "mainline-lines": [
    { id: "rail-line-ecml", title: "East Coast Main Line (ECML)", details: "Runs from London King's Cross towards Scotland via Yorkshire, York, Durham and Newcastle. Network Rail describes it as connecting London to Scotland.", sourceTitle: "East Coast route · Network Rail", sourceUrl: "https://www.networkrail.co.uk/our-work/our-routes/east-coast/" },
    { id: "rail-line-wcml", title: "West Coast Main Line (WCML)", details: "Major north–south railway connecting London with the West Midlands, North West England and Scotland. London Euston is its southern terminus.", sourceTitle: "North West & Central · Network Rail", sourceUrl: "https://www.networkrail.co.uk/our-work/our-regions/north-west-and-central/" },
    { id: "rail-line-gwml", title: "Great Western Main Line", details: "Mainline services from London Paddington towards Bristol, South Wales and the South West, with branches and connecting routes across the region.", sourceTitle: "GWR train times and routes", sourceUrl: "https://www.gwr.com/travel-information/train-times" }
  ],
  "mainline-fleet": []
};

window.TRANSPORT_SEED["mainline-lines"].push(
  { id: "rail-line-ecml", title: "East Coast Main Line (ECML) · network overview", operator: "Network overview", axis: "north-south", stops: ["London King's Cross", "Peterborough", "York", "Darlington", "Newcastle", "Edinburgh Waverley"], details: "Principal route from London King's Cross to Scotland via Yorkshire and North East England. See the operator-specific service entries for example routes and calling points.", sourceTitle: "East Coast route · Network Rail", sourceUrl: "https://www.networkrail.co.uk/our-work/our-routes/east-coast/", directoryTitle: "National Rail network map", directoryUrl: "https://www.nationalrail.co.uk/travel-information/maps-of-the-national-rail-network/" },
  { id: "rail-line-wcml", title: "West Coast Main Line (WCML) · network overview", operator: "Network overview", axis: "north-south", stops: ["London Euston", "Milton Keynes Central", "Rugby", "Birmingham New Street", "Crewe", "Preston", "Carlisle", "Glasgow Central"], details: "Principal north-south route linking London, the West Midlands, North West England and Scotland. See the operator-specific service entries for example routes and calling points.", sourceTitle: "North West & Central · Network Rail", sourceUrl: "https://www.networkrail.co.uk/our-work/our-regions/north-west-and-central/", directoryTitle: "National Rail network map", directoryUrl: "https://www.nationalrail.co.uk/travel-information/maps-of-the-national-rail-network/" },
  { id: "rail-line-gwml", title: "Great Western Main Line", operator: "Great Western Railway", axis: "west-east", stops: ["London Paddington", "Reading", "Didcot Parkway", "Swindon", "Bristol Parkway", "Bristol Temple Meads"], details: "Main line west from London Paddington through Reading and Swindon to Bristol, with connecting routes to South Wales and the South West.", sourceTitle: "GWR train times and routes", sourceUrl: "https://www.gwr.com/travel-information/train-times", directoryTitle: "National Rail network map", directoryUrl: "https://www.nationalrail.co.uk/travel-information/maps-of-the-national-rail-network/" },
  { id: "rail-line-elizabeth", title: "Elizabeth line", operator: "Elizabeth line", axis: "west-east", stops: ["Reading", "Maidenhead", "Slough", "Hayes & Harlington", "Ealing Broadway", "London Paddington", "Bond Street", "Tottenham Court Road", "Farringdon", "Liverpool Street", "Stratford", "Romford", "Shenfield"], details: "Cross-London railway linking Reading and Heathrow in the west with Shenfield and Abbey Wood in the east. This directory lists the principal route sequence; branches and service patterns vary.", sourceTitle: "Elizabeth line · TfL", sourceUrl: "https://tfl.gov.uk/modes/elizabeth-line/", directoryTitle: "TfL Elizabeth line", directoryUrl: "https://tfl.gov.uk/modes/elizabeth-line/" },
  { id: "rail-line-overground", title: "London Overground", operator: "London Overground", axis: "west-east", stops: ["Richmond", "Kew Gardens", "Gunnersbury", "Acton Central", "Willesden Junction", "Kensal Rise", "Camden Road", "Highbury & Islington", "Dalston Junction", "Canada Water", "New Cross Gate"], details: "TfL network of orbital and radial routes. This sample sequence describes the Richmond/Clapham Junction to Stratford corridor; the Overground also has other routes and branches.", sourceTitle: "London Overground maps · TfL", sourceUrl: "https://tfl.gov.uk/modes/london-overground/overground-maps", directoryTitle: "TfL London Overground", directoryUrl: "https://tfl.gov.uk/modes/london-overground/" }
);
window.TRANSPORT_SEED["mainline-lines"] = [...new Map(window.TRANSPORT_SEED["mainline-lines"].map(record => [record.id, record])).values()];

// TfL's contracted fleet is made up of vehicles supplied by several operators.
// Profiles below focus on recognisable makes/models; operator filters are indicative
// London fleet associations and can be edited as allocations change.
const tflBusModels = [
  ["Enviro200", "Alexander Dennis", "Single-deck low-floor bus, commonly used on London routes with lighter passenger demand. Search photos by exact model name.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro200"],
  ["Enviro200 MMC", "Alexander Dennis", "Updated Enviro200 mid-life model with the Modular Micro-Chassis body. London examples operate as single-deck city buses in diesel and hybrid configurations.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro200"],
  ["Enviro200EV", "Alexander Dennis / BYD", "Battery-electric single-deck version of the Enviro200 family, built on BYD electric chassis for zero-emission operation.", "Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro200"],
  ["Enviro400", "Alexander Dennis", "Two-door double-deck city bus family used widely across London. Variants include conventional diesel and hybrid drivetrains.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro400"],
  ["Enviro400H", "Alexander Dennis", "Hybrid double-deck Enviro400 with a diesel-electric powertrain, built for stop-start urban services.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro400"],
  ["Enviro400H City", "Alexander Dennis", "Hybrid double-deck City variant with a curved front and updated styling, seen on high-frequency London routes.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro400"],
  ["Enviro400 MMC", "Alexander Dennis", "Modernised Enviro400 double-deck body using the Modular Micro-Chassis design. London versions include hybrid configurations.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Alexander_Dennis_Enviro400"],
  ["Enviro400EV", "Alexander Dennis / BYD", "Battery-electric double-deck variant, combining an Enviro400 body with a BYD electric chassis.", "Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://www.alexander-dennis.com/vehicles/enviro400ev/"],
  ["Enviro400EV City", "Alexander Dennis", "Zero-emission double-deck City version, designed for frequent urban operation and rapid passenger boarding.", "Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://www.alexander-dennis.com/vehicles/enviro400ev/"],
  ["BYD BD11", "BYD", "Battery-electric double-deck bus developed for the UK market. London examples have entered service with operators including Go-Ahead London.", "Go-Ahead Group", "https://en.wikipedia.org/wiki/BYD_BD11"],
  ["New Routemaster", "Wrightbus", "London-designed hybrid double-deck bus, with three doors and two staircases on the original layout. It was introduced for London services in 2012.", "Arriva Group, Go-Ahead Group, Metroline, Stagecoach", "https://en.wikipedia.org/wiki/New_Routemaster"],
  ["Wright StreetDeck Electroliner", "Wrightbus", "Battery-electric double-deck bus family, including the Electroliner variant used on London routes.", "Metroline, Go-Ahead Group, Stagecoach, First Bus", "https://wrightbus.com/electroliner"],
  ["Wright StreetDeck Hydroliner", "Wrightbus", "Hydrogen fuel-cell double-deck StreetDeck variant. Fuel-cell buses use hydrogen to generate electricity for the traction motors.", "Arriva Group", "https://wrightbus.com/hydroliner"],
  ["Wright StreetLite", "Wrightbus", "Single-deck low-floor bus family available in several lengths and powertrains, used on lower-capacity London services.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group, Transport UK, First Bus", "https://en.wikipedia.org/wiki/Wright_StreetLite"],
  ["MCV EvoSeti", "MCV", "Double-deck body built for London operation on Volvo B5LH hybrid chassis, with a conventional two-staircase layout.", "Arriva Group, Go-Ahead Group, Stagecoach", "https://en.wikipedia.org/wiki/MCV_EvoSeti"],
  ["Optare MetroCity", "Optare", "Compact single-deck bus designed for dense urban streets and routes with lower passenger demand.", "Metroline, Go-Ahead Group, Stagecoach, Arriva Group", "https://en.wikipedia.org/wiki/Optare_MetroCity"]
];
window.TRANSPORT_SEED["tfl-bus-fleet"] = tflBusModels.map(([modelName, manufacturer, details, operator, sourceUrl]) => ({
  id: `tfl-bus-model-${modelName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  title: modelName, modelName, manufacturer, operator, details,
  sourceTitle: `${modelName} · model information`, sourceUrl,
  directoryTitle: "TfL bus fleet data and audits", directoryUrl: "https://tfl.gov.uk/corporate/publications-and-reports/bus-fleet-data-and-audits",
  imageQuery: `${modelName} London bus`
}));

window.TRANSPORT_SEED["tfl-rail-fleet"] = [
  { id: "tfl-fleet-class-345", title: "Class 345 Aventra · Elizabeth line", operator: "Elizabeth line", details: "Nine-car, full-length walk-through electric trains built for high-capacity cross-London services. Class 345s run on all Elizabeth line routes and use 25 kV overhead power. Each nine-car unit has four wheelchair spaces in the middle coach, priority seating throughout, call-for-aid buttons, passenger screens, announcements and ramps where a station does not have level boarding. There are no onboard toilets. In September 2026, the first of ten additional Derby-built Class 345s entered passenger service.", sourceTitle: "Elizabeth line fleet information · TfL", sourceUrl: "https://tfl.gov.uk/cdn/static/cms/documents/elizabeth-line-fleet-information.pdf", directoryTitle: "TfL Elizabeth line", directoryUrl: "https://tfl.gov.uk/modes/elizabeth-line/" },
  { id: "tfl-fleet-class-710", title: "Class 710 Aventra · London Overground", operator: "London Overground", details: "Aventra electric multiple units built in four-car AC, four-car dual-voltage and five-car dual-voltage formations. The fleet works Gospel Oak–Barking Riverside, Watford Junction–Euston, Liverpool Street–Chingford, Liverpool Street–Enfield Town/Cheshunt and Romford–Upminster services; four-car trains can couple to eight cars at peak times. Each four-car unit has two wheelchair spaces (four when coupled), full-length walk-through interiors, call-for-assistance points, priority seating, screens and announcements. No onboard toilets.", sourceTitle: "London Overground fleet review · TfL", sourceUrl: "https://content.tfl.gov.uk/london-overground-fleet-review.pdf", directoryTitle: "TfL London Overground", directoryUrl: "https://tfl.gov.uk/modes/london-overground/" },
  { id: "tfl-fleet-class-378", title: "Class 378 Capitalstar · London Overground", operator: "London Overground", details: "Five-car Bombardier Capitalstar electric trains serving Richmond–Stratford, Clapham Junction–Stratford, Watford Junction–Euston and Highbury & Islington branches to West Croydon, Crystal Palace and Clapham Junction. The walk-through units have two wheelchair spaces, priority seats, on-train information screens and announcements; boarding ramps are available at stations. Class 378s are dual-voltage units capable of 25 kV overhead or 750 V third-rail operation. No onboard toilets.", sourceTitle: "London Overground fleet review · TfL", sourceUrl: "https://content.tfl.gov.uk/london-overground-fleet-review.pdf", directoryTitle: "TfL London Overground", directoryUrl: "https://tfl.gov.uk/modes/london-overground/" }
];

const undergroundLines = [
  ["Bakerloo", "Harrow & Wealdstone", "Elephant & Castle", ["Harrow & Wealdstone", "Wembley Central", "Queen's Park", "Paddington", "Oxford Circus", "Charing Cross", "Elephant & Castle"]],
  ["Central", "West Ruislip", "Epping", ["West Ruislip", "Ealing Broadway", "Notting Hill Gate", "Oxford Circus", "Liverpool Street", "Stratford", "Epping"]],
  ["Circle", "Hammersmith", "Edgware Road", ["Hammersmith", "Paddington", "Baker Street", "King's Cross St Pancras", "Liverpool Street", "Tower Hill", "Victoria", "Edgware Road"]],
  ["District", "Ealing Broadway", "Upminster", ["Ealing Broadway", "Earl's Court", "Victoria", "Westminster", "Monument", "Tower Hill", "Upminster"]],
  ["Hammersmith & City", "Hammersmith", "Barking", ["Hammersmith", "Paddington", "Baker Street", "King's Cross St Pancras", "Liverpool Street", "Whitechapel", "Barking"]],
  ["Jubilee", "Stanmore", "Stratford", ["Stanmore", "Wembley Park", "Baker Street", "Bond Street", "Westminster", "London Bridge", "Canary Wharf", "Stratford"]],
  ["Metropolitan", "Aldgate", "Amersham", ["Aldgate", "Liverpool Street", "King's Cross St Pancras", "Baker Street", "Wembley Park", "Harrow-on-the-Hill", "Amersham"]],
  ["Northern", "Edgware", "Morden", ["Edgware", "Camden Town", "King's Cross St Pancras", "Bank", "London Bridge", "Clapham Common", "Morden"]],
  ["Piccadilly", "Uxbridge", "Cockfosters", ["Uxbridge", "Acton Town", "Earl's Court", "South Kensington", "Green Park", "King's Cross St Pancras", "Cockfosters"]],
  ["Victoria", "Walthamstow Central", "Brixton", ["Walthamstow Central", "Seven Sisters", "Highbury & Islington", "King's Cross St Pancras", "Oxford Circus", "Victoria", "Brixton"]],
  ["Waterloo & City", "Bank", "Waterloo", ["Bank", "Waterloo"]]
];
window.TRANSPORT_SEED["lu-lines"] = undergroundLines.map(([name, from, to, stops]) => ({ id: `lu-line-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, lineId: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: `${name} line`, operator: `${name} line`, axis: "north-south", stops, details: `${from} ↔ ${to}\nPrincipal stations shown as a directory overview. Some services branch or omit stations; consult TfL for live route details.`, sourceTitle: `${name} line · TfL`, sourceUrl: `https://tfl.gov.uk/tube/route/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`, directoryTitle: "London Underground lines", directoryUrl: "https://tfl.gov.uk/modes/tube/" }));
window.TRANSPORT_SEED["lu-stations"] = [
  ["King's Cross St Pancras", "Circle, Hammersmith & City, Metropolitan, Northern, Piccadilly and Victoria lines", "Major interchange with National Rail, international rail and multiple Tube lines."],
  ["Oxford Circus", "Bakerloo, Central and Victoria lines", "Central London interchange serving Oxford Street."],
  ["Stratford", "Central and Jubilee lines", "Interchange with the Elizabeth line, London Overground, DLR and National Rail."],
  ["Waterloo", "Bakerloo, Jubilee, Northern and Waterloo & City lines", "Interchange with National Rail and river services."],
  ["Victoria", "District and Victoria lines", "Interchange with National Rail, coach services and buses."]
].map(([name, lines, details]) => ({ id: `lu-station-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, title: name, operator: "London Underground", details: `Lines: ${lines}\n${details}`, sourceTitle: `${name} station · TfL`, sourceUrl: `https://tfl.gov.uk/tube/stop/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`, directoryTitle: "London Underground map", directoryUrl: "https://tfl.gov.uk/maps/track/tube" }));
window.TRANSPORT_SEED["lu-fleet"] = [
  ["1972 Tube Stock", "Bakerloo line", "7-car trains"], ["1973 Tube Stock", "Piccadilly line", "6-car trains"], ["1992 Tube Stock", "Central line", "8-car trains"], ["1992 Tube Stock", "Waterloo & City line", "4-car trains"], ["1995 Tube Stock", "Northern line", "6-car trains"], ["1996 Tube Stock", "Jubilee line", "7-car trains"], ["2009 Tube Stock", "Victoria line", "8-car trains"], ["S7 Stock", "Circle, District and Hammersmith & City lines", "7-car trains"], ["S8 Stock", "Metropolitan line", "8-car trains"]
].map(([stock, lines, formation]) => ({ id: `lu-fleet-${stock.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${lines.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, title: `${stock} · ${lines}`, operator: lines, details: `${formation}\nCurrent allocation and fleet totals can change.`, sourceTitle: "London Underground fleet · TfL", sourceUrl: "https://tfl.gov.uk/cdn/static/cms/documents/london-underground-safety-certificate-and-safety-authorisation.pdf", directoryTitle: "TfL rolling stock information", directoryUrl: "https://tfl.gov.uk/transport-accessibility/download-accessibility-guides-and-maps" }));
window.TRANSPORT_SEED["custom-bus-routes"] = [];
window.TRANSPORT_SEED["custom-train-routes"] = [];

// Active passenger train classes and train families, organised by the operator
// that uses them. These are class-level records, not a register of individual
// unit numbers; allocations change and every entry remains editable in-app.
const mainlineFleetIndex = [
  ["Avanti West Coast", "https://www.avantiwestcoast.co.uk/about-our-trains", ["390|Pendolino", "805|Evero bi-mode", "807|Evero electric"]],
  ["c2c", "https://www.c2c-online.co.uk/about-us/our-trains/", ["357|Electrostar", "720/6|Aventra"]],
  ["Chiltern Railways", "https://www.chilternrailways.co.uk/", ["165|Networker Turbo", "168|Clubman", "68|locomotive-hauled sets"]],
  ["CrossCountry", "https://www.crosscountrytrains.co.uk/travel-information/on-board/about-our-trains", ["170|Turbostar", "220|Voyager", "221|Super Voyager"]],
  ["East Midlands Railway", "https://www.eastmidlandsrailway.co.uk/", ["158|Express Sprinter", "170|Turbostar", "180|Adelante", "360|Desiro", "810|Aurora bi-mode"]],
  ["Thameslink", "https://www.thameslinkrailway.com/travel-information/on-board/our-trains", ["700|Desiro City"]],
  ["Great Northern", "https://www.greatnorthernrail.com/travel-information/on-board/our-trains", ["387|Electrostar", "717|Desiro City"]],
  ["Southern", "https://www.southernrailway.com/travel-information/on-board/our-trains", ["171|Turbostar", "377|Electrostar"]],
  ["Gatwick Express", "https://www.gatwickexpress.com/travel-information/on-board/our-trains", ["387|Electrostar"]],
  ["Great Western Railway", "https://www.gwr.com/travel-information/on-our-trains", ["150|Sprinter", "158|Express Sprinter", "165|Networker Turbo", "166|Networker Turbo", "175|Coradia 1000 DMU", "800|Intercity Express Train", "802|Intercity Express Train"]],
  ["Greater Anglia", "https://www.greateranglia.co.uk/travel-information/onboard", ["720|Aventra", "745|FLIRT inter-city electric", "755|FLIRT bi-mode"]],
  ["LNER", "https://www.lner.co.uk/travel-information/travelling-later/our-trains/", ["800|Azuma bi-mode", "801|Azuma electric", "91|InterCity 225 locomotive and coaches"]],
  ["Northern", "https://www.northernrailway.co.uk/travel/train-types", ["150|Sprinter", "155|Sprinter", "156|Super Sprinter", "158|Express Sprinter", "170|Turbostar", "195|Civity", "323|multiple unit", "331|Civity", "333|multiple unit"]],
  ["South Western Railway", "https://www.southwesternrailway.com/travelling-with-us/our-trains", ["158|Express Sprinter", "159|South Western Turbo", "444|Desiro", "450|Desiro", "458|Juniper", "484|Island Line D-Train", "701|Arterio"]],
  ["Southeastern", "https://www.southeasternrailway.co.uk/travel-information/onboard/our-trains", ["375|Electrostar", "376|Electrostar", "395|Javelin", "465|Networker", "466|Networker", "707|Desiro City"]],
  ["TransPennine Express", "https://www.tpexpress.co.uk/travelling-with-us/onboard-facilities", ["185|Desiro", "397|Nova 2", "802|Nova 1", "68|Nova 3 locomotive and coaches"]],
  ["London Northwestern Railway", "https://www.londonnorthwesternrailway.co.uk/", ["350|Desiro", "730|Aventra"]],
  ["West Midlands Railway", "https://www.westmidlandsrailway.co.uk/", ["150|Sprinter", "170|Turbostar", "172|Turbostar", "196|Civity", "323|multiple unit", "350|Desiro", "730|Aventra"]],
  ["Elizabeth line", "https://tfl.gov.uk/modes/elizabeth-line/using-the-elizabeth-line", ["345|Aventra"]],
  ["London Overground", "https://tfl.gov.uk/modes/london-overground/overground-trains", ["378|Capitalstar", "710|Aventra"]],
  ["Merseyrail", "https://www.merseyrail.org/about-us/our-trains/", ["777|Merseyrail"]],
  ["ScotRail", "https://www.scotrail.co.uk/plan-your-journey/our-trains", ["156|Super Sprinter", "158|Express Sprinter", "170|Turbostar", "318|electric multiple unit", "320|electric multiple unit", "334|Juniper", "380|Desiro", "385|AT200"]],
  ["Transport for Wales", "https://tfw.wales/travel-information/our-trains", ["150|Sprinter", "153|Super Sprinter", "158|Express Sprinter", "170|Turbostar", "175|Coradia (transition)", "197|Civity", "230|D-Train"]],
  ["Heathrow Express", "https://www.heathrowexpress.com/tickets-fares/train-information", ["387|Electrostar"]],
  ["Hull Trains", "https://www.hulltrains.co.uk/about-us/our-trains", ["802|Paragon"]],
  ["Lumo", "https://www.lumo.co.uk/who-we-are/our-fleet", ["803|Intercity electric", "222|Meridian (Stirling–London service)"]],
  ["Stansted Express", "https://www.stanstedexpress.com/travel-information/onboard", ["745/1|FLIRT airport express"]],
  ["Grand Central", "https://www.grandcentralrail.com/travelling-with-us/on-board", ["180|Adelante"]],
  ["Caledonian Sleeper", "https://www.sleeper.scot/our-trains", ["73|locomotive", "92|electric locomotive", "Mk5|sleeper coaches"]],
  ["Eurostar", "https://www.eurostar.com/uk-en/travel-info/travel-planning/our-trains", ["373|e300 (withdrawal/limited use)", "374|e320"]],
  ["Island Line", "https://www.southwesternrailway.com/travelling-with-us/our-trains", ["484|Island Line D-Train"]]
];
const recentRailFleetStatus = new Map([
  ["Avanti West Coast|805", "Newer fleet · entered service 2024"], ["Avanti West Coast|807", "Newer fleet · entered service 2024"],
  ["East Midlands Railway|810", "New train · entered passenger service 2025/26"],
  ["Great Western Railway|175", "In passenger service · first unit entered service December 2025"],
  ["Greater Anglia|720", "Newer fleet · introduced 2020–23"], ["Greater Anglia|745", "Newer fleet · introduced 2019–20"], ["Greater Anglia|755", "Newer fleet · introduced 2019–20"],
  ["South Western Railway|701", "Newer fleet · rollout underway"],
  ["West Midlands Railway|730", "Recent fleet · new units entered service 2025"], ["London Northwestern Railway|730", "Recent fleet · introduced 2023–25"],
  ["Merseyrail|777", "New fleet · entered service from 2023"], ["Lumo|803", "New fleet · introduced 2021/22"],
  ["London Overground|710", "Newer fleet · introduced from 2018"], ["Elizabeth line|345", "New fleet · entered service 2022"]
]);

for (const [operator, sourceUrl, classes] of mainlineFleetIndex) {
  for (const item of classes) {
    const [classNumber, family] = item.split("|");
    const id = `rail-fleet-${operator.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${classNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const title = classNumber === "Mk5" ? `Mark 5 sleeper coaches · ${operator}` : `Class ${classNumber} ${family} · ${operator}`;
    const recentStatus = recentRailFleetStatus.get(`${operator}|${classNumber}`);
    const isScotRail385 = operator === "ScotRail" && classNumber === "385";
    const isGwr175 = operator === "Great Western Railway" && classNumber === "175";
    const isC2c720 = operator === "c2c" && classNumber === "720/6";
    window.TRANSPORT_SEED["mainline-fleet"].push({
      id, title, operator,
      details: isC2c720
        ? `Train family: Alstom Aventra electric multiple unit.\nc2c's Class 720/6 fleet consists of twelve 5-car units, operating alongside the Class 357 fleet. The photo search is limited to c2c-branded trains.`
        : isGwr175
        ? `Train family: Alstom Coradia 1000 diesel multiple unit.\nGWR began introducing the Class 175 into passenger service in December 2025. Its 26 units comprise ten 2-car and sixteen 3-car trains, serving local and regional routes in Devon and Cornwall. Current GWR 175 livery: silver-grey body, red accents and yellow front.`
        : isScotRail385
          ? `Train family: Hitachi AT200 electric multiple unit.\nScotRail's Class 385 fleet operates in 3- and 4-car formations, which can be coupled. The photograph shows a real ScotRail Class 385/0 at Glasgow Central in 2026, in ScotRail's own current livery.`
          : `Train family: ${family}.\nListed for ${operator} in this class-level fleet directory. Fleet allocations and service status can change; check the linked operator source and edit this entry when needed.`,
      ...(isGwr175 ? { imageQuery: "GWR Class 175 current livery 175112 175113 Truro 2026" } : {}),
      ...(isC2c720 ? { imageQuery: "c2c Class 720/6 720604 c2c livery" } : {}),
      ...(isScotRail385 ? {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Class_385_0_Glasgow.jpg/1280px-Class_385_0_Glasgow.jpg",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Class_385_0_Glasgow.jpg",
        imageArtist: "TriStateGuy · CC BY 4.0",
        imageQuery: "ScotRail Class 385 Glasgow"
      } : {}),
      ...(recentStatus ? { status: recentStatus } : {}),
      ...( /planned|transition|withdrawal|limited/i.test(family) ? { status: /planned/i.test(family) ? "Planned" : "Transition / limited service" } : {}),
      sourceTitle: isGwr175 ? "GWR Class 175 introduction · UK Parliament" : `${operator} · train and fleet information`,
      sourceUrl: isGwr175 ? "https://questions-statements.parliament.uk/written-questions/detail/2026-01-02/101858" : sourceUrl,
      directoryTitle: isGwr175 ? "GWR Facilities Guide · Class 175" : "GB passenger rail operators",
      directoryUrl: isGwr175 ? "https://www.gwr.com/-/media/gwr-sc-website/files/passenger-assist/2026/GWR-Facilities-Guide-January-2026.pdf" : "https://www.nationalrail.co.uk/travel-information/find-a-train-company/"
    });
  }
}
window.TRANSPORT_SEED["mainline-fleet"] = [...new Map(window.TRANSPORT_SEED["mainline-fleet"]
  .filter(record => !["Elizabeth line", "London Overground"].includes(record.operator))
  .map(record => [record.id, record])).values()];

// Operator-specific examples of principal mainline corridors and services.
// Keep route stops editable; use a specific operating brand in the operator field.
const operatorMainlineRoutes = [
  ["LNER", "London King's Cross → Edinburgh Waverley", ["London King's Cross", "York", "Newcastle", "Edinburgh Waverley"], "https://www.lner.co.uk/"],
  ["Lumo", "London King's Cross → Edinburgh Waverley", ["London King's Cross", "Newcastle", "Morpeth", "Edinburgh Waverley"], "https://www.lumo.co.uk/where-we-travel/our-routes"],
  ["Hull Trains", "London King's Cross → Hull", ["London King's Cross", "Doncaster", "Brough", "Hull"], "https://www.hulltrains.co.uk/"],
  ["Grand Central", "London King's Cross → Bradford / Sunderland", ["London King's Cross", "York", "Northallerton", "Bradford Interchange"], "https://www.grandcentralrail.com/"],
  ["CrossCountry", "Southampton → Manchester / Newcastle", ["Southampton Central", "Reading", "Birmingham New Street", "Manchester Piccadilly", "York", "Newcastle"], "https://www.crosscountrytrains.co.uk/"],
  ["Avanti West Coast", "London Euston → Glasgow Central", ["London Euston", "Milton Keynes Central", "Birmingham New Street", "Preston", "Carlisle", "Glasgow Central"], "https://www.avantiwestcoast.co.uk/"],
  ["London Northwestern Railway", "London Euston → Birmingham New Street", ["London Euston", "Milton Keynes Central", "Rugby", "Birmingham New Street"], "https://www.londonnorthwesternrailway.co.uk/"],
  ["West Midlands Railway", "Birmingham New Street → Shrewsbury", ["Birmingham New Street", "Wolverhampton", "Telford Central", "Shrewsbury"], "https://www.westmidlandsrailway.co.uk/"],
  ["Great Western Railway", "London Paddington → Bristol Temple Meads", ["London Paddington", "Reading", "Swindon", "Bristol Parkway", "Bristol Temple Meads"], "https://www.gwr.com/"],
  ["East Midlands Railway", "London St Pancras → Nottingham", ["London St Pancras", "Luton", "Kettering", "Leicester", "Derby", "Nottingham"], "https://www.eastmidlandsrailway.co.uk/"],
  ["TransPennine Express", "Liverpool Lime Street → Newcastle", ["Liverpool Lime Street", "Manchester Victoria", "Leeds", "York", "Newcastle"], "https://www.tpexpress.co.uk/"],
  ["Northern", "Manchester Piccadilly → Leeds", ["Manchester Piccadilly", "Huddersfield", "Dewsbury", "Leeds"], "https://www.northernrailway.co.uk/"],
  ["ScotRail", "Glasgow Queen Street → Edinburgh Waverley", ["Glasgow Queen Street", "Croy", "Falkirk High", "Haymarket", "Edinburgh Waverley"], "https://www.scotrail.co.uk/"],
  ["Transport for Wales", "Cardiff Central → Manchester Piccadilly", ["Cardiff Central", "Newport", "Hereford", "Shrewsbury", "Crewe", "Manchester Piccadilly"], "https://tfw.wales/"],
  ["Southeastern", "London St Pancras → Ashford International", ["London St Pancras", "Stratford International", "Ebbsfleet International", "Ashford International"], "https://www.southeasternrailway.co.uk/"],
  ["South Western Railway", "London Waterloo → Exeter St Davids", ["London Waterloo", "Basingstoke", "Salisbury", "Yeovil Junction", "Exeter St Davids"], "https://www.southwesternrailway.com/"],
  ["c2c", "London Fenchurch Street → Shoeburyness", ["London Fenchurch Street", "Barking", "Upminster", "Basildon", "Southend Central", "Shoeburyness"], "https://www.c2c-online.co.uk/"],
  ["Chiltern Railways", "London Marylebone → Birmingham Moor Street", ["London Marylebone", "High Wycombe", "Bicester North", "Banbury", "Solihull", "Birmingham Moor Street"], "https://www.chilternrailways.co.uk/"],
  ["Thameslink", "Bedford → Brighton", ["Bedford", "St Pancras International", "Farringdon", "London Bridge", "East Croydon", "Brighton"], "https://www.thameslinkrailway.com/"],
  ["Great Northern", "London King's Cross → Cambridge", ["London King's Cross", "Finsbury Park", "Stevenage", "Royston", "Cambridge"], "https://www.greatnorthernrail.com/"],
  ["Southern", "London Victoria → Brighton", ["London Victoria", "Clapham Junction", "East Croydon", "Three Bridges", "Brighton"], "https://www.southernrailway.com/"],
  ["Gatwick Express", "London Victoria → Gatwick Airport", ["London Victoria", "Gatwick Airport"], "https://www.gatwickexpress.com/"],
  ["Greater Anglia", "London Liverpool Street → Norwich", ["London Liverpool Street", "Colchester", "Ipswich", "Diss", "Norwich"], "https://www.greateranglia.co.uk/"],
  ["Stansted Express", "London Liverpool Street → Stansted Airport", ["London Liverpool Street", "Tottenham Hale", "Bishop's Stortford", "Stansted Airport"], "https://www.stanstedexpress.com/"],
  ["Merseyrail", "Liverpool Central → Southport", ["Liverpool Central", "Sandhills", "Formby", "Southport"], "https://www.merseyrail.org/"],
  ["Heathrow Express", "London Paddington → Heathrow Airport", ["London Paddington", "Heathrow Central", "Heathrow Terminal 5"], "https://www.heathrowexpress.com/"],
  ["Caledonian Sleeper", "London Euston → Fort William", ["London Euston", "Edinburgh Waverley", "Fort William"], "https://www.sleeper.scot/"],
  ["Elizabeth line", "Reading → Abbey Wood", ["Reading", "Ealing Broadway", "London Paddington", "Tottenham Court Road", "Liverpool Street", "Canary Wharf", "Abbey Wood"], "https://tfl.gov.uk/modes/elizabeth-line/"],
  ["London Overground", "Richmond → Stratford", ["Richmond", "Kew Gardens", "Gunnersbury", "Acton Central", "Willesden Junction", "Highbury & Islington", "Stratford"], "https://tfl.gov.uk/modes/london-overground/"],
  ["Island Line", "Ryde Pier Head → Shanklin", ["Ryde Pier Head", "Ryde Esplanade", "Brading", "Sandown", "Shanklin"], "https://www.southwesternrailway.com/"
  ]
];
for (const [operator, title, stops, sourceUrl] of operatorMainlineRoutes) {
  const id = `rail-route-${operator.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  window.TRANSPORT_SEED["mainline-lines"].push({
    id, title, operator, stops, axis: "north-south",
    details: `Illustrative principal service route operated by ${operator}. This is a simplified calling-point sequence for directory and map display; some services take different stopping patterns.`,
    sourceTitle: `${operator} · routes and destinations`, sourceUrl,
    directoryTitle: "Find a train company · National Rail", directoryUrl: "https://www.nationalrail.co.uk/travel-information/find-a-train-company/"
  });
}
window.TRANSPORT_SEED["lu-fleet"].push({ id: "lu-fleet-new-piccadilly", title: "New Siemens train · Piccadilly line", operator: "Piccadilly line", status: "New train · passenger service forecast Dec 2026–Jun 2027", details: "New Siemens-built Piccadilly line train, now in testing. TfL's published passenger-service window is December 2026 to June 2027; this is not yet a regular passenger fleet entry.", sourceTitle: "Piccadilly line upgrade · TfL", sourceUrl: "https://tfl.gov.uk/travel-information/improvements-and-projects/piccadilly-line-upgrade", directoryTitle: "TfL Underground rolling stock", directoryUrl: "https://tfl.gov.uk/transport-accessibility/download-accessibility-guides-and-maps" });

// Full operator indexes from the community wiki category directories.
// Their individual class/route pages hold the detailed specifications and calling points.
const scrOperatorCatalogues = [
  { name: "Stepford Connect", trainCategory: "Stepford_Connect_Trains", routeCategory: "Stepford_Connect_Routes", trains: ["68", "156", "158", "168", "170", "185", "195", "321", "331", "333", "350", "357", "360", "365", "377", "380", "385", "387", "444", "458", "700", "707", "720", "730"], routes: ["001", "003", "004", "005", "007", "009", "020", "022", "024", "025", "026", "032", "033", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "048", "049", "050", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109"] },
  { name: "Waterline", trainCategory: "Waterline_Trains", routeCategory: "Waterline_Routes", trains: ["143", "165", "166", "171", "195", "313", "319", "323", "379", "508", "730"], routes: ["010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "120"] },
  { name: "AirLink", trainCategory: "AirLink_Trains", routeCategory: "AirLink_Routes", trains: ["185", "332", "345", "360", "387", "397", "745", "755", "802"], routes: ["051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "063"], formerRoutes: ["061", "062"] },
  { name: "Metro", trainCategory: "Metro_Trains", routeCategory: "Metro_Routes", trains: ["398", "555", "717", "756", "777"], routes: ["002", "006", "008", "021", "023", "027", "028", "029", "030", "031", "034", "047", "130", "131", "132", "133", "134", "135", "136", "137", "139", "140", "141", "142", "143", "144"] },
  { name: "Stepford Express", trainCategory: "Stepford_Express_Trains", routeCategory: "Stepford_Express_Routes", trains: ["43", "91", "180", "220", "221", "390", "397", "800", "801", "80x"], routes: ["075", "076", "077", "078", "079", "080", "081", "082", "083", "084", "085", "086", "087", "088"] }
];

const latestScrModels = new Map([
  ["Stepford Express|91", ["New model · SCR v2.3.0", "The Class 91 was added to Stepford Express in Version 2.3.0. This entry follows the current in-game class page and its gallery images."]],
  ["Metro|398", ["New model · SCR v2.3.0", "The Class 398 tram-train and its Metro service were added in Version 2.3.0."]],
  ["Stepford Connect|700", ["New model · SCR v2.3.0", "The Class 700 was added to Stepford Connect in Version 2.3.0."]],
  ["Stepford Connect|350", ["Latest variant · SCR v2.3.0", "The current Class 350 model was remeshed for Version 2.2.2, and the double Class 350/1 variant was added in Version 2.3.0."]],
  ["Stepford Connect|185", ["Latest variant · SCR v2.3.0", "A double Class 185 variant was added to Stepford Connect in Version 2.3.0."]],
  ["AirLink|185", ["Latest remesh · SCR v2.2.4", "The AirLink Class 185 received its latest remesh in Version 2.2.4; this profile uses the AirLink liveried in-game Wiki image where a front-facing view is available."]],
  ["Stepford Connect|385", ["Latest variant · SCR v2.3.0", "Double Class 385/0 and /1 variants were added to Stepford Connect in Version 2.3.0."]],
  ["Stepford Connect|168", ["Latest remesh · SCR v2.3.3", "Remeshed in SCR Version 2.3.3. The in-game Class 168 is a four-coach, diesel-powered Turbostar with a 100 mph top speed, 16 passenger doors and a 1,500-point price. Built in-game for Stepford Connect, it is a regional diesel unit for routes beyond the electrified network."]],
  ["Stepford Connect|387", ["Latest remesh · SCR v2.3.4", "The Electrostar family received its second remesh in SCR Version 2.3.4. The Class 387 returned to Stepford Connect as the 387/1, alongside its AirLink 387/2 variant; check the class page for the operator-specific liveries and formations. The AirLink version is a four-coach dual-voltage train with a 110 mph top speed, and an eight-coach double is available in-game."]],
  ["Stepford Connect|377", ["Latest remesh · SCR v2.3.4", "Remeshed for a second time with the Electrostar family in SCR Version 2.3.4. The Stepford Connect Class 377 is a five-coach Bombardier Electrostar with 20 passenger doors, a 100 mph top speed and dual-voltage power for 25 kV overhead or 750 V third-rail sections."]],
  ["Waterline|379", ["Latest remesh · SCR v2.3.4", "Remeshed for a second time with the Electrostar family in SCR Version 2.3.4. The Waterline Class 379 is a four-coach Bombardier Electrostar with 16 passenger doors, a 100 mph top speed and 25 kV overhead power. The class page records its Waterline allocation and current in-game configuration."]]
]);

for (const operator of scrOperatorCatalogues) {
  const trainDirectory = `https://scr.fandom.com/wiki/Category:${operator.trainCategory}`;
  const routeDirectory = `https://scr.fandom.com/wiki/Category:${operator.routeCategory}`;
  for (const trainClass of operator.trains) {
    const classTitle = trainClass === "80x" ? "Class 80x" : `Class ${trainClass}`;
    const classSlug = trainClass.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const latestModel = latestScrModels.get(`${operator.name}|${trainClass}`);
    window.TRANSPORT_SEED["scr-trains"].push({
      id: `scr-train-${operator.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${classSlug}`,
      title: `${classTitle} · ${operator.name}`,
      operator: operator.name,
      details: `${latestModel ? `${latestModel[1]}\n` : ""}Listed in the ${operator.name} train directory. Open the class page for variants, speed, formation, manufacturer and availability. Wiki operator lists can include former or partial service.` ,
      ...(latestModel ? { status: latestModel[0] } : {}),
      sourceTitle: `${classTitle} · SCR Wiki`,
      sourceUrl: `https://scr.fandom.com/wiki/${encodeURIComponent(classTitle.replaceAll(" ", "_"))}`,
      directoryUrl: trainDirectory
    });
  }
  for (const routeNumber of operator.routes) {
    window.TRANSPORT_SEED["scr-routes"].push({
      id: `scr-route-r${routeNumber}`,
      title: `R${routeNumber} · ${operator.name}`,
      operator: operator.name,
      details: `Operator: ${operator.name}\nOpen the route page for termini, calling points, travel time, route type and compatible trains.`,
      sourceTitle: `R${routeNumber} · SCR Wiki route page`,
      sourceUrl: `https://scr.fandom.com/wiki/R${routeNumber}`,
      directoryUrl: routeDirectory
    });
  }
  for (const routeNumber of operator.formerRoutes || []) {
    window.TRANSPORT_SEED["scr-routes"].push({
      id: `scr-route-r${routeNumber}`,
      title: `R${routeNumber} · ${operator.name} · removed`,
      operator: operator.name,
      details: `Former ${operator.name} route. This route appeared for the April Fools' 2025 update and was removed in Version 2.1.4. The source page includes the calling points and service history.`,
      sourceTitle: `R${routeNumber} · SCR Wiki route page`,
      sourceUrl: `https://scr.fandom.com/wiki/R${routeNumber}`,
      directoryUrl: routeDirectory,
      status: "Former"
    });
  }
}

for (const [trainClass, status] of [["08", "Scenery only"], ["66", "Scenery only"], ["465", "Retired"], ["701", "Retired"]]) {
  window.TRANSPORT_SEED["scr-trains"].push({
    id: `scr-train-other-${trainClass}`,
    title: `Class ${trainClass} · ${status}`,
    operator: "Other / former / scenery",
    details: `${status} train entry. Open the full SCR train list for its notes and status.` ,
    sourceTitle: `Class ${trainClass} · SCR Wiki`,
    sourceUrl: `https://scr.fandom.com/wiki/Class_${trainClass}`,
    directoryUrl: "https://scr.fandom.com/wiki/List_of_Trains",
    status
  });
}

for (const [title, operator] of [["Mark 3 Coaches", "Stepford Connect"], ["Mark 4 Coaches", "Stepford Express"]]) {
  window.TRANSPORT_SEED["scr-trains"].push({
    id: `scr-train-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `${title} · ${operator}`,
    operator,
    details: `Coach stock listed in the SCR train directory for ${operator}. Open the source page for consist and availability notes.`,
    sourceTitle: `${title} · SCR Wiki`,
    sourceUrl: "https://scr.fandom.com/wiki/List_of_Trains",
    directoryTitle: "SCR train directory",
    directoryUrl: "https://scr.fandom.com/wiki/List_of_Trains"
  });
}

// Current route codes and operator groupings from the SCR Wiki route directory.
const scrRouteSets = {
  "Stepford Connect": ["R001","R003","R004","R005","R007","R009","R020","R022","R024","R025","R026","R032","R033","R035","R036","R037","R038","R039","R040","R041","R042","R043","R044","R045","R046","R048","R049","R050","R100","R101","R102","R103","R104","R105","R106","R107","R108","R109"],
  "Metro": ["R002","R006","R008","R021","R023","R027","R028","R029","R030","R031","R034","R047","R130","R131","R132","R133","R134","R135","R136","R137","R139","R140","R141","R142","R143","R144"],
  "Waterline": ["R010","R011","R012","R013","R014","R015","R016","R017","R018","R019","R120"],
  "AirLink": ["R051","R052","R053","R054","R055","R056","R057","R058","R059","R060","R063"],
  "Stepford Express": ["R075","R076","R077","R078","R079","R080","R081","R082","R083","R084","R085","R086","R087","R088"]
};
for (const [operator, routes] of Object.entries(scrRouteSets)) {
  for (const route of routes) {
    const id = `scr-route-${route.toLowerCase()}`;
    const existing = window.TRANSPORT_SEED["scr-routes"].find(entry => entry.id === id);
    const entry = {
      id, title: `${route} · ${operator}`, operator,
      details: `Current ${operator} route listed in the SCR Wiki route directory. Open the route details to load its station sequence, journey facts and route source.`,
      sourceTitle: `${route} · SCR Wiki`, sourceUrl: `https://scr.fandom.com/wiki/${route}`,
      directoryTitle: "List of Routes · SCR Wiki", directoryUrl: "https://scr.fandom.com/wiki/List_of_Routes"
    };
    if (existing) {
      existing.operator ||= entry.operator;
      existing.directoryTitle ||= entry.directoryTitle;
      existing.directoryUrl ||= entry.directoryUrl;
      if (existing.sourceUrl?.endsWith("/List_of_Routes")) { existing.sourceTitle = entry.sourceTitle; existing.sourceUrl = entry.sourceUrl; }
    } else window.TRANSPORT_SEED["scr-routes"].push(entry);
  }
}
for (let index = 1; index <= 5; index++) {
  const route = `R90${index}`;
  window.TRANSPORT_SEED["scr-routes"].push({
    id: `scr-route-${route.toLowerCase()}`, title: `${route} · Training route`, operator: "Training",
    status: "Training only", details: "Special training route described by the SCR Wiki. Its route follows Greenslade, Elsemere Pond and Houghton Rake.",
    sourceTitle: `${route} · SCR Wiki`, sourceUrl: "https://scr.fandom.com/wiki/List_of_Routes",
    directoryTitle: "List of Routes · SCR Wiki", directoryUrl: "https://scr.fandom.com/wiki/List_of_Routes"
  });
}

const croydonRouteCatalog = [
  ["50", "Arriva"], ["60", "Arriva"], ["64", "Arriva"], ["75", "Stagecoach"], ["109", "Transport UK"], ["119", "Go-Ahead"], ["130", "Transport UK"], ["157", "Go-Ahead"], ["166", "Arriva"], ["194", "Arriva"], ["197", "Go-Ahead"], ["198", "Arriva"], ["250", "Arriva"], ["264", "Go-Ahead"], ["289", "Arriva"], ["312", "Arriva"], ["367", "Transport UK"], ["403", "Go-Ahead"], ["405", "Arriva"], ["407", "Transport UK"], ["412", "Arriva"], ["433", "Transport UK"], ["450", "Go-Ahead"], ["455", "Withdrawn (formerly Go-Ahead)"], ["466", "Arriva"], ["468", "Arriva"], ["S4", "Transport UK"], ["N68", "Transport UK"], ["N250", "Arriva"], ["TR1", "Tram replacement"], ["TR2", "Tram replacement"], ["TR3", "Tram replacement"], ["RR1", "Rail replacement"], ["RR2", "Rail replacement"], ["RR3", "Rail replacement"], ["RR4", "Rail replacement"], ["SCS", "Cycle shuttle"]
];

// Endpoints and operator labels follow the Centro Travel Wiki route directory.
const croydonRouteEndpoints = {
  "50": ["Croydon Town Centre (Fairfield Halls)", "Thornton Heath, Parchmore Road"],
  "60": ["Thornton Heath Pond", "South Croydon Bus Garage"], "64": ["Thornton Heath Pond", "South Croydon, Coombe Road"],
  "75": ["Croydon Town Centre (Fairfield Halls)", "Norwood Junction"], "109": ["Thornton Heath Pond", "Croydon Town Centre (Katharine Street)"],
  "119": ["Addiscombe Road, Shirley Road", "South Croydon, South End"], "130": ["Thornton Heath, Parchmore Road", "Coombe Lane Tram Stop"],
  "157": ["West Croydon", "Norwood Junction"], "166": ["West Croydon", "South Croydon Bus Garage"], "194": ["Addiscombe Road, Shirley Road", "West Croydon"],
  "197": ["Croydon Town Centre (Fairfield Halls)", "Norwood Junction"], "198": ["Thornton Heath, High Street", "Shirley Road, Addiscombe"],
  "250": ["Croydon Town Centre (Fairfield Halls)", "Thornton Heath, Parchmore Road"], "264": ["Croydon Town Centre (Katharine Street)", "Mitcham Common"],
  "289": ["Waddon Marsh", "Elmers End Interchange"], "312": ["South Croydon Bus Garage", "Norwood Junction"], "367": ["West Croydon", "Shirley Road, Addiscombe"],
  "403": ["West Croydon", "South Croydon, South End"], "405": ["Croydon Town Centre (Park Street)", "South Croydon, South End"],
  "407": ["West Croydon", "South Croydon Bus Garage"], "412": ["Croydon Town Centre (Katharine Street)", "South Croydon, South End"],
  "433": ["Croydon Town Centre (Park Street)", "South Croydon, Coombe Road"], "450": ["West Croydon", "Thornton Heath, Parchmore Road"],
  "455": ["Beddington Superstore", "South Croydon, South End"], "466": ["Coombe Lane Tram Stop", "South Croydon Bus Garage"],
  "468": ["Thornton Heath, High Street", "South Croydon, South End"], "S4": ["Beddington Superstore", "Waddon Marsh"],
  "N68": ["Thornton Heath, High Street", "South Croydon Bus Garage"], "N250": ["Thornton Heath, Parchmore Road", "Croydon Town Centre (Fairfield Halls)"],
  "TR1": ["Elmers End", "West Croydon (via Sandilands)"], "TR2": ["Elmers End", "West Croydon (via Addiscombe)"],
  "TR3": ["Coombe Lane Tram Stop", "Therapia Lane Tram Stop"], "RR1": ["South Croydon, South End", "Norwood Junction"],
  "RR2": ["South Croydon, South End", "Norwood Junction Station"], "RR3": ["West Croydon", "Norwood Junction"],
  "RR4": ["South Croydon, South End", "Thornton Heath, Parchmore Road"], "SCS": ["Croydon Town Centre", "Croydon Town Centre"],
  "BD": ["West Croydon", "Beddington Superstore"]
};

// Centro Wiki model catalogues, split into one editable profile per operator.
const croydonBusFleets = {
  "Alighted · Arriva": ["Enviro 200","Enviro 200 Facelift","Enviro 200 MMC","Enviro 400","Gemini 2","ALX400 (B7TL)","ALX400 (DB250)","Cadet","Metrocity","President","Gemini 3","NB4L","Enviro 400 MMC","Enviro 400 City","Enviro 400 EV","Gemini 3 MK1","Pointer 2","Electric Pointer 2","Streetlite","StreetDeck","Citaro G","RH (Olympian)","Crusader","CroydonMaster"],
  "Centro Transport · Transport UK": ["Pointer 2","ALX400","Enviro 400","Enviro 200 MMC","Enviro 200","Enviro 200 Facelift","Enviro 200 Fake Facelift","Enviro 400 MMC","Enviro 400 EV","NB4L","Electrocity"],
  "Croycoach · Stagecoach": ["Enviro 200 EV","Enviro 200 MMC","Enviro 200","Enviro 200 Facelift","Enviro 400","Enviro 400 EV","MCV Evoseti","Omnicity","Gemini 3","Enviro 400 MMC","Gemini 2","StreetDeck","StreetLite","Citaro G","ALX 400","Versa","Pointer 2","RL (Olympian)","RH (N113)","NB4L","Enviro 400 City","Pathfinder"],
  "Go Travel · Go-Ahead London": ["Mylennium Gas","Pointer 2","Enviro 200","Enviro 200 Facelift","Enviro 200 Fake Facelift","Enviro 200 MMC","Enviro 200 EV","Enviro 200 Hybrid","Enviro 400","Enviro 400 MMC","Enviro 400 EV","MCV Evoseti","Citaro C2","Streetlite","Esteem","Metrocity","Omnicity","President","Solo SR","StreetDeck","Metrodecker","Electrocity","Gemini 2","Citaro G","Versa","ALX400 (B7TL)","Omnidekka (Go Travel)","NB4L","Cadet","Enviro 200 Facelift Dart"]
};
const describeCroydonBus = name => {
  const deck = /^(Enviro 200|Enviro 200 EV|Enviro 200 MMC|Facelift Enviro 200|Cadet|Metrocity|Streetlite|StreetLite|Solo|Versa|Pointer 2|Mylennium|Esteem|Electrocity|Caetano E City Gold)/i.test(name) ? "single-deck" : /Citaro G/i.test(name) ? "articulated" : "double-deck";
  const manufacturer = /Enviro|ALX|Routemaster|NB4L/i.test(name) ? "Alexander Dennis / associated body family" : /Gemini|StreetDeck|Streetlite|New Routemaster|Electroliner/i.test(name) ? "Wrightbus family" : /Metrocity|Metrodecker|Mylennium|Solo|Versa/i.test(name) ? "Optare family" : /Citaro/i.test(name) ? "Mercedes-Benz" : /Scania|Omnicity/i.test(name) ? "Scania" : /Evoseti/i.test(name) ? "MCV" : /Caetano/i.test(name) ? "CaetanoBus" : /Crusader|Pathfinder|Pointer/i.test(name) ? "Plaxton / ADL family" : "Manufacturer details are on the linked Wiki page";
  const energy = /EV|Electro|E City Gold/i.test(name) ? "battery-electric" : /Hybrid|B5LH/i.test(name) ? "hybrid" : "diesel or variant-dependent";
  return `${name} is listed as a ${deck} ${energy} bus in Croydon's ${manufacturer} model family. This is the in-game model profile; the Centro Wiki page carries the operator's variants and game-specific details.`;
};
for (const [operator, fleet] of Object.entries(croydonBusFleets)) {
  const [companyName, realOperator] = operator.split(" · ");
  for (const modelName of fleet) {
    const slug = modelName.replace(/\s+/g, "_").replace(/[()]/g, "");
    const id = `croydon-bus-${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${modelName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    if (window.TRANSPORT_SEED["bus-types"].some(entry => entry.id === id)) continue;
    window.TRANSPORT_SEED["bus-types"].push({
      id, title: `${modelName} · ${companyName}`, modelName, operator: companyName,
      details: `${describeCroydonBus(modelName)}\nReal-world operator counterpart: ${realOperator}.`,
      sourceTitle: `${modelName} · Centro Travel Wiki`, sourceUrl: `https://centro.fandom.com/wiki/${encodeURIComponent(slug)}`,
      directoryTitle: "Croydon bus fleets · Centro Travel Wiki", directoryUrl: "https://centro.fandom.com/wiki/Croydon_Buses"
    });
  }
}
const croydonProBusFleets = {
  "Croydoline · Metroline": ["Enviro 400 EV","Pointer 2","Optare Versa","Enviro 200","Enviro 200 Facelift","Enviro 200 EV","Enviro 200 MMC","ALX400","MCV Evoseti"],
  "RATS · RATP / Quality Line": ["Enviro 400 EV","Pointer 2","ALX400 (B7TL)","ALX400 (Trident)","Optare Versa","Enviro 200","Enviro 200 Facelift","Enviro 200 MMC","Enviro 200 EV","MCV Evoseti"],
  "Plus · First London": ["Citaro G","ALX400 (Trident)"]
};
for (const [operator, fleet] of Object.entries(croydonProBusFleets)) {
  for (const modelName of fleet) {
    const baseModel = modelName.replace(/\s+\((?:Croydoline|RATS|Plus)\)$/, "");
    const slug = baseModel.replace(/\s+/g, "_").replace(/[()]/g, "");
    const id = `croydon-pro-bus-${operator.split(" · ")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${modelName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    window.TRANSPORT_SEED["bus-types"].push({
      id, title: `${modelName} · ${operator.split(" · ")[0]}`, modelName: baseModel, operator: operator.split(" · ")[0], status: "Pro fleet",
      details: `${describeCroydonBus(baseModel)}\nThis is a Pro-pack fleet profile from the Centro Wiki's published bus list.`,
      sourceTitle: `${baseModel} · Centro Travel Wiki`, sourceUrl: `https://centro.fandom.com/wiki/${encodeURIComponent(slug)}`,
      directoryTitle: "Croydon Pro Pack buses · Centro Travel Wiki", directoryUrl: "https://centro.fandom.com/wiki/Pro_Pack"
    });
  }
}

for (const [route, operator] of croydonRouteCatalog) {
  const slug = route === "SCS" ? "Route_SCS" : `Route_${route}`;
  const source = `https://centro.fandom.com/wiki/${slug}`;
  window.TRANSPORT_SEED["bus-routes"].push({
    id: `croydon-route-${route.toLowerCase()}`,
    title: `Route ${route} · Croydon`,
    operator,
    origin: croydonRouteEndpoints[route]?.[0] || "Croydon",
    destination: croydonRouteEndpoints[route]?.[1] || "Croydon",
    routeNumber: route,
    axis: "west-east",
    details: `${croydonRouteEndpoints[route]?.[0] || "Croydon"} ↔ ${croydonRouteEndpoints[route]?.[1] || "Croydon"}\nListed in Croydon's route directory. Open the Centro Wiki source for its full stop sequence and service notes.`,
    sourceTitle: `Route ${route} · Centro Travel Wiki`,
    sourceUrl: source,
    directoryUrl: "https://centro.fandom.com/wiki/Bus_Routes"
  });
}

window.TRANSPORT_SEED["bus-routes"].push({
  id: "croydon-route-bd", title: "Beddington Express BD · Croydon", operator: "Removed route", status: "Removed",
  origin: croydonRouteEndpoints.BD[0], destination: croydonRouteEndpoints.BD[1], routeNumber: "BD", axis: "west-east",
  details: "West Croydon ↔ Beddington Superstore. This route is listed by the Centro Wiki as removed, so it is kept here as a historical directory entry.",
  sourceTitle: "Beddington Express BD · Centro Travel Wiki", sourceUrl: "https://centro.fandom.com/wiki/Beddington_Express_BD",
  directoryTitle: "Bus Routes · Centro Travel Wiki", directoryUrl: "https://centro.fandom.com/wiki/Bus_Routes"
});
