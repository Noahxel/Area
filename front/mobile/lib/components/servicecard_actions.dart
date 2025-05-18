import 'package:flutter/material.dart';
import '../services/service.dart';
import '../services/connect_service_view.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/list_actions.dart';

class ServiceCardActions extends StatelessWidget {
  final Service service;

  const ServiceCardActions({Key? key, required this.service}) : super(key: key);

  Future<void> _loadProfileFromAPI(BuildContext context) async {
    const String url = 'https://api.techparisarea.com/profile';

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token == null) {
      print("No token found");
      return;
    }

    final response = await http.get(Uri.parse(url), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      List<String> connectedServices =
          List<String>.from(data['connectServices'] ?? []);

      if (connectedServices.contains(service.name)) {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => ListActionsView(selectedService: service)),
        );
      } else {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                ConnectServiceView(service: service, sourceType: "actions"),
          ),
        );
      }
    } else {
      print('Error fetching profile: ${response.statusCode}');
    }
  }

  @override
  Widget build(BuildContext context) {
    String logoAssetName = 'assets/servicesLogo/${service.name}.png';

    return GestureDetector(
      onTap: () => _loadProfileFromAPI(context),
      child: Card(
        color: Color(int.parse('0xFF${service.color.substring(1)}')),
        margin: const EdgeInsets.symmetric(vertical: 1, horizontal: 1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: SizedBox(
          height: 120,
          width: 120,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(logoAssetName, height: 44, width: 44),
              SizedBox(height: 20),
              Text(
                capitalize(service.name),
                style: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'Archivo',
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
