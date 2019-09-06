import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mazon/utils/globals.dart';

class MazonAPIClient {
  static const String API_BASE_URL = "http://$server:$port";



  // static Future<Response> authenticate(String password, String email) {
  //   var client = new Client();
  //   try {
  //     String encodedString =  base64Encode(utf8.encode("$email:$password"));
  //     String authString = "Basic "+encodedString;
  //     return client.post(
  //       '$API_BASE_URL'+'/accounts/signin',
  //       headers: {
  //         "authorization": authString,
  //         'Content-Type': 'application/json'
  //       }
  //     );
  //   } finally{
  //     client.close();
  //   }
  // }

  static Future<http.Response> getMenu(String authToken, String restaurantID){
    return http.get(
      '$API_BASE_URL'+'/api/library/menu/'+restaurantID,
      headers: {
        "Content-Type": 'application/json',
        "Authorization": 'Bearer ' +authToken
      }
    );
  }
}