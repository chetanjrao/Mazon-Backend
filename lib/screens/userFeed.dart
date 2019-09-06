import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:mazon/my_flutter_app_icons.dart';
import 'package:mazon/utils/customCard.dart';
import './restaurantView.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flip_card/flip_card.dart';
import 'package:badges/badges.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import '../utils/globals.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:shimmer/shimmer.dart';

class UserFeed extends StatefulWidget {
  @override
  _UserFeedState createState() => _UserFeedState();
}

class _UserFeedState extends State<UserFeed> with AutomaticKeepAliveClientMixin {

  List popularRestaurants;
  int currentPage = 1;
  PageController _controller;
  ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    this.getPopularRestaurants();
  }

  void getPopularRestaurants() async {
  var response = await http.get('http://$server:$port/api/public/library/restaurants?requestQueryType=popular',);
  var responseJSON = response.body;
  var decodedJSON = jsonDecode(responseJSON);
  setState(() {
    _controller = new PageController(
      initialPage: currentPage,//(decodedJSON.length/2).floor(),
      keepPage: false,
      viewportFraction: 0.5,
    );
    _scrollController = new ScrollController();
    popularRestaurants = jsonDecode(responseJSON);
  });
  
  @override
  dispose(){
    _controller.dispose();
    _scrollController.dispose();
     super.dispose();
  }
}

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 24.0),
      child: Container(
        child: popularRestaurants == null ? Container(
          child: Center(
            child: Container(
              height: 20.0,
              width: 20.0,
              child: CircularProgressIndicator(
                backgroundColor: Color(0x0f000000),
                strokeWidth: 2.0,
              ),
            ),
          ),
        ) : popularRestaurants.length == 0 ? Container(
            height: 0,
        ) : CustomScrollView(
          scrollDirection: Axis.vertical,
          slivers: <Widget>[
            SliverList(
              delegate: SliverChildListDelegate([
                Flex(
                  direction: Axis.horizontal,
                  children: <Widget>[
                     Container(
                       margin: EdgeInsets.only(top: 10.0),
                        width: 42.0,
                       height: 48.0,
                       padding: EdgeInsets.all(5.0),
                        child:Center(
                      child: Icon(
                          MdiIcons.text,
                          color: Colors.blueGrey,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                      margin: EdgeInsets.only(top: 12.0, right: 12.0, left: 6.0),
                      height: 48.0,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.all(Radius.circular(6.0)),
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Color(0x22000000),
                              offset: Offset(2.0, 0.5),
                              blurRadius: 1.0,
                              spreadRadius: 1.0
                            )
                            ]
                        ),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Container(
                            margin: EdgeInsets.only(left: 8.0),
                            child: Wrap(
                          children: <Widget>[
                                Icon(
                                  Icons.search,
                                  color: Colors.blueGrey,
                                  size: 22.0, 
                                ),
                                Container(
                                    margin: EdgeInsets.only(top: 3.0, left: 5.0),
                                    child: Text(
                                    "Search",
                                    style: TextStyle(
                                      fontSize: 16.0,
                                      fontFamily: 'Orkney',
                                      color: Colors.blueGrey
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(top: 3.0, left: 5.0),
                                  child: FadeAnimatedTextKit(
                                  onTap: (){

                                  },
                                  text: [
                                    "Food",
                                    "Cusines",
                                    "Varieties",
                                    "Restaurants",
                                    "Cafes",
                                    "Locations",
                                    "Mazon"
                                  ],
                                  textStyle: TextStyle(
                                    fontSize: 16.0,
                                    fontFamily: 'Orkney',
                                    color: Colors.blueGrey,
                                    fontWeight: FontWeight.w600
                                  ),
                                  alignment: AlignmentDirectional.topStart,
                                  isRepeatingAnimation: false,
                                )
                                )
                              ],
                            ),
                          )
                        )
                      ),
                    )
                  ],
                ),
                Heading(
                  heading: "Top Restaurants",
                ),
                Container(
                  color: Colors.transparent,
                  margin: EdgeInsets.fromLTRB(5.0, 5.0, 5.0, 10),
                  height: 140,
                  child: ListView.builder(
                      itemCount: popularRestaurants.length,
                      addRepaintBoundaries: true,
                      scrollDirection: Axis.horizontal,
                      itemBuilder: (context, index){
                        return GestureDetector(
                          child: Card(
                            elevation: 2.0,
                            clipBehavior: Clip.antiAliasWithSaveLayer,
                            child: Stack(
                              children: <Widget>[
                              Container(
                              height: 140,
                              width: 120,
                              child:Container(
                                  child: Column(
                                    children: <Widget>[
                                      Stack(
                                        children: <Widget>[
                                          ClipPath(
                                            clipper: CrossClipper(),
                                            child: Container(
                                              height: 130,
                                              child: Container(
                                                child: Stack(
                                                  children: <Widget>[
                                                    FadeInImage.assetNetwork(
                                                      fadeInDuration: Duration(milliseconds: 200),
                                                      placeholder: 'assets/imageBackground.png',
                                                      image: 'http://$server:$port/images/restaurants/image.jpg',
                                                      height: 80,
                                                      width: 120,
                                                      fit: BoxFit.cover,
                                                    )
                                                  ],
                                                )
                                              ),
                                            )
                                          ),
                                          Container(
                                            height: 130,
                                            child: Container(
                                              alignment: Alignment.bottomLeft,
                                              child: Container(
                                                height: 63,
                                                width: 120,
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: <Widget>[
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 11, 2, 0),
                                                      child: Text(
                                                        restaurantNameDecider(popularRestaurants[index]["name"]),
                                                        textAlign: TextAlign.left,
                                                        style: TextStyle(
                                                          fontFamily: 'Orkney',
                                                          fontSize: 13
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 1, 2, 0),
                                                      child: Text(
                                                        addressDecider(popularRestaurants[index]["address"]), 
                                                        textAlign: TextAlign.left,
                                                        maxLines: 2,
                                                        style: TextStyle(
                                                          color: Color(0xFF838383),
                                                          fontFamily: 'Oxygen',
                                                          fontSize: 9
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 1, 2, 0),
                                                      child: Text(
                                                        "Yelahanka".toUpperCase(), 
                                                        textAlign: TextAlign.left,
                                                        maxLines: 2,
                                                        style: TextStyle(
                                                          color: Color(0xFF838383),
                                                          fontFamily: 'Oxygen',
                                                          fontSize: 9
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 0, 2, 0),
                                                      child: FlutterRatingBarIndicator(
                                                              itemPadding: EdgeInsets.all(0.5),
                                                              rating: double.parse(popularRestaurants[index]["ratings"]),
                                                              itemCount: 5,
                                                              itemSize: 9.0,
                                                              emptyColor: Colors.amber.withAlpha(50),
                                                          ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          )
                                        ],
                                      ),
                                      
                                    ],
                                  ),
                          ),
                          ),
                          Positioned(
                            right: 0,
                            bottom: 0,
                                child: RatingsBadge(
                                  rating: double.parse(popularRestaurants[index]["ratings"])
                                ),
                              ),
                            ],)
                          ),
                          onTap: (){
                            Navigator.push(context, MaterialPageRoute(builder: (context)=> RestaurantView(
                              restaurantID: popularRestaurants[index]["id"]
                            )));
                          },
                        );
                      },
                  ),
                ),
                Heading(
                  heading: "Popular Restaurants",
                ),
                Container(
                  height: 130.0,
                  margin: EdgeInsets.fromLTRB(5.0, 5.0, 5.0, 10),
                  child: ListView.builder(
        itemCount: 15,
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index){
          return Container(
            width: 210,
            height: 140,
            margin: EdgeInsets.fromLTRB(0, 0, 5, 10),
             child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(6.0))
                ),
                clipBehavior: Clip.antiAliasWithSaveLayer,
                elevation: 4.0,
                    child: Container(
                      child: Stack(
                        children: <Widget>[
                          Container(
                            width: 210,
                            foregroundDecoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.bottomCenter,
                                end: Alignment.topCenter,
                                colors: [
                                  Colors.black87,
                                  Colors.black38,
                                  Colors.black12,
                                  Colors.transparent
                                ],
                                stops: [
                                  0.0,
                                  0.3,
                                  0.6,
                                  1.0
                                ]
                              )
                            ),
                            child: Image.network(
                            index % 2 == 0 ? 'https://cdn5.eyeem.com/thumb/e8e86a5bae1003daf0cdd9b208a5dc1e5a50f845-1538885667725/w/850' : 'https://thewallpaper.co/wp-content/uploads/2016/09/place-hd-wallpapers-Backgrounds-download-Beautiful-Places-free-cool-monitor-place-desktop-wallpapers-1366x768.jpg',
                            filterQuality: FilterQuality.high,
                            fit: BoxFit.cover,
                          ),
                          ),
                          Container(
                            alignment: Alignment.bottomRight,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.end,
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                Text(
                                  "Hotel Emperor",
                                  style: TextStyle(
                                    fontFamily: 'kano',
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.fromLTRB(5.0, 2.0, 5.0, 6.0),
                                  child: FlutterRatingBarIndicator(
                                    itemPadding: EdgeInsets.all(0.5),
                                    rating: double.parse("4.0"),
                                    itemCount: 5,
                                    itemSize: 10.0,
                                    emptyColor: Colors.amber.withAlpha(50),
                                ),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                ),
          );
            },
                ),
                ),
                Heading(
                  heading: "Fast Serving Restaurants",
                ),
                Container(
                  height: 150.0,
                  margin: EdgeInsets.only(left: 5.0, bottom: 16.0, top: 5.0),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: 10,
                    itemBuilder: (context, index){
                      return Container(
                        width: 120.0,
                        margin: EdgeInsets.all(5.0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.all(Radius.circular(6.0)),
                          boxShadow: [
                            BoxShadow(
                                color: Color(0x22000000),
                                offset: Offset(1.0, 1.0),
                                blurRadius: 1.0,
                                spreadRadius: 1.0
                              )
                            ]
                        ),
                        child: Container(
                          child: Stack(
                            children: <Widget>[
                              Container(
                                child: ClipRRect(
                                  child: FadeInImage.assetNetwork(
                                    fadeInDuration: Duration(milliseconds: 200),
                                    placeholder: 'assets/imageBackground.png',
                                    image: 'http://$server:$port/images/restaurants/image.jpg',
                                    height: 75,
                                    width: 120,
                                    fit: BoxFit.cover,
                                ),
                                borderRadius: BorderRadius.only(topLeft: Radius.circular(6.0), topRight: Radius.circular(6.0)),
                                )
                              ),
                              Align(
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  height: 65,
                                  width: 120,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.only(bottomLeft: Radius.circular(6.0), bottomRight: Radius.circular(6.0)),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Container(
                                        margin: EdgeInsets.only(left: 4.0, top: 4.0),
                                        child: Text("Big Brooskee",
                                        style: TextStyle(
                                          fontFamily: "Orkney",
                                          fontSize: 13.0,
                                          fontWeight: FontWeight.w500
                                        ),
                                        ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.only(left: 4.0, top: 2.0),
                                        child: Text("13TH Cross, Bell Road".toUpperCase(),
                                        style: TextStyle(
                                          fontFamily: "Orkney",
                                          fontSize: 8.5,
                                          fontWeight: FontWeight.w500,
                                          color: Color(0xFF868686)
                                        ),
                                        ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.only(left: 4.0, top: 2.0),
                                        child: Text("Yelahanka".toUpperCase(),
                                        style: TextStyle(
                                          fontFamily: "Orkney",
                                          fontSize: 8.5,
                                          fontWeight: FontWeight.w500,
                                          color: Color(0xFF868686)
                                        ),
                                        ),
                                      ),
                                      Wrap(
                                       children: <Widget>[
                                         Container(
                                        margin: EdgeInsets.fromLTRB(3.8, 2, 4, 2),
                                        child: FlutterRatingBarIndicator(
                                            itemPadding: EdgeInsets.all(0.2),
                                            rating: double.parse(popularRestaurants[index]["ratings"]),
                                            itemCount: 5,
                                            itemSize: 9.0,
                                            emptyColor: Colors.amber.withAlpha(50),
                                        ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.only(left: 4.0, top: 2.0),
                                        padding: EdgeInsets.all(1.0),
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.all(Radius.circular(3.0)),
                                          color: Color(0xFFE0AB8B),
                                          border: Border.all(
                                            color: Colors.orangeAccent,
                                            width: 0.35
                                          )
                                        ),
                                        child: Text("20% offer".toUpperCase(),
                                        style: TextStyle(
                                          fontFamily: "Orkney",
                                          fontSize: 7.0,
                                          fontWeight: FontWeight.w500,
                                          color: Colors.black87
                                        ),
                                        ),
                                      ),
                                       ]
                                       ),
                                    ],
                                  ),
                                ),
                              ),
                              Positioned(
                                child: Container(
                                  margin: EdgeInsets.all(3.0),
                                  padding: EdgeInsets.all(2.5),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle
                                  ),
                                  child: Icon(
                                    MdiIcons.crown,
                                    color: Color(0XFFD4AF37),
                                    size: 10.0,
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 0,
                                right: 0,
                                child: Container(
                                  width: 36.0,
                                  height: 20.0,
                                  decoration: BoxDecoration(
                                    color: Color(0xFF363636) ,
                                    borderRadius: BorderRadius.only(topRight: Radius.circular(6.0), bottomLeft: Radius.circular(3.0))
                                  ),
                                  child: Center(
                                    child: Text(
                                    "30 min",
                                    style: TextStyle(
                                      fontFamily: "Orkney",
                                        fontSize: 9.0,
                                        color: Colors.white,
                                        fontWeight: FontWeight.w500
                                      ),
                                    ),
                                  )
                                ),
                              ),
                            ],
                          ),
                        )
                      );
                    },
                  ),
                ),
                Heading(
                  heading: "Most Visited Restaurants",
                ),
                Container(
                  height: 140.0,
                  margin: EdgeInsets.only(left: 5.0, bottom: 20.0),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: 10,
                    itemBuilder: (context, index){
                      return Container(
                        width: 120.0,
                        margin: EdgeInsets.all(5.0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.all(Radius.circular(6.0)),
                          boxShadow: [
                            BoxShadow(
                              color: Color(0x22000000),
                              offset: Offset(1.0, 1.0),
                              blurRadius: 1.0,
                              spreadRadius: 1.0
                            )
                            ]
                        ),
                        child: Stack(
                          children: <Widget>[
                            Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(6.0),
                                  bottomLeft: Radius.circular(6.0),
                                )
                              ),
                              child: ClipPath(
                                clipper: SlantClipper(
                                  height: 140,
                                  width: 120
                                ),
                                clipBehavior: Clip.antiAliasWithSaveLayer,
                                child: FadeInImage.assetNetwork(
                                  fadeInDuration: Duration(milliseconds: 200),
                                  placeholder: 'assets/imageBackground.png',
                                  image: "http://$server:$port/images/restaurants/image.jpg",
                                  height: 140,
                                  width: 120,
                                  fit: BoxFit.cover,
                                ),
                              )
                            ),
                            Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(6.0),
                                  bottomLeft: Radius.circular(6.0),
                                )
                              ),
                              child: ClipPath(
                                clipper: SlantClipper(
                                  height: 140,
                                  width: 120
                                ),
                                child: BackdropFilter(
                                  filter: ImageFilter.blur(sigmaX: 0.8, sigmaY: 0.8),
                                  child:  Container(
                                    decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.0),
                                    ),
                                    ),
                                ),
                              ),
                            ),
                            Align(
                              alignment: Alignment.bottomRight,
                              child: Container(
                                margin: EdgeInsets.all(4.0),
                                height: 90.0,
                                width: 80.0,
                                child: Column(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: <Widget>[
                                      Container(
                                        child: Text(
                                          "Hotel Emporer",
                                          textDirection: TextDirection.rtl,
                                          style: TextStyle(
                                            color: Color(0xff363636),
                                            fontFamily: "Mosk",
                                            fontSize: 13.0,
                                            fontWeight: FontWeight.w600
                                          ),
                                        ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.fromLTRB(3.8, 2, 4, 2),
                                        child: FlutterRatingBarIndicator(
                                            itemPadding: EdgeInsets.all(0.2),
                                            rating: double.parse(popularRestaurants[index]["ratings"]),
                                            itemCount: 5,
                                            itemSize: 9.0,
                                            emptyColor: Colors.amber.withAlpha(50),
                                        ),
                                      ),
                                      Container(
                                        child: Shimmer.fromColors(
                                          baseColor: Colors.amber,
                                          highlightColor: Colors.white,
                                          child: Text(
                                            "56000 Visits",
                                            style: TextStyle(
                                              fontFamily: "Mosk",
                                              fontSize: 11.0,
                                              color:  Colors.amber,
                                            ),
                                          ),
                                        )
                                      ),
                                    ],
                                  ),
                              ),
                            )
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Heading(
                  heading: "Trending Varietes",
                ),
                Container(
                  margin: EdgeInsets.only(left: 5.0),
                  height: 80.0,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: <Widget>[
                      Wrap(
                        children: <Widget>[
                          IconCard(
                            asset: 'assets/restaurant.png',
                            type: "Fine",
                          ),
                          IconCard(
                            asset: 'assets/serving-dish.png',
                            type: "Casual",
                          ),
                          IconCard(
                            asset: 'assets/champagne-glass.png',
                            type: "Pub & Bar",
                          ),
                          IconCard(
                            asset: 'assets/coffee.png',
                            type: "Cafe",
                          ),
                          IconCard(
                            asset: 'assets/pizza-slice.png',
                            type: "Fast Food",
                          ),
                          IconCard(
                            asset: 'assets/birthday-cake.png',
                            type: "Bakery",
                          ),
                          IconCard(
                            asset: 'assets/iced-tea.png',
                            type: "JuiceLands",
                          ),
                          IconCard(
                            asset: 'assets/ice-cream.png',
                            type: "IceLands",
                          ),
                        ],
                      ),
                    ],
                  )
                ),
                AdWidget(),
                Heading(
                  heading: "Party Locations",
                ),
                Container(
                  height: 130,
                  child: HangoutPlacesCarousel(),
                ),
                Heading(
                  heading: "Featured Restaurants",
                ),
                Container(
                  color: Colors.transparent,
                  margin: EdgeInsets.fromLTRB(5.0, 5.0, 5.0, 10),
                  height: 140,
                  child: ListView.builder(
                      itemCount: popularRestaurants.length,
                      addRepaintBoundaries: true,
                      scrollDirection: Axis.horizontal,
                      itemBuilder: (context, index){
                        return GestureDetector(
                          child: Card(
                            elevation: 0.0,
                            clipBehavior: Clip.antiAliasWithSaveLayer,
                            child: Stack(children: <Widget>[
                              Container(
                              height: 140,
                              width: 120,
                              child:Container(
                                  child: Column(
                                    children: <Widget>[
                                      Stack(
                                        children: <Widget>[
                                          ClipPath(
                                            clipper: CrossClipper(),
                                            child: Container(
                                              height: 130,
                                              child: Container(
                                                child: Stack(
                                                  children: <Widget>[
                                                    FadeInImage.assetNetwork(
                                                      fadeInDuration: Duration(milliseconds: 200),
                                                    placeholder: 'assets/imageBackground.png',
                                                    image: "http://$server:$port/images/restaurants/image.jpg",
                                                    height: 80,
                                                    width: 120,
                                                    fit: BoxFit.cover,
                                                    )
                                                  ],
                                                )
                                              ),
                                            )
                                          ),
                                          Container(
                                            height: 130,
                                            child: Container(
                                              alignment: Alignment.bottomLeft,
                                              child: Container(
                                                height: 63,
                                                width: 120,
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: <Widget>[
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 11, 2, 0),
                                                      child: Text(
                                                        restaurantNameDecider(popularRestaurants[index]["name"]),
                                                        textAlign: TextAlign.left,
                                                        style: TextStyle(
                                                          fontFamily: 'Orkney',
                                                          fontSize: 13
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 1, 2, 0),
                                                      child: Text(
                                                        addressDecider(popularRestaurants[index]["address"]), 
                                                        textAlign: TextAlign.left,
                                                        maxLines: 2,
                                                        style: TextStyle(
                                                          color: Color(0xFF838383),
                                                          fontFamily: 'Oxygen',
                                                          fontSize: 9
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 1, 2, 0),
                                                      child: Text(
                                                        "Yelahanka".toUpperCase(), 
                                                        textAlign: TextAlign.left,
                                                        maxLines: 2,
                                                        style: TextStyle(
                                                          color: Color(0xFF838383),
                                                          fontFamily: 'Oxygen',
                                                          fontSize: 9
                                                        ),
                                                      )
                                                    ),
                                                    Container(
                                                      margin: EdgeInsets.fromLTRB(4, 0, 2, 0),
                                                      child: FlutterRatingBarIndicator(
                                                              itemPadding: EdgeInsets.all(0.5),
                                                              rating: double.parse(popularRestaurants[index]["ratings"]),
                                                              itemCount: 5,
                                                              itemSize: 9.0,
                                                              emptyColor: Colors.amber.withAlpha(50),
                                                          ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          )
                                        ],
                                      ),
                                    ],
                                  ),
                          ),
                          ),
                          Positioned(
                            right: 0,
                            bottom: 0,
                                child: RatingsBadge(
                                  rating: double.parse(popularRestaurants[index]["ratings"])
                                ),
                              ),
                            ],)
                          ),
                          onTap: (){
                            Navigator.push(context, MaterialPageRoute(builder: (context)=> RestaurantView(
                              restaurantID: popularRestaurants[index]["id"]
                            )));
                          },
                        );
                      },
                  ),
                ),
              ])
            )
          ],
        )
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}

class PopularRestaurant {
  final String id, name, address, image;
  final int locality, priceForTwo, reviewsCount;
  final double ratings;

  PopularRestaurant(
    this.id, 
    this.name, 
    this.address, 
    this.image, 
    this.locality, 
    this.priceForTwo, 
    this.reviewsCount, 
    this.ratings
    );

    PopularRestaurant.fromJSON(Map<String, dynamic> responseJSON): 
    id = responseJSON['id'],
    name = responseJSON['name'],
    address = responseJSON['address'],
    image = responseJSON['image'],
    locality = responseJSON['locality'],
    priceForTwo = responseJSON['priceForTwo'],
    reviewsCount = responseJSON['reviewsCount'],
    ratings = responseJSON['ratings'];

    Map<String, dynamic> toJSON() => {
      'id': id,
      'name': name,
      'address': address,
      'image': image,
      'locality': locality,
      'priceForTwo': priceForTwo,
      'reviewsCount': reviewsCount,
      'ratings': ratings
    };
}


class PopularRestaurantsCarousel extends StatefulWidget {
  @override
  _PopularRestaurantsCarouselState createState() => _PopularRestaurantsCarouselState();
}

class _PopularRestaurantsCarouselState extends State<PopularRestaurantsCarousel> {
  PageController controller;
  int currentpage = 1;
  bool onSwiped = false;

  @override
  initState() {
    super.initState();
    controller = new PageController(
      initialPage: currentpage,
      keepPage: true,
      viewportFraction: 0.8,
    );
  }

  @override
  dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) { 
    return Container(
      child: new PageView.builder(
        pageSnapping: true,
        itemCount: 15,
          onPageChanged: (value) {
            setState(() {
              onSwiped = true;
              currentpage = value;
            });
          },
          controller: controller,
          itemBuilder: (context, index) => builder(index)),
    );
  }

  builder(int index) {
    return new AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        double value = 1.0;
        if (controller.position.haveDimensions) {
          value = controller.page - index;
          value = (1 - (value.abs() * .25)).clamp(0.0, 1.0);
        }
        if(index==2 && !onSwiped){
          value = 0.75;
        }
        if(index==0 && !onSwiped){
          value = 0.75;
        }
        return Center(
          heightFactor: 0.7,
          widthFactor: 1.0,
          child: new SizedBox(
            height: Curves.easeOut.transform(value) * 190,
            width: Curves.easeOut.transform(value) * (MediaQuery.of(context).size.width),
            child: child,
          ),
        );
      },
      child: new Container(
        height: 160,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(8.0)),
        ),
        child: Stack(
          children: <Widget>[
            ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
              child: Image.network(
            'http://$server:$port/images/restaurants/image.jpg',
              height: 160,
              filterQuality: FilterQuality.high,
              fit: BoxFit.cover,
            ),
            )
          ],
        ),
        margin: const EdgeInsets.all(8.0),
      ),
    );
  }
}


