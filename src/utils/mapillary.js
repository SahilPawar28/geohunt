const TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN

// ── Curated pool of well-covered global locations (200+ diverse spots) ──
const REGIONS = [
  // Western Europe – Cities
  { name: 'Paris, France',               bbox: '2.29,48.85,2.40,48.87' },
  { name: 'Lyon, France',                bbox: '4.82,45.74,4.86,45.76' },
  { name: 'Marseille, France',           bbox: '5.36,43.29,5.40,43.31' },
  { name: 'Nice, France',                bbox: '7.24,43.69,7.28,43.71' },
  { name: 'Bordeaux, France',            bbox: '-0.59,44.83,-0.55,44.85' },
  { name: 'Strasbourg, France',          bbox: '7.74,48.57,7.78,48.59' },
  { name: 'London, UK',                  bbox: '-0.13,51.50,-0.10,51.52' },
  { name: 'Manchester, UK',              bbox: '-2.25,53.47,-2.21,53.49' },
  { name: 'Edinburgh, UK',               bbox: '-3.20,55.94,-3.16,55.96' },
  { name: 'Dublin, Ireland',             bbox: '-6.28,53.33,-6.24,53.35' },
  { name: 'Amsterdam, Netherlands',      bbox: '4.88,52.36,4.92,52.38' },
  { name: 'Rotterdam, Netherlands',      bbox: '4.47,51.91,4.51,51.93' },
  { name: 'Brussels, Belgium',           bbox: '4.34,50.84,4.38,50.86' },
  { name: 'Berlin, Germany',             bbox: '13.38,52.51,13.42,52.53' },
  { name: 'Munich, Germany',             bbox: '11.57,48.13,11.61,48.15' },
  { name: 'Hamburg, Germany',            bbox: '9.99,53.55,10.03,53.57' },
  { name: 'Frankfurt, Germany',          bbox: '8.67,50.11,8.71,50.13' },
  { name: 'Cologne, Germany',            bbox: '6.95,50.93,6.99,50.95' },
  { name: 'Zurich, Switzerland',         bbox: '8.53,47.36,8.57,47.38' },
  { name: 'Geneva, Switzerland',         bbox: '6.13,46.20,6.17,46.22' },
  { name: 'Vienna, Austria',             bbox: '16.36,48.20,16.40,48.22' },
  { name: 'Innsbruck, Austria',          bbox: '11.39,47.26,11.43,47.28' },
  { name: 'Rome, Italy',                 bbox: '12.47,41.89,12.51,41.91' },
  { name: 'Milan, Italy',                bbox: '9.18,45.46,9.22,45.48' },
  { name: 'Venice, Italy',               bbox: '12.33,45.43,12.37,45.45' },
  { name: 'Florence, Italy',             bbox: '11.25,43.77,11.29,43.79' },
  { name: 'Naples, Italy',               bbox: '14.25,40.83,14.29,40.85' },
  { name: 'Barcelona, Spain',            bbox: '2.15,41.38,2.19,41.40' },
  { name: 'Madrid, Spain',               bbox: '-3.71,40.41,-3.67,40.43' },
  { name: 'Seville, Spain',              bbox: '-6.01,37.38,-5.97,37.40' },
  { name: 'Valencia, Spain',             bbox: '-0.38,39.46,-0.34,39.48' },
  { name: 'Bilbao, Spain',               bbox: '-2.94,43.26,-2.90,43.28' },
  { name: 'Lisbon, Portugal',            bbox: '-9.15,38.71,-9.11,38.73' },
  { name: 'Porto, Portugal',             bbox: '-8.63,41.14,-8.59,41.16' },
  { name: 'Athens, Greece',              bbox: '23.72,37.97,23.76,37.99' },
  { name: 'Thessaloniki, Greece',        bbox: '22.94,40.63,22.98,40.65' },
  { name: 'Dubrovnik, Croatia',          bbox: '18.10,42.64,18.14,42.66' },
  { name: 'Split, Croatia',              bbox: '16.43,43.50,16.47,43.52' },
  { name: 'Budapest, Hungary',           bbox: '19.04,47.49,19.08,47.51' },
  { name: 'Prague, Czechia',             bbox: '14.41,50.07,14.45,50.09' },
  { name: 'Warsaw, Poland',              bbox: '21.00,52.22,21.04,52.24' },
  { name: 'Krakow, Poland',              bbox: '19.93,50.05,19.97,50.07' },
  { name: 'Stockholm, Sweden',           bbox: '18.06,59.32,18.10,59.34' },
  { name: 'Gothenburg, Sweden',          bbox: '11.97,57.70,12.01,57.72' },
  { name: 'Copenhagen, Denmark',         bbox: '12.56,55.67,12.60,55.69' },
  { name: 'Oslo, Norway',                bbox: '10.73,59.91,10.77,59.93' },
  { name: 'Bergen, Norway',              bbox: '5.32,60.39,5.36,60.41' },
  { name: 'Helsinki, Finland',           bbox: '24.93,60.16,24.97,60.18' },
  { name: 'Tallinn, Estonia',            bbox: '24.74,59.43,24.78,59.45' },
  { name: 'Riga, Latvia',                bbox: '24.10,56.94,24.14,56.96' },
  { name: 'Vilnius, Lithuania',          bbox: '25.27,54.68,25.31,54.70' },
  { name: 'Reykjavik, Iceland',          bbox: '-22.00,64.14,-21.96,64.16' },
  { name: 'Bucharest, Romania',          bbox: '26.09,44.43,26.13,44.45' },
  { name: 'Sofia, Bulgaria',             bbox: '23.32,42.69,23.36,42.71' },
  { name: 'Belgrade, Serbia',            bbox: '20.46,44.81,20.50,44.83' },
  { name: 'Ljubljana, Slovenia',         bbox: '14.50,46.05,14.54,46.07' },
  { name: 'Bratislava, Slovakia',        bbox: '17.10,48.14,17.14,48.16' },

  // Western Europe – Countryside / Scenic
  { name: 'Cotswolds, UK',               bbox: '-1.79,51.88,-1.75,51.90' },
  { name: 'Scottish Highlands, UK',      bbox: '-4.22,57.27,-4.18,57.29' },
  { name: 'Yorkshire Dales, UK',         bbox: '-2.18,54.30,-2.14,54.32' },
  { name: 'Tuscany Countryside, Italy',  bbox: '11.38,43.46,11.42,43.48' },
  { name: 'Amalfi Coast, Italy',         bbox: '14.60,40.63,14.64,40.65' },
  { name: 'Cinque Terre, Italy',         bbox: '9.72,44.10,9.76,44.12' },
  { name: 'Dolomites, Italy',            bbox: '11.95,46.49,11.99,46.51' },
  { name: 'Provence, France',            bbox: '5.37,43.92,5.41,43.94' },
  { name: 'Loire Valley, France',        bbox: '0.68,47.39,0.72,47.41' },
  { name: 'Normandy, France',            bbox: '-0.36,49.17,-0.32,49.19' },
  { name: 'Black Forest, Germany',       bbox: '8.21,47.99,8.25,48.01' },
  { name: 'Bavarian Alps, Germany',      bbox: '12.98,47.55,13.02,47.57' },
  { name: 'Swiss Alps, Switzerland',     bbox: '7.97,46.56,8.01,46.58' },
  { name: 'Lofoten Islands, Norway',     bbox: '13.57,68.23,13.61,68.25' },
  { name: 'Fjords of Norway',            bbox: '7.12,60.86,7.16,60.88' },
  { name: 'Algarve Coast, Portugal',     bbox: '-8.67,37.09,-8.63,37.11' },
  { name: 'Costa Brava, Spain',          bbox: '3.17,41.70,3.21,41.72' },
  { name: 'Andalusia Countryside, Spain',bbox: '-4.75,37.88,-4.71,37.90' },
  { name: 'Rhine Valley, Germany',       bbox: '7.89,50.11,7.93,50.13' },

  // North America – Cities
  { name: 'New York, USA',               bbox: '-74.01,40.71,-73.98,40.73' },
  { name: 'Los Angeles, USA',            bbox: '-118.27,34.04,-118.23,34.06' },
  { name: 'Chicago, USA',                bbox: '-87.64,41.88,-87.60,41.90' },
  { name: 'San Francisco, USA',          bbox: '-122.42,37.77,-122.38,37.79' },
  { name: 'Miami, USA',                  bbox: '-80.21,25.77,-80.17,25.79' },
  { name: 'Las Vegas, USA',              bbox: '-115.18,36.17,-115.14,36.19' },
  { name: 'New Orleans, USA',            bbox: '-90.07,29.95,-90.03,29.97' },
  { name: 'Seattle, USA',                bbox: '-122.34,47.60,-122.30,47.62' },
  { name: 'Boston, USA',                 bbox: '-71.07,42.35,-71.03,42.37' },
  { name: 'Washington DC, USA',          bbox: '-77.04,38.89,-77.00,38.91' },
  { name: 'Nashville, USA',              bbox: '-86.79,36.16,-86.75,36.18' },
  { name: 'Portland, USA',               bbox: '-122.69,45.52,-122.65,45.54' },
  { name: 'Austin, USA',                 bbox: '-97.75,30.27,-97.71,30.29' },
  { name: 'Denver, USA',                 bbox: '-104.99,39.74,-104.95,39.76' },
  { name: 'Atlanta, USA',                bbox: '-84.39,33.74,-84.35,33.76' },
  { name: 'Toronto, Canada',             bbox: '-79.39,43.64,-79.35,43.66' },
  { name: 'Vancouver, Canada',           bbox: '-123.14,49.27,-123.10,49.29' },
  { name: 'Montreal, Canada',            bbox: '-73.57,45.50,-73.53,45.52' },
  { name: 'Mexico City, Mexico',         bbox: '-99.14,19.42,-99.10,19.44' },
  { name: 'Guadalajara, Mexico',         bbox: '-103.36,20.67,-103.32,20.69' },

  // North America – Scenic
  { name: 'Pacific Coast Hwy, USA',      bbox: '-122.50,37.55,-122.46,37.57' },
  { name: 'Route 66 – Williams, USA',    bbox: '-112.19,35.25,-112.15,35.27' },
  { name: 'Blue Ridge Pkwy, USA',        bbox: '-82.32,35.54,-82.28,35.56' },
  { name: 'Yellowstone, USA',            bbox: '-110.59,44.46,-110.55,44.48' },
  { name: 'Key West, Florida, USA',      bbox: '-81.81,24.55,-81.77,24.57' },
  { name: 'Cape Cod, USA',               bbox: '-70.08,41.67,-70.04,41.69' },
  { name: 'Sedona, Arizona, USA',        bbox: '-111.77,34.86,-111.73,34.88' },
  { name: 'Banff, Canada',               bbox: '-115.58,51.17,-115.54,51.19' },
  { name: 'Quebec City, Canada',         bbox: '-71.22,46.81,-71.18,46.83' },

  // South America
  { name: 'Buenos Aires, Argentina',     bbox: '-58.39,-34.62,-58.35,-34.60' },
  { name: 'São Paulo, Brazil',           bbox: '-46.65,-23.56,-46.61,-23.54' },
  { name: 'Rio de Janeiro, Brazil',      bbox: '-43.18,-22.91,-43.14,-22.89' },
  { name: 'Curitiba, Brazil',            bbox: '-49.29,-25.44,-49.25,-25.42' },
  { name: 'Porto Alegre, Brazil',        bbox: '-51.23,-30.04,-51.19,-30.02' },
  { name: 'Bogotá, Colombia',            bbox: '-74.09,4.60,-74.05,4.62' },
  { name: 'Medellín, Colombia',          bbox: '-75.58,6.23,-75.54,6.25' },
  { name: 'Lima, Peru',                  bbox: '-77.04,-12.05,-77.00,-12.03' },
  { name: 'Santiago, Chile',             bbox: '-70.67,-33.46,-70.63,-33.44' },
  { name: 'Valparaíso, Chile',           bbox: '-71.63,-33.05,-71.59,-33.03' },
  { name: 'Montevideo, Uruguay',         bbox: '-56.19,-34.91,-56.15,-34.89' },
  { name: 'Quito, Ecuador',              bbox: '-78.53,-0.23,-78.49,-0.21' },
  { name: 'Cartagena, Colombia',         bbox: '-75.54,10.40,-75.50,10.42' },

  // Asia – East
  { name: 'Tokyo, Japan',                bbox: '139.69,35.68,139.72,35.70' },
  { name: 'Osaka, Japan',                bbox: '135.49,34.68,135.53,34.70' },
  { name: 'Kyoto, Japan',                bbox: '135.76,35.01,135.80,35.03' },
  { name: 'Sapporo, Japan',              bbox: '141.35,43.06,141.39,43.08' },
  { name: 'Hiroshima, Japan',            bbox: '132.45,34.39,132.49,34.41' },
  { name: 'Nara, Japan',                 bbox: '135.82,34.68,135.86,34.70' },
  { name: 'Fukuoka, Japan',              bbox: '130.40,33.58,130.44,33.60' },
  { name: 'Seoul, South Korea',          bbox: '126.97,37.56,127.01,37.58' },
  { name: 'Busan, South Korea',          bbox: '129.05,35.10,129.09,35.12' },
  { name: 'Incheon, South Korea',        bbox: '126.70,37.45,126.74,37.47' },
  { name: 'Beijing, China',              bbox: '116.39,39.90,116.43,39.92' },
  { name: 'Shanghai, China',             bbox: '121.47,31.22,121.51,31.24' },
  { name: 'Guangzhou, China',            bbox: '113.26,23.12,113.30,23.14' },
  { name: 'Chengdu, China',              bbox: '104.07,30.66,104.11,30.68' },
  { name: 'Hong Kong',                   bbox: '114.15,22.27,114.19,22.29' },
  { name: 'Macau',                       bbox: '113.54,22.19,113.58,22.21' },
  { name: 'Taipei, Taiwan',              bbox: '121.52,25.04,121.56,25.06' },
  { name: 'Tainan, Taiwan',              bbox: '120.20,23.00,120.24,23.02' },

  // Asia – South & Southeast
  { name: 'Mumbai, India',               bbox: '72.82,18.95,72.85,18.97' },
  { name: 'Delhi, India',                bbox: '77.20,28.63,77.24,28.65' },
  { name: 'Bangalore, India',            bbox: '77.58,12.96,77.62,12.98' },
  { name: 'Chennai, India',              bbox: '80.27,13.08,80.31,13.10' },
  { name: 'Kolkata, India',              bbox: '88.35,22.57,88.39,22.59' },
  { name: 'Hyderabad, India',            bbox: '78.48,17.38,78.52,17.40' },
  { name: 'Jaipur, India',               bbox: '75.79,26.91,75.83,26.93' },
  { name: 'Kathmandu, Nepal',            bbox: '85.31,27.70,85.35,27.72' },
  { name: 'Colombo, Sri Lanka',          bbox: '79.84,6.91,79.88,6.93' },
  { name: 'Bangkok, Thailand',           bbox: '100.52,13.74,100.56,13.76' },
  { name: 'Chiang Mai, Thailand',        bbox: '98.99,18.79,99.03,18.81' },
  { name: 'Phuket Town, Thailand',       bbox: '98.38,7.88,98.42,7.90' },
  { name: 'Singapore',                   bbox: '103.84,1.28,103.88,1.30' },
  { name: 'Kuala Lumpur, Malaysia',      bbox: '101.69,3.14,101.73,3.16' },
  { name: 'Penang, Malaysia',            bbox: '100.33,5.41,100.37,5.43' },
  { name: 'Jakarta, Indonesia',          bbox: '106.82,-6.21,106.86,-6.19' },
  { name: 'Bali, Indonesia',             bbox: '115.20,-8.66,115.24,-8.64' },
  { name: 'Yogyakarta, Indonesia',       bbox: '110.36,-7.80,110.40,-7.78' },
  { name: 'Hanoi, Vietnam',              bbox: '105.84,21.02,105.88,21.04' },
  { name: 'Ho Chi Minh City, Vietnam',   bbox: '106.69,10.77,106.73,10.79' },
  { name: 'Da Nang, Vietnam',            bbox: '108.22,16.06,108.26,16.08' },
  { name: 'Manila, Philippines',         bbox: '120.98,14.58,121.02,14.60' },
  { name: 'Cebu City, Philippines',      bbox: '123.89,10.31,123.93,10.33' },
  { name: 'Phnom Penh, Cambodia',        bbox: '104.91,11.56,104.95,11.58' },
  { name: 'Yangon, Myanmar',             bbox: '96.15,16.80,96.19,16.82' },
  { name: 'Dhaka, Bangladesh',           bbox: '90.40,23.72,90.44,23.74' },

  // Middle East & Central Asia
  { name: 'Dubai, UAE',                  bbox: '55.27,25.19,55.31,25.21' },
  { name: 'Abu Dhabi, UAE',              bbox: '54.37,24.45,54.41,24.47' },
  { name: 'Istanbul, Turkey',            bbox: '28.97,41.01,29.01,41.03' },
  { name: 'Ankara, Turkey',              bbox: '32.85,39.92,32.89,39.94' },
  { name: 'Tel Aviv, Israel',            bbox: '34.77,32.07,34.81,32.09' },
  { name: 'Jerusalem, Israel',           bbox: '35.21,31.78,35.25,31.80' },
  { name: 'Tbilisi, Georgia',            bbox: '44.79,41.69,44.83,41.71' },
  { name: 'Yerevan, Armenia',            bbox: '44.50,40.18,44.54,40.20' },
  { name: 'Almaty, Kazakhstan',          bbox: '76.94,43.25,76.98,43.27' },
  { name: 'Tashkent, Uzbekistan',        bbox: '69.28,41.31,69.32,41.33' },
  { name: 'Amman, Jordan',               bbox: '35.93,31.95,35.97,31.97' },
  { name: 'Beirut, Lebanon',             bbox: '35.49,33.88,35.53,33.90' },
  { name: 'Doha, Qatar',                 bbox: '51.52,25.28,51.56,25.30' },

  // Africa
  { name: 'Cairo, Egypt',                bbox: '31.23,30.05,31.26,30.07' },
  { name: 'Alexandria, Egypt',           bbox: '29.92,31.20,29.96,31.22' },
  { name: 'Cape Town, South Africa',     bbox: '18.41,-33.93,18.45,-33.91' },
  { name: 'Johannesburg, South Africa',  bbox: '28.04,-26.21,28.08,-26.19' },
  { name: 'Durban, South Africa',        bbox: '31.02,-29.87,31.06,-29.85' },
  { name: 'Nairobi, Kenya',              bbox: '36.81,-1.30,36.85,-1.28' },
  { name: 'Mombasa, Kenya',              bbox: '39.66,-4.06,39.70,-4.04' },
  { name: 'Lagos, Nigeria',              bbox: '3.38,6.45,3.42,6.47' },
  { name: 'Abuja, Nigeria',              bbox: '7.49,9.06,7.53,9.08' },
  { name: 'Accra, Ghana',                bbox: '-0.21,5.55,-0.17,5.57' },
  { name: 'Addis Ababa, Ethiopia',       bbox: '38.75,9.02,38.79,9.04' },
  { name: 'Casablanca, Morocco',         bbox: '-7.62,33.58,-7.58,33.60' },
  { name: 'Marrakech, Morocco',          bbox: '-8.01,31.62,-7.97,31.64' },
  { name: 'Tunis, Tunisia',              bbox: '10.17,36.81,10.21,36.83' },
  { name: 'Dar es Salaam, Tanzania',     bbox: '39.28,-6.82,39.32,-6.80' },
  { name: 'Dakar, Senegal',              bbox: '-17.46,14.68,-17.42,14.70' },
  { name: 'Kigali, Rwanda',              bbox: '30.06,-1.96,30.10,-1.94' },
  { name: 'Maputo, Mozambique',          bbox: '32.58,-25.96,32.62,-25.94' },

  // Oceania
  { name: 'Sydney, Australia',           bbox: '151.20,-33.87,151.23,-33.85' },
  { name: 'Melbourne, Australia',        bbox: '144.96,-37.82,145.00,-37.80' },
  { name: 'Brisbane, Australia',         bbox: '153.02,-27.47,153.06,-27.45' },
  { name: 'Perth, Australia',            bbox: '115.85,-31.95,115.89,-31.93' },
  { name: 'Adelaide, Australia',         bbox: '138.60,-34.93,138.64,-34.91' },
  { name: 'Auckland, New Zealand',       bbox: '174.76,-36.86,174.80,-36.84' },
  { name: 'Wellington, New Zealand',     bbox: '174.77,-41.29,174.81,-41.27' },
  { name: 'Christchurch, New Zealand',   bbox: '172.63,-43.53,172.67,-43.51' },
  { name: 'Great Ocean Rd, Australia',   bbox: '143.56,-38.58,143.60,-38.56' },

  // Russia & Eastern Europe
  { name: 'Moscow, Russia',              bbox: '37.62,55.75,37.66,55.77' },
  { name: 'Saint Petersburg, Russia',    bbox: '30.31,59.94,30.35,59.96' },
  { name: 'Novosibirsk, Russia',         bbox: '82.92,54.99,82.96,55.01' },
  { name: 'Kyiv, Ukraine',               bbox: '30.52,50.44,30.56,50.46' },
  { name: 'Lviv, Ukraine',               bbox: '24.03,49.84,24.07,49.86' },
  { name: 'Minsk, Belarus',              bbox: '27.55,53.90,27.59,53.92' },
  { name: 'Chisinau, Moldova',           bbox: '28.83,47.01,28.87,47.03' },

  // Islands & Scenic Unique
  { name: 'Tenerife, Canary Islands',    bbox: '-16.26,28.46,-16.22,28.48' },
  { name: 'Santorini, Greece',           bbox: '25.43,36.39,25.47,36.41' },
  { name: 'Mykonos, Greece',             bbox: '25.32,37.44,25.36,37.46' },
  { name: 'Madeira, Portugal',           bbox: '-16.93,32.65,-16.89,32.67' },
  { name: 'Azores, Portugal',            bbox: '-25.67,37.73,-25.63,37.75' },
  { name: 'Hawaii – Honolulu, USA',      bbox: '-157.86,21.30,-157.82,21.32' },
  { name: 'Hawaii – Maui, USA',          bbox: '-156.48,20.88,-156.44,20.90' },
  { name: 'Easter Island, Chile',        bbox: '-109.37,-27.11,-109.33,-27.09' },
  { name: 'Bermuda',                     bbox: '-64.67,32.30,-64.63,32.32' },
  { name: 'Faroe Islands',               bbox: '-6.77,62.00,-6.73,62.02' },
  { name: 'Malta, Valletta',             bbox: '14.51,35.89,14.55,35.91' },
  { name: 'Cyprus – Nicosia',            bbox: '33.37,35.16,33.41,35.18' },
  { name: 'Bora Bora, French Polynesia', bbox: '-151.76,-16.50,-151.72,-16.48' },
  { name: 'Maldives – Malé',             bbox: '73.50,4.17,73.54,4.19' },
  { name: 'Mauritius – Port Louis',      bbox: '57.49,-20.16,57.53,-20.14' },
  { name: 'Jamaica – Kingston',          bbox: '-76.80,17.99,-76.76,18.01' },
  { name: 'Barbados – Bridgetown',       bbox: '-59.62,13.09,-59.58,13.11' },
  { name: 'Puerto Rico – San Juan',      bbox: '-66.12,18.46,-66.08,18.48' },
  { name: 'Iceland – Akureyri',          bbox: '-18.11,65.68,-18.07,65.70' },
  { name: 'Greenland – Nuuk',            bbox: '-51.75,64.17,-51.71,64.19' },
]

