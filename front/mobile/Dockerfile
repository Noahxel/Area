FROM instrumentisto/flutter

USER root

RUN flutter --version

RUN mkdir /apk

WORKDIR /app/mobileapp

COPY ./ ./

RUN flutter --version

RUN flutter pub get

RUN flutter build apk --release

RUN mv build/app/outputs/apk/release/app-release.apk /apk/
