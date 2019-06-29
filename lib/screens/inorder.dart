import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class Inorder extends StatefulWidget {
  @required final String restaurantID, restaurantName;

  const Inorder({Key key, this.restaurantID, this.restaurantName}) : super(key: key);
  @override
  _InorderState createState() => _InorderState();
}

class _InorderState extends State<Inorder> with SingleTickerProviderStateMixin{
  TabController _tabController;
  ScrollController _controller;
  int currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 10, initialIndex: currentIndex, vsync: this );
    _controller = new ScrollController();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 10,
      child: Scaffold(
          floatingActionButton: FloatingActionButton.extended(
          label: Text("Varieties"),
          isExtended: true,
          onPressed: (){},
          tooltip: "Varieties",
          icon: Icon(Icons.restaurant_menu),
        ),
        appBar: AppBar(
          bottom: TabBar(
            isScrollable: true,
            tabs: <Widget>[
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
              Tab(
                child: Text("Hello"),
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: <Widget>[
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
      ),
    );
  }
}