// ── Inhabited continental bounding boxes for truly random picks ──
// [west, south, east, north]
const RANDOM_ZONES = [
  [-10, 36, 30, 60],    // Western/Central Europe
  [30, 36, 70, 60],     // Eastern Europe / Russia west
  [-130, 25, -60, 55],  // North America
  [-120, -55, -35, 15], // South America
  [-18, -35, 52, 38],   // Africa
  [25, 10, 80, 50],     // Middle East + South Asia
  [80, 5, 110, 35],     // Southeast Asia mainland
  [110, 15, 145, 50],   // East Asia
  [100, -45, 180, 10],  // Oceania / SE island arcs
  [-80, 15, -60, 30],   // Caribbean
  [25, -35, 50, 0],     // Southern Africa
]

function randomFloat(min, max) {
  return min + Math.random() * (max - min)
}

function randomBbox(zone) {
  const [w, s, e, n] = zone
  const lat = randomFloat(s, n)
  const lng = randomFloat(w, e)
  const d = 0.03 // ~3km box
  return {
    name: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
    bbox: `${(lng - d).toFixed(4)},${(lat - d).toFixed(4)},${(lng + d).toFixed(4)},${(lat + d).toFixed(4)}`
  }
}

// ── Shuffle queue ──
let shuffledQueue = []

