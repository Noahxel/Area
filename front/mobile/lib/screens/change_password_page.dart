import 'package:flutter/material.dart';
import '../components/my_input.dart';
import '../components/my_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  ChangePasswordPageState createState() => ChangePasswordPageState();
}

class ChangePasswordPageState extends State<ChangePasswordPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController oldPasswordController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  bool _passwordChanged = false;
  String? _username;
  String? _email;

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

  Future<void> updatePassword() async {
    if (_email != emailController.text) {
      const snackBar =
          SnackBar(content: Text('The provided email is incorrect'));
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
        "username": _username,
        "email": emailController.text,
        "oldPassword": oldPasswordController.text,
        "newPassword": newPasswordController.text,
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      print(data['message']);
      setState(() {
        _passwordChanged = true;
      });
    } else {
      print("Error updating password: ${response.body}");
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
            'Change your password',
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
                controller: emailController,
                hint: 'Email',
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 30),
              MyInput(
                controller: oldPasswordController,
                hint: 'Old Password',
                obscureText: true,
              ),
              const SizedBox(height: 30),
              MyInput(
                controller: newPasswordController,
                hint: 'New Password',
                obscureText: true,
              ),
              const SizedBox(height: 80),
              MyButton(
                onPressed: updatePassword,
                label: 'Change Password',
                fontSize: 24,
              ),
              if (_passwordChanged)
                const Padding(
                  padding: EdgeInsets.only(top: 20.0),
                  child: Text(
                    'Password changed successfully.',
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
