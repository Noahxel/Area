import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import './login_screen.dart';
import './change_mail_page.dart';
import './change_password_page.dart';
import '../components/my_button.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({Key? key}) : super(key: key);

  @override
  AccountPageState createState() => AccountPageState();
}

class AccountPageState extends State<AccountPage> {
  String? _username;

  @override
  void initState() {
    super.initState();
    _loadProfileFromAPI();
  }

  void navigateToChangeMail() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ChangeMailPage()),
    );
  }

  void navigateToChangePassword() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ChangePasswordPage()),
    );
  }

  void navigateToLogin() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  Future<void> _loadProfileFromAPI() async {
    const String url = 'https://api.techparisarea.com/profile';

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token == null) {
      navigateToLogin();
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
      });
    } else {
      print('Error fetching profile: ${response.statusCode}');
    }
  }

  _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    navigateToLogin();
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> deleteUser() async {
    const String url = 'https://api.techparisarea.com/users/delete';

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token == null) {
      navigateToLogin();
      return;
    }

    final response = await http.delete(Uri.parse(url), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      print("User deleted");
      navigateToLogin();
    } else {
      print('Server Error');
      _showErrorSnackbar("Error during deleting user");
    }
  }

  Future<void> _showDeleteConfirmation() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm Deletion'),
          content: const Text('Are you sure you want to delete your account?'),
          actions: <Widget>[
            TextButton(
              child: const Text('No'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Yes'),
              onPressed: () async {
                Navigator.of(context).pop();
                await deleteUser();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 20.0,
        ),
        
        child: Center(
          child: Column(
            
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 80),
            Text(
              'Welcome,',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 46,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              '$_username !',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 30,
              ),
            ),
              const SizedBox(height: 80),
              MyButton(
                onPressed: navigateToChangeMail,
                label: 'Change Email',
                fontSize: 24,
              ),
              const SizedBox(height: 30),
              MyButton(
                onPressed: navigateToChangePassword,
                label: 'Change Password',
                fontSize: 24,
              ),
              const SizedBox(height: 30),
              MyButton(
                onPressed: _showDeleteConfirmation,
                label: 'Delete User',
                color: Colors.orange,
                fontSize: 24,
              ),
              const SizedBox(height: 90),
              MyButton(
                onPressed: _logout,
                label: 'Logout',
                color: Colors.red,
                fontSize: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
