import 'package:flutter/material.dart';
import '../components/my_input.dart';
import '../components/my_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ChangeMailPage extends StatefulWidget {
  const ChangeMailPage({super.key});

  @override
  ChangeMailPageState createState() => ChangeMailPageState();
}

class ChangeMailPageState extends State<ChangeMailPage> {
  final TextEditingController oldEmailController = TextEditingController();
  final TextEditingController newEmailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String? _username;
  String? _email;
  bool _emailSent = false;

  @override
  void initState() {
    super.initState();
    _loadProfileFromAPI();
  }

  Future<void> _loadProfileFromAPI() async {
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
      setState(() {
        _username = data['username'];
        _email = data['email'];
      });
    } else {
      print('Error fetching profile: ${response.statusCode}');
    }
  }

  void _navigateToHome() {
    Navigator.of(context).pop();
  }

  Future<void> updateEmail() async {
    if (_email != oldEmailController.text) {
      const snackBar = SnackBar(content: Text('Old email incorrect'));
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('token');

    if (token == null) {
      print("No token found");
      return;
    }

    final Uri url = Uri.parse('https://api.techparisarea.com/profile/update');

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        "email": newEmailController.text,
        "username": _username ?? "user",
        "oldPassword": passwordController.text,
        "newPassword": passwordController.text,
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      print(data['message']);
      setState(() {
        _emailSent = true;
      });
    } else {
      print("Error updating email: ${response.body}");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 20.0),
      child: Scaffold(
        backgroundColor: const Color(0xFF1D1D1D),
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: _navigateToHome,
          ),
          title: const Text(
            'Change your email',
            style: TextStyle(
              fontSize: 25,
              fontFamily: 'Archivo',
              color: Colors.white,
            ),
          ),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              MyInput(
                controller: oldEmailController,
                hint: 'Old email',
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 30),
              MyInput(
                controller: newEmailController,
                hint: 'New email',
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 30),
              MyInput(
                controller: passwordController,
                hint: 'Password',
                obscureText: true,
              ),
              const SizedBox(height: 80),
              MyButton(
                onPressed: updateEmail,
                label: 'Confirm',
                fontSize: 24,
              ),
              if (_emailSent)
                const Padding(
                  padding: EdgeInsets.only(top: 20.0),
                  child: Text(
                    'Email sent.',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
