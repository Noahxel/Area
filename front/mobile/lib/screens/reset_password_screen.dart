import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../components/my_input.dart';
import '../components/my_button.dart';
import 'login_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({Key? key}) : super(key: key);

  @override
  ResetPasswordScreenState createState() => ResetPasswordScreenState();
}

class ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final TextEditingController emailController = TextEditingController();
  String? errorMessage;

  void navigateToLogin() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  Future<void> resetPassword() async {
    const String url =
        'https://api.techparisarea.com/reset/request-password-reset';
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode({
        "email": emailController.text,
      }),
    );

    if (response.statusCode == 200) {
      setState(() {
        errorMessage = 'Reset link email sent. Please check your email.';
      });
    } else {
      final Map<String, dynamic> data = json.decode(response.body);
      setState(() {
        errorMessage = data['message'];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: navigateToLogin,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const SizedBox(height: 10),
            Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const Align(
                  alignment: Alignment.center,
                  child: Text(
                    "Reset Password",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30.0,
                      fontWeight: FontWeight.w800,
                      fontFamily: 'Archivo',
                      height: 1.465,
                    ),
                  ),
                ),
                const SizedBox(height: 200),
                MyInput(
                  hint: "Email",
                  controller: emailController,
                ),
                if (errorMessage != null)
                  Text(
                    errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),
                const SizedBox(height: 50),
                Padding(
                  padding: const EdgeInsets.only(top: 24),
                  child: MyButton(
                    onPressed: resetPassword,
                    label: 'Send Reset Link',
                    fontSize: 26,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
