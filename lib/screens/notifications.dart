import 'package:flutter/material.dart';

class Notifications extends StatelessWidget {
  Notifications({this.no});
  @required final int no;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text((no+1).toString()),
    );
  }
}