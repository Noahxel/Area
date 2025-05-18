import 'package:flutter/material.dart';
import '../components/search_bar.dart';
import '../components/area_card.dart';
import '../services/service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

Future<List<Area>> fetchAreas() async {
  const String url = 'https://api.techparisarea.com/areas';

  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString('token');

  if (token == null) {
    print("No token found");
    throw Exception('Token not found');
  }

  final response = await http.get(Uri.parse(url), headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  });

  if (response.statusCode == 200) {
    List<dynamic> data = json.decode(response.body);
    return data.map((areaJson) => Area.fromJson(areaJson)).toList();
  } else {
    print('Error fetching areas: ${response.statusCode}');
    throw Exception('Failed to load areas');
  }
}

Future<List<Service>> fetchServices() async {
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
    List<dynamic> data = json.decode(response.body)['server']['services'];
    return data.map((serviceJson) => Service.fromJson(serviceJson)).toList();
  } else {
    throw Exception('Failed to load services');
  }
}

class HomeView extends StatefulWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  HomeViewState createState() => HomeViewState();
}

class HomeViewState extends State<HomeView> {
  final Future<List<Area>> futureAreas = fetchAreas();
  final Future<List<Service>> futureServices = fetchServices();
  String _searchQuery = '';

  List<Area> _filterServices(List<Area> areas) {
    if (_searchQuery.isEmpty) {
      return areas;
    }
    return areas
        .where((area) =>
            area.description.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Column(
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.only(top: 50.0, bottom: 20.0),
            child: Center(
              child: Text(
                'Home',
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
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
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
          const SizedBox(height: 30),
          Expanded(
            child: FutureBuilder<List<Service>>(
              future: futureServices,
              builder: (context, serviceSnapshot) {
                if (serviceSnapshot.connectionState == ConnectionState.done) {
                  if (serviceSnapshot.hasError) {
                    return Center(
                        child: Text('Error: ${serviceSnapshot.error}'));
                  }
                  List<Service> services = serviceSnapshot.data!;
                  return FutureBuilder<List<Area>>(
                    future: futureAreas,
                    builder: (context, areaSnapshot) {
                      if (areaSnapshot.connectionState ==
                          ConnectionState.done) {
                        if (areaSnapshot.hasError) {
                          return Center(
                              child: Text('Error: ${areaSnapshot.error}'));
                        }
                        List<Area> areas = _filterServices(areaSnapshot.data!);
                        if (areas.isEmpty) {
                          return Center(
                            child: Text(
                              'Create your first AREA !',
                              style: TextStyle(
                                color: Colors.white,
                                fontFamily: 'Archivo',
                                fontSize: 30,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }
                        return ListView.builder(
                          itemCount: areas.length,
                          itemBuilder: (context, index) => AreaCard(
                            area: areas[index],
                            services: services,
                            onDelete: () {
                              setState(() {
                                areas.removeAt(index);
                              });
                            },
                          ),
                        );
                      } else {
                        return const Center(child: CircularProgressIndicator());
                      }
                    },
                  );
                } else {
                  return const Center(child: CircularProgressIndicator());
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
