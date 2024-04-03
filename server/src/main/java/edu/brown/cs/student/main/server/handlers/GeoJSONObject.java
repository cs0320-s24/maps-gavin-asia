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

    return filtere