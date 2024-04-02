package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class FilteredDataHandler implements Route {

  public StorageInterface storageHandler;

  public FilteredDataHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    Integer minLat = Integer.parseInt(request.queryParams("minLat"));
    Integer maxLat = Integer.parseInt(request.queryParams("maxLat"));
    Integer minLong = Integer.parseInt(request.queryParams("minLong"));
    Integer maxLong = Integer.parseInt(request.queryParams("maxLong"));

    responseMap.put("minLat", minLat);
    responseMap.put("maxLat", maxLat);
    responseMap.put("minLong", minLong);
    responseMap.put("maxLong", maxLong);

    return Utils.toMoshiJson(responseMap);
  }
}
