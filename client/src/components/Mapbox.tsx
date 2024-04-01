import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef } from "react";
import Map, {
  Layer,
  MapLayerMouseEvent,
  Source,
  ViewStateChangeEvent,
  MapRef,
  PointLike,
  Popup,
} from "react-map-gl";
import {
  geoLayer,
  overlayData,
  broadbandLayer,
  broadbandOverlay,
} from "../utils/overlay";

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
  
  const selectedFeatures = mapRef.current?.queryRenderedFeatures(bbox, {});
  console.log(selectedFeatures);
}

interface MapboxProps {
  mappedData: Map<string, string>;
}

export default function Mapbox(props: MapboxProps) {
  const [viewState, setViewState] = useState({
    latitude: ProvidenceLatLong.lat,
    longitude: ProvidenceLatLong.long,
    zoom: initialZoom,
  });

  const mapRef = useRef<MapRef>(null);

  const [overlay, setOverlay] = useState<GeoJSON.FeatureCollection | undefined>(
    undefined
  );

  const [broadband, setBroadband] = useState<
    GeoJSON.FeatureCollection | undefined
  >(undefined);

  const [popupHover, setPopupHover] = useState<{
    longitude: number;
    latitude: number;
    data: any;
  } | null>(null);

  const onHover = (event: MapLayerMouseEvent) => {
    setBroadband(broadbandOverlay(props.mappedData));
    const features = mapRef.current?.queryRenderedFeatures(event.point, {
      layers: ["broadband_data"],
    });

    const feature = features && features[0];
    if (feature) {
      setPopupHover({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        data: feature.properties,
      });
    } else {
      setPopupHover(null);
    }
  };

  const onLeave = () => {
    setPopupHover(null);
  };

  useEffect(() => {
    setOverlay(overlayData());
    setBroadband(broadbandOverlay(props.mappedData));
  }, [props.mappedData]);

  return (
    <div className="map">
      <Map
        mapboxAccessToken={MAPBOX_API_KEY}
        {...viewState}
        style={{ width: window.innerWidth, height: window.innerHeight }}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        onMove={(ev: ViewStateChangeEvent) => setViewState(ev.viewState)}
        onClick={(ev: MapLayerMouseEvent) => onMapClick(ev, mapRef)}
        onMouseMove={onHover}
        onMouseLeave={onLeave}
        ref={mapRef}
      >
        <Source id="geo_data" type="geojson" data={overlay}>
          <Layer {...geoLayer} />
        </Source>
        <Source id="broadband_data" type="geojson" data={broadband}>
          <Layer {...broadbandLayer()} />
        </Source>
        {popupHover && (
          <Popup
            longitude={popupHover.longitude}
            latitude={popupHover.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="center"
          >
            {/* Render the content of the popup */}
            <div>
              {/* Display properties of the broadband feature */}
              <p>{"County Name: " + popupHover.data.NAME}</p>
              <p>
                {"\nBroadband: " +
                  props.mappedData.get(
                    popupHover.data.STATEFP + popupHover.data.COUNTYFP
                  )}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
