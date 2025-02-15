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
async function generateDescription(animal) {
  var prompt = `You are a knowledgeable scientist. Provide information about the species ${animal} in this exact format:  

  Common Name: [Insert common name]  
  Scientific Name: [Insert scientific name]  
  Description: [Provide a concise one-sentence description, including habitat or unique traits.]  
  Endangerment Reason: [Provide a brief one-sentence explanation of why this species is endangered.]  
  
  Only output the requested details. Do NOT include explanations, introductory text, or repeat the input.`;

  var response = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: "Tell me about the Amur Leopard" })
  });

  if (!response.ok) {
      console.error("AI API Error:", response.status, response.statusText);
      return "Error generating description.";
  }

  var data = await response.json();
  
  if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;  // Corrected response extraction
  } else {
      return "No response from AI.";
  }
}

/* APIs used: 
- IUCN 2024. IUCN Red List of Threatened Species. Version 2024-2 <www.iucnredlist.org>

*/
