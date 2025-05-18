const Map<String, String> servicesAuthorize = {
  'spotify': 'https://accounts.spotify.com/authorize',
  'youtube': 'https://accounts.google.com/o/oauth2/v2/auth',
  'gmail': 'https://accounts.google.com/o/oauth2/v2/auth',
  'github': 'https://github.com/login/oauth/authorize',
  'twitch': 'https://id.twitch.tv/oauth2/authorize',
  'dropbox': 'https://www.dropbox.com/oauth2/authorize',
};

String? getServiceAuthorizeByName(String key) {
  return servicesAuthorize[key];
}

String buildAuthorizationUrl({
  required String serviceName,
  required String clientId,
  required String redirectUri,
  required List<String> scopes,
  required String oAuthSessionId,
  String? accessType,
  String? prompt,
}) {
  final String? baseUrl = getServiceAuthorizeByName(serviceName);

  if (baseUrl == null) {
    throw Exception('Service not supported');
  }

  Uri uri = Uri.parse(baseUrl);
  Map<String, dynamic> queryParams = {
    'client_id': clientId,
    'redirect_uri': redirectUri,
    'scope': scopes.join(' '),
    'response_type': 'code',
    'state': oAuthSessionId,
  };

  if (accessType != null) {
    queryParams['access_type'] = accessType;
  }

  if (prompt != null) {
    queryParams['prompt'] = prompt;
  }

  uri = uri.replace(queryParameters: queryParams);

  return uri.toString();
}