function getNextRegion() {
  if (shuffledQueue.length === 0) {
    shuffledQueue = [...REGIONS]
    for (let i = shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]]
    }
  }
  return shuffledQueue.pop()
}

// ── Session image dedup ──
const usedImageIds = new Set()

async function fetchFromRegion(region) {
  const url = `https://graph.mapillary.com/images?access_token=${TOKEN}&fields=id,geometry&bbox=${region.bbox}&limit=50`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.data || data.data.length === 0) return null

  const fresh = data.data.filter(img => !usedImageIds.has(img.id))
  const pool = fresh.length > 0 ? fresh : data.data
  const picked = pool[Math.floor(Math.random() * pool.length)]
  usedImageIds.add(picked.id)

  return {
    imageId: picked.id,
    lat: picked.geometry.coordinates[1],
    lng: picked.geometry.coordinates[0],
    label: region.name,
  }
}

// ── Race N fetches in parallel, resolve with the first success ──
function raceRegions(regions) {
  return new Promise((resolve, reject) => {
    let failures = 0
    const total = regions.length
    regions.forEach(async (region) => {
      try {
        const result = await fetchFromRegion(region)
        if (result) { resolve(result) }
        else { if (++failures === total) reject(new Error('All empty')) }
      } catch {
        if (++failures === total) reject(new Error('All failed'))
      }
    })
  })
}

