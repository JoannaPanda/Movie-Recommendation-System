Installation Guide

see the pdf version with helpful screenshots for user installation via this link :



Virtual Machine Environment:
The application runs on a virtual machine based on the Lubuntu 20.4.1 LTS virtual machine image. The VM image should be imported and run using VirtualBox 6.1.22.
________________________________________________________________________________________________________________________________________

Requirements:
Lubuntu 20.4.1 LTS virtual machine image
VirtualBox 6.1.22
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

7. Once we have the backend and database up and running, we can proceed with front end installations. We need to install npm first. The command is:
sudo apt install npm

8. We can check node js is installed by getting the current node js version:
node -v

9. To run the react app, we need to update the node version to v19.7.0 (if node.js is already installed. remove it first by using command: sudo apt remove nodejs)


To update node.js to the required version (v19.7.0), run the following command:

curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -

sudo apt-get install -y nodejs

node -v

Now the node and npm versions should be as allowing. 


10. Create app

To create the frontend react app, use the following commands:

sudo npm install -g create-react-app

create-react-app my-app

11. Open the folder of the newly created app “my-app”, go to the my-app/src folder and remove the original Components and Styles folders (if these exists), as well as App.js, and App.css.

From our Setup folder, go to FrontEnd/src, copy the components, styles, newReview, images,and CommentImage folders, and app.js, app.css files. A total of 5 folders and 2 files should be copied.

Then we paste these to my-app/src.


12. Go into the my-app directory in the terminal
cd my-app


13. import the required packages through terminal in one single command:
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react d3 react-toastify react-confetti @ramonak/react-progress-bar axios react-router-dom json-bigint react-slick slick-carousel validator


14. Start the app, now the frontend should be running on localhost 3000. The command is:
npm start

Please make the browser window full screen to enjoy the ultimate movie finding experience on CinemaScope!




