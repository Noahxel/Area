import 'package:flutter/material.dart';
import '../services/services_with_triggers_view.dart';
import '../services/services_with_actions_view.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fluttertoast/fluttertoast.dart';

Future<String> getServiceColor(String serviceName) async {
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

    final service = servicesData.firstWhere(
      (service) => service['name'] == serviceName,
      orElse: () => null,
    );

    if (service != null) {
      return service['color'];
    } else {
      throw Exception('Service with the given name not found');
    }
  } else {
    throw Exception('Failed to load services');
  }
}

Future<String> createArea(
    Map<String, dynamic> trigger, List<Map<String, dynamic>> actions) async {
  final url = 'https://api.techparisarea.com/areas';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  final triggerCopy = Map<String, dynamic>.from(trigger);
  triggerCopy.remove('ingredients');

  final payload = {
    "trigger": triggerCopy,
    "actions": actions,
  };

  print("Sending JSON payload to server: ${json.encode(payload)}");

  final response = await http.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: json.encode(payload),
  );

  if (response.statusCode == 200) {
    print("AREA SUCCCESSFULLY CREATED !");
    print(response.body);
    return "Area created successfully!";
  } else {
    print(response.body);
    print(json.decode(response.body)['message']);
    throw Exception(json.decode(response.body)['message']);
  }
}

String formatTriggerName(String original) {
  return original
      .split('_')
      .map((str) => '${str[0].toUpperCase()}${str.substring(1)}')
      .join(' ');
}

class CreatePage extends StatefulWidget {
  const CreatePage({Key? key}) : super(key: key);

  @override
  _CreatePageState createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  late final AreaCreationState _areaState;
  int numberOfThenThatButtons = 1;
  String _serverMessage = '';
  Color _serverMessageColor = Colors.green;

  @override
  void initState() {
    super.initState();
    _areaState = Provider.of<AreaCreationState>(context, listen: false);
    numberOfThenThatButtons = _areaState.actions.length + 1;
  }


