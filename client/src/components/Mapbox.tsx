import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import Map, {
  Layer,
  MapLayerMouseEvent,
  Source,
  ViewStateChangeEvent,
  MapRef,
  Popup,
  Marker,
} from "react-map-gl";
import {
  geoLayer,
  overlayData,
  broadbandLayer,
  broadbandOverlay,
} from "../utils/overlay";
import { addPin, getPins } from "../utils/api";

import mapPin from "../components/pin.png";

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

interface MapboxProps {
  mappedData: Map<string, string>;
  pins: LatLong[];
  setPins: Dispatch<SetStateAction<LatLong[]>>;
  flyCoords: LatLong;
}

export const getFeatureCenter = (feature: GeoJSON.Feature) => {
  if (feature.geometry.type === "Polygon") {
    let coords = feature.geometry.coordinates;
    let avgLat = 0;
    let avgLong = 0;
    for (let i = 0; i < coords[0].length; i++) {
      avgLat += coords[0][i][1];
      avgLong += coords[0][i][0];
    }
    avgLat /= coords[0].length;
    avgLong /= coords[0].length;
    return { latitude: avgLat, longitude: avgLong };
  }
  return { latitude: 0, longitude: 0 };
};

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

  async function onMapClick(e: MapLayerMouseEvent) {
    // Add the pin to the pins array.
    props.setPins([...props.pins, { lat: e.lngLat.lat, long: e.lngLat.lng }]);
    await addPin(e.lngLat.lng.toString(), e.lngLat.lat.toString());
  }

  const [popupHover, setPopupHover] = useState<{
    longitude: number;
    latitude: number;
    data: any;
  } | null>(null);

  const [hPressed, setHPressed] = useState(false);

  // Function to smoothly move the map to a specified location
  const flyToLocation = (latitude: number, longitude: number) => {
    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        essential: true,
        speed: 0.8,
        zoom: 9,
      });
    }
  };

  const onHover = (event: MapLayerMouseEvent) => {
    setBroadband(broadbandOverlay(props.mappedData));
    const features = mapRef.current?.queryRenderedFeatures(event.point, {
      layers: ["broadband_data"],
    });

    const feature = features && features[0];
    if (feature && feature.geometry.type === "Polygon") {
      let { latitude: avgLat, longitude: avgLong } = getFeatureCenter(feature);
      setPopupHover({
        longitude: avgLong,
        latitude: avgLat,
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
    if (props.flyCoords) {
      flyToLocation(props.flyCoords.lat, props.flyCoords.long);
    }
  }, [props.flyCoords]);

  useEffect(() => {
    setOverlay(overlayData());
    setBroadband(broadbandOverlay(props.mappedData));

    getPins().then((data) => {
      // Loop through data.pins and split by comma, then convert to LatLong:
      let pinsConverted: LatLong[] = [];
      data.pins.forEach((pin: string) => {
        let [long, lat] = pin.split(",");
        pinsConverted.push({ lat: parseFloat(lat), long: parseFloat(long) });
      });
      props.setPins(pinsConverted);
    });

    // Hide the popup when the "h" key is pressed:
    const hDown = (ev: KeyboardEvent) => {
      if (ev.key === "h") {
        setHPressed(true);
      }
    };
    const hUp = (ev: KeyboardEvent) => {
      if (ev.key === "h") {
        setHPressed(false);
      }
    };

    // Add event listeners for the key presses.
    window.addEventListener("keydown", hDown);
    window.addEventListener("keyup", hUp);

    // Remove event listeners when the component is unmounted.
    return () => {
      window.removeEventListener("keydown", hDown);
      window.removeEventListener("keyup", hUp);
    };
  }, [props.mappedData]);

  return (
    <div className="map">
      <Map
        mapboxAccessToken={MAPBOX_API_KEY}
        {...viewState}
        projection={{
          name: "globe",
        }}
        fog={{
          color: "#9ee1e8",
          "horizon-blend": 0.02,
          "high-color": "#113385",
          "space-color": "#000000",
          "star-intensity": 0.5,
        }}
        style={{ width: window.innerWidth, height: window.innerHeight }}
        mapStyle={"mapbox://styles/mapbox/satellite-streets-v12"}
        onMove={(ev: ViewStateChangeEvent) => setViewState(ev.viewState)}
        onClick={(ev: MapLayerMouseEvent) => onMapClick(ev)}
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
        {popupHover && !hPressed && (
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
        {props.pins.map((pin, index) => (
          <Marker
            key={index}
            longitude={pin.long}
            latitude={pin.lat}
            anchor="bottom"
          >
            <img src={mapPin} alt="Marker" className="pin-image" />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
