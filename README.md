# Weather Map

Weather Map is a web application built with React.js that allows users to view real-time weather information for different locations. It leverages various weather APIs to provide accurate and up-to-date weather data.

## Table of Contents 📚

- [Introduction](#introduction)
- [Features](#features)
- [Screenshot](#screenshot)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction🚀

Weather Map is a user-friendly application that allows users to check the current weather conditions, forecasts, and other relevant weather data for various locations around the world. The application features a clean, responsive design that works well on both desktop and mobile devices.

## Features🛠️

- **Real-Time Weather Data**: Get up-to-date weather information for any location.
- **Search Functionality**: Easily search for the weather in any city.
- **Weather Forecasts**: View detailed weather forecasts for the upcoming days.
- **Responsive Design**: Accessible on various devices, including desktops and mobiles.
- **Interactive Map**: Visualize weather conditions on an interactive map.
- **User-Friendly Interface**: Intuitive and easy-to-use interface.

## Screenshot📷

![Weather Map_1](https://github.com/BoddepallyVenkatesh06/Weather-Map/blob/main/Screenshot_1.png)
![Weather Map_2](https://github.com/BoddepallyVenkatesh06/Weather-Map/blob/main/Screenshot_2.png)
![Weather Map_3](https://github.com/BoddepallyVenkatesh06/Weather-Map/blob/main/Screenshot_3.png)

## Technologies Used🖥️

- **Frontend**: React.js, Redux, Bootstrap
- **APIs**: OpenWeatherMap API, Mapbox API
- **Deployment**: Vercel

## Getting Started🎯

### Prerequisites📋

Before you begin, ensure you have the following installed on your system:
- Node.js
- npm (Node Package Manager)

### Installation⚙️

1. Clone the repository:

```bash
git clone https://github.com/BoddepallyVenkatesh06/Weather-Map.git
cd weather-map
```

2. Install dependencies:

```bash
npm install
```

3. Get API keys from [OpenWeatherMap](https://openweathermap.org/api) and [Mapbox](https://www.mapbox.com/).

4. Create a `.env` file in the root directory and add your API keys:

```
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
REACT_APP_MAPBOX_API_KEY=your_mapbox_api_key
```

## Usage📈

To start the development server, run:

```bash
npm start
```

This will start the application in development mode at `http://localhost:3000`.

To build the application for production, run:

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

## Contributing❤️

Contributions are welcome! If you'd like to contribute to Weather Map, please follow these steps:

1. Fork the project.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License📝

```
MIT License

© 2024 Venky Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
```
