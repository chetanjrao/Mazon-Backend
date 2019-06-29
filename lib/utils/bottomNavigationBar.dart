import 'package:flutter/material.dart';

class BottomNavigationBarItem {
  BottomNavigationBarItem({this.iconData, this.label, this.itemIconSize});
  IconData iconData;
  String label;
  double itemIconSize;
}

class BottomNavigationBar extends StatefulWidget {
  BottomNavigationBar({
    this.items,
    this.activeTintColor,
    this.inactiveTintColor,
    this.height: 60.0,
    this.iconSize: 24.0,
    this.backgroundColor: Colors.white,
    this.shape,
    this.onTabSelected,
    this.centerIconAnimation: 2.0,
    this.centerIcon,
    this.shifting: false,
    this.labeled: true,
    this.elevation: 2.0
  });
  final IconData centerIcon;
  final List<BottomNavigationBarItem> items;
  final Color activeTintColor, inactiveTintColor;
  final double height, elevation;
  final double iconSize;
  final NotchedShape shape;
  final Color backgroundColor;
  final ValueChanged<int> onTabSelected;
  final double centerIconAnimation;
  final bool labeled, shifting;
  @override
  State<BottomNavigationBar> createState() => _BottomNavigationBarState();
}

class _BottomNavigationBarState extends State<BottomNavigationBar> {
  int selectedTab = 0;

  updateSelectedTab(int index){
    widget.onTabSelected(index);
    setState(() {
      selectedTab = index;
    });
  }

  @override
  Widget build(BuildContext context) {


    List<Widget> bottomNavigationBarItems = List.generate(widget.items.length, (int index){
      return buildNavigationBarItem(
                    item: widget.items[index],
                    index: index,
                    onPressed: updateSelectedTab
                  );
                });
                return BottomAppBar(
                  shape: widget.shape,
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: bottomNavigationBarItems,
                  ),
                  color: widget.backgroundColor,
                );
      
                
              }
      
        Widget buildNavigationBarItem({BottomNavigationBarItem item, int index, Function(int index) onPressed}) {
          Color color = selectedTab == index ? widget.activeTintColor : widget.inactiveTintColor;
          return Expanded(
            child: Container(
              height: widget.height,
              child: Material(
                elevation: widget.elevation,
                type: MaterialType.transparency,
                child: InkResponse(
                  onTap: () => 
                    onPressed(index)
                  ,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      item.itemIconSize == widget.iconSize || item.itemIconSize == null ? Icon(item.iconData, color: color, size: widget.iconSize) :  Icon(item.iconData, color: color, size: item.itemIconSize),
                      widget.labeled || (widget.shifting == true && selectedTab == index) ? new Text(item.label, style: TextStyle(color: color)) : new Container(
                        width: 0,
                        height: 0
                      )
                    ],
                  ),
                ),
              )
            )
          );
        }
      
          
  }