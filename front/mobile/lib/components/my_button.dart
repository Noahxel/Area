import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String label;
  final Color color;
  final double fontSize;

  const MyButton({required this.onPressed, this.label = 'Login', this.color = const Color(0xFF1D1D1D), Key? key, required this.fontSize}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: color,
        backgroundColor: Colors.white,
        elevation: 0,
        fixedSize: const Size(316, 63),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      child: Text(label, style: TextStyle(fontSize: fontSize)),
    );
  }
}
