import 'package:flutter/material.dart';

class MyInput extends StatefulWidget {
  final String hint;
  final bool obscureText;
  final TextEditingController? controller;
  final TextInputType keyboardType;

  const MyInput({
    required this.hint,
    this.obscureText = false,
    this.controller,
    this.keyboardType = TextInputType.text,
    Key? key,
  }) : super(key: key);

  @override
  MyInputState createState() => MyInputState();
}

class MyInputState extends State<MyInput> {
  bool _passwordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 316,
      height: 63,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        controller: widget.controller,
        obscureText: widget.obscureText && !_passwordVisible,
        keyboardType: widget.keyboardType,
        decoration: InputDecoration(
          hintText: widget.hint,
          hintStyle: const TextStyle(
            color: Color(0xFFA4A9AE),
            fontFamily: 'Archivo',
            fontSize: 16,
            fontWeight: FontWeight.w400,
            height: 23.44 / 16,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: BorderSide.none,
          ),
          suffixIcon: widget.obscureText
              ? IconButton(
                  icon: Icon(
                    _passwordVisible ? Icons.visibility : Icons.visibility_off,
                    color: const Color(0xFFA4A9AE),
                  ),
                  onPressed: () {
                    setState(() {
                      _passwordVisible = !_passwordVisible;
                    });
                  },
                )
              : null,
        ),
      ),
    );
  }
}
