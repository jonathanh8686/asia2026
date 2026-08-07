(function () {
  var el = document.getElementById('trip-map');
  if (!el || typeof L === 'undefined') return;

  var stops = [
    {
      key: 'hcm',
      name: 'Ho Chi Minh City',
      meta: 'Nov 20–23 · nightlife & sightseeing',
      lat: 10.7769, lng: 106.7009
    },
    {
      key: 'ninhbinh',
      name: 'Ninh Binh',
      meta: 'Nov 26 · rice paddies & boat tour',
      lat: 20.2506, lng: 105.9744
    },
    {
      key: 'hanoi',
      name: 'Hanoi',
      meta: 'Nov 24–28 · Old Quarter & egg coffee',
      lat: 21.0278, lng: 105.8342
    }
  ];

  var map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  var latlngs = stops.map(function (s) { return [s.lat, s.lng]; });

  L.polyline(latlngs, {
    color: '#1C1912',
    weight: 2,
    dashArray: '1 8',
    lineCap: 'round'
  }).addTo(map);

  stops.forEach(function (s) {
    var icon = L.divIcon({
      className: '',
      html: '<div class="trip-pin ' + s.key + '"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });

    L.marker([s.lat, s.lng], { icon: icon })
      .addTo(map)
      .bindPopup(
        '<p class="popup-city">' + s.name + '</p>' +
        '<p class="popup-meta">' + s.meta + '</p>'
      );
  });

  map.fitBounds(latlngs, { padding: [36, 36] });

  el.addEventListener('click', function () { map.scrollWheelZoom.enable(); });
  el.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
})();
