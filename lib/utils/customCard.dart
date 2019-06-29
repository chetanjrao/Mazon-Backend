import 'dart:core' as prefix0;
import 'dart:ui';

import 'package:flutter/material.dart';

class CardView extends StatelessWidget {
  CardView({
    this.backgroundColor:Colors.white,
    this.height,
    this.width:prefix0.double.infinity,
    this.elevation:2.0,
    this.borderRadius: 4.0,
    this.clickable: false,
    this.margin: 0.0,
    this.marginLeft: 0.0,
    this.marginRight: 0.0,
    this.marginTop: 0.0,
    this.marginBottom: 0.0,
    this.paddingTop: 0.0,
    this.paddingBottom: 0.0,
    this.paddingLeft: 0.0,
    this.paddingRight: 0.0,
    this.topLeftBorderRadius: 4.0,
    this.topRightBorderRadius: 4.0,
    this.bottomLeftBorderRadius: 4.0,
    this.bottomRightBorderRadius: 4.0,
    this.alignment,
    this.padding: 0.0,
    this.child,
  });
  final prefix0.double width, height, elevation, borderRadius, marginLeft, marginRight, marginTop, marginBottom, paddingTop,paddingBottom,paddingLeft, paddingRight, margin, topLeftBorderRadius, topRightBorderRadius, bottomLeftBorderRadius, bottomRightBorderRadius, padding;
  final Color backgroundColor;
  final Alignment alignment;
  final prefix0.bool clickable;
  final Widget child;
  @prefix0.override
  Widget build(BuildContext context) {
    BorderRadius cardBorderRadius = borderRadius != 4.0 ? BorderRadius.all(Radius.circular(borderRadius)) : BorderRadius.only(
      topLeft: Radius.circular(topLeftBorderRadius),
      topRight: Radius.circular(topRightBorderRadius),
      bottomLeft: Radius.circular(bottomLeftBorderRadius),
      bottomRight: Radius.circular(bottomRightBorderRadius)
    );
    EdgeInsets cardMargins = margin != 0.0 ? EdgeInsets.all(margin) : EdgeInsets.only(
      top: marginTop,
      bottom: marginBottom,
      left: marginLeft,
      right: marginRight
    );
    EdgeInsets cardPadding = padding != 0.0 ? EdgeInsets.all(padding) : EdgeInsets.only(
      top: paddingTop,
      left: paddingLeft,
      bottom: paddingBottom,
      right: paddingRight
    );
    return SizedBox(
      width: width,
      height: height,
        child: Container(
          padding: cardPadding,
          height: height,
          width: width,
        margin:cardMargins,
        child: Material(
          type: MaterialType.transparency,
          color: backgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: cardBorderRadius
          ),
          elevation: elevation,
          clipBehavior: Clip.antiAlias,
          child: child,
          ),
        color: backgroundColor,
      )
    );
  }
}