import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class Explore extends StatefulWidget {
  @override
  _ExploreState createState() => _ExploreState();
}

class _ExploreState extends State<Explore> {
  GoogleMapController _googleMapController;
  PageController _pageController;
  int mapPlaceIndex = 0;

  List<Marker> restaurantMarkers = [];

  final LatLng _latLng = const LatLng(13.1334, 77.5674);

  void _onMapCreated(GoogleMapController controller){
    _googleMapController = controller;
  }

  @override
  void initState() {
    _pageController = new PageController(initialPage: mapPlaceIndex, viewportFraction: 0.8);
    restaurantMarkers.add(
      Marker(
        markerId: MarkerId("1"),
        infoWindow: InfoWindow(
          title: "Bhagini Pavilion",
          snippet: "5.0, 22391 reviews"
        ),
        position: _latLng,
        onTap: (){
          _pageController.animateToPage(
            0,
            curve: Curves.easeIn,
            duration: Duration(milliseconds: 300)
          );
          _googleMapController.animateCamera(
            CameraUpdate.newLatLngZoom(_latLng, 14.0)
            );
        }
      ),
    );
    restaurantMarkers.add(
      Marker(
        markerId: MarkerId("2"),
        infoWindow: InfoWindow(
          title: "Zocial Point",
          snippet: "4.9, Best Italian Cuisine around you"
        ),
        position: LatLng(13.1452658, 77.5677778),
        onTap: (){
          _pageController.animateToPage(
            1,
            curve: Curves.easeIn,
            duration: Duration(milliseconds: 300)
          );
          _googleMapController.animateCamera(
            CameraUpdate.newLatLngZoom(LatLng(13.1452658, 77.5677778), 14.0)
            );
        }
      ));
      restaurantMarkers.add(
      Marker(
        markerId: MarkerId("3"),
        infoWindow: InfoWindow(
          title: "Hindusthan Famliy Restaurant",
          snippet: "4.5, Best North Cuisine around you"
        ),
        position: LatLng(13.1293454,77.5720085),
        onTap: (){
          _pageController.animateToPage(
            2,
            curve: Curves.easeIn,
            duration: Duration(milliseconds: 300)
          );
          _googleMapController.animateCamera(
            CameraUpdate.newLatLngZoom(LatLng(13.1293454,77.5720085), 14.0)
            );
        }
      ));
    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          GoogleMap(
            onMapCreated: _onMapCreated,
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            markers: Set<Marker>.of(restaurantMarkers),
            initialCameraPosition: CameraPosition(
              target: _latLng,
              zoom: 14.0
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 180.0,
              margin: EdgeInsets.only(bottom: 20.0),
              child: PageView.builder(
                controller: _pageController,
                physics: PageScrollPhysics(),
                pageSnapping: true,
                itemCount: 10,
                onPageChanged:(index){
                  _googleMapController.animateCamera(
                    CameraUpdate.newLatLngZoom(index == 2 ? LatLng(13.1452658, 77.5677778) : index == 1 ? LatLng(13.1293454,77.5720085) : _latLng, 14.0)
                  );
                  restaurantMarkers[index == 2 ? 2 : index == 1 ? 1 : 0].onTap();
                  setState(() {
                    mapPlaceIndex = index;
                  });
                },
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, indexOfRestaurant){
                  return Container(
                    width: MediaQuery.of(context).size.width * 0.9,
                    margin: EdgeInsets.all(5.0),
                    child: Card(
                      elevation: 4.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(Radius.circular(10.0))
                      ),
                      clipBehavior: Clip.antiAliasWithSaveLayer,
                      child: Stack(
                        children: <Widget>[
                          Container(
                            child: Image.network(
                              indexOfRestaurant == 2 ? 'https://www.theriverside.co.uk/images/Inside-Restaurant.jpg' : indexOfRestaurant == 1 ? 'https://ak2.picdn.net/shutterstock/videos/13074452/thumb/1.jpg' : 'https://www.boringplate.com/wp-content/uploads/2015/12/Boring-Plate-find-exciting-food-North-Indian-Cuisine-1.jpg',
                              fit: BoxFit.cover,
                              width: MediaQuery.of(context).size.width * 0.9,
                              filterQuality: FilterQuality.high,
                            ),
                          ),
                          Container(
                            height: 180.0,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.bottomCenter,
                                end: Alignment.topLeft,
                                colors: [
                                  Colors.black54,
                                  Colors.black38,
                                  Colors.black26,
                                  Colors.transparent
                                ],
                                stops: [
                                  0.2,
                                  0.3,
                                  0.6,
                                  1.0
                                ]
                              )
                            ),
                          ),
                          Align(
                            alignment: Alignment.bottomRight,
                            child: Column(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              Container(
                                margin: EdgeInsets.all(10.0),
                                child: Text(
                                  indexOfRestaurant == 2 ? "Hindusthan Family Restaurant" : indexOfRestaurant == 1 ? "Zocial Point" : "Bhagini Pavilion" ,
                                  style: TextStyle(
                                    fontFamily: 'Orkney',
                                    color: Colors.white,
                                    fontSize: 18.0,
                                    fontWeight: FontWeight.w400
                                  ),
                                ),
                              )
                            ],
                          ),
                          )
                        ],
                      )
                    ),
                  );
                },
              )
            ),
          )
        ],
      )
    );
  }
}