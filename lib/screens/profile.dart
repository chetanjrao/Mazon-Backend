import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:mazon/my_flutter_app_icons.dart';
import 'package:mazon/utils/customCard.dart';

class Profile extends StatefulWidget {
  Profile({this.no});
  @required final int no;
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> with AutomaticKeepAliveClientMixin, SingleTickerProviderStateMixin {
  TabController _tabController;

  @override
  void initState(){
    super.initState();
    _tabController = new TabController(length: 4, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        child: NestedScrollView(
        scrollDirection: Axis.vertical,
        headerSliverBuilder: (context, state){
          return [
            SliverList(
              delegate: SliverChildListDelegate([
                  Stack(
              children: <Widget>[
                ClipPath(
                  clipper: InclineClipper(),
                  child: Container(
                    height: 280.0,
                    child: Image.network(
                      'https://iso.500px.com/wp-content/uploads/2015/12/food_cover.jpg',
                      filterQuality: FilterQuality.high,
                      fit: BoxFit.cover,
                    )//Color(0x8FD35400),
                  ),
                ),
                Stack(
                  children: <Widget>[
                    Container(
                      height: 280.0,
                      alignment: Alignment.bottomCenter,
                      child: Stack(
                        children: <Widget>[
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                                Stack(
                                  children: <Widget>[
                                    CardView(
                                    height: 169.0,
                                    backgroundColor: Colors.transparent,
                                    elevation: 0.0,
                                    width: double.infinity,
                                    marginLeft: 5.0,
                                    marginRight: 10.0,
                                    marginTop: 0.0,
                                    marginBottom: 0.0,
                                    bottomLeftBorderRadius: 30.0,
                                    bottomRightBorderRadius: 0.0,
                                    topLeftBorderRadius: 0.0,
                                    topRightBorderRadius: 30.0,
                                    child: Container(
                                      alignment: Alignment.topCenter,
                                      margin: EdgeInsets.only(top: 45.0),
                                      child: Container(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          verticalDirection: VerticalDirection.down,
                                          children: <Widget>[
                                            Container(
                                              margin: EdgeInsets.only(left: MediaQuery.of(context).size.width * 0.12, top: 5.0),
                                              child: Row(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: <Widget>[
                                                  Text(
                                                    "Carl D'souza",
                                                    textAlign: TextAlign.center,
                                                    style: TextStyle(
                                                      fontFamily: 'Orkney',
                                                      fontWeight: FontWeight.w500,
                                                      fontSize: 20
                                                    ),
                                                  ),
                                                  Icon(
                                                    Icons.check_circle,
                                                    size: 16.0,
                                                    color: Colors.blue,
                                                  )
                                                ],
                                              )
                                            ),
                                            Container(
                                              margin: EdgeInsets.only(left: MediaQuery.of(context).size.width * 0.35, top: 0.0),
                                                child: Row(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: <Widget>[
                                                    Chip(
                                                      backgroundColor: Colors.green,
                                                      avatar: Icon(
                                                        Icons.fastfood,
                                                        size: 14.0,
                                                        color: Colors.white
                                                      ),
                                                      labelPadding: EdgeInsets.only(right: 5, top: 0, bottom: 0),
                                                      label: Text(
                                                        "Blogger",
                                                        style: TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 14.0,
                                                          fontFamily: 'Mosk'
                                                        ),
                                                      ),
                                                    ),
                                                    Padding(
                                                      padding: EdgeInsets.only(left: 3.0, right: 3.0),
                                                    ),
                                                    Chip(
                                                      backgroundColor: Colors.blue,
                                                      avatar: Icon(
                                                        Icons.store_mall_directory,
                                                        size: 14.0,
                                                        color: Colors.white
                                                      ),
                                                      labelPadding: EdgeInsets.only(right: 5, top: 0, bottom: 0),
                                                      label: Text(
                                                        "Owner",
                                                        style: TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 14.0,
                                                          fontFamily: 'Mosk'
                                                        ),
                                                      ),
                                                    )
                                                  ],
                                                ),
                                            ),
                                            Container(
                                              margin: EdgeInsets.only(top: 5.0, left: 10),
                                                child: Row(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: <Widget>[
                                                  Container(
                                                    padding: EdgeInsets.only(right: 15.0),
                                                    child: Column(
                                                      mainAxisSize: MainAxisSize.min,
                                                      verticalDirection: VerticalDirection.down,
                                                      children: <Widget>[
                                                        Text(
                                                          "2.2 K",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'HK Grotesk',
                                                            fontWeight: FontWeight.w500,
                                                            fontSize: 16
                                                          ),
                                                        ),
                                                        Text(
                                                          "Dineouts",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'HK Grotesk',
                                                            fontWeight: FontWeight.w500,
                                                            fontSize: 16
                                                          ),
                                                        )
                                                      ],
                                                    ),
                                                  ),
                                                  Container(
                                                    padding: EdgeInsets.only(right: 15.0, left: 15.0),
                                                    child: Column(
                                                      mainAxisSize: MainAxisSize.min,
                                                      verticalDirection: VerticalDirection.down,
                                                      children: <Widget>[
                                                        Text(
                                                          "1.8 K",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                          fontWeight: FontWeight.w500,
                                                            fontFamily: 'HK Grotesk',
                                                            fontSize: 16
                                                          ),
                                                        ),
                                                        Text(
                                                          "Inorders",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'HK Grotesk',
                                                            fontWeight: FontWeight.w500,
                                                            fontSize: 17
                                                          ),
                                                        )
                                                      ],
                                                    ),
                                                  ),
                                                  Container(
                                                    padding: EdgeInsets.only(left: 15.0),
                                                    child: Column(
                                                      mainAxisSize: MainAxisSize.min,
                                                      verticalDirection: VerticalDirection.down,
                                                      children: <Widget>[
                                                        Text(
                                                          "32 K",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'HK Grotesk',
                                                            fontWeight: FontWeight.w500,
                                                            fontSize: 17
                                                          ),
                                                        ),
                                                        Text(
                                                          "Reviews",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'HK Grotesk',
                                                            fontWeight: FontWeight.w500,
                                                            fontSize: 17
                                                          ),
                                                        )
                                                      ],
                                                    ),
                                                  )
                                                ],
                                              )
                                            ),
                                          ],
                                        )
                                      ),
                                    )
                                  ),
                                  ],
                                )
                            ],
                          ),
                        ],
                      )
                    ),
                    Positioned(
                      top: 115.0,
                      left: 10.0,
                      child: Container(
                        decoration: BoxDecoration(
                          boxShadow: [
                            // BoxShadow(
                            //   blurRadius: 5.0,
                            //   spreadRadius: 1.0,
                            //   offset: Offset(-2, 0),
                            //   color: Color(0x55000000)
                            // )
                          ],
                          borderRadius: BorderRadius.all(Radius.circular(112/2)),
                          border: Border.all(
                            color: Colors.white,
                            width: 2.0,
                          )
                        ),
                        child: CircleAvatar(
                        radius: 56.0,
                        backgroundColor: Colors.transparent,
                        backgroundImage: NetworkImage(
                          'http://www.italianmade.com/ca/wp-content/uploads/2015/05/Rob-Gentile-Buca.jpg'
                        ),
                      ),
                    ),
                    )
                  ],
                  ),
              ],
            ),
              ]
            )
            ),
            SliverAppBar(
              expandedHeight: 0.0,
              pinned: true,
              forceElevated: false,
              primary: false,
              floating: true,
              backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
              bottom: TabBar(
                isScrollable: false,
                controller: _tabController,
                indicatorColor: Colors.greenAccent,
                indicatorWeight: 3.0,
                tabs: <Widget>[
                  Tab(
                    icon: Icon(
                    Icons.rate_review,
                    size: 20,
                    color: Colors.blueGrey,
                    )
                    ),
                  Tab(icon: Icon(
                    Icons.photo_album,
                    color: Colors.blueGrey,
                    size: 20,
                    )
                    ),
                  Tab(icon: Icon(
                    Icons.history,
                    size: 20,
                    color: Colors.blueGrey,
                    )
                    ),
                    Tab(icon: Icon(
                    Icons.bookmark,
                    size: 20,
                    color: Colors.blueGrey,
                    )
                    )
              ],
            ),
            )
           ];
        },
        body: Container(
        child: TabBarView(
              controller: _tabController,
              children: <Widget>[
                Container(
                  child: Text("Hello"),
                ),
                Container(
                  child: Text("Hello"),
                ),
                Container(
                  child: Text("Hello"),
                ),
                Container(
                  child: Text("Hello"),
                ),
              ]   
            )
        ),
      ),
      )
    );
  }

  @override
  bool get wantKeepAlive => true;
}

class InclineClipper extends CustomClipper<Path> {
  @override
  getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height-80);
    path.lineTo(size.width, size.height/3);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper oldClipper) {
    return true;
  }
  
}