  void _navigateToSelectTrigger(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TriggersView()),
    );

    if (result != null && result is Map<String, dynamic>) {
      _areaState.setTrigger(result['triggerData']);
    }
  }

  void _navigateToSelectAction(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ActionsView()),
    );

    if (result != null && result is Map<String, dynamic>) {
      _areaState.addAction(result['actionData']);
      setState(() {
        numberOfThenThatButtons = _areaState.actions.length + 1;
      });
    }
  }

  Widget _buildContainer(String text, Color buttonColor, VoidCallback? onTap,
      [int? index]) {
    bool showAddButton = text != 'Then That' || (_areaState.trigger.isNotEmpty);
    bool showTrashButton = text == 'Then That' && index != null && index > 0;

    Widget textWidget = Text(
      text,
      style: TextStyle(
        fontFamily: 'Archivo',
        color: const Color(0xFF1D1D1D),
        fontSize: 35.0,
        fontWeight: FontWeight.bold,
      ),
      textAlign: TextAlign.center,
    );

    if (showTrashButton) {
      textWidget = Expanded(child: textWidget);
    }

    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth - 40;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: containerWidth,
        constraints: BoxConstraints(
          minHeight: 80,
        ),
        decoration: BoxDecoration(
          color: buttonColor,
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              textWidget,
              if (showAddButton) SizedBox(width: 20.0),
              if (showAddButton)
                ElevatedButton(
                  onPressed: onTap,
                  child: Text(
                    "Add",
                    style: TextStyle(
                      fontFamily: 'Archivo',
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    primary: const Color(0xFF1D1D1D),
                    onPrimary: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                  ),
                ),
              if (showTrashButton)
                Padding(
                  padding: const EdgeInsets.only(left: 10.0),
                  child: IconButton(
                    icon: Icon(
                      Icons.delete,
                      color: const Color(0xFF1D1D1D),
                    ),
                    onPressed: () {
                      setState(() {
                        numberOfThenThatButtons--;
                      });
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionContainer(
      Map<String, dynamic> action, String serviceName, int index) {
    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth - 40;

    return FutureBuilder<String>(
      future: getServiceColor(serviceName),
      builder: (BuildContext context, AsyncSnapshot<String> snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }

          final buttonColor =
              Color(int.parse('0xFF${snapshot.data!.substring(1)}'));
          final textColor =
              action.isEmpty ? const Color(0xFF1D1D1D) : Colors.white;
          String logoAssetName = 'assets/servicesLogo/$serviceName.png';

          return Padding(
            padding: const EdgeInsets.only(bottom: 10.0),
            child: GestureDetector(
              onTap: () => _navigateToSelectAction(context),
              child: Container(
                width: containerWidth,
                constraints: BoxConstraints(
                  minHeight: 80,
                ),
                decoration: BoxDecoration(
                  color: buttonColor,
                  borderRadius: BorderRadius.circular(15.0),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Padding(
                      padding: EdgeInsets.only(left: 30),
                      child: Text(
                        action.isEmpty ? 'Then That' : 'Then',
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: textColor,
                          fontSize: 35.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    SizedBox(width: 20),
                    if (!action.isEmpty)
                      Image.asset(
                        logoAssetName,
                        height: 40,
                        fit: BoxFit.cover,
                      ),
                    SizedBox(width: 20),
                    Expanded(
                      child: Text(
                        action.isEmpty ? '' : formatTriggerName(action['name']),
                        style: TextStyle(
                          fontFamily: 'Archivo',
                          color: textColor,
                          fontSize: 15.0,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ),
                    if (index > 0 || !action.isEmpty)
                      IconButton(
                        icon: Icon(
                          Icons.delete,
                          color: textColor,
                        ),
                        onPressed: () {
                          if (!action.isEmpty) {
                            int actionIndex =
                                _areaState.actions.indexOf(action);
                            _areaState.removeAction(actionIndex);
                            setState(() {
                              numberOfThenThatButtons =
                                  _areaState.actions.length + 1;
                            });
                          } else {
                            setState(() {
                              numberOfThenThatButtons--;
                            });
                          }
                        },
                      )
                  ],
                ),
              ),
            ),
          );
        } else {
          return CircularProgressIndicator();
        }
      },
    );
  }

  Widget _buildSelectedContainer(
    String text,
    String serviceName,
    double titleFontSize,
    FontWeight titleFontWeight,
    double itemFontSize,
    FontWeight itemFontWeight,
  ) {

    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth - 40;

    return FutureBuilder<String>(
      future: getServiceColor(serviceName),
      builder: (BuildContext context, AsyncSnapshot<String> snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }

          final buttonColor =
              Color(int.parse('0xFF${snapshot.data!.substring(1)}'));
          String logoAssetName = 'assets/servicesLogo/$serviceName.png';

          return GestureDetector(
            onTap: () {
              _areaState.clearArea();
            },
            child: Container(
              width: containerWidth,
              constraints: BoxConstraints(
                minHeight: 80,
              ),
              decoration: BoxDecoration(
                color: buttonColor,
                borderRadius: BorderRadius.circular(15.0),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding: EdgeInsets.only(left: 30),
                    child: Text(
                      text.split(' ').first,
                      style: TextStyle(
                        fontFamily: 'Archivo',
                        color: Colors.white,
                        fontSize: titleFontSize,
                        fontWeight: titleFontWeight,
                      ),
                    ),
                  ),
                  SizedBox(width: 20),
                  Image.asset(
                    logoAssetName,
                    height: 40,
                    fit: BoxFit.cover,
                  ),
                  SizedBox(width: 20),
                  Expanded(
                    child: Text(
                      formatTriggerName(text.split(' ').last),
                      style: TextStyle(
                        fontFamily: 'Archivo',
                        color: Colors.white,
                        fontSize: itemFontSize,
                        fontWeight: itemFontWeight,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.delete,
                      color: Colors.white,
                    ),
                    onPressed: () {
                      _areaState.clearArea();
                    },
                  ),
                ],
              ),
            ),
          );
        } else {
          return CircularProgressIndicator();
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Consumer<AreaCreationState>(
        builder: (context, areaState, child) {
          Color buttonColor = Colors.white;
          Color thenButtonColor =
              areaState.trigger.isEmpty ? Colors.grey : Colors.white;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 20.0, vertical: 50.0),
                  child: Center(
                    child: Text(
                      'Create',
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Archivo',
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 50.0),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_areaState.trigger.isEmpty)
                        Builder(
                          builder: (BuildContext context) {
                            if (numberOfThenThatButtons != 1) {
                              WidgetsBinding.instance
                                  .addPostFrameCallback((_) {
                                setState(() {
                                  numberOfThenThatButtons = 1;
                                });
                              });
                            }
                            return _buildContainer('If This', buttonColor,
                                () => _navigateToSelectTrigger(context));
                          },
                        )
                      else
                        _buildSelectedContainer(
                            "If   ${_areaState.trigger['name']}",
                            _areaState.trigger['service'],
                            35.0,
                            FontWeight.bold,
                            15.0,
                            FontWeight.normal),
                      SizedBox(height: 50),
                      for (int i = 0; i < numberOfThenThatButtons; i++)
                        if (i < _areaState.actions.length)
                          _buildActionContainer(_areaState.actions[i],
                              _areaState.actions[i]['service'], i)
                        else
                          _buildContainer(
                              'Then That',
                              thenButtonColor,
                              _areaState.trigger.isEmpty
                                  ? null
                                  : () => _navigateToSelectAction(context),
                              i),
                      if (_areaState.trigger.isNotEmpty &&
                          numberOfThenThatButtons == _areaState.actions.length)
                        Padding(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 140.0),
                          child: IconButton(
                            icon: Icon(Icons.add_circle_outline,
                                color: Colors.white, size: 40),
                            onPressed: () {
                              setState(() {
                                numberOfThenThatButtons += 1;
                              });
                            },
                          ),
                        ),
                      SizedBox(height: 30),
                    ],
                  ),
                ),
                if (areaState.trigger.isNotEmpty &&
                    areaState.actions.isNotEmpty) ...[
                  if (_serverMessage.isNotEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Text(
                          _serverMessage,
                          style: TextStyle(
                              color: _serverMessageColor, fontSize: 16),
                        ),
                      ),
                    ),
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16.0, vertical: 10.0),
                      child: ElevatedButton(
                        onPressed: () async {
                          try {
                            String message = await createArea(
                                areaState.trigger, areaState.actions);
                            setState(() {
                              _serverMessage = message;
                              _serverMessageColor = Colors.green;
                            });
                            Fluttertoast.showToast(
                              msg: message,
                              backgroundColor: Colors
                                  .green,
                              textColor: Colors
                                  .white,
                            );
                            areaState.clearArea();
                          } catch (e) {
                            setState(() {
                              _serverMessage = e.toString();
                              _serverMessageColor = Colors.red;
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          primary: Colors.white,
                          onPrimary: Color(0xFF1D1D1D),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                          padding: EdgeInsets.symmetric(
                              horizontal: 50, vertical: 16.0),
                        ),
                        child: Text("Create", style: TextStyle(fontSize: 18)),
                      ),
                    ),
                  ),
                  SizedBox(height: 30),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
