# AREA

## Table of Contents 📑

- [Overview of AREA](#overview-of-area)
- [Documentation](#documentation-)
- [Technology Stack](#technology-stack-)
- [Libraries Used](#libraries-used-)
- [AREA Diagram](#area-diagram-)
- [Integrated External Services](#integrated-external-services)
- [Getting Started with AREA](#getting-started-with-area-)
- [Contributors](#contributors-)

<br>

## Overview of AREA 🔎

AREA (Action Reaction) is an automation platform designed to automate interactions between various services. Inspired by platforms like IFTTT (If This Then That) and Zapier, AREA aims to provide users with a means to automate repetitive tasks.

### Main Objectives:

- Provide an intuitive user interface for creating and managing automations.
- Integrate a variety of popular services and enable seamless interactions between them.

### Key Features:

- Automation Creation: Users can create automations by linking an action from one service to a reaction from another service.
- User Management: Users can register, log in, and manage their profiles.
- Service Management: Users can connect and manage different services to their AREA account.

### General Architecture:

- Server: The heart of AREA, managing users, services, and automations.
- Web Client: A web interface for users to interact with the platform.
- Mobile Client: A mobile application for interaction on mobile devices.
- Database: Stores user data, service configurations, and automations.

<br>

## Documentation 📖

Below you'll find links to detailed documentation for the AREA project, including technical information, user guides, and system diagrams.

- **Technical Documentation**: Detailed information on the system architecture, libraries used, and API references.  
🔗 [Read the Technical Documentation](https://www.canva.com/design/DAFwICz4VGY/VmUUTWtZ4N9dbpc8okFW3w/edit?utm_content=DAFwICz4VGY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) 🔗

- **User Guide**: Instructions on how to use the AREA platform, set up triggers and actions, and integrate services.  
🔗 [Read the User Guide](https://www.canva.com/design/DAFwIbsQJVE/1CG-esl8EwN7hWhHDWXmHQ/edit?utm_content=DAFwIbsQJVE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) 🔗

- **System Diagram**: Visual representation of the AREA system components and their interactions.  
🔗 [View the AREA Diagram](https://drive.google.com/file/d/1JO7P4ckywCi8hnC5euNMw6AVnJKtVCMT/view?usp=drive_link) 🔗

<br>

## Technology Stack 💻

<p align="center">
    <img src="https://skillicons.dev/icons?i=mongodb,nodejs,flutter,dart,androidstudio,react,ts,css,aws,githubactions" />
</p>

This section describes the key technologies used for building and deploying AREA, covering the database, server, mobile, and web clients, as well as the containerization environment.

<br>

<p align="center">
    <img src="https://skillicons.dev/icons?i=mongodb" />
</p>

### Database:

- MongoDB: A NoSQL database chosen for its flexibility and ability to handle structured and unstructured data (stores data in BSON documents).
- Mongo Compass: Used for a visual representation and easy interaction with the MongoDB database.

<br>

<p align="center">
    <img src="https://skillicons.dev/icons?i=nodejs" />
</p>

### Server:

- Node.js: Server-side JavaScript execution environment, chosen for its rich library ecosystem.

<br>

<p align="center">
    <img src="https://skillicons.dev/icons?i=flutter,dart,androidstudio" />
</p>

### Mobile Client:

- Flutter: Google's mobile development SDK, enabling the creation of high-quality native applications for iOS and Android from a single codebase.

<br>

<p align="center">
    <img src="https://skillicons.dev/icons?i=react,ts,css" />
</p>

### Web Client:

- React: JavaScript library for building user interfaces, chosen for its modularity.

<br>

<p align="center">
    <img src="https://skillicons.dev/icons?i=docker" />
</p>

### Containerization and Deployment:

- Docker: Used to containerize the application and ensure consistent deployment environments.
- Docker Compose: Used to define and run multi-container Docker applications.

<br>

<p align="center">
  <img src="https://skillicons.dev/icons?i=aws" />
</p>

### Cloud and Infrastructure Services:

- AWS (Amazon Web Services):
  - EC2 (Elastic Compute Cloud): For hosting the application servers with an EC2 instance.
  - Route 53: For domain name management, using AWS for the DNS system.
  - Elastic Load Balancing: For efficiently distributing incoming traffic and for high availability.
  - VPC (Virtual Private Cloud): Configuring an isolated network within AWS, allowing control over AREA's network environment.
  - Network Interfaces: For configuring network interfaces associated with EC2 instances.
  - ARN (Amazon Resource Name): A unique identifier assigned to the Load Balancer in AWS.
 
<br>

## Libraries Used 📚

For a comprehensive list of all libraries and dependencies utilized in this project, as well as their versions and purposes, please refer to our detailed technical documentation. The documentation provides in-depth insights into how each library contributes to the functionality of AREA and ensures that all components work seamlessly together.

🔗 [Read the full technical documentation for libraries details](https://www.canva.com/design/DAFwICz4VGY/VmUUTWtZ4N9dbpc8okFW3w/edit?utm_content=DAFwICz4VGY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton).

<br>

## AREA Diagram 📈

<div style="text-align: right;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Diagrams.net_Logo.svg/800px-Diagrams.net_Logo.svg.png" alt="Draw.io Logo" width="60" style="display: block; margin: auto;">
</div>

🔗 [View AREA Diagram](https://drive.google.com/file/d/1JO7P4ckywCi8hnC5euNMw6AVnJKtVCMT/view?usp=drive_link).

<br>

## Integrated External Services

<div style="text-align: right;">
  <img src="https://openweathermap.org/themes/openweathermap/assets/img/mobile_app/android-app-top-banner.png" alt="OpenWeather Logo" width="60">
  <img src="https://t3.ftcdn.net/jpg/05/29/73/96/360_F_529739662_yRW6APsQg3PaJGQ6afQL8hDdod0OR1re.jpg" alt="dateTime logo" width="60">
  <img src="https://camo.githubusercontent.com/8b52e302122a31c683c4a9cf8e71d29cc8aba3ebb6a5ac7ae7818b5b14ba1c15/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f676f6f676c652e737667" alt="Google Logo" width="60"">
  <img src="https://camo.githubusercontent.com/4a3dd8d10a27c272fd04b2ce8ed1a130606f95ea6a76b5e19ce8b642faa18c27/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f676d61696c2e737667" alt="Gmail Logo" width="60">
  <img src="https://camo.githubusercontent.com/d54e97f5edde790381f7e62b217410df33e066a0dc8f692f2fc6b25fc1768b0c/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f796f75747562652e737667" alt="YouTube Logo" width="60">
  <img src="https://camo.githubusercontent.com/dfd07c1182528521769ef6260a2cb26abd3bc107b1089da677984ed9ad88db76/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f64726f70626f782e737667" alt="Dropbox Logo" width="60">
  <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub Logo" width="60">
  <img src="https://camo.githubusercontent.com/15d4e1b8bf3ed25b7131cc93f248f86cc42deaf9e19fdb61aa1ba3b46e0400a5/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f73706f746966792e737667" alt="Spotify Logo" width="60">
  <img src="https://camo.githubusercontent.com/c5942c39052ad962364ea8286a6991f7a9b036bf1d96d20db346d9dfd844dfa4/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f7477697463682e737667" alt="Twitch Logo" width="60">
</div>

<br>

These external services are integrated into AREA, allowing users to link their accounts from these platforms with their AREA profile, thus facilitating the automation of interactions between various services.

To enhance this experience, AREA employs the concept of "ingredients." 
Ingredients are key data snippets extracted from triggers, automatically identified to simplify the creation of actions. Ingredients might include device names, trigger times, or other service-specific data. Look for the flask icon to use them in action setups, adding a layer of customization to your automation flows.

<br>

For complete details of each service trigger, actions and ingredients read the full technical documentation:

🔗 [AREA Technical Documentation](https://www.canva.com/design/DAFwICz4VGY/VmUUTWtZ4N9dbpc8okFW3w/edit?utm_content=DAFwICz4VGY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton).

<br>

## Starting AREA 🚀

### Local Setup:
1. Ensure Docker and Docker Compose are installed on your local machine.
2. Clone the AREA project repository.
3. **Environment Configuration:**
   - Navigate to the server directory.
   - Create a `.env` file with the necessary environment variables for your setup.
4. Navigate to the project root directory in your terminal.
5. Run `docker-compose build` to construct the required Docker images.
6. Start the services with `docker-compose up`.
7. Verify the services:
   - AREA Server: `http://localhost:8080`
   - AREA Web Client: `http://localhost:8081`

### AWS Setup:
1. Connect to your AWS EC2 instance via SSH.
2. **Environment Configuration:**
   - Navigate to the server directory.
   - Create a `.env` file with the necessary environment variables for your setup.
3. If you have made changes to the code or if it's the first setup, run `docker-compose build`.
4. Start the services with `docker-compose up -d` to run them in the background.
5. Verify the services:
   - AREA Server: Access `https://api.techparisarea.com` to ensure the server is up and running.
   - AREA Web Client: Access `https://techparisarea.com` to ensure the web client is operational.
6. Ensure proper ports are opened in your EC2 security group and services are configured to use HTTPS with the correct SSL certificates for encryption.

<br>

## Contributors 👥

- ADELE DE PREMONVILLE
- NOAH LE VEVE
- LUCAS HOLCZINGER
- HUGO PATTEIN
- LOUIS CHAMBON
