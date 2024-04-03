package edu.brown.cs.student.main.server.handlers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * This class represents the GeoJSON data - it contains a list of features, and each feature
 * contains a type, a geometry (a huge list of coordinates), and a list of properties. Each list of
 * properties contains a name, a holc grade, and a hashmap of area description data, along other
 * properties.
 */
public class GeoJSONObject {
  public String type;
  public List<Feature> features;

  public static class Feature {
    public String type;
    public Geometry geometry;
    public Properties properties;
  }

  public static class Geometry {
    public String type;
    public List<List<List<List<Double>>>> coordinates;
  }

  public static class Properties {
    public String city;
    public String holc_grade;
    public Map<String, String> area_description_data;
  }

  // Filter the GeoJSON data to only include the data within the specified latitude and longitude
  // bounds. The latitude and longitude bounds are specified by the query parameters minLat, maxLat,
  // minLong, and maxLong.
  public GeoJSONObject filterData(Double minLat, Double maxLat, Double minLong, Double maxLong) {

    List<Feature> filteredFeatures =
        features.stream()
            .filter(feature -> isFeatureWithinBounds(feature, minLat, maxLat, minLong, maxLong))
            .collect(Collectors.toList());

    GeoJSONObject filteredGeoJSONObject = new GeoJSONObject();
    filteredGeoJSONObject.type = this.type;
    filteredGeoJSONObject.features = filteredFeatures;

    return filteredGeoJSONObject;
  }

  public GeoJSONObject filterKeyWords(String keyWord) {
    List<Feature> filteredFeatures =
        features.stream()
            .filter(feature -> isFeatureWithDescription(feature, keyWord))
            .collect(Collectors.toList());

    GeoJSONObject filteredGeoJSONObject = new GeoJSONObject();
    filteredGeoJSONObject.type = this.type;
    filteredGeoJSONObject.features = filteredFeatures;

    return filteredGeoJSONObject;
  }

  private boolean isFeatureWithDescription(Feature feature, String keyWord) {
    if (feature == null
        || feature.properties == null
        || feature.properties.area_description_data.isEmpty()) {
      return false;
    }
    Map<String, String> areaDescriptionData = feature.properties.area_description_data;
    // probably need to parse keywords array into an array of strings separatted by spaces
    for (String description : areaDescriptionData.values()) {
      if (description.contains(keyWord)) {
        return true;
      }
    }
    return false;
    // go through the area description and check if each value has keyword
  }

  private boolean isFeatureWithinBounds(
      Feature feature, Double minLat, Double maxLat, Double minLong, Double maxLong) {

    // Check for null feature or geometry
    if (feature == null || feature.geometry == null || feature.geometry.coordinates.isEmpty()) {
      return false;
    }

    try {
      // Access the first point of the first list of lists of lists of coordinates
      List<List<List<List<Double>>>> coordinates = feature.geometry.coordinates;
      List<Double> firstPoint = coordinates.get(0).get(0).get(0);

      // Check if the first point is within bounds
      Double longitude = firstPoint.get(0);
      Double latitude = firstPoint.get(1);

      boolean inBounds =
          longitude >= minLong && longitude <= maxLong && latitude >= minLat && latitude <= maxLat;

      return inBounds;
    } catch (IndexOutOfBoundsException e) {
      // Catch any exceptions related to accessing the nested lists, returning false in such cases
      System.out.println("Exception accessing coordinates: " + e.getMessage());
      return false;
    }
  }
}