class HangoutPlacesCarousel extends StatefulWidget {
  @override
  _HangoutPlacesCarouselState createState() => _HangoutPlacesCarouselState();
}

class _HangoutPlacesCarouselState extends State<HangoutPlacesCarousel> with AutomaticKeepAliveClientMixin {

  GlobalKey<FlipCardState> cardKey = GlobalKey<FlipCardState>();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: 15,
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index){
          return Container(
            width: 210,
            height: 140,
            margin: EdgeInsets.fromLTRB(5, 0, 5, 0),
            child: FlipCard(
              direction: FlipDirection.HORIZONTAL, // default
              front: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(6.0))
                ),
                clipBehavior: Clip.antiAliasWithSaveLayer,
                elevation: 4.0,
                    child: Container(
                      child: Stack(
                        children: <Widget>[
                          Container(
                            width: 210,
                            foregroundDecoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.bottomCenter,
                                end: Alignment.topCenter,
                                colors: [
                                  Colors.black87,
                                  Colors.black38,
                                  Colors.black12,
                                  Colors.transparent
                                ],
                                stops: [
                                  0.0,
                                  0.3,
                                  0.6,
                                  1.0
                                ]
                              )
                            ),
                            child: Image.network(
                            index % 2 == 0 ? 'https://cdn5.eyeem.com/thumb/e8e86a5bae1003daf0cdd9b208a5dc1e5a50f845-1538885667725/w/850' : 'https://thewallpaper.co/wp-content/uploads/2016/09/place-hd-wallpapers-Backgrounds-download-Beautiful-Places-free-cool-monitor-place-desktop-wallpapers-1366x768.jpg',
                            filterQuality: FilterQuality.high,
                            fit: BoxFit.cover,
                          ),
                          ),
                          Container(
                            alignment: Alignment.bottomRight,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.end,
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                Text(
                                  "Hotel Emperor",
                                  style: TextStyle(
                                    fontFamily: 'kano',
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.fromLTRB(5.0, 2.0, 5.0, 6.0),
                                  child: FlutterRatingBarIndicator(
                                    itemPadding: EdgeInsets.all(0.5),
                                    rating: double.parse("4.0"),
                                    itemCount: 5,
                                    itemSize: 10.0,
                                    emptyColor: Colors.amber.withAlpha(50),
                                ),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                ),
                back:
                  Card(
                  clipBehavior: Clip.antiAliasWithSaveLayer,
                  elevation: 3.0,
                    child: GestureDetector(
                  onTap: (){
                    print("Hi. You clicked a party place");
                  }, 
                  child: Container(
                      color: Colors.black,
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Image.asset(
                            'assets/mazon-01.png',
                            height: 60.0,
                            width: 60.0,
                            filterQuality: FilterQuality.high,
                          ),
                          Text(
                            "Hotel Maharaj Emperor",
                            style: TextStyle(
                                    fontFamily: 'kano',
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white
                                  ),
                          ),
                          IconTitle(),
                          
                        ],
                      ),
                      )
                    ),
                ),
                ),
                )
          );
        },
    );
  }

  @override
  bool get wantKeepAlive => true;
}


class AdWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(5.0, 0.0, 5.0, 10.0),
      height: 90,
      child: Card(
        clipBehavior: Clip.antiAliasWithSaveLayer,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(10.0))
        ),
        child: Image.network(
        'https://thumbs.dreamstime.com/t/horizontal-ad-banner-ready-web-sites-press-as-discount-advertisement-flyer-contains-black-friday-sale-black-friday-sale-103627128.jpg',        filterQuality: FilterQuality.high,
        fit: BoxFit.cover,
        ),
      )
    );
  }
}

class CrossClipper extends CustomClipper<Path> {
  @override
  getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height-55);
    path.lineTo(size.width, size.height-63);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
}


String restaurantNameDecider(String currentName){
  String modifiedName = currentName;
  if(currentName.length > 16){
    modifiedName = currentName.substring(0, 15);
    modifiedName += "...";
  }
  return modifiedName;
}

String addressDecider(String currentName){
  String modifiedName = currentName;
  if(currentName.length > 19){
    modifiedName = currentName.substring(0, 17);
    modifiedName += "...";
  }
  return modifiedName.toUpperCase();
}


class RatingsBadge extends StatelessWidget {
  @required final double rating;

  const RatingsBadge({Key key, this.rating}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Wrap(
      children: <Widget>[
        Container(
          margin: EdgeInsets.all(4.0),
          height: 18.0,
          width: 26.0,
          child: Center(
            child: Text(rating.toString(),
            style: TextStyle(
              fontFamily: 'SoftProSoftW01-Regular',
              fontWeight: FontWeight.w600,
              fontSize: 11,
              color: Colors.white
            ),
            ),
          ),
          decoration: BoxDecoration(
            color: rating < 2.0 ? Color(0xFFCC0000) : 2.0 <= rating && rating < 3.0 ? Colors.yellow : 3.0 <= rating && rating < 4.0 ? Color(0xFF999900) : 4.0 <= rating && rating <= 5.0 ? Color(0xFF297C35) : Color(0xFFCC0000),
            borderRadius: BorderRadius.all(Radius.circular(4.0))
          ),
        )
      ],
    );
  }
}

