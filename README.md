# Nomad News API

## Description 
Nomad News is a full-stack project for a Reddit-type news forum. Only the backend is currently implemented which just provides the server-side functionality for viewing, voting, commenting on articles.

## Hosted 
https://nomad-news.onrender.com/api

## Technologies Used
- Node.js
- PostgreSQL
- JavaScript
- Render
- Supabase

## Prerequisites 
- Node.js (v22.9.0 or higher)
- PostgreSQL (v16.3 or higher)

## Set up instruction

1. Clone the repo 
    ```
    git clone http://github.com/hessam-0/nomad-news
    ```
2. Install dependencies
    ```
    npm install    
    ```
3. Set up environment variables
    - Create .env files for test and dev environments in root.
    - Set 'PGDATABASE' variable in each file.
    - Refer to 'setup.sql' for database names.
    - Refer to '.env-example' file for structure.

4. Set up and seed database
    ```
    npm run setup-dbs

    npm run seed
    ```
## Running Tests 
To run test suite: 
    ```
    npm test 
    ```
## Running in Dev mode with nodemon
To start the server in development mode: 
    ```
    npm run start-dev 
    ```
## Endpoints 
For more detailed information about available endpoints refer to 'endpoints.json' or visit the hosted link above.

## Upcoming features 
A frontend! 

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