// ── Prefetch cache ──
let prefetchedPromise = null

function startPrefetch() {
  prefetchedPromise = _fetchNewImage().catch(() => null)
}

async function _fetchNewImage() {
  // 35% truly random – fire 3 zones in parallel
  if (Math.random() < 0.35) {
    const zones = [...RANDOM_ZONES].sort(() => Math.random() - 0.5).slice(0, 3)
    try {
      const result = await raceRegions(zones.map(z => randomBbox(z)))
      if (result) return result
    } catch { /* fall through */ }
  }

  // Curated – race 3 regions in parallel
  try {
    const result = await raceRegions([getNextRegion(), getNextRegion(), getNextRegion()])
    if (result) return result
  } catch { /* fall through */ }

  // Serial fallback
  for (let i = 0; i < 5; i++) {
    const result = await fetchFromRegion(getNextRegion())
    if (result) return result
  }

  throw new Error('Could not load any location. Check your Mapillary token.')
}

export async function getRandomMapillaryImage() {
  if (prefetchedPromise) {
    const pending = prefetchedPromise
    prefetchedPromise = null
    try {
      const result = await pending
      if (result) {
        startPrefetch()
        return result
      }
    } catch { /* fall through */ }
  }

  const result = await _fetchNewImage()
  startPrefetch()
  return result
}
