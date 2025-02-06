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
    var ISO = await convertLocationISO(e.latlng.lat, e.latlng.lng);
    var speciesName = await getSpecies(ISO);
  
    popup
      .setLatLng(e.latlng)
      .setContent(`<b>A Endangered Species in ${country} (${ISO}):</b><br>${speciesName}`)
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

// get country ISO from coordinates
async function convertLocationISO(lat, lon) {

  var response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  var data = await response.json();
    
  if (data && data.address && data.address.country_code) {
    return data.address.country_code.toUpperCase();
  } else {
      return null;
  }
}

// get species name 
async function getSpecies(region) {
  var apiURL = `https://apiv3.iucnredlist.org/api/v3/country/getspecies/${region.toString()}?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee`;

  try {
    var response = await fetch(apiURL);
    var data = await response.json();
  
    if (data.count > 0) {
      return result = data.result[0].scientific_name;
    } else {
        return ["No endangered species found here"];
    }
  } catch (error) {
      return ["Error fetching endangered species data"]
  }
}

/* APIs used: 
- IUCN 2024. IUCN Red List of Threatened Species. Version 2024-2 <www.iucnredlist.org>

*/
