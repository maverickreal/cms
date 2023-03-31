# Contact_Management_System
### API documentation:
https://documenter.getpostman.com/view/15905495/2s93RTStJh
### Implemented:
- Dockerized containerization
- RESTful CRUD API
- Token based authentication
### An engineered backend web application, developed using:
- Node.js, Express.js
- MongoDB
- Jest.js, Postman
- docker, bash, git
- npm libraries
### Allows:
* User account creation, signing in, signing out, authentication.
* Create, fetch, update and remove contacts.
* Creating a user account, signin in to and out of it, retrieving user profile, etc.
### To use:
##### automated testing using Jest.js
You need to have a mongodb instance running and open to connection at 127.0.0.1:27017, i.e. on the default mongodb port on your local machine. Run:
```sh
npm install && npm run 
```
##### deploying/dockerizing/manual testing
You need to have docker installed and running on your system. Run:
```sh
docker-compose up
```