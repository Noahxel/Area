import 'package:flutter/material.dart';
import 'dart:async';

class CustomSwitch extends StatefulWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  final Color backgroundColor;

  CustomSwitch({
    required this.value,
    required this.onChanged,
    required this.backgroundColor,
  });

  @override
  _CustomSwitchState createState() => _CustomSwitchState();
}

class _CustomSwitchState extends State<CustomSwitch> {
  bool _value = false;
  double _opacity = 1.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _value = widget.value;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _handleTap() {
    setState(() {
      _opacity = 0.0;
    });

    _timer = Timer(Duration(milliseconds: 70), () {
      setState(() {
        _value = !_value;
        _opacity = 1.0;
      });
    });

    widget.onChanged(!_value);
  }

  @override
  Widget build(BuildContext context) {
    Color thumbColor;
    Color trackColor;
    String text;
    double thumbRadius = 15;

    thumbColor = widget.backgroundColor;
    HSLColor hslColor = HSLColor.fromColor(widget.backgroundColor);

    if (_value) {
      text = "Connected";
      if (hslColor.lightness < 0.2) {
        trackColor = Color.fromARGB(255, 73, 73, 73);
      } else {
        HSLColor hslDarkerColor =
            hslColor.withLightness((hslColor.lightness - 0.1).clamp(0.0, 1.0));
        trackColor = hslDarkerColor.toColor();
      }
    } else {
      thumbColor = Colors.grey;
      HSLColor hslDarkerColor =
          hslColor.withLightness((hslColor.lightness - 0.1).clamp(0.0, 1.0));
      trackColor = hslDarkerColor.toColor();
      text = "Connect";
    }

    return GestureDetector(
      onTap: _handleTap,
      child: Container(
        width: MediaQuery.of(context).size.width * 0.40,
        height: 40,
        decoration: BoxDecoration(
          color: trackColor,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Stack(
          children: [
            AnimatedAlign(
              alignment: _value
                  ? Alignment(
                      0.92, 0)
                  : Alignment(-0.92,
                      0),
              duration: Duration(milliseconds: 350),
              curve: Curves.easeInOut,
              child: Container(
                width: thumbRadius * 2,
                height: thumbRadius * 2,
                decoration: BoxDecoration(
                  color: thumbColor,
                  borderRadius: BorderRadius.circular(thumbRadius),
                ),
              ),
            ),
            Positioned(
              left: _value ? 0 : thumbRadius * 2,
              right: _value ? thumbRadius * 2 : 0,
              top: 0,
              bottom: 0,
              child: AnimatedOpacity(
                opacity: _opacity,
                duration: Duration(milliseconds: 70),
                child: Center(
                  child: Text(
                    text,
                    style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.w800),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
