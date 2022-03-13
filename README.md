## Backend part is implemented using NodeJS and Express.

served on `localhost:3000` you can change host and port on `config/config.js`
### Requirements to build & deploy backend
 - node 
   - v16.14.0


### HOW TO INSTALL
#### Steps
1- Install NodeJS(version 14)to your computer

link: https://nodejs.org/en/download/

2- Be sure node application is install 

`node -v` should print 14.16 sth.

2- Go to root directory and install dependencies using this command

`npm install`

3- install test coverage tools c8.

`npm install c8 -g`

3- To check Test coverage

`c8 npm run test`

4- build&run  serving on `localhost:3000`

`npm start`