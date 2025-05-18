import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:webview_flutter/webview_flutter.dart';
import '../main_container.dart';
import 'register_screen.dart';
import 'reset_password_screen.dart';
import '../components/my_button.dart';
import '../components/my_input.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String? errorMessage;

  void navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const MainContainer()),
    );
  }

  void continueWithGoogle() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const LoginWebView()),
    );
  }

  Future<void> login() async {
    const String url = 'https://api.techparisarea.com/auth/sign-in';
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode({
        "email": emailController.text,
        "password": passwordController.text,
      }),
    );

    print('Status Code: ${response.statusCode}');
    print('Response Body: ${response.body}');

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final token = data['token'];
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      navigateToHome();
    } else if (response.statusCode == 400) {
      setState(() {
        errorMessage =
            'Please verify your mail is verified and your password and email are corrects.';
      });
    } else {
      setState(() {
        errorMessage = 'Invalid email or password';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D1D1D),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const SizedBox(height: 40),
            Center(
              child: Image.asset('assets/logo_areas.png'),
            ),
            const SizedBox(height: 60),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 35.0),
                        child: Text(
                          "Login",
                          style: const TextStyle(
                            fontSize: 45,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Expanded(child: Container()),
                    ],
                  ),
                  const SizedBox(height: 20),
                  MyInput(
                    hint: "Username",
                    controller: emailController,
                  ),
                  const SizedBox(height: 20),
                  MyInput(
                    hint: "Password",
                    obscureText: true,
                    controller: passwordController,
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  const ResetPasswordScreen()),
                        );
                      },
                      child: const Padding(
                        padding: EdgeInsets.only(right: 23.0),
                        child: Text(
                          "Forgot Password?",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ),
                  ),
                  if (errorMessage != null)
                    Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 35),
                  Padding(
                    padding: const EdgeInsets.only(top: 24),
                    child: MyButton(
                      onPressed: login,
                      fontSize: 30,
                    ),
                  ),
                  const SizedBox(height: 20),
                  RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      style: const TextStyle(
                        color: Color(0xFF8E949A),
                        fontFamily: 'Cabin',
                        fontSize: 18,
                        fontWeight: FontWeight.w400,
                        height: 1.465,
                      ),
                      children: [
                        const TextSpan(text: "Don't have an account? "),
                        WidgetSpan(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const RegisterScreen()),
                              );
                            },
                            child: const Text(
                              "Sign up",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    "Or continue with",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF8E949A),
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onTap: continueWithGoogle,
                    child: Center(
                      child: Image.asset(
                        'assets/logo_google.png',
                        width: 50,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LoginWebView extends StatefulWidget {
  const LoginWebView({Key? key}) : super(key: key);

  @override
  LoginWebViewState createState() => LoginWebViewState();
}

class LoginWebViewState extends State<LoginWebView> {
  final String url = "https://api.techparisarea.com/auth/google";
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController();
    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    _controller.setUserAgent("random");
    _controller.setNavigationDelegate(
      NavigationDelegate(
        onNavigationRequest: (NavigationRequest request) async {
          print(request.url);
          if (request.url
              .startsWith('https://techparisarea.com/applets?token=')) {
            Uri uri = Uri.parse(request.url);
            String? token = uri.queryParameters['token'];
            if (token != null) {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.setString('token', token);
              Navigator.pop(context);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const MainContainer()),
              );
            }
          }
          return NavigationDecision.navigate;
        },
      ),
    );

    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);

    _controller.loadRequest(Uri.parse(url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login with Google'),
        backgroundColor: const Color(0xFF1D1D1D),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
