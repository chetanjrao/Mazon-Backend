import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import '../utils/mazonAPIClient.dart';
import '../utils/globals.dart';

const String API_BASE_URL = "http://$server:$port";

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = new GlobalKey<FormState>();
  TextEditingController _editingController = new TextEditingController();
  TextEditingController _passwordController = new TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  bool autoValidate = false;
  String email;
  String password;
  bool isProcessing;
  bool isPasswordVisible;
  int statusCode;
  String message = "";
  bool onReEdited = false;
  bool isAuthenticated = false;
  Map<String, String> data = {
    "email": "",
    "password": ""
  };

  Future<http.Response> getResponse() async {
    return await MazonAPIClient.getMenu('e0e88989b12df0aec51b4312320ae8a75c3b7d96332790b84530e2cc9dbaf5a31cc8cbd7635628d1ac542c4ff8e86558eb6805216af94c906528c453b84308b79c1bcc1676388fcd785f3bc6789535ce7bffbdefb0fe12127972a6dc15ac9191432e80cb291ab1effe928fe1570b7719.356430306436336663333034356330323637626563613639','123');
  }

  Future<http.Response> authenticate(String password, String email) async{
      String encodedString =  base64Encode(utf8.encode("$email:$password"));
      String authString = "Basic "+encodedString;
      try{
        var response = await http.post('$API_BASE_URL'+'/accounts/signin', 
          headers: {'authorization': authString, 'Content-Type': 'application/json'});
        return response;
      }catch(ex, st){
        return null;
      }
  }

  @override
  void initState(){
    super.initState();
    isPasswordVisible = false;
    isProcessing = false;
    _editingController.addListener(_onChanged);
    _passwordController.addListener(_onPassChanged);
    getResponse().then((resp){
      print(resp.body);
    });
  }

  _onChanged(){
    if(statusCode == 401 && !onReEdited){
      setState(() {
        onReEdited = true;
      });
    }
  }
  _onPassChanged(){
    if(statusCode == 401 && !onReEdited){
      setState(() {
        onReEdited = true;
      });
    } 
  }

  @override
  void dispose() {
    _editingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      body: Form (
        key: _formKey,
        autovalidate: autoValidate,
        child: Container(
        height: MediaQuery.of(context).size.height,
        margin: EdgeInsets.only(top: 24.0),
        child: Stack(
          // mainAxisSize: MainAxisSize.max,
          // mainAxisAlignment: MainAxisAlignment.spaceBetween,
          // crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Positioned(
              top: 0,
              left: 0,
              child: Container(
              width: 80.0,
              height: 80.0,
              child: Stack(
                children: <Widget>[
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.deepOrange,
                      borderRadius: BorderRadius.only(topRight: Radius.circular(40.0), bottomRight: Radius.circular(40.0), bottomLeft: Radius.circular(40.0))
                    ),
                  ),
                  Center(
                      child: Icon(
                        Icons.clear,
                        color: Colors.white
                      )
                  ),
                ],
              ),
            ),
            ),
             Container(
              margin: EdgeInsets.fromLTRB(14.0, 94.0, 14.0, 14.0),
              child: ListView(
               // crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    child: Wrap(
                      children: <Widget>[
                        Text(
                          "Login",
                          style: TextStyle(
                            fontFamily: 'kano',
                            fontSize: 34.0,
                            fontWeight: FontWeight.w600
                          ),
                        ),
                        Image.asset(
                          'assets/mazon-01.png',
                          height: 50.0,
                          width: 50.0,
                        ),
                      ],
                    )
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 14.0),
                    child: TextFormField(
                      controller: _editingController,
                      style: TextStyle(
                        fontFamily: 'orkney',
                        fontWeight: FontWeight.w500
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (String value){
                          if(value.isEmpty){
                            return "Enter the email address";
                          } 
                          String pattern = "[a-zA-Z0-9\+\.\_\%\-\+]{1,256}" +
                              "\\@" +
                              "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                              "(" +
                              "\\." +
                              "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                              ")+";
                          RegExp patternRefEx = new RegExp(pattern);
                          if(patternRefEx.hasMatch(value)){
                            return null;
                          }
                          return "Enter valid email address";
                        },
                      onSaved: (String value){
                        setState(() {
                          data["email"] = value; 
                        });
                      },
                      enabled: isProcessing ? false : true,
                      decoration: InputDecoration(
                        enabledBorder: !onReEdited && statusCode == 401 ? UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.red
                          )
                        ) : UnderlineInputBorder(),
                       // suffixIcon: Icon(Icons.email),
                       errorStyle: TextStyle(
                          fontFamily: 'orkney',
                          fontWeight: FontWeight.w400
                        ),
                        labelText: "Email Address",
                        alignLabelWithHint: true,
                        labelStyle: TextStyle(
                          fontFamily: 'orkney',
                          fontWeight: FontWeight.w600,
                          color: !onReEdited && statusCode == 401 ? Colors.red : null
                        )
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 20.0),
                    child: TextFormField(
                      controller: _passwordController,
                      obscureText: isPasswordVisible ? false : true,
                      enabled: isProcessing ? false : true,
                      onSaved: (String value){
                        setState(() {
                          data["password"] = value; 
                        });
                      },
                      style: TextStyle(
                        fontFamily: 'orkney',
                        fontWeight: FontWeight.w500
                      ),
                      validator: (String value){
                        if(value.isEmpty){
                          return "Enter a password";
                        }
                        if(value.length < 8){
                          return "Password should be minimum 8 characters";
                        }
                      },
                      
                      decoration: InputDecoration(
                      enabledBorder: !onReEdited && statusCode == 401 ? UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.red
                          )
                      ) : UnderlineInputBorder(),                        
                      errorStyle: TextStyle(
                          fontFamily: 'orkney',
                          fontWeight: FontWeight.w400
                        ),
                       // suffixIcon: Icon(Icons.security),
                        labelText: "Password",
                        suffixIcon: GestureDetector(
                          onTap: (){
                            if(isPasswordVisible){
                              setState(() {
                                isPasswordVisible = false;
                              });
                            }else {
                              setState(() {
                                isPasswordVisible = true;
                              });
                            }
                          },
                          child: Container(
                            padding: EdgeInsets.only(top: 0.0),
                            child: isPasswordVisible ? Icon(Icons.visibility_off) : Icon(Icons.visibility),
                          ),
                        ),
                        alignLabelWithHint: true,
                        labelStyle: TextStyle(
                          fontFamily: 'orkney',
                          fontWeight: FontWeight.w600,
                          color: !onReEdited && statusCode == 401 ? Colors.red : null
                        )
                        
                      ),
                    ),
                  ),
                  message.length > 0 ? Container(
                    margin: EdgeInsets.only(top: 10.0),
                    padding: EdgeInsets.only(bottom: 0.0),
                    child: Wrap(
                      children: <Widget>[
                        Icon(
                          Icons.error_outline,
                          color: Colors.red,
                          size: 15.0,
                        ),
                        Padding(
                          padding: EdgeInsets.only(left: 2.0, top: 1.0),
                          child: Text(
                          "Invalid Credentials",
                          style: TextStyle(
                            fontFamily: 'orkney',
                            color: Colors.red,
                            fontSize: 13.0
                          ),
                        ),
                        )
                      ],
                    ),
                  ) : Container(
                    height: 0.0,
                    width: 0.0,
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 20.0),
                    padding: EdgeInsets.only(bottom: 100.0),
                    child: Text(
                      "Forgot your password ?",
                      style: TextStyle(
                        fontFamily: 'orkney',
                        color: Colors.blue,
                        fontSize: 13.0
                      ),
                    ),
                  )
                ],
              )
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: GestureDetector(
                onTap: (){
                  final form = _formKey.currentState;
                  if(form.validate()){
                    form.save();
                    setState(() {
                      isPasswordVisible = false;
                      isProcessing = true;
                    });
                    var response = authenticate(data["password"], data["email"]);
                    response.then((resp){
                        if(resp != null){
                          setState(() {
                            isProcessing = false;
                            statusCode = resp.statusCode;
                          });
                          if(statusCode == 200){
                              setState(() {
                                message = "";
                              });
                              
                              print(jsonDecode(resp.body)["accessToken"]);
                          } else {
                            setState(() {
                              onReEdited = false;
                              message = jsonDecode(resp.body)["message"];
                            });
                          }
                        }
                         else {
                          setState(() {
                            isProcessing = false;
                          });
                          _scaffoldKey.currentState.showSnackBar(SnackBar(
                            content: Text(
                              "Failed to connect. Kindly check your internet connection",
                              style: TextStyle(
                                fontFamily: 'orkney'
                              ),
                              ),
                          ));
                        }
                      });
                  } else {
                    setState(() {
                      autoValidate = true;
                    });
                  }
                  
                },
                child: Container(
                  margin: EdgeInsets.only(bottom: 20.0),
                  height: 80,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.only(topLeft: Radius.circular(40.0), bottomLeft: Radius.circular(40.0)),
                    color: Colors.green,
                  ),
                  width: 160,
                  child: Center(
                    child: Wrap(
                      children: !isProcessing ? <Widget>[
                        Text(
                          "Proceed",
                          style: TextStyle(
                            fontFamily: 'kano',
                            fontSize: 19.0,
                            color: Colors.white,
                            fontWeight: FontWeight.w600
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(left: 6.0),
                          child: Icon(
                          Icons.arrow_forward_ios,
                          size: 20.0,
                          color: Colors.white,
                        ),
                        )
                      ] :  <Widget>[
                        Text(
                          "Processing",
                          style: TextStyle(
                            fontFamily: 'kano',
                            fontSize: 19.0,
                            color: Colors.white,
                            fontWeight: FontWeight.w600
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(left: 6.0, top: 4.0),
                          child: Container(
                            height: 18.0,
                            width: 18.0,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.0,
                              valueColor: AlwaysStoppedAnimation(Colors.white),
                            ),
                          )
                        )
                      ],
                    )
                ),
              ),
              )
            )
          ],
        )
      ),
    ),
    );
  }
}