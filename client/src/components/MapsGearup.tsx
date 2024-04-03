import Mapbox from "./Mapbox";
import {
  getBroadband,
  clearUser,
  getFilteredRedlining,
  getKeywords,
} from "../utils/api";
import { useState, useEffect } from "react";
import { LatLong, ProvidenceLatLong } from "../components/Mapbox";
import { broadbandOverlay } from "../utils/overlay";
import { getFeatureCenter } from "./Mapbox";

export default function MapsGearup() {
  const [stateInput, setStateInput] = useState("");
  const [countyInput, setCountyInput] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [flyCoords, setFlyCoords] = useState<LatLong>(ProvidenceLatLong);
  const [redliningData, setRedliningData] =
    useState<GeoJSON.FeatureCollection>();
  const [areaData, setAreaData] = useState<GeoJSON.FeatureCollection>();

  useEffect(() => {
    // Asynchronously fetch redlining data
    async function fetchRedliningData() {
      try {
        let json = await getFilteredRedlining(20.0, 50.0, -130.0, -70.0);
        setRedliningData(json.data);
        console.log("Fetched redlining data:", json.data);
      } catch (error) {
        console.error("Failed to fetch redlining data:", error);
        // Handle error appropriately
      }
    }

    fetchRedliningData();
  }, []);

  async function handleAreaClick() {
    setAreaInput("");
    try {
      let json = await getKeywords(areaInput);
      setAreaData(json.data);
      console.log("Fetched area data:", json.data);
    } catch (error) {
      console.error("Failed to fetch area data:", error);
    }
  }

  // Function to handle broadband click:
  async function handleBroadbandClick() {
    setCountyInput("");
    setStateInput("");
    let res = await getBroadband(stateInput, countyInput);
    if (res.data !== undefined) {
      // Add the data to the map.
      mappedData.set(res.data[0] + res.data[1], res.data[2]);

      // Make map with just the new data.
      let newMap = new Map();
      newMap.set(res.data[0] + res.data[1], res.data[2]);
      let features = broadbandOverlay(newMap);
      if (features !== undefined) {
        // Get the center of the feature.
        let center = getFeatureCenter(features.features[0]);
        if (center) {
          setFlyCoords({ lat: center.latitude, long: center.longitude });
        }
      }
    }
  }

  // Create a state variable to store the broadband data in a map.
  const [mappedData, setMappedData] = useState<Map<string, string>>(new Map());
  // Create a state variable to store the pins.
  const [pins, setPins] = useState<LatLong[]>([]);

  return (
    <div>
      <h1 aria-label="Maps Title">Maplette 🎀💀🗿</h1>
      {/* Add input boxe for state. */ "State: "}
      <input
        aria-label="state-input"
        id="state"
        type="text"
        value={stateInput}
        placeholder="Enter state here!"
        onChange={(ev) => setStateInput(ev.target.value)}
      />
      <br />
      {/* Add input box for county. */ "County: "}
      <input
        aria-label="county-input"
        id="county"
        type="text"
        value={countyInput}
        placeholder="Enter county here!"
        onChange={(ev) => setCountyInput(ev.target.value)}
      />
      <br />
      {/* Add a button that, when clicked, queries the backend for broadband data */}
      <button
        onClick={async () => {
          await handleBroadbandClick();
        }}
      >
        Get Broadband Data!
      </button>
      <br />
      {/* Add input box for area. */ "Area Descriptor: "}
      <input
        aria-label="area-input"
        id="area"
        type="text"
        value={areaInput}
        placeholder="Enter area keyword!"
        onChange={(ev) => setAreaInput(ev.target.value)}
      />
      <br />
      <button
        onClick={async () => {
          await handleAreaClick();
        }}
      >
        Get Area Data!
      </button>
      <br />
      <button
        onClick={async () => {
          setCountyInput("");
          setStateInput("");
          setMappedData(new Map());
          await clearUser();
          setPins([]);
        }}
      >
        Clear All User Data!
      </button>
      {
        <Mapbox
          mappedData={mappedData}
          pins={pins}
          setPins={setPins}
          flyCoords={flyCoords}
          redliningData={redliningData}
          areaData={areaData}
        />
      }
    </div>
  );
}
