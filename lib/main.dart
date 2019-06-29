import 'package:flutter/material.dart';
import 'package:mazon/screens/notifications.dart';
import 'package:mazon/screens/profile.dart';
import 'package:mazon/screens/restaurantView.dart';
import 'package:mazon/screens/search.dart';
import 'package:mazon/utils/bottomNavigationBar.dart' as prefix0;
import './my_flutter_app_icons.dart';
import 'package:mazon/screens/userFeed.dart';
void main() => runApp(
  MyApp()
);

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return(
      MaterialApp(
        home: HomePage(),
        debugShowCheckedModeBanner: false,  
      )
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  PageController homePageController = PageController(initialPage: 0);
  int selectedTab = 0;
  void changeTabSelectedIndex(int index){
    setState(() {
      homePageController.jumpToPage(index);
      selectedTab = index;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: homePageController,
        onPageChanged:(int){},
        children: <Widget>[
          new UserFeed(),
          new Search(no: selectedTab,),
          new Notifications(no: selectedTab,),
          new Profile(no: selectedTab,),
        ],
        physics: NeverScrollableScrollPhysics(),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: (){},
        tooltip: "Explore",
        backgroundColor: Color(0xFF2ECC71),
        child: Icon(MyFlutterApp.store),
        elevation: 2.0,
      ),
      bottomNavigationBar: prefix0.BottomNavigationBar(
        onTabSelected: changeTabSelectedIndex,
        activeTintColor: Color(0xFF2ECC71),//Color(0xFFD35400),
        inactiveTintColor: Colors.blueGrey,
        labeled: false,
        shifting: false,
        items: [
          prefix0.BottomNavigationBarItem(iconData: Icons.home, label: 'Home' , itemIconSize: 26),
          prefix0.BottomNavigationBarItem(iconData: Icons.search, label: 'Search', itemIconSize: 26),
          prefix0.BottomNavigationBarItem(iconData: Icons.notifications, label: 'Notifications', itemIconSize: 26),
          prefix0.BottomNavigationBarItem(iconData: Icons.person, label: 'Profile', itemIconSize: 26),
        ],
      )
      
    );
  }
}