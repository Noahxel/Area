import 'package:flutter/material.dart';
import '../services/service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'oauth_service.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'list_triggers.dart';
import 'list_actions.dart';

String capitalize(String input) {
  if (input.isEmpty) {
    return input;
  }
  return input[0].toUpperCase() + input.substring(1);
}

class ConnectServiceView extends StatefulWidget {
  final Service service;
  final String sourceType;

  const ConnectServiceView({
    Key? key,
    required this.service,
    required this.sourceType,
  }) : super(key: key);

  @override
  _ConnectServiceViewState createState() => _ConnectServiceViewState();
}

class _ConnectServiceViewState extends State<ConnectServiceView> {
  late final WebViewController _controller = WebViewController();

  Future<void> connectService(String serviceName) async {
    final String url =
        'https://api.techparisarea.com/connect/get${Uri.encodeComponent(serviceName)}OAuthConstants';

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token == null) {
      print("No token found");
      return;
    }

    try {
      final response = await http.get(Uri.parse(url), headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final String clientId = data['clientId'];
        final String redirectUri = data['redirectUri'];
        final List<String> scopes = List<String>.from(data['scopes']);
        final String oAuthSessionId = data['oAuthSessionId'];

        String authorizationUrl = buildAuthorizationUrl(
          serviceName: serviceName,
          clientId: clientId,
          redirectUri: redirectUri,
          scopes: scopes,
          oAuthSessionId: oAuthSessionId,
        );

        print('Opening URL : $authorizationUrl');
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) {
              _controller.loadRequest(Uri.parse(authorizationUrl));
              _controller.setJavaScriptMode(JavaScriptMode.unrestricted);

              return WebViewScreen(
                  service: widget.service,
                  controller: _controller,
                  sourceType: widget.sourceType);
            },
          ),
        );
      } else {
        print('Request failed with status code : ${response.statusCode}.');
      }
    } catch (e) {
      print('Error occurred: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    Color backgroundColor =
        Color(int.parse('0xFF${widget.service.color.substring(1)}'));
    HSLColor hslColor = HSLColor.fromColor(backgroundColor);
    HSLColor hslDarkerColor =
        hslColor.withLightness((hslColor.lightness - 0.1).clamp(0.0, 1.0));
    Color darkerBackgroundColor = hslDarkerColor.toColor();
    String serviceName = capitalize(widget.service.name);
    String logoAssetName = 'assets/servicesLogo/${widget.service.name}.png';

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: 20),
              Text(
                'Connect the service',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Archivo',
                ),
                textAlign: TextAlign.center,
              ),
              Flexible(
                flex: 1,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Image.asset(logoAssetName, height: 64, width: 64),
                    SizedBox(height: 20),
                    Text(
                      'Connect to $serviceName to continue',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 35,
                        fontFamily: 'Archivo',
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 160),
                  ],
                ),
              ),
              Flexible(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 10),
                    TextButton(
                      style: TextButton.styleFrom(
                        backgroundColor: darkerBackgroundColor,
                        padding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 80),
                        textStyle: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Archivo',
                        ),
                        primary: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                      ),
                      onPressed: () {
                        connectService(widget.service.name);
                      },
                      child: Text('Connect'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  final Service service;
  final WebViewController controller;
  final String sourceType;

  WebViewScreen(
      {required this.service,
      required this.controller,
      required this.sourceType});

  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    _controller = widget.controller;
    _controller.setUserAgent("random");
    _controller.setNavigationDelegate(
      NavigationDelegate(
        onPageFinished: (String url) {
          if (url.startsWith("https://techparisarea.com")) {
            Navigator.of(context).pop();
            if (widget.sourceType == "triggers") {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ListTriggersView(
                    selectedService: widget.service,
                  ),
                ),
              );
            } else if ((widget.sourceType == "actions")) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ListActionsView(
                    selectedService: widget.service,
                  ),
                ),
              );
            }
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connect'),
        backgroundColor: const Color(0xFF1D1D1D),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
