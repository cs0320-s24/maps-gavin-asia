package edu.brown.cs.student.main.server.handlers;

import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class KeywordFilterHandler implements Route {

  private GeoJSONObject geoJSONObject;

  public KeywordFilterHandler(GeoJSONObject geoJSONObject) {
    this.geoJSONObject = geoJSONObject;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    String keyWord = request.queryParams("keyWord");

    GeoJSONObject filteredGeoJSONObject = geoJSONObject.filterKeyWords(keyWord);
    responseMap.put("data", filteredGeoJSONObject);

    return Utils.toMoshiJson(responseMap);
  }
}
