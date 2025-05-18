import 'package:flutter/material.dart';
import 'custom_switch.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../services/service.dart';
import 'dart:async';

class Area {
  Map<String, dynamic> trigger;
  String id;
  List<Map<String, dynamic>> actions;
  bool isActive;
  String description;

  Area({
    required this.id,
    required this.trigger,
    required this.actions,
    required this.isActive,
    required this.description,
  });

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
      id: json['_id'],
      trigger: json['trigger'],
      actions: List<Map<String, dynamic>>.from(json['actions']),
      isActive: json['isActive'],
      description: json['area_description'],
    );
  }

  @override
  String toString() {
    return 'Area(id: $id, trigger: $trigger, actions: $actions, isActive: $isActive, description: $description)';
  }
}

class AreaCard extends StatefulWidget {
  final Area area;
  final List<Service> services;
  final VoidCallback onDelete;

  AreaCard({
    required this.area,
    required this.services,
    required this.onDelete,
  });

  @override
  _AreaCardState createState() => _AreaCardState();
}

class _AreaCardState extends State<AreaCard> {
  Color _getServiceColor(String serviceName) {
    print("Looking for service: $serviceName");
    for (var service in widget.services) {
      print("Checking against service: ${service.name}");
      if (service.name == serviceName) {
        return Color(
            int.parse(service.color.substring(1, 7), radix: 16) + 0xFF000000);
      }
    }
    print("Service not found for: $serviceName");
    return Colors.blue;
  }

  Future<void> _toggleActivation() async {
    final String url =
        'https://api.techparisarea.com/areas/${widget.area.id}/switch_activation';
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token == null) {
      print("No token found");
      return;
    }
    final response = await http.put(Uri.parse(url), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (response.statusCode == 200) {
      print('RESPONSE : ${response.body}');
      setState(() {
        widget.area.isActive = !widget.area.isActive;
      });
    } else {
      print('Error toggling activation: ${response.statusCode}');
    }
  }

  Future<void> _deleteArea() async {
    final String url = 'https://api.techparisarea.com/areas/${widget.area.id}';
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token == null) {
      print("No token found");
      return;
    }
    final response = await http.delete(Uri.parse(url), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (response.statusCode == 200) {
      print('Area successfully deleted');
      widget.onDelete();
    } else {
      print('Error deleting area: ${response.statusCode}');
    }
  }

  Future<void> _showDeleteConfirmation(BuildContext context) async {
    return showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                'Are you sure you want to delete this area?',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      primary: Colors.red,
                    ),
                    onPressed: () {
                      Navigator.of(context).pop();
                      _deleteArea();
                    },
                    child: Text('Yes', style: TextStyle(color: Colors.white)),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: Text('No', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  List<String> _getUniqueServices() {
    Set<String> uniqueServices = {};

    uniqueServices.add(widget.area.trigger['service']);

    for (var action in widget.area.actions) {
      uniqueServices.add(action['service']);
    }

    return uniqueServices.toList();
  }

  @override
  Widget build(BuildContext context) {
    Color cardColor = widget.area.isActive
        ? _getServiceColor(widget.area.trigger['service'])
        : Colors.grey;
    HSLColor hslColor = HSLColor.fromColor(cardColor);
    HSLColor hslDarkerColor =
        hslColor.withLightness((hslColor.lightness - 0.3).clamp(0.0, 3.0));
    Color darkerCardColor = hslDarkerColor.toColor();
    List<String> services = _getUniqueServices();
    double logoWidth = 40.0;
    double rectangleWidth = (services.length * logoWidth) + 65;

    return Container(
      width: MediaQuery.of(context).size.width * 0.8,
      margin: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Stack(
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(height: 80),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text(
                    widget.area.description,
                    style: TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                SizedBox(height: 30),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      child: CustomSwitch(
                        value: widget.area.isActive,
                        onChanged: (bool value) {
                          _toggleActivation();
                        },
                        backgroundColor: cardColor,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.delete, color: Colors.white),
                      onPressed: () {
                        _showDeleteConfirmation(context);
                      },
                    ),
                  ],
                ),
                SizedBox(height: 10),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.all(23.0),
            child: Container(
              width: rectangleWidth,
              height: 50,
              decoration: BoxDecoration(
                color: darkerCardColor,
                borderRadius: BorderRadius.circular(25),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: services.map((serviceName) {
                  String logoAssetName = 'assets/servicesLogo/$serviceName.png';
                  return Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10.0),
                    child: Image.asset(
                      logoAssetName,
                      width: 35,
                      height: 35,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
