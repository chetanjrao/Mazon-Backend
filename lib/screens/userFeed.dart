import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:mazon/utils/customCard.dart';
import './restaurantView.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flip_card/flip_card.dart';
import 'package:badges/badges.dart';
import '../utils/globals.dart';

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
  var response = await http.get('http://$server:$port/api/public/library/restaurants?requestQueryType=popular');
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
      color: Colors.white,
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
            // SliverPersistentHeader(
            //   delegate: SliverPersistentHeaderDelegate(
                
            //   ) /////// ******* Should Create a new header class for persistat header
            // ),
            SliverAppBar(
              backgroundColor: Colors.white,
              forceElevated: true,
              pinned: true,
              primary: false,
              flexibleSpace: FlexibleSpaceBar(
                collapseMode: CollapseMode.pin,
                
              ),
              actions: <Widget>[
                // Container(
                //   margin: EdgeInsets.all(16.0),
                //   child: Icon(
                //   Icons.search,
                //   color: Colors.blueGrey,
                // ),
                // ),
                Container(
                  margin: EdgeInsets.all(16.0),
                  child: Badge(
                    child: Icon(
                  Icons.notifications,
                  color: Colors.blueGrey,
                ),
                badgeColor: Colors.green,
                badgeContent: Text('3',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 13.0
                ),
                ),
                animationType: BadgeAnimationType.scale,
                  )
                )
              ],
              titleSpacing: 0.0,
              centerTitle: false,
              title: Container(
                margin: EdgeInsets.only(left: 5.0),
                width: MediaQuery.of(context).size.width * 0.5,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      margin: EdgeInsets.all(3.0),
                      child: Text("YOUR LOCATION - HOME",
                      style: TextStyle(
                        color: Colors.blueGrey,
                        fontSize: 9.0,
                        fontWeight: FontWeight.w400,
                        fontFamily: 'HK Grotesk',
                      ),
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.all(3.0),
                      child: Text("BMSIT Boys Hostel, BMSIT",
                      style: TextStyle(
                        color: Colors.black87,
                        fontSize: 16.5,
                        fontWeight: FontWeight.w400,
                        fontFamily: 'HK Grotesk',
                      ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildListDelegate([
                Container(
                   margin: EdgeInsets.fromLTRB(0, 10, 0,5),
                      child: Column(
                        children: <Widget>[
                          /*Container(
                            margin: EdgeInsets.fromLTRB(5, 5, 10, 5),
                            child: Flex(
                              direction: Axis.horizontal,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Expanded(
                                  child: Container(
                                    margin: EdgeInsets.fromLTRB(5.0, 9.0,9.0, 0.0),
                                    alignment: Alignment.bottomCenter,
                                    child: Divider(
                                    color: Colors.grey,
                                  ),
                                  )
                                ),
                                Text("Popular Picked for You", style: TextStyle(
                                  fontFamily: 'Mosk',
                                  fontWeight: FontWeight.w500,
                                  fontSize: 19,
                                  color: Colors.black87
                                ),
                                ),
                                Expanded(
                                  child: Container(
                                    margin: EdgeInsets.fromLTRB(9.0, 9.0, 5.0, 0.0),
                                    alignment: Alignment.bottomCenter,
                                    child: Divider(
                                    color: Colors.grey,
                                  ),
                                  )
                                )
                              ],
                            ),
                          ),*/
                          Container(
                              height: 200,
                              child: PopularRestaurantsCarousel(),
                            ),
                            
                        ],
                      )
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
                                                    image: 'http://$server:$port/images/restaurants/image.jpg',
                                                    // Image.network(
                                                    //   'http://$server:$port/images/restaurants/image.jpg',
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
                                                          fontFamily: 'Mosk',
                                                          fontSize: 14
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
                                                    image: popularRestaurants[index]["images"],
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
                                                          fontFamily: 'kano',
                                                          fontSize: 14
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
          heightFactor: 1.0,
          widthFactor: 1.0,
          child: new SizedBox(
            height: Curves.easeOut.transform(value) * 200,
            width: Curves.easeOut.transform(value) * (MediaQuery.of(context).size.width * 0.95),
            child: child,
          ),
        );
      },
      child: new Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(8.0)),
        ),
        child: Stack(
          children: <Widget>[
            ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
              child: Image.network(
            'http://$server:$port/images/restaurants/image.jpg',
              height: 200,
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
            margin: EdgeInsets.fromLTRB(5, 0, 5, 10),
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
      margin: EdgeInsets.fromLTRB(5, 5, 10, 5),
      child: Flex(
        direction: Axis.horizontal,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(heading, style: TextStyle(
            fontFamily: 'Mosk',
            fontWeight: FontWeight.w500,
            fontSize: 18,
            color: Colors.black87
          ),
          ),
          Expanded(
            child: Container(
              margin: EdgeInsets.fromLTRB(9.0, 9.0, 5.0, 0.0),
              alignment: Alignment.bottomCenter,
              child: Divider(
              color: Colors.grey,
            ),
            )
          )
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
          elevation: 4.0,
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