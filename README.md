# Digital Emergency Help Kit 🚨

A premium, mobile-first web application designed for quick access to critical emergency services and nearby hospitals in Pakistan. The application is meant to be accessed via QR codes placed at "Point Zero" incident spots or public areas.

## Features

- **Quick Dial Protocol**: One-tap access to primary emergency responders:
  - 🚑 Rescue 1122
  - 🚓 Police 15
  - 🏥 Edhi 115
- **Geolocation & Mapping**: Automatically fetches nearby hospitals and trauma centers within a 10km radius using the OpenStreetMap Overpass API.
- **Proximity Sorting**: Hospitals are dynamically sorted by distance from the user's current location.
- **Bilingual Interface**: Critical instructions are provided in both English and Urdu (ایمرجنسی رابطے).
- **First Aid & Safety Guide**: Includes immediate steps for handling common emergencies like bleeding, burns, and choking.
- **Premium UI**: Designed with a dark-mode glassmorphic aesthetic to reduce glare and ensure maximum readability during high-stress situations.

## Tech Stack

- **HTML5**: Semantic and accessible structure.
- **Vanilla CSS3**: Custom properties, glassmorphism, flexbox, and responsive design (no external frameworks needed).
- **Vanilla JavaScript**: DOM manipulation, Geolocation API, and Fetch API (Overpass API integration).

## Setup & Running Locally

Since this is a vanilla web application, no build steps are required. However, due to browser security policies regarding the Geolocation API, you must serve the application over `localhost` or `https`.

1. Clone the repository.
2. Serve the `index.html` file using a local web server. 
   - If you use VSCode, you can use the **Live Server** extension.
   - If you have Node.js installed, you can run: `npx serve .`
   - If you have Python installed, you can run: `python -m http.server`
3. Open the provided `localhost` URL in your browser.

## APIs Used

- [OpenStreetMap Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) - Used for fetching `amenity=hospital` nodes and ways based on latitude and longitude without requiring a paid API key.

## Project Structure

```
├── index.html   # Main application structure
├── style.css    # Premium glassmorphic styling
├── app.js       # Geolocation and API logic
└── README.md    # Project documentation
```

## License

This project is open-source and meant for public utility and safety.
