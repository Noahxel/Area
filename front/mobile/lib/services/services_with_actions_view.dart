import 'package:flutter/material.dart';
import './service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../components/search_bar.dart';
import '../components/servicecard_actions.dart';

Future<List<Service>> fetchActions() async {
  const String url = 'https://api.techparisarea.com/about.json';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

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

    final List<dynamic> servicesWithActions = servicesData.where((service) {
      final List<dynamic> actions = service['actions'];
      return actions.isNotEmpty;
    }).toList();

    if (servicesWithActions.isNotEmpty) {
      return servicesWithActions
          .map((serviceData) => Service.fromJson(serviceData))
          .toList();
    } else {
      throw Exception('No services with actions found in the response');
    }
  } else {
    throw Exception('Failed to load services');
  }
}

class ActionsView extends StatefulWidget {
  const ActionsView({Key? key}) : super(key: key);

  @override
  ActionsViewState createState() => ActionsViewState();
}

class ActionsViewState extends State<ActionsView> {
  final Future<List<Service>> futureServices = fetchActions();
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
            child: Center(
              child: Text(
                'Choose a service',
                style: TextStyle(
                  color: Color(0xFFFFFFFF),
                  fontFamily: 'Archivo',
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
            child: SizedBox(
              width: 359,
              height: 63,
              child: MySearchBar(
                onChanged: (query) {
                  setState(() {
                    _searchQuery = query;
                  });
                },
              ),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Service>>(
              future: futureServices,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (snapshot.data == null || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No services found.'));
                } else {
                  final services = snapshot.data!;
                  final filteredServices = services
                      .where((service) => service.name
                          .toLowerCase()
                          .contains(_searchQuery.toLowerCase()))
                      .toList();
                  return GridView.builder(
                    padding: const EdgeInsets.all(20.0),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 20.0,
                      mainAxisSpacing: 20.0,
                    ),
                    itemCount: filteredServices.length,
                    itemBuilder: (ctx, index) =>
                        ServiceCardActions(service: filteredServices[index]),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
