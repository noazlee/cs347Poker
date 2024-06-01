# cs347Poker

Pocket Aces is the final project for the class CS 347 with Matthew Lepinski created by Ashok Khare, Batmend Batsaikhan, Carlos Flores, Noah Lee, Sho Tanaka and Wesley Yang. This large project uses a MERN Stack (MongoDB, Express.js, React.js, Node.js), Socket.io and is deployed using two Docker images - one for the frontend and one for the backend. The project currently has two collections in the Mongo database - Users and Games. The backend uses Node.js and Express.js and sends socket signals to the frontend - as well as REST API for non-gameplay connection between the backend and the frontend. The frontend uses react.js and css with the image credits below.

This application allows you to: create a poker game, join a game, play a poker game with/without AI, keep track of your wins and chip totals and game history. To add an IP address to play the game wirelessly with users on the same WIFI connection, add your IP address to the list of acceptable URLs in app.js (server) and socket.js (client).

To run this application: git clone this repository, then go to the root directory. Ensure that Docker Desktop is installed and running - then enter: docker compose build
followed by: docker compose up

The application should now be running on your local device.

Team Agreement: https://docs.google.com/document/d/1AP9mlET7MxQbqPdoJ10EmB-fCuxxBRmGgbX9t6ZO7cU/edit <br />
Planning slides: https://docs.google.com/presentation/d/1SALGtjrwbJJ-kLWbSkRuYY_1Gmg2yPrAszVYIfPdKmk/edit?usp=sharing <br />
Project Log: https://docs.google.com/document/d/11E76UkFGQZ_2gm35Ad9MUgOuUgT4LxQ9EmvUOkagFBE/edit?usp=sharing <br />

Image Credits:
Table Image, Blinds and Chip Icons - Aiden Johnson '27 <br />
Poker stock images - https://www.freepik.com/free-photo/overhead-view-red-dices-casino-chip-green-poker- table_2887007.htm#query=poker%20background&position=3&from_view=keyword&track=ais&uuid=b07ca1ea-2a07-4e0f-afe6-ce1e71cefc4a <br />
Font: CardFont
