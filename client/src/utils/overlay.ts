import { FeatureCollection } from "geojson";
import { FillLayer } from "react-map-gl";
import county_state from "../geodata/counties.json";

const propertyName = "holc_grade";
export const geoLayer: FillLayer = {
  id: "geo_data",
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", propertyName],
      "A",
      "#5bcc04",
      "B",
      "#04b8cc",
      "C",
      "#e9ed0e",
      "D",
      "#d11d1d",
      "#ccc",
    ],
    "fill-opacity": 0.4,
  },
};

export const areaLayer: FillLayer = {
    id: "area_data",
    type: "fill",
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0.6,
    },
  };

export const broadbandLayer: FillLayer = {
    id: "broadband_data",
    type: "fill",
    paint: {
      "fill-color": "#000000",
      "fill-opacity": 0.4,
    },
};

export function filterGeoJSONData(
  geojsonData: GeoJSON.FeatureCollection,
  data: Map<string, string>
) {
  // Filter the features
  const filteredFeatures = geojsonData.features.filter((feature) => {
    const statefp = feature.properties?.STATEFP;
    const countyfp = feature.properties?.COUNTYFP;

    // Check if this feature matches any state-county pair
    return data.has(statefp + countyfp);
  });

  // Return new GeoJSON object
  return {
    ...geojsonData,
    features: filteredFeatures,
  };
}

function isFeatureCollection(json: any): json is FeatureCollection {
  return json.type === "FeatureCollection";
}

export function overlayData(json: any): GeoJSON.FeatureCollection | undefined {
  return isFeatureCollection(json) ? json : undefined;
}

export function broadbandOverlay(
  data: Map<string, string>
): GeoJSON.FeatureCollection | undefined {
  return isFeatureCollection(county_state)
    ? filterGeoJSONData(county_state, data)
    : undefined;
}
