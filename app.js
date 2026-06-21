document.addEventListener('DOMContentLoaded', () => {
    const btnGetLocation = document.getElementById('btn-get-location');
    const btnRetry = document.getElementById('btn-retry');
    
    const locationPrompt = document.getElementById('location-prompt');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const hospitalsList = document.getElementById('hospitals-list');

    btnGetLocation.addEventListener('click', requestLocation);
    btnRetry.addEventListener('click', requestLocation);

    function requestLocation() {
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser.");
            return;
        }

        showLoading();

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchNearbyHospitals(latitude, longitude);
            },
            error => {
                let msg = "Could not access location.";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "Location permission denied. Please allow location access to find hospitals.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                }
                showError(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    async function fetchNearbyHospitals(lat, lon) {
        // Query OpenStreetMap Overpass API for hospitals within a 10km radius
        const query = `
            [out:json];
            (
              node["amenity"="hospital"](around:10000, ${lat}, ${lon});
              way["amenity"="hospital"](around:10000, ${lat}, ${lon});
              relation["amenity"="hospital"](around:10000, ${lat}, ${lon});
            );
            out center;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();

            let hospitals = data.elements.map(el => {
                // If it's a way/relation, it has a center property, else use lat/lon
                const hLat = el.lat || el.center.lat;
                const hLon = el.lon || el.center.lon;
                
                return {
                    name: el.tags.name || "Emergency Hospital",
                    phone: el.tags.phone || el.tags['contact:phone'] || null,
                    lat: hLat,
                    lon: hLon,
                    distance: calculateDistance(lat, lon, hLat, hLon)
                };
            });

            // Filter out unnamed hospitals if there are many, but keep them if few
            hospitals = hospitals.filter(h => h.name !== "Emergency Hospital" || hospitals.length < 5);
            
            // Sort by distance
            hospitals.sort((a, b) => a.distance - b.distance);

            // Take top 10
            renderHospitals(hospitals.slice(0, 10));

        } catch (err) {
            showError("Failed to fetch nearby hospitals. Please try again.");
            console.error(err);
        }
    }

    function renderHospitals(hospitals) {
        hospitalsList.innerHTML = '';
        
        if (hospitals.length === 0) {
            showError("No hospitals found within 10km.");
            return;
        }

        hospitals.forEach(h => {
            const distanceStr = h.distance < 1 ? `${(h.distance * 1000).toFixed(0)} m` : `${h.distance.toFixed(1)} km`;
            
            const card = document.createElement('div');
            card.className = 'hospital-card';
            
            const phoneAction = h.phone 
                ? `<a href="tel:${h.phone}" class="action-btn call-btn">📞 Call</a>` 
                : `<div class="action-btn" style="opacity: 0.5; cursor: not-allowed">📞 No Number</div>`;
            
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`;

            card.innerHTML = `
                <div class="hospital-info">
                    <div class="hospital-name">${h.name}</div>
                    <div class="hospital-distance">${distanceStr}</div>
                </div>
                <div class="hospital-actions">
                    ${phoneAction}
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="action-btn dir-btn">🗺️ Directions</a>
                </div>
            `;
            hospitalsList.appendChild(card);
        });

        hideAllStates();
        hospitalsList.classList.remove('hidden');
    }

    function showLoading() {
        hideAllStates();
        loadingState.classList.remove('hidden');
    }

    function showError(msg) {
        hideAllStates();
        errorMessage.textContent = msg;
        errorState.classList.remove('hidden');
    }

    function hideAllStates() {
        locationPrompt.classList.add('hidden');
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        hospitalsList.classList.add('hidden');
    }

    // Haversine formula to calculate distance in km
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1); 
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
});
