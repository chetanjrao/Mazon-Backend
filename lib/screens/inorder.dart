import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:mazon/my_flutter_app_icons.dart';
import 'package:flutter_emoji/flutter_emoji.dart';

class Inorder extends StatefulWidget {
  @required final String restaurantID, restaurantName;

  const Inorder({Key key, this.restaurantID, this.restaurantName}) : super(key: key);
  @override
  _InorderState createState() => _InorderState();
}

class _InorderState extends State<Inorder> with SingleTickerProviderStateMixin{
  PersistentBottomSheetController _sheetController;
  final GlobalKey<ScaffoldState> _scaffoldkey = new GlobalKey<ScaffoldState>();
  TabController _tabController;
  ScrollController _controller;
  bool isChanged;
  int currentIndex = 0;
  var parser = EmojiParser();
  var satisfaction_1 = Emoji('ver-happy', '');
  double total = 0;
  bool isSheetClosed = false;
  Map<String, Map<String, String>> itemList = {};
  int itemsCount = 0;



  @override
  void initState() {
    super.initState();
    isChanged = false;
    _tabController = TabController(length: 10, initialIndex: currentIndex, vsync: this );
    _controller = new ScrollController();
  }

  Map<String, String> generateObject(String idOfFood, String nameOfFood, int count, double amount){
  return {
      "name": nameOfFood,
      "count": count.toString(),
      "amount": amount.toString()
  };
}

  String getCountofElements(int indexToBeSearched){
    if(itemList.length > 0){
      if(itemList.containsKey(indexToBeSearched.toString())){
        String count = itemList[indexToBeSearched.toString()]["count"];
        return count;
      } else {
        return "0";
      }
    } else {
      return "0";
    }
}

double calculateTotal(){
  double total = 0.0;
  itemList.forEach((i, f){
    total += int.parse(f["count"]) * double.parse(f["amount"]);
  });
  return total;
}

int getAllItemsCount(){
  int count = 0;
  itemList.forEach((id, food){
    count += int.parse(food["count"]);
  });
  return count;
}



