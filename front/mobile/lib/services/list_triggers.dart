import 'package:flutter/material.dart';
import './service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'triggers_parameter_input_view.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';

Future<Service> fetchTriggers(String serviceName) async {
  const String url = 'https://api.techparisarea.com/about.json';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  if (token == null) {
    throw Exception('No token found');
  }

  final response = await http.get(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 200) {
    final Map<String, dynamic> data = json.decode(response.body);
    final List<dynamic> servicesData = data['server']['services'] ?? [];

    final serviceData = servicesData.firstWhere(
      (service) => service['name'] == serviceName,
      orElse: () => throw Exception('Service not found'),
    );

    return Service.fromJson(serviceData);
  } else {
    throw Exception('Failed to load services');
  }
}

String formatTriggerName(String original) {
  return original
      .split('_')
      .map((str) => '${str[0].toUpperCase()}${str.substring(1)}')
      .join(' ');
}

class ListTriggersView extends StatelessWidget {
  final Service selectedService;

  ListTriggersView({Key? key, required this.selectedService}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color backgroundColor =
        Color(int.parse('0xFF${selectedService.color.substring(1)}'));
    Color lowerBackgroundColor = Color(0xFF1D1D1D);
    String logoAssetName = 'assets/servicesLogo/${selectedService.name}.png';
    final areaState = Provider.of<AreaCreationState>(context, listen: false);

    return Scaffold(
      body: Column(
        children: [
          Container(
            color: backgroundColor,
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                children: [
                  SizedBox(height: 55),
                  Text(
                    'Choose a trigger',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Archivo',
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 50),
                  Image.asset(logoAssetName, height: 64, width: 64),
                  SizedBox(height: 70),
                ],
              ),
            ),
          ),
          Expanded(
            child: Container(
              color: lowerBackgroundColor,
              child: FutureBuilder<Service>(
                future: fetchTriggers(selectedService.name),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text(
                        'Error: ${snapshot.error}',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontFamily: 'Archivo',
                        ),
                      ),
                    );
                  } else if (!snapshot.hasData ||
                      snapshot.data!.triggers.isEmpty) {
                    return Center(
                      child: Text(
                        'No triggers available.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontFamily: 'Archivo',
                        ),
                      ),
                    );
                  } else {
                    final service = snapshot.data!;
                    return ListView.builder(
                      itemCount: service.triggers.length,
                      itemBuilder: (context, index) {
                        final trigger = service.triggers[index];
                        return Padding(
                          padding:
                              const EdgeInsets.fromLTRB(40.0, 10.0, 40.0, 15.0),
                          child: TextButton(
                            style: TextButton.styleFrom(
                              backgroundColor: backgroundColor,
                              primary: Colors.white,
                              padding: EdgeInsets.symmetric(vertical: 15),
                              textStyle: TextStyle(
                                fontSize: 20,
                                fontFamily: 'Archivo',
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            onPressed: () {
                              if (trigger.parameters.isEmpty) {
                                areaState.setTrigger({
                                  'service': service.name,
                                  'name': trigger.name,
                                  'parameters': [],
                                  'ingredients': trigger.ingredients,
                                });
                                Navigator.popUntil(
                                    context, (route) => route.isFirst);
                              } else {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        TriggerParameterInputPage(
                                      service: service,
                                      trigger: trigger,
                                    ),
                                  ),
                                );
                              }
                            },
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                padding: const EdgeInsets.only(left: 16.0),
                                child: Text(formatTriggerName(trigger.name)),
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
