import Mapbox from "./Mapbox";
import { getBroadband } from "../utils/api";
import { useState } from "react";

export default function MapsGearup() {
  const [stateInput, setStateInput] = useState("");
  const [countyInput, setCountyInput] = useState("");

  // Create a state variable to store the broadband data in a map.
  const[mappedData, _] = useState<Map<string, string>>(new Map());

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
          setCountyInput("");
          setStateInput("");
          let res = await getBroadband(stateInput, countyInput);
          if (res.data !== undefined) {
            // Add the data to the map.
            mappedData.set(res.data[0] + res.data[1], res.data[2]);
          }
        }}
      >
        Get Broadband Data!
      </button>
      {<Mapbox mappedData={mappedData}/>}
    </div>
  );
}
