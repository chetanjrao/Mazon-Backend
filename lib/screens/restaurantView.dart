import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:http/http.dart' as http;
import 'package:mazon/screens/inorder.dart';
import 'package:mazon/utils/customCard.dart';

class RestaurantView extends StatefulWidget {
  @required final String restaurantID;

  const RestaurantView({Key key, this.restaurantID}) : super(key: key);
  @override
  _RestaurantViewState createState() => _RestaurantViewState();
}

class _RestaurantViewState extends State<RestaurantView> {
  String restaurantID;
  var restaurantData;
  int currentImageIndex = 0;
  ScrollController _controller;

  void getRestaurantData(String restaurantID) async{
  var response = await http.get('http://localhost:9000/api/library/restaurants/'+restaurantID);
  setState(() {
    restaurantData = jsonDecode(response.body);
  });
}

  @override
  void initState() {
    super.initState();
    restaurantID = widget.restaurantID;
    _controller = new ScrollController();
    getRestaurantData(restaurantID);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          print("Order Food");
        },
        tooltip: "Order Food",
        backgroundColor: Color(0xFF2ECC71),
        child: Icon(Icons.restaurant_menu),
        elevation: 2.0,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      body: Container(
      child: 
      restaurantData == null ? Container(
        child: Center(
          child: Container(
              height: 20.0,
              width: 20.0,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation(Colors.green),
                backgroundColor: Color(0x0f000000),
                strokeWidth: 2.0,
              ),
            ),
        ),
      ) :
      CustomScrollView(
          slivers: <Widget>[
            SliverList(
                delegate: SliverChildListDelegate([
                  Stack(
                  children: <Widget>[
                    Container(
                                width: MediaQuery.of(context).size.width,
                                height: MediaQuery.of(context).size.height * 0.3,
                                child: PageView.builder(
                                onPageChanged: (index){
                                  setState(() {
                                    currentImageIndex = index;
                                  });
                                },
                                itemBuilder: (context, index){
                                  return Container(
                                    height: 100,
                                    margin: EdgeInsets.all(0.0),
                                    child: index % 2 == 0 ? Container(
                                      child: FadeInImage.assetNetwork(
                                              fadeInDuration: Duration(milliseconds: 200),
                                              placeholder: 'assets/imageBackground.png',
                                              image: 'https://im1.dineout.co.in/images/uploads/restaurant/sharpen/2/v/s/p20355-15175704855a7449b53ce58.jpg?w=1200&q=100',
                                              height: 200,
                                              fit: BoxFit.cover,
                                              )
                                    ) : Container(
                                      child: FadeInImage.assetNetwork(
                                        fadeInDuration: Duration(milliseconds: 200),
                                        placeholder: 'assets/imageBackground.png',
                                        image: 'https://www.thechediandermatt.com/images/content/mood/Big/The-Chedi-Andermatt-RESTAURANT-Main-Dining-03.jpg',
                                        height: 200,
                                        fit: BoxFit.cover,
                                        )
                                  ),
                                );
                              },
                            ),
                        ),
                        Container(
                          height: 131,
                          width: 0.96 * MediaQuery.of(context).size.width,
                          color: Colors.transparent,
                          margin: EdgeInsets.fromLTRB(0.02*MediaQuery.of(context).size.width, 0.27 * MediaQuery.of(context).size.height, 0.02*MediaQuery.of(context).size.width, 0),
                          child: Card(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.all(Radius.circular(5.0))
                            ),
                            borderOnForeground: true,
                            elevation: 2.0,
                            child:Container(
                              margin: EdgeInsets.only(top: 5.0, left: 10.0, right: 0.0, bottom: 0.0),
                              child: Column(
                                children: <Widget>[
                                  Flex(
                                direction: Axis.horizontal,
                                children: <Widget>[
                                  Container(
                                    width: MediaQuery.of(this.context).size.width * 0.6,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Container(
                                        margin: EdgeInsets.only(top: 2, bottom: 1),
                                        child: Text(
                                        "Bhagini Pavilion",
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 25,
                                          fontFamily: 'SofiaProSoftW01-Regular'
                                        ),
                                      ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.only(top: 2, bottom: 2),
                                        child: FlutterRatingBarIndicator(
                                        itemCount: 5,
                                        itemPadding: EdgeInsets.all(1.0),
                                        itemSize: 24,
                                        rating: 5.0,
                                      ),
                                      ),
                                      Container(
                                        margin: EdgeInsets.only(top: 2, bottom: 1),
                                        child: Text(
                                        "58, Singhanayakanahalli, Agrahara Layout Main Road, Doddaballapur Rd, Yelahanka, Bengaluru, Karnataka-560064",
                                        maxLines: 3,
                                        textAlign: TextAlign.start,
                                        style: TextStyle(
                                          color: Color(0xEA000000),
                                          fontSize: 12,
                                          fontFamily: 'Avenir LT Std'
                                        ),
                                      ),
                                      )
                                    ],
                                  ),
                                  ),
                                  Container(
                                    width: 0.31*MediaQuery.of(this.context).size.width,
                                    child: Center(
                                      child: Card(
                                      elevation: 0.0,
                                      child: Image.network(
                                        'https://previews.123rf.com/images/sergeypykhonin/sergeypykhonin1707/sergeypykhonin170700052/81892309-restaurant-logo-icon-or-symbol-for-design-menu-eatery-canteen-or-cafe-lettering-vector-illustration.jpg',
                                        height: 110,
                                        filterQuality: FilterQuality.high,
                                        width: 0.31*MediaQuery.of(this.context).size.width,
                                      ),
                                    ),
                                    )
                                  )
                                ],
                              ),
                                ],
                              )
                            ),
                          )
                          )
                  ],
                ),
                    Container(
                      margin: EdgeInsets.only(left: 0.016*MediaQuery.of(context).size.width, right: 0.01*MediaQuery.of(context).size.width),
                      height: 150,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: 10,
                        itemBuilder: (context, index){
                          return Container(
                            color: Colors.transparent,
                            margin: EdgeInsets.all(2.0),
                            width: 120,
                            child: Card(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.all(Radius.circular(6.0))
                              ),
                              elevation: 3.0,
                              child: Stack(
                                children: <Widget>[
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(6.0),
                                    child: index % 2 == 0 ? Image.network(
                                    'https://media.gettyimages.com/photos/authentic-indian-food-picture-id639389404?s=612x612',
                                    height: 150,
                                    width: 120,
                                    filterQuality: FilterQuality.high,
                                    fit: BoxFit.cover, 
                                  ) : index % 3 == 0 ? Image.network(
                                    'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/epic-summer-salad.jpg',
                                    filterQuality: FilterQuality.high,
                                    height: 130,
                                    width: 120,
                                    fit: BoxFit.cover,
                                  ) : Image.network(
                                    'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
                                      filterQuality: FilterQuality.high,
                                      height: 150,
                                      width: 120,
                                      fit: BoxFit.cover,
                                    )
                                  ),
                                  Container(
                                    alignment: Alignment.bottomRight,
                                   child: Stack(
                                     children: <Widget>[
                                       ClipRRect(
                                         borderRadius: BorderRadius.all(Radius.circular(6.0)),
                                         child: Container(
                                           child: ClipPath(
                                         clipBehavior: Clip.antiAliasWithSaveLayer,
                                         clipper: CrossClipper(),
                                         child: Container(
                                         alignment: Alignment.bottomRight,
                                         
                                          // decoration: BoxDecoration(
                                          //   gradient: LinearGradient(
                                          //     begin: Alignment.bottomRight,
                                          //     end: Alignment.topCenter,
                                          //     stops: [0.0, 0.2, 0.8, 0.9, 1.0],
                                          //     colors: [
                                          //       Colors.transparent,
                                          //       Colors.black54,
                                          //       Colors.black45,
                                          //       Colors.black26,
                                          //       Colors.transparent,
                                          //     ],
                                          //   ),
                                          // ),
                                          decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                              begin: FractionalOffset.bottomCenter,
                                              end: FractionalOffset.topCenter,
                                              colors: [
                                                Colors.black,
                                                Colors.black38,
                                                Colors.transparent,
                                              ],
                                              stops: [
                                                0.0,
                                                0.5,
                                                0.8
                                              ])),
                                          height: 80,
                                       ),
                                       ),
                                         ),
                                       ),
                                       Container(
                                         margin: EdgeInsets.only(left: 5.0, right: 5.0, bottom: 5.0, top: 35.0),
                                         child: Column(
                                         mainAxisSize: MainAxisSize.min,
                                         mainAxisAlignment: MainAxisAlignment.start,
                                         crossAxisAlignment: CrossAxisAlignment.stretch,
                                           children: <Widget>[
                                             Text(
                                               "Paneer Butter",
                                              textAlign: TextAlign.end,
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 15,
                                                fontFamily: 'Source Sans Pro',
                                              ),
                                             ),
                                             Align(
                                                alignment: Alignment.bottomRight,
                                                child: FlutterRatingBarIndicator(
                                                itemCount: 5,
                                                itemSize: 13,
                                                rating: 3,
                                                itemPadding: EdgeInsets.all(1.0),
                                              ),
                                             )
                                           ],
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
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 13.0, left: 4.0, right: 4.0, bottom: 6.0),
                      height: 110,
                      child: Flex(
                        direction: Axis.vertical,
                        children: <Widget>[
                          Container(
                            margin: EdgeInsets.only(left: 13.0, right: 13.0),
                            child: InkWell(
                            borderRadius: BorderRadius.all(Radius.circular(5.0)),
                            onTap: (){
                            Navigator.push(context, MaterialPageRoute(builder: (context)=> Inorder(
                              restaurantID: widget.restaurantID,
                              restaurantName: "Bhagini Pavilion",
                            )));
                            },
                            child: Container(
                            height: 45.0,
                            child:  GestureDetector(
                              child: Flex(
                            direction: Axis.horizontal,
                            children: <Widget>[
                              Container(
                                width: 0.1 * MediaQuery.of(context).size.width,
                                child: Image.asset(
                                'assets/dinner-1.png',
                                height: 28.0,
                                width: 28.0,
                              ),
                              ),
                              Container(
                                padding: EdgeInsets.only(left: 15.0, top: 2.0, bottom: 0.0, right: 10.0),
                                width: 0.7 * MediaQuery.of(context).size.width,
                                child: Text(
                                "Order your food!! Now",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontFamily: 'SofiaProSoftW01-Regular',
                                  color: Color(0xff363636)
                                ),
                                )
                              ),
                              Container(
                                padding: EdgeInsets.all(4.0),
                                width: 0.1 * MediaQuery.of(context).size.width,
                                child: Icon(Icons.arrow_forward_ios, size: 12),
                              )
                            ],
                          ),
                            ),
                          ),
                          ),
                          ),
                          Container(
                            margin: EdgeInsets.only(left: 13.0, right: 13.0),
                            child: 
                          Divider(
                            height: 8,
                            color: Colors.black45,
                          ),
                          ),
                          Container(
                            padding: EdgeInsets.all(10.0),
                            height:45.0,
                            child: Flex(
                            direction: Axis.horizontal,
                            children: <Widget>[
                              Container(
                                width: 0.1 * MediaQuery.of(context).size.width,
                                child: Image.asset(
                                'assets/toast.png',
                                height: 30.0,
                                width: 30.0,
                              ),
                              ),
                              Container(
                                padding: EdgeInsets.only(left: 15.0, top: 2.0, bottom: 2.0, right: 10.0),
                                width: 0.7 * MediaQuery.of(context).size.width,
                                child: Text(
                                "Book a table now",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontFamily: 'SofiaProSoftW01-Regular',
                                  color: Color(0xff363636)
                                ),
                                )
                              ),
                              Container(
                                padding: EdgeInsets.all(4.0),
                                width: 0.1 * MediaQuery.of(context).size.width,
                                child: Icon(Icons.arrow_forward_ios, size: 12),
                              )
                            ],
                          ),
                          ),
                        ],
                      )
                    ),
                    Container(
                      margin: EdgeInsets.all(13.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Container(
                            child: Row(
                              children: <Widget>[
                                Text(
                                  "TYPES",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF868686),
                                    fontSize: 13
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.only(left: 4.0, bottom: 2.0),
                                  child: Icon(
                                    Icons.sentiment_satisfied,
                                    size: 15,
                                    color: Color(0xFF868686),
                                  ),
                                )

                              ],
                            )
                          ),
                          Divider(
                            height: 8,
                            color: Colors.black45,
                          ),
                          Container(
                            margin: EdgeInsets.only(top: 10.0, bottom: 20.0),
                            child: Text(
                              "Non Vegetarian, Bar & Pub, Party Place, Casual Dine",
                              style: TextStyle(
                                fontFamily: 'Avenir LT Std',
                                fontSize: 13.5,
                                color: Color(0xFF363636),
                                fontWeight: FontWeight.bold
                              ),
                              ),
                          ),
                          Container(
                            child: Row(
                              children: <Widget>[
                                Text(
                                  "CUISINES",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF868686),
                                    fontSize: 13
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.only(left: 4.0, bottom: 2.0),
                                  child: Icon(
                                    Icons.restaurant,
                                    size: 15,
                                    color: Color(0xFF868686),
                                  ),
                                )

                              ],
                            )
                          ),
                          Divider(
                            height: 8,
                            color: Colors.black45,
                          ),
                          Container(
                            padding: EdgeInsets.all(0.0),
                            margin: EdgeInsets.only(top: 5.0, bottom: 10.0),
                            child: Wrap(
                              children: <Widget>[
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "North Indian",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "South Indian",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "Italian",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "American",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "Japanese",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0),
                                    child: Chip(
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.all(1.0),
                                      backgroundColor: Colors.green,
                                    label: Text(
                                    "Chinese",
                                      style: TextStyle(
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(top: 6.0, left: 2.0),
                                  margin: EdgeInsets.only(left: 1.0, right: 1.0, top: 0.0, bottom: 0.0),
                                    child: Chip(
                                      backgroundColor: Colors.green,
                                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      padding: EdgeInsets.only(top: 1.0),
                                    label: Text(
                                    "Special Mid East",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontFamily: 'Avenir LT Std',
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            )
                          ),
                          Container(
                            child: Row(
                              children: <Widget>[
                                Text(
                                  "DESCRIPTION",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF868686),
                                    fontSize: 13
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.only(left: 4.0, bottom: 2.0),
                                  child: Icon(
                                    Icons.info_outline,
                                    size: 15,
                                    color: Color(0xFF868686),
                                  ),
                                )

                              ],
                            )
                          ),
                          Divider(
                            height: 8,
                            color: Colors.black45,
                          ),
                          Container(
                            margin: EdgeInsets.only(top: 10.0, bottom: 20.0),
                            child: Text(
                              "Bhagini Pavilion at Yelahanka makes sure one has a great food experience by offering highly palatable food. The various services offered at the venue include Bar , Smoking Areas , Alcohol , Banquet Hall , Birthday Parties , Candle Light Dinner , Tv Screens , Good Place For Kids , Valet Parking , Outdoor Seating , Ac , Home Delivery , Catering Services , Take Away",
                              style: TextStyle(
                                wordSpacing: 1.0,
                                height: 1.04,
                                fontFamily: 'Avenir LT Std',
                                fontSize: 13.5,
                                color: Color(0xFF363636),
                                fontWeight: FontWeight.bold
                              ),
                              ),
                          ),
                        ],
                      ),
                    ),
                    
                ]),
              )
          ],
        ),
    ),
    );
  }
}

class CrossClipper extends CustomClipper<Path>{
  @override
  Path getClip(Size size) {
    var path = Path();
    path.moveTo(size.width, size.height);
    path.lineTo(size.width, 20);
    path.lineTo(0, size.height - 40);
    path.lineTo(0, size.height);
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
  
}