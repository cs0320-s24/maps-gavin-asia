# Project Details

## Maps

### Team members:

Asia Nguyen (atnguyen), Gavin Dhanda (gdhanda)

### Repo:

https://github.com/cs0320-s24/maps-gavin-asia

### Total time:

15 hours

# Design Choices

## Overall Structure
### Client:
#### MapsGearup
MapsGearup sets up the data for our map. Here, we fetch the redlining data from the backend, which we pass in the coordinates of the entire US to display all of the redlining data when the map is first rendered. Additionally, we fetch the filtered redlining data when a user inputs a keyword for a feature's description. Finally, we fetch the broadband data based on the inputted state and county. All of the fetch calls query the backend server through designated end points. 
#### Mapbox
In Mapbox, we handle much of the functionality associated with interacting with the map. This includes setting the overlay data we got from MapsGearup, handling button clicks, flying to the inputted location, inserting the broadband popup, and implementing event listeners. 
#### api.ts
This class includes functions that fetch data from the backend through certain endpoints. For instance, we query the backend for redlining data, broadband data, pins, and keywords through these functions.
#### overlay.ts
This class includes functions that are responsonsible for filtering the GeoJSON's features.
### Server:
#### AddPinHandler
A handler that is invoked when a user clicks on the map to add a pin. It stores the pins location for the specific user that created it.
#### ClearUserHandler
A handler that is invoked when we clear a user from the data base.
#### FilteredDataHandler
A handler that is invoked when we want to filter the redlining data based on specific minimum and maximum latitudes and longitudes.
#### KeywordFilterHandler
A handler that is invoked when we want to filter the redlining data based on a keyword. We convert the JSON's filtered data, which is done by parsing the area description for the keyword, into a GeoJSON object.
#### ListPinsHandler
A handler that is invoked when we add a pin. It keeps a list of the pins created per user.
#### GeoJSONObject
A class that represents a GeoJSON object with fields for a GeoJSON. It also includes functions that handles filtering the data based on location and keywords.

# Errors/Bugs
No, we are not aware of any bugs. However, we did not do extensive testing, so there may be underlying bugs that were not obvious while interacting with the UI.

# Tests
We chose to omit testing in exchange for happiness and joy.

# How to
#### Display filtered redlining data:
A developer could input minimum and maximum latitudes and longitudes into the backend server through the filtered-geojson endpoint to get filtered redlining data. The returned data will show all the features that are within the bounds of the inputted coordinates. Additionally, a developer could specify the coordinates into the getRedlining parameters to display only a portion of the redlining data when the map is first rendered.
#### Start up the frontend:
- First start by doing 'npm install' if you haven't already.
- Then run 'npm start' 
- You can click on the map to add a pin
- You can click and drag to move the map
- You can scroll with two fingers to zoom
- You can enter a state and county and press 'Get broadband data!' to be directed to the specified location with the data displayed
- You can enter a keyword and press 'Get area data!' to see the areas with a description that includes the specified keyword highlighted in white
#### Start up the backend:
- Run 'mvn package'
- Run './run'
- You can use any of the specified inputs and input parameters to see the response map generated by that query
- Developers can use the filtered-geojson endpoint for whatever purposes to get the filtered redlining data from the backend

# Collaboration
- Most of our base structure came from the gearup
- Looked up help for specific, extra functionality like changing the map projection and flying to the coordinates
