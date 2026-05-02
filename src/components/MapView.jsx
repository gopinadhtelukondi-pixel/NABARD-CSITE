import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "../leafletFix";

import rrbData from "../data/rrbData";
import stcbData from "../data/stcbData";
import dccbData from "../data/dccbData";

function MapView() {

  // =========================
  // STATES
  // =========================

  const [geoData, setGeoData] = useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  // =========================
  // LOAD INDIA GEOJSON
  // =========================

  useEffect(() => {

    fetch("/indiaStates.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });

  }, []);

  // =========================
  // COMBINE ALL BANKS
  // =========================

  const allBanks = [
    ...rrbData,
    ...stcbData,
    ...dccbData,
  ];

  // =========================
  // FILTER BANKS
  // =========================

  const filteredBanks =

    selectedCategory === "ALL"

      ? allBanks

      : allBanks.filter(
          (bank) =>
            bank.category === selectedCategory
        );

  // =========================
  // STATE STYLE
  // =========================

  const defaultStyle = {

    color: "white",

    weight: 1.5,

    fillOpacity: 0.1,

  };

  // =========================
  // STATE INTERACTIONS
  // =========================

  function onEachState(feature, layer) {

    layer.on({

      mouseover: (e) => {

        e.target.setStyle({

          fillColor: "#00FFFF",

          fillOpacity: 0.3,

          weight: 3,

        });

      },

      mouseout: (e) => {

        e.target.setStyle(defaultStyle);

      },

      click: (e) => {

        const map = e.target._map;

        map.fitBounds(
          e.target.getBounds(),
          {
            padding: [20, 20],
          }
        );

      },

    });

  }

  // =========================
  // CUSTOM MARKER ICONS
  // =========================

  const greenIcon = new L.Icon({

    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

  });

  const blueIcon = new L.Icon({

    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

  });

  const redIcon = new L.Icon({

    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

  });

  // =========================
  // GET ICON
  // =========================

  function getMarkerIcon(category) {

    if (category === "RRB") {

      return greenIcon;

    }

    if (category === "StCB") {

      return blueIcon;

    }

    return redIcon;

  }

  return (

    <div className="relative h-screen w-full">

      {/* ========================= */}
      {/* DROPDOWN FILTER */}
      {/* ========================= */}

      <div className="absolute top-4 left-20 z-[1000]">

        <select

          value={selectedCategory}

          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }

          className="
            bg-black
            text-white
            p-3
            rounded-lg
            border
            border-white
            shadow-lg
          "
        >

          <option value="ALL">
            All Banks
          </option>

          <option value="RRB">
            RRBs
          </option>

          <option value="StCB">
            StCBs
          </option>

          <option value="DCCB">
            DCCBs
          </option>

        </select>

      </div>

      {/* ========================= */}
      {/* MAP */}
      {/* ========================= */}

      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
      >

        {/* ========================= */}
        {/* DARK TILE LAYER */}
        {/* ========================= */}

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ========================= */}
        {/* INDIA STATES */}
        {/* ========================= */}

        {geoData && (

          <GeoJSON
            data={geoData}
            style={defaultStyle}
            onEachFeature={onEachState}
          />

        )}

        {/* ========================= */}
        {/* BANK MARKERS */}
        {/* ========================= */}

        {filteredBanks.map((bank) => (

          <Marker

            key={`${bank.category}-${bank.id}`}

            position={bank.position}

            icon={getMarkerIcon(bank.category)}

          >

            <Popup>

              <div className="text-black min-w-[250px]">

                <h2 className="font-bold text-lg mb-2">

                  {bank.name}

                </h2>

                <p>

                  <strong>Category:</strong>

                  {" "}

                  {bank.category}

                </p>

                <p>

                  <strong>State:</strong>

                  {" "}

                  {bank.state}

                </p>

                <p>

                  <strong>District:</strong>

                  {" "}

                  {bank.district}

                </p>

                <p>

                  <strong>Headquarters:</strong>

                  {" "}

                  {bank.headquarters}

                </p>

                <p>

                  <strong>Established:</strong>

                  {" "}

                  {bank.established}

                </p>

                {bank.sponsorBank && (

                  <p>

                    <strong>Sponsor Bank:</strong>

                    {" "}

                    {bank.sponsorBank}

                  </p>

                )}

                {bank.website && (

                  <a

                    href={bank.website}

                    target="_blank"

                    rel="noreferrer"

                    className="
                      text-blue-600
                      underline
                    "
                  >

                    Visit Website

                  </a>

                )}

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  );

}

export default MapView;