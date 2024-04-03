package edu.brown.cs.student.main.server.handlers;

import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class FilteredDataHandler implements Route {

  public GeoJSONObject geoJSONObject;

  public FilteredDataHandler(GeoJSONObject geoJSONObject) {
    this.geoJSONObject = geoJSONObject;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    Double minLat = Double.parseDouble(request.queryParams("minLat"));
    Double maxLat = Double.parseDouble(request.queryParams("maxLat"));
    Double minLong = Double.parseDouble(request.queryParams("minLong"));
    Double maxLong = Double.parseDouble(request.queryParams("maxLong"));

    // If no parameters given, return the full GeoJSON data
    if (request.queryParams().isEmpty()) {
      responseMap.put("data", geoJSONObject);
      return Utils.toMoshiJson(responseMap);
    }

    GeoJSONObject filteredGeoJSONObject =
        geoJSONObject.filterData(minLat, maxLat, minLong, maxLong);

    responseMap.put("data", filteredGeoJSONObject);

    return Utils.toMoshiJson(responseMap);
  }
}
