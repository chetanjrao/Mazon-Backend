import 'package:flutter/material.dart';

class Search extends StatelessWidget {
  Search({this.no});
  @required int no;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text((no+1).toString()),
    );
  }
}