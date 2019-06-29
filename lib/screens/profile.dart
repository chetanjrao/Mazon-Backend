import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:mazon/utils/customCard.dart';

class Profile extends StatefulWidget {
  Profile({this.no});
  @required final int no;
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> with AutomaticKeepAliveClientMixin, SingleTickerProviderStateMixin {
  TabController _tabController;
  double height = 285.0;

  @override
  void initState(){
    super.initState();
    _tabController = new TabController(length: 4, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      height = 285.0;
    }
    return Scaffold(
        body: Container(
        child: Column(
          children: <Widget>[
            CardView(
              elevation: 2.0,
        bottomLeftBorderRadius: 8.0,
        bottomRightBorderRadius: 8.0,
        child: Column(
          children: <Widget>[
                Stack(
              children: <Widget>[
                ClipPath(
                  clipper: InclineClipper(),
                  child: Container(
                    height: height,
                    color: Color(0xAFFFCD94)//Color(0x8FD35400),
                  ),
                ),
                Stack(
                  children: <Widget>[
                    Container(
                      height: height,
                      alignment: Alignment.bottomCenter,
                      child: Stack(
                        children: <Widget>[
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                                Stack(
                                  children: <Widget>[
                                    CardView(
                                    height: 160.0,
                                    backgroundColor: Colors.transparent,
                                    elevation: 0.0,
                                    width: double.infinity,
                                    marginLeft: 10.0,
                                    marginRight: 10.0,
                                    marginTop: 0.0,
                                    marginBottom: 0.0,
                                    bottomLeftBorderRadius: 30.0,
                                    bottomRightBorderRadius: 0.0,
                                    topLeftBorderRadius: 0.0,
                                    topRightBorderRadius: 30.0,
                                    child: Container(
                                      alignment: Alignment.topCenter,
                                      margin: EdgeInsets.only(top: 60.0),
                                      child: Container(
                                        child: Column(
                                          verticalDirection: VerticalDirection.down,
                                          children: <Widget>[
                                            Text(
                                              "Allen Carl Williams",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontFamily: 'SofiaProSoftW01-Regular',
                                                fontSize: 19
                                              ),
                                            ),
                                            Container(
                                              margin: EdgeInsets.only(top: 15, left: 10),
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
                                                            fontFamily: 'SofiaProSoftW01-Regular',
                                                            fontSize: 16
                                                          ),
                                                        ),
                                                        Text(
                                                          "Dineouts",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'SofiaProSoftW01-Regular',
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
                                                          
                                                            fontFamily: 'SofiaProSoftW01-Regular',
                                                            fontSize: 16
                                                          ),
                                                        ),
                                                        Text(
                                                          "Inorders",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'SofiaProSoftW01-Regular',
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
                                                            fontFamily: 'SofiaProSoftW01-Regular',
                                                            fontSize: 17
                                                          ),
                                                        ),
                                                        Text(
                                                          "Reviews",
                                                          textAlign: TextAlign.center,
                                                          style: TextStyle(
                                                            fontFamily: 'SofiaProSoftW01-Regular',
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
                      top: 65.0,
                      left: (MediaQuery.of(context).size.width - 116)/2,
                      child: Container(
                        decoration: BoxDecoration(
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
                          'https://www.mills.edu/uniquely-mills/students-faculty/student-profiles/images/student-profile-veronica-mills-college.jpg'
                        ),
                      ),
                    ),
                    )
                  ],
                  ),
              ],
            ),
            Container(
              child: CardView(
                elevation: 0.0,
                topLeftBorderRadius: 0.0,
                topRightBorderRadius: 0.0,
                bottomLeftBorderRadius: 8.0,
                bottomRightBorderRadius: 8.0,
                child: Column(
                  children: <Widget>[
                    Container(
                      child: TabBar(
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
                  ],
                )
              ),
            ),
          ],
        )

        ),
             Container(
               height: MediaQuery.of(context).size.height - height - 46 - 97,
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
             )
          ],
        )
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