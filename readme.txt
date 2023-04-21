Installation Guide



Virtual Machine Environment:
The application runs on a virtual machine based on the Lubuntu 20.4.1 LTS virtual machine image. The VM image should be imported and run using VirtualBox 6.1.22.
________________________________________________________________________________________________________________________________________

Requirements:
Lubuntu 20.4.1 LTS virtual machine image
VirtualBox 6.1.22
Docker
Node.js v19.7.0
npm 9.5.0
SetUp.zip file


The following steps cover all the installation procedures and how to run the app.
________________________________________________________________________________________________________________________________________

How to install and run: 

1. Download the SetUP.zip via path: https://github.com/unsw-cse-comp3900-9900-23T1/capstone-project-3900w12aunsoftware/blob/main/SetUP.zip


2. Unzip the SetUP.zip as a folder named Setup and place it on the desktop location


3. Open the terminal in VM
ctrl + alt + T

4. cd to the directory of Setup folder using cd Desktop/Setup and perform certain actions, when chmod the  required password for lubuntu is: lubuntu
cd Desktop/Setup
sudo chmod 777 ./install.sh
./install.sh

Sometimes it needs to Press Y to continue like this (we encountered it 4 time in total.)


5. After the installation completes,  switch to docker group by enter command 
 newgrp - docker

6. Then go to `Setup` Folder via cd Desktop/Setup and enter command docker-compose up -d to startup all Backend application.
cd Desktop/Setup
docker-compose up -d

Note if the downloading process get stuck halfway through, we can close the current terminal and restart from Step 5.



After these steps, the project backend is running. We can check it by visiting http://localhost:9900
A text message “UNSoftWare BackEND”is diaplayed.

________________________________________________________________________________________________________________________________________

To Run The Front End

7. Once we have the backend and database up and running, we can run the frontend simply by:
typing: https://localhost:3000
to visit the website, visit https://localhost:3000/welcome to see the welcome page and start our exploration from there.

Please make the browser window full screen to enjoy the ultimate movie finding experience on CinemaScope!




