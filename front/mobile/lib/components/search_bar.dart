import 'package:flutter/material.dart';

class MySearchBar extends StatelessWidget {
  const MySearchBar({super.key, required this.onChanged});
  final Function(String) onChanged;

  @override
  Widget build(BuildContext context) {
    return  TextField(
                onChanged: onChanged,
                style: const TextStyle(
                  color: Color(0xFFC1C1C1),
                  fontFamily: 'Archivo',
                  fontSize: 25,
                  fontWeight: FontWeight.w400,
                ),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF282828),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                    borderSide: BorderSide.none,
                  ),
                  hintText: 'Search',
                  hintStyle: const TextStyle(
                    color: Color(0xFFC1C1C1),
                    fontFamily: 'Archivo',
                    fontSize: 25,
                  ),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFFC1C1C1)),
                ),
              );
  }
}