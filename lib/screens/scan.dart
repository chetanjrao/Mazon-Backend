import 'package:flutter/material.dart';
import 'dart:async';
import 'package:qr_mobile_vision/qr_camera.dart';

class Scan extends StatefulWidget {
  @override
  _ScanState createState() => _ScanState();
}

class _ScanState extends State<Scan> {
  @override
  Widget build(BuildContext context) {
    // return new SizedBox(
    //     width: 100.0,
    //     height: 100.0,
    //     child: new QrCamera(
    //       qrCodeCallback: (code) {
    //         print(code);
    //       },
    //     ),
    //   );
    return Scaffold(
      appBar: AppBar(
        leading: Icon(Icons.arrow_back),
        title: Text("Scan the QR Code on the table"),
      ),
      body: Center(
        child: new SizedBox(
        width: 400.0,
        height: 400.0,
        child: new QrCamera(
          qrCodeCallback: (code) {
            print(code);
          },
        ),
      )
      ),
    );
  }
}