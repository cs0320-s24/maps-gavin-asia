import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef } from "react";
import Map, {
  Layer,
  MapLayerMouseEvent,
  Source,
  ViewStateChangeEvent,
  MapRef,
  PointLike,
} from "react-map-gl";
import { geoLayer, overlayData } from "../utils/overlay";

const MAPBOX_API_KEY = process.env.MAPBOX_TOKEN;
if (!MAPBOX_API_KEY) {
  console.error("Mapbox API key not found. Please add it to your .env file.");
}

export interface LatLong {
  lat: number;
  long: number;
}

const ProvidenceLatLong: LatLong = {
  lat: 41.824,
  long: -71.4128,
};
const initialZoom = 10;

function onMapClick(e: MapLayerMouseEvent, mapRef: React.RefObject<MapRef>) {
  console.log(e.lngLat.lat);
  console.log(e.lngLat.lng);
  const bbox: [PointLike, PointLike] = [
    [e.point.x, e.point.y],
    [e.point.x, e.point.y],
  ];
  //add broadband counties data source as a layer from backend and get data to show up for bounding box
  const selectedFeatures = mapRef.current?.queryRenderedFeatures(bbox, {});
  console.log(selectedFeatures);
}

export default function Mapbox() {
  const [viewState, setViewState] = useState({
    latitude: ProvidenceLatLong.lat,
    longitude: ProvidenceLatLong.long,
    zoom: initialZoom,
  });

  const mapRef = useRef<MapRef>(null);

  const [overlay, setOverlay] = useState<GeoJSON.FeatureCollection | undefined>(
    undefined
  );

  useEffect(() => {
    setOverlay(overlayData());
  }, []);

  return (
    <div className="map">
      <Map
        mapboxAccessToken={MAPBOX_API_KEY}
        {...viewState}
        style={{ width: window.innerWidth, height: window.innerHeight }}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        onMove={(ev: ViewStateChangeEvent) => setViewState(ev.viewState)}
        onClick={(ev: MapLayerMouseEvent) => onMapClick(ev, mapRef)}
        ref={mapRef}
      >
        <Source id="geo_data" type="geojson" data={overlay}>
          <Layer {...geoLayer} />
        </Source>
        <Source id="broadband_data" type="geojson" data={overlay}>
          <Layer {...geoLayer} />
        </Source>
      </Map>
    </div>
  );
}
