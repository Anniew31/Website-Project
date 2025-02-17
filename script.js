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
    var description = await generateDescription(speciesName);
    
    popup
      .setLatLng(e.latlng)
      .setContent(`<b>A Endangered Species in ${country} (${ISO}):</b><br>${speciesName} \n ${description}}`)
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

      if (data.count > 0 && data.result && data.result.length > 0) {
          return data.result[0].scientific_name || "Unknown species";  // Ensures it returns a valid string
      } else {
          return "No endangered species found here";
      }
  } catch (error) {
      console.error("Error fetching endangered species data:", error);
      return "Error fetching endangered species data";
  }
}

// get AI-generated description
async function generateDescription(animal) {
  var prompt = `You are a knowledgeable scientist. Provide **brief** information about the species "${animal}" in **exactly** this format:  

  Common Name: [Common name]  
  Scientific Name: [Scientific name]  
  Description: [ONE sentence about habitat or unique traits]  
  Endangerment Reason: [ONE sentence explaining why it's endangered]  

  Keep each response **under 20 words**. Do NOT include extra text, or repeat the input. Format extactly like shown above`;

  var response = await fetch("https://website-project-muvj.onrender.com/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt})
  });

  if (!response.ok) {
      console.error("AI API Error:", response.status, response.statusText);
      return "Error generating description.";
  }

  var data = await response.json();
  
  if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;  
  } else {
      return "No response from AI.";
  }
}

/* APIs used: 
- IUCN 2024. IUCN Red List of Threatened Species. Version 2024-2 <www.iucnredlist.org>

*/
