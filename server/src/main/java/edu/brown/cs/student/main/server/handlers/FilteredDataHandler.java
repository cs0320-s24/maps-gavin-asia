package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class FilteredDataHandler implements Route {

  public StorageInterface storageHandler;
  public GeoJSONObject geoJSONObject;

  public FilteredDataHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
    String filePath = "data/geojson/fullDownload.json";
    try {
      // ***************** READING THE FILE *****************
      FileReader jsonReader = new FileReader(filePath);
      BufferedReader br = new BufferedReader(jsonReader);
      String fileString = "";
      String line = br.readLine();
      while (line != null) {
        fileString = fileString + line;
        line = br.readLine();
      }
      jsonReader.close();

      // ****************** CREATING THE ADAPTER **********
      this.geoJSONObject = Utils.fromJsonGeneral(fileString, GeoJSONObject.class);
    } catch (IOException e) {
      System.out.println(e.getMessage());
    }
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