class Heading extends StatelessWidget {
  @required final String heading;

  const Heading({Key key,@required this.heading}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(5, 14, 10, 5),
      child: Flex(
        direction: Axis.horizontal,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(heading, style: TextStyle(
            fontFamily: 'Orkney',
            fontWeight: FontWeight.w600,
            fontSize: 17,
            color: Color(0xFF363636)
          ),
          ),
        ],
      ),
    );
  }
}

class IconCard extends StatelessWidget {
  @required final String asset, type;

  const IconCard({Key key, this.asset, this.type}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(5.0, 2.0, 5.0, 2.0),
        width: 60,
        height: 60,
        child: Card(
          elevation: 2.0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
        ),
        clipBehavior: Clip.antiAliasWithSaveLayer,
        child: Center(
              child: Wrap(
                children: <Widget>[
                  Flex(
                direction: Axis.vertical,
                children: <Widget>[
                  Container(
                      child: Image.asset(
                      asset,
                      width: 24,
                      height: 24, 
                  ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 6.0),
                    child: Text(
                    type,
                    style: TextStyle(
                      fontSize: 9.0,
                      fontFamily: 'HK Grotesk',
                      fontWeight: FontWeight.w700
                    ),
                  ),
                  )
                ],
          )
                ],
              )
        )
      ),
      );
  }
}

class IconTitle extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 4.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(left: 4.0, bottom: 2.0),
                  child: Icon(
                    Icons.phone,
                    size: 10,
                    color: Colors.white
                  ),
                ),
                Text(
                  "  9110466718",
                  style: TextStyle(
                    fontFamily: 'HK Grotesk',
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 11
                  ),
                ),
              ],
            )
          );
  }
}

class SlantClipper extends CustomClipper<Path>{
  final double height;
  final  double width;
  const SlantClipper({Key key, @required this.height, @required this.width});

  @override
  Path getClip(Size size) {
    Path mainPath = new Path();
    mainPath.moveTo(0, 0);
    mainPath.lineTo(0, height);
    mainPath.lineTo(25, height);
    mainPath.lineTo(width-5, 0);
    mainPath.lineTo(0, 0);
    return mainPath;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }

}