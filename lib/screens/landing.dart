import 'package:flutter/material.dart';

class Signin extends StatefulWidget {
  @override
  _SigninState createState() => _SigninState();
}

class _SigninState extends State<Signin> {
  final double logoRotateValue = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
            child: Stack(
            children: <Widget>[
              Container(
                child: Image.asset(
                  'assets/background.jpg',
                  height: MediaQuery.of(context).size.height,
                  width: MediaQuery.of(context).size.width,
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                  height: 72.0,
                ),
                )
              ),
              Container(
                alignment: Alignment.bottomCenter,
                margin: EdgeInsets.all(18.0),
                child: Flex(
                  direction: Axis.horizontal,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Expanded(
                      child: Container(
                      child: RaisedButton(
                        onPressed: (){},
                        elevation: 0.0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(30.0))
                        ),
                        splashColor: Colors.white24,
                        color: Colors.transparent,
                        child: Text("Log In",
                        style: TextStyle(
                          fontFamily: "HK Grotesk",
                          fontSize: 16.0,
                          color: Colors.white,
                          fontWeight: FontWeight.bold
                        ),
                        ),
                        highlightColor: Colors.transparent,
                        highlightElevation: 0.0,
                      ),
                    ),
                    ),
                    Container(
                      margin: EdgeInsets.all(10.0),
                      height: 28.0,
                      alignment: Alignment.topCenter,
                      width: 1.0,
                      color: Colors.blueGrey,
                    ),
                    Expanded(
                      child: Container(
                      child: RaisedButton(
                        onPressed: (){},
                        elevation: 0.0,
                        highlightColor: Colors.transparent,
                        highlightElevation: 0.0,
                        color: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(30.0))
                        ),
                        splashColor: Colors.white24,
                        child: Text("Sign Up",
                        style: TextStyle(
                          fontFamily: "HK Grotesk",
                          fontSize: 16.0,
                          color: Colors.white,
                          fontWeight: FontWeight.bold
                        ),
                        ),
                      ),
                    ),
                    ),
                  ],
                ),
              ),
            ],
          )
        )
      );
  }
}

class WavePathClipper extends CustomClipper<Path>{
  @override
  Path getClip(Size size) {
    Path path = new Path();
    
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
  
}