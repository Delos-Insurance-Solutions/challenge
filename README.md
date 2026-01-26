<<<<<<< HEAD
# Backend Engineer Assignment: Address-based Wildfire Risk API

## Objective
Create a backend application using NestJS and TypeScript that processes addresses, retrieves geocoding and wildfire data, and stores this information in a database. The application should provide API endpoints to submit addresses and retrieve stored data.

## Core Requirements

1. **Address Submission Endpoint**
   - Implement a POST endpoint `/addresses`
   - Accept a valid address as input
   - Use a geocoding service (e.g., Google Maps Geocoding API) to obtain latitude and longitude for the address
   - Make a request to NASA's FIRMS API to check for wildfire data in the vicinity
   - Save all retrieved data in the database

2. **Address Listing Endpoint**
   - Implement a GET endpoint `/addresses`
   - Return a list of all stored addresses with their IDs, latitudes, and longitudes

3. **Address Detail Endpoint**
   - Implement a GET endpoint `/addresses/:id`
   - Return full details for a specific address, including:
     - Original address
     - Latitude and longitude
     - Wildfire data
     - Any other relevant information retrieved

4. **Database Integration**
   - Use PostgreSQL as the database
   - Use Sequelize for object-relational mapping

5. **API Integration**
   - Integrate with a geocoding API (e.g., Google Maps Geocoding API)
   - Integrate with NASA's FIRMS API for wildfire data

## Technical Requirements

- Use NestJS as the framework
- Use TypeScript for all code
- Use sequelize-typescript as ORM
- Use postgres database
- Create a docker-compose file to run the application
- Implement proper error handling and input validation
- Use environment variables for API keys and sensitive information
- Include logging for important operations and errors

## Detailed Specifications

### 1. POST /addresses
- **Input**: JSON object with an `address` field (string)
- **Process**:
  1. Validate the input address
  2. Use geocoding API to get latitude and longitude
  3. Use NASA FIRMS API to get wildfire data for the location
  4. Save all data to the database
- **Output**: JSON object with the saved data, including a generated ID

### 2. GET /addresses
- **Input**: None (optional query parameters for pagination)
- **Output**: JSON array of objects, each containing:
  - `id`: Database ID of the address entry
  - `address`: Original address string
  - `latitude`: Latitude from geocoding
  - `longitude`: Longitude from geocoding

### 3. GET /addresses/:id
- **Input**: Address ID in the URL parameter
- **Output**: JSON object with full details:
  - `id`: Database ID of the address entry
  - `address`: Original address string
  - `latitude`: Latitude from geocoding
  - `longitude`: Longitude from geocoding
  - `wildfireData`: Object or array containing wildfire information from NASA FIRMS
  - Any other relevant data you choose to include

## API Integration Guidelines

1. **Geocoding API**
   - Suggested: Google Maps Geocoding API
   - Endpoint: `https://maps.googleapis.com/maps/api/geocode/json`
   - Key Parameters: `address`, `key` (API key)
   - Parse the response to extract latitude and longitude

2. **NASA FIRMS API**
   - Endpoint: `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/`
   - Key Parameters: 
     - `area`: Use a bounding box around the address coordinates
     - `date`: Recent date range (e.g., last 7 days)
   - Parse the CSV response to extract relevant wildfire data

## Bonus Features
- Implement caching for geocoding and wildfire data to reduce API calls
- Add pagination to the GET /addresses endpoint
- Implement a background job to periodically update wildfire data for stored addresses
- Add unit and integration tests

## Submission Instructions
1. Fork this repository to start your application
2. Implement the assignment according to the requirements
3. Include in the top of the README.md file:
   - Setup and run instructions
   - API documentation
   - Any assumptions or additional features you implemented
4. Ensure your code is well-commented and follows best practices
5. Share the repository with our GitHub account: [Your Company's GitHub Account]

## Evaluation Criteria
- Correct implementation of all required endpoints
- Proper integration with external APIs
- Effective use of NestJS features and TypeScript
- Database design and ORM usage
- Error handling and input validation
- Code organization and clarity
- API documentation quality

## Time Limit
Please complete this assignment within 7 days of receiving it. If you need more time, please let us know.

Good luck! We look forward to reviewing your implementation.
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> 4f04764 (add project)
