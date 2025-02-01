var token = '9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';

function displayMap() {
  // Initialize the map
  var map = L.map('map').setView([51.505, -0.09], 2);

  // Add tile layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // create popup
  var popup = L.popup();

  map.on("click", async function (e) {
    var country = await convertLocation(e.latlng.lat, e.latlng.lng);
    
    popup
      .setLatLng(e.latlng)
      .setContent(`Country: ${country}`)
      .openOn(map);
  });
}

// get country name from coordinates
async function convertLocation(lat, lon) {

  var response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  var data = await response.json();
    
  if (data && data.address && data.address.country) {
    return data.address.country;
  } else {
      return null;
  }
}

// get species name 
async function getSpecies() {}

  
