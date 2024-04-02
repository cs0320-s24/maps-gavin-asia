import Mapbox from "./Mapbox";
import { getBroadband, clearUser } from "../utils/api";
import { useState } from "react";
import { LatLong } from "../components/Mapbox";
import { broadbandOverlay } from "../utils/overlay";
import { getFeatureCenter } from "./Mapbox";

export default function MapsGearup() {
  const [stateInput, setStateInput] = useState("");
  const [countyInput, setCountyInput] = useState("");
  const [flyCoords, setFlyCoords] = useState<LatLong>({ lat: 0, long: 0 });

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
        />
      }
    </div>
  );
}