  @override
  Widget build(BuildContext context) {
  void _showBottomSheet() async {
    _sheetController = _scaffoldkey.currentState.showBottomSheet((context){
      return Container(
        width: MediaQuery.of(context).size.width,
        child: Card(
        margin: EdgeInsets.all(0.0),
        child: Container(
          child: Flex(
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Container(
                margin: EdgeInsets.only(left: 10.0, bottom: 0.0, top: 4.0),
                child: Text(getAllItemsCount().toString() + " Items | " + "Rs. $total /-",
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: "Orkney",
                  fontSize: 14.0,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Container(
               margin: EdgeInsets.only(right: 5.0, bottom: 5.0, top: 5.0),
              child: RaisedButton(
                disabledElevation: 0.0,
                color: Colors.transparent,
                highlightElevation: 0.0,
                highlightColor: Colors.transparent,
                elevation: 0.0,
                padding: EdgeInsets.only(left: 8.0, right: 8.0),
                onPressed: (){},
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(6.0))
                ),
                splashColor: Colors.white30,
                child: Container(
                  height: 36.0,
                  child: Row(
                    children: <Widget>[
                      Text(
                        "Place your order",
                        style: TextStyle(
                          fontFamily: "Orkney",
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                          fontSize: 15.0
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(left: 3.0),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                        ),
                        padding: EdgeInsets.all(2.0),
                        child: Icon(
                        Icons.arrow_forward,
                        size: 14.0,
                        color: Color(0xCF5aff15),
                      ),
                      )
                    ],
                  )
                )
              )
              )
            ],
          ),
          height: 60,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.only(topLeft: Radius.circular(0.0), topRight: Radius.circular(0.0)),
            gradient: LinearGradient(
              begin: Alignment.bottomRight,
              end: Alignment.topLeft,
              colors: [
                Color(0xCF5aff15),
                Color(0xCF00b712),
              ],
              stops: [
                0.0,
                0.74
              ]
            )
          ),
        ),
        )
      );
    });
  }

  
    return DefaultTabController(
      length: 11,
      child: Container(
        margin: EdgeInsets.only(top: 24.0),
        child: Scaffold(
        key: _scaffoldkey,
        //   floatingActionButton: FloatingActionButton.extended(
        //   label: Text("Place your Order"),
        //   isExtended: true,
        //   onPressed: (){},
        //   tooltip: "Place your Order",
        //   icon: Icon(Icons.restaurant_menu),
        // ),
        appBar: AppBar(
          actions: <Widget>[
            GestureDetector(
              child: Padding(
                padding: EdgeInsets.only(right: 16.0, bottom: 16.0),
                child: Icon(
              Icons.more_vert,
              color: Colors.black,
            ),
              ),
            )
          ],
          centerTitle: true,
          backgroundColor: Colors.white,
          title: Container(
            padding: EdgeInsets.only(top: 6),
            child: Column(
            children: <Widget>[
              Text(
                "Welcome to",
                style: TextStyle(
                  fontSize: 16,
                    fontFamily: "Orkney",
                    color: Colors.black,
                    fontWeight: FontWeight.w200
                  ),
              ),
              Text(
                "Bhagini Pavilion",
                style: TextStyle(
                  fontSize: 22,
                    fontFamily: "Orkney",
                    color: Colors.black,
                    fontWeight: FontWeight.w300
                  ),
              ),
            ],
          ),
          ),
          elevation: 4.0,
          leading: GestureDetector(
            child: Icon(Icons.arrow_back,
            color: Colors.black,
            ),
            onTap: (){
              setState(() {
                isSheetClosed = true;
              });
              Navigator.of(context).pop();
            },
          ),
          flexibleSpace: FlexibleSpaceBar(
            
          ),
          bottom: TabBar(
            isScrollable: true,
            tabs: <Widget>[
              Tab(
                child: Text("Main Course",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Starters",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Desserts",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Beverages",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Breads & Wraps",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Rice, Biriyani & Noodles",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Meals",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Soups & Salads",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Pizza & Pastas",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Burgers & Snacks",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
              Tab(
                child: Text("Others",
                style: TextStyle(
                  fontFamily: "HK Grotesk",
                  color: Colors.black,
                  fontWeight: FontWeight.w500
                ),
                ),
              ),
            ],
          ),
        ),
        body: Container(
          child: TabBarView(
          children: <Widget>[
            ListView.builder(
              itemCount: 4,
              itemBuilder: (context, indexOfFood)=>
              new  Container(
                margin: indexOfFood == 0 ? EdgeInsets.only(top: 10.0) : indexOfFood == 9 ? EdgeInsets.only(bottom: 50.0) : EdgeInsets.only(top: 0.0, bottom: 0.0),
                height: 80,
                child: Card(
                  elevation: 3.0,
                  margin: EdgeInsets.only(left: 8.0, right: 8.0, top: 0.1, bottom: 0.1) ,
                child: Container(
                  height: 80,
                  padding: EdgeInsets.all(0),
                  margin: EdgeInsets.fromLTRB(8.0, 2.0, 8.0, 2.0),
                  child: Flex(
                    crossAxisAlignment: CrossAxisAlignment.center,
                  direction: Axis.horizontal,
                  children: <Widget>[
                    Container(
                      height: 50,
                      width: 50,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        image: DecorationImage(
                          fit: BoxFit.cover,
                        image: NetworkImage(
                           indexOfFood %2 ==0 ? 'https://www.cookforindia.com/wp-content/uploads/2016/01/Paneer-Butter-cover.jpg' : 'https://i.ytimg.com/vi/IJPSjb2Nl94/maxresdefault.jpg',
                      ),
                        )
                      ),
                    ),
                    Expanded(
                      child: Container(
                        alignment: Alignment.centerLeft,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                          Container(
                            margin: EdgeInsets.fromLTRB(10.0, 15.0, 10.0, 3.0),
                            child: Text( indexOfFood % 2 == 0 ? "Paneer Butter Masala" : "Veg Hydrebadi",
                            style: TextStyle(
                              fontFamily: "HK Grotesk",
                              fontSize: 14,
                              fontWeight: FontWeight.w500
                            ),
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.only(left: 10.0, top: 0.0),
                            child: Row(
                            children: <Widget>[
                              Container(
                                margin: EdgeInsets.only(right: 3.0, left: 3.0),
                                width: 40.0,
                                color: Colors.transparent,
                                child: FlutterRatingBarIndicator(
                                  rating: indexOfFood % 2 == 0 ? 4.0 : 3.0,
                                  fillColor: Colors.green,
                                  itemSize: 8,
                                  itemPadding: EdgeInsets.all(0.0),
                                  itemCount: 5,
                                  emptyColor: Colors.blueGrey.withAlpha(50),
                                ),
                              ),
                              Container(
                                height: 3,
                                width: 3,
                                margin: EdgeInsets.only(left: 1.0 , top: 1.0, right: 3.0),
                                decoration: BoxDecoration(
                                  color: Color(0xFF8F8F8F),
                                  shape: BoxShape.circle
                                ),
                              ),
                              Text(
                                "\u20B9",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0XFF565656),
                                  fontFamily: "Mosk" 
                                ),
                              ),
                              Text(
                                "180",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0XFF565656),
                                  letterSpacing: 0.3,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: "HK Grotesk"  //"Aganè"
                                ),
                              ),
                              Container(
                                height: 3,
                                width: 3,
                                margin: EdgeInsets.only(left: 2.0 , top: 2.0, right: 2.0),
                                decoration: BoxDecoration(
                                  color: Color(0xFF8F8F8F),
                                  shape: BoxShape.circle
                                ),
                              ),
                              Container(
                                margin: EdgeInsets.only(left: 2.0, right: 2.0, bottom: 2.0),
                                // child: Icon(
                                //   indexOfFood % 2 == 0 ? Icons.sentiment_very_satisfied : Icons.sentiment_very_dissatisfied,
                                //   size: 14,
                                //   color:  Colors.blue,
                                // ),
                                child: Text(
                                  indexOfFood % 2 == 0 ? "\u{1f60b}" : indexOfFood % 3 == 0 ? "\u{1f644}" : "\u{2639}",
                                  style: TextStyle(
                                    fontSize: 15.0
                                  )
                                )
                                ),
                                Container(
                                height: 3,
                                width: 3,
                                margin: EdgeInsets.only(left: 2.0 , top: 2.0, right: 2.0),
                                decoration: BoxDecoration(
                                  color: Color(0xFF8F8F8F),
                                  shape: BoxShape.circle
                                ),
                              ),
                              Container(
                                margin: EdgeInsets.only(left: 2.0, right: 2.0, bottom: 2.0),
                                // child: Icon(
                                //   indexOfFood % 2 == 0 ? Icons.sentiment_very_satisfied : Icons.sentiment_very_dissatisfied,
                                //   size: 14,
                                //   color:  Colors.blue,
                                // ),
                                child: Text(
                                  "\u{1f37d}",
                                  style: TextStyle(
                                    fontSize: 15.0
                                  )
                                )
                                ),
                              Container(
                                height: 3,
                                width: 3,
                                margin: EdgeInsets.only(left: 2.0 , top: 2.0, right: 2.0),
                                decoration: BoxDecoration(
                                  color: Color(0xFF8F8F8F),
                                  shape: BoxShape.circle
                                ),
                              ),
                              Container(
                                width: 12.0,
                                height: 12.0,
                                margin: EdgeInsets.only(left: 2.0, right: 2.0),
                                // child: Icon(
                                //   MyFlutterApp.leaf,
                                //   size: 12,
                                //   color: indexOfFood % 2 == 0 ? Colors.green : Colors.red,
                                // )
                                child: Container(
                                  decoration: BoxDecoration(
                                    shape: BoxShape.rectangle,
                                    borderRadius: BorderRadius.all(Radius.circular(2.0)),
                                    border: Border.all(
                                      color: indexOfFood % 2 == 0 ? Colors.green : Colors.red
                                    ),
                                  ),
                                  child:Center(
                                    child: Container(
                                      width: 5.0,
                                      height: 5.0,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: indexOfFood % 2 == 0 ? Colors.green : Colors.red
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          )
                        ],),
                      ),
                    ),
                    AnimatedCrossFade(
                      duration: Duration(milliseconds: 200),
                      firstChild: AbsorbPointer(
                        absorbing: itemList.containsKey(indexOfFood.toString()) ? true : false,
                        child:  RaisedButton(
                      elevation: 0.0,
                      shape: RoundedRectangleBorder(
                        side: BorderSide(
                          style: BorderStyle.solid,
                          width: 1.5,
                          color: Colors.green
                        ),
                        borderRadius: BorderRadius.all(Radius.circular(40.0))
                      ),
                      child: Text("Add Item",
                      style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.green,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: "HK Grotesk"   //"Aganè"
                                ),
                      ),
                      color: Colors.white,
                      onPressed: (){
                       if(itemList.length == 0 || isSheetClosed){
                        _showBottomSheet();
                        isSheetClosed = false;
                      }
                      setState((){
                        itemList[indexOfFood.toString()] = generateObject(indexOfFood.toString(), "Paneer", 1, indexOfFood % 2 == 0 ? 100 : 120);
                        total = calculateTotal();
                      });
                      _sheetController.setState((){
                        itemsCount = getAllItemsCount();
                      });
                      print(itemList);
                      }
                    ),
                      ),
                    secondChild: Container(
                      margin: EdgeInsets.only(left: 10.0, right: 5.0),
                      width: 72.0, //Text(getCountofElements(itemList, indexOfFood)),
                      child: Flex(
                        direction: Axis.horizontal,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          SizedBox(
                            width: 20.0,
                            height: 20.0,
                            child: GestureDetector(
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.all(Radius.circular(4.0)),
                                  border: Border.all(
                                    color: Colors.red,
                                  )
                                ),
                                child: Center(
                                    child: Icon(
                                    Icons.remove,
                                    size: 16.0,
                                    color: Colors.red,
                                  ),
                                ),
                              ),
                              onTap: (){
                                setState(() {
                                  if(isSheetClosed){
                                    _showBottomSheet();
                                    isSheetClosed = false;
                                  }
                                  if(itemList.containsKey(indexOfFood.toString())){
                                    itemList[indexOfFood.toString()]["count"] = (int.parse(itemList[indexOfFood.toString()]["count"])-1).toString();
                                    print(itemList[indexOfFood.toString()]["count"]);
                                    if(int.parse(itemList[indexOfFood.toString()]["count"]) == 0){
                                      itemList.remove(indexOfFood.toString());
                                    }
                                  }
                                  total = calculateTotal();
                                  itemsCount = getAllItemsCount();
                                });
                                if(itemList.length == 0){
                                  isSheetClosed = true;
                                  _sheetController.close();
                                }
                                _sheetController.setState((){
                                  itemsCount = getAllItemsCount();
                                  total = total;
                                });
                              },
                            ),
                          ),
                          Text(
                            getCountofElements(indexOfFood),
                            style: TextStyle(
                              fontFamily: "Orkney",
                              fontWeight: FontWeight.w500
                            ),
                          ),
                          SizedBox(
                            width: 20.0,
                            height: 20.0,
                            child: GestureDetector(
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.all(Radius.circular(4.0)),
                                  border: Border.all(
                                    color: Colors.green,
                                  )
                                ),
                                child: Center(
                                    child: Icon(
                                    Icons.add,
                                    size: 16.0,
                                    color: Colors.green,
                                  ),
                                ),
                              ),
                              onTap: (){
                                setState(() {
                                  if(isSheetClosed){
                                    _showBottomSheet();
                                    isSheetClosed = false;
                                  }
                                  if(itemList.containsKey(indexOfFood.toString())){
                                    itemList[indexOfFood.toString()]["count"] = (int.parse(itemList[indexOfFood.toString()]["count"])+1).toString();
                                  } else {
                                    itemList[indexOfFood.toString()] = (generateObject(indexOfFood.toString(), "Paneer", 1, indexOfFood % 2 == 0 ? 100 : 120));
                                  }
                                  total = calculateTotal();
                                  itemsCount = getAllItemsCount();
                                });
                                _sheetController.setState((){
                                  itemsCount = getAllItemsCount();
                                  total = calculateTotal();
                                });
                              },
                            ),
                          )
                        ],
                      ) 
                    ),
                    crossFadeState: itemList.containsKey(indexOfFood.toString()) ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                    )
                  ],
                ),
                )
              ),
              )
              ,
            ),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
            Text("Hello"),
          ],
        ),
        )
      ),
    ),
    );
  }
}

class InorderContentSummary extends StatelessWidget {
  _InorderState parent;
  InorderContentSummary(this.parent);
  @override
  Widget build(BuildContext context) {
    return Text(
      this.parent.itemList.length.toString()
    );
  }
}

Color indicatorColorDecider(double value){
  Color color = Colors.green;
  if(value >= 3.0 && value < 4.0){
    color = Colors.yellow;
  }else if(value < 3.0 && value >= 2.0){
    color = Color(0xFF999900);
  }else if(value < 2.0){
    color = Colors.red;
  }
  return color;
}

