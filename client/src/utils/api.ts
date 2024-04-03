import { getLoginCookie } from "./cookie";

const HOST = "http://localhost:3232";

async function queryAPI(
  endpoint: string,
  query_params: Record<string, string>
) {
  const paramsString = new URLSearchParams(query_params).toString();
  const url = `${HOST}/${endpoint}?${paramsString}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(response.status, response.statusText);
  }
  return response.json();
}

export async function getFilteredRedlining(minLat: number, maxLat: number, minLong: number, maxLong: number) {
  return await queryAPI("filtered-geojson", {
    minLat: minLat.toString(),
    maxLat: maxLat.toString(),
    minLong: minLong.toString(),
    maxLong: maxLong.toString(),
  });
}

export async function getBroadband(stateIn: string, countyIn: string) {
  return await queryAPI("broadband", {
    county: countyIn,
    state: stateIn,
  });
}

export async function addPin(longIn: string, latIn: string) {
  return await queryAPI("add-pin", {
    uid: getLoginCookie() || "",
    long: longIn,
    lat: latIn,
  });
}

export async function getPins() {
  return await queryAPI("list-pins", {
    uid: getLoginCookie() || "",
  });
}

export async function clearUser(uid: string = getLoginCookie() || "") {
  return await queryAPI("clear-user", {
    uid: uid,
  });
}
