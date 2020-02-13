# Cofffee Critic
## Description
Coffee Critic is a website for finding and discussing local coffee shops. Users can create an account, view information about local shops, use the search function to find shops near them, and leave comments about the shops. Shop owners can create an account and create a page for their shop that users can see. Coffee Critic is hosted at https:www.coffeecritic.net/ 
## Components and Architecture
### Application Overview
Coffee critic is a full stack web application built using the Model-View-Controller (MVC) design pattern. It handles routing of incoming requests using a RESTful routing scheme to manage resources and render pages. It uses multiple databases to securely handle application data as well as user authentication and request validation. 
### Backend Architecture
__Web Server:__ Node.js <br />
__Database__: Mongodb

| Technology/Framework  | Purpose |
| ------------- | ------------- |
| Express.js  | Node.js Web Framework  |
| Embedded Javascript (EJS)  | Template engine for server-side rendering  |
| Mongoose ODM | Database object mapping framework for MVC pattern |
| Passport | Server authentication and session management library |
| Google geocoding API | Geocoding of address records for database normalization |

### Frontend Architecture
__Main Tools:__ HTML, CSS, Javascript

| Technology/Framework  | Purpose |
| ------------- | ------------- |
| Bootstrap | Client-side javascript and css framework for user-interface design and functionality |
| Google maps API | Integration with google maps |
| JQuery | DOM Manipulation + Bootstrap dependency |
| Popper | Bootstrap javascript dependency |

### Devops

| Technology/Platform | Purpose |
| ------------- | ------------- |
| Heroku Cloud Platform | Web Hosting and DNS |
| Mlab | Managed MongoDb hosting |
| Google cloud platform | API access and functionality |
| Trello | Project Management |
