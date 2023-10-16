**Documentation**

### Delos Challenge Documentation

#### Introduction

This document serves as the documentation for the Delos Challenge project. The project aims to implement a backend system for managing insurance quotes and interacting with a mocked insurance dispatcher API.

#### Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Entities](#entities)
   - [User](#user)
   - [Quote](#quote)
5. [API Routes](#api-routes)
   - [Generate Quotes](#generate-quotes)
   - [Get Best Three Quotes](#get-best-three-quotes)
6. [Integration with Mocked API](#integration-with-mocked-api)
   - [Using Axios](#using-axios)
7. [Rate Limiting](#rate-limiting)
8. [Testing](#testing)
   - [Unit Tests](#unit-tests)
   - [Integration Tests](#integration-tests)
9. [Conclusion](#conclusion)

#### Project Overview

The Delos Challenge project implements a backend system for managing insurance quotes. It includes functionality to generate quotes, get the best three quotes for a user, and interact with a mocked insurance dispatcher API.

#### Getting Started

##### Prerequisites

Ensure you have the following installed:

- Node.js and npm
- TypeScript
- PostgreSQL
- [json-server](https://www.npmjs.com/package/json-server) (for mocking the external API)

##### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   cd delos-challenge
   npm install
   ```

3. Set up your PostgreSQL database and configure the connection in the `.ormconfig` file.
    - You should have PostgreSQL installed on your machine

4. Run migrations:
    - You don't need to run the migrations as such there aren't any migration files in the project. But when you start the server your database will be initialized with the 2 tables users and entities.

5. Start the server:

   ```bash
   npm run start
   ```

#### Project Structure

The project follows a modular structure, with separate folders for routes, controllers, services, and entities.

```
delos-challenge/
├── README.md
├── SOLUTION.md
├── backup-whateverfolder-2023-10-15.txt
├── db.json
├── jest.config.ts
├── ormconfig.json
├── package-lock.json
├── package.json
├── server.js
├── src
│   ├── entities
│   │   ├── Quote.ts
│   │   └── Users.ts
│   ├── index.ts
│   ├── integrations
│   │   └── quoteMocker.ts
│   ├── quotes
│   │   ├── controller.ts
│   │   ├── dbservice.ts
│   │   ├── error.ts
│   │   ├── routes.ts
│   │   └── service.ts
│   ├── routes.ts
│   ├── test
│   │   └── routes.ts
│   └── utils
│       ├── constants.ts
│       ├── helper.ts
│       ├── lookupData.json
│       └── response.ts
├── test
│   ├── integration
│   │   └── api.test.ts
│   └── unit
│       └── quotes.test.ts
└── tsconfig.json
```

The project is organized into modules, including routes, controllers, services, and entities. The main folders are:

- `src/quotes`: Implementation related to insurance quotes.
    - `controller` which handles errors and the methods coming in.
    - `service` which handles the business logic
    - `dbservice` which handles all the database logic, it is seperated out so as to change when and if needed to change the data base entirely
    - `error` will have constant error codes with specific error codes so that we can pin point the errors while debugging
    - `routes` entry point for different api in this sub module
- `src/integrations`: All third party api integrations and libraries will be in this
    - `quoteMocker` - dummy service to connect to the second server which we have, for quotes hosting
- `test`: Has basic initial unit and integration tests
- `utils`: Has all the helper functions in a common place
- `src/index.ts`: Entry point for the application.
- `src/routes.ts`: Routes configurations.

#### Entities

##### User

The `User` entity represents a user with details such as name, age, car model, and years of experience.

```typescript
@Entity()
export class User {
  // ...
}
```

##### Quote

The `Quote` entity represents an insurance quote with details such as amount and the associated user.

```typescript
@Entity()
export class Quote {
  // ...
}
```

#### API Routes

##### Server Status

Endpoint: `http://localhost:3000/test/serverstatus`

Method: `GET`

Description: Checks if the server is up and running. Output for this API should be something like this :

```json
{
    "data": {
        "message": "Server is running from test route!!"
    }
}
```

This could be used to ping the server once in a while for status on the service availability.

##### Generate Quotes

Endpoint: `http://localhost:3000/quotes/`

Method: `POST`

Description: Generates insurance quotes for a user. And save them with the user_id into Quote classes. Returns the user_id which later on can be used to pull in the best Quotes

Request Body:

```json
{
  "user": {
    "name": "John Doe",
    "age": 30,
    "carModel": "Toyota Camry",
    "yearsOfExperience": 5
  }
}
```

Response Body:

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "user_id": 2
    }
}
```

##### Get Best Three Quotes

Endpoint: `http://localhost:3000/quotes/best-three?user_id=2`

Method: `GET`

Description: Retrieves the best three insurance quotes for a user.

Response Body:

```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "id": 30,
            "amount": 1600,
            "user_id": 2
        }
    ]
}
```

#### Running the code and tests

##### Hosting 1 : 

We need to host the dummy server which gives us the dummy quotes data. In the root directory : 

   ```bash
   node server.js
   ```

This will be hosting the sample quotas data which we have in `db.json` file.

- This hosts the node-server at http://localhost:3001/
- Using this http get method at http://localhost:3001/quotes we get all the quotes hosted there.
- We also have a rate-limit on this mocking api as needed, we are limiting this for a max of 5 requests per minute.

##### Hosting 2 : 

Now coming to the main server. In the root directory : 

   ```bash
   npm run start
   ```

- This starts the server. Here is the postman collection for all the routes available `Delos Collection.postman_collection.json`.

##### Run Tests : 

In the root directory : 

   ```bash
   npm run test
   ```

- This runs all the unit and integration test cases.


### NOTES : 

Regarding the Bonus points to be considered.

I have dealt with these :
- Including unit and integration tests.
- Implementing a rate-limiting mechanism around the mocked dispatched API.
- I started out with the caching stuff as well using Node-cache but could get it to finish them, along with Dockerization and serverless deployments.