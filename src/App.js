import React from "react";
// import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/Map.jsx";

function App() {
  require('dotenv').config()
  return <Map />;
}

export default App;
