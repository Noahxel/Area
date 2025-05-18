import 'package:flutter/foundation.dart';
import 'area_model.dart';

class AreaCreationState extends ChangeNotifier {
  Map<String, dynamic> _trigger = {};
  List<Map<String, dynamic>> _actions = [];

  Map<String, dynamic> get trigger => _trigger;
  List<Map<String, dynamic>> get actions => _actions;

  void setTrigger(Map<String, dynamic> trigger) {
    _trigger = trigger;
    notifyListeners();
  }

  void addAction(Map<String, dynamic> action) {
    _actions.add(action);
    notifyListeners();
  }

  void removeAction(int index) {
    _actions.removeAt(index);
    notifyListeners();
  }

  void clearActions() {
    _actions = [];
    notifyListeners();
  }

  void clearTrigger() {
    _trigger = {};
    notifyListeners();
  }

  void clearArea() {
    clearActions();
    clearTrigger();
  }

  Area compileArea() {
    return Area(_trigger, _actions);
  }
}
