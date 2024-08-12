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
   - Use TypeORM for object-relational mapping

5. **API Integration**
   - Integrate with a geocoding API (e.g., Google Maps Geocoding API)
   - Integrate with NASA's FIRMS API for wildfire data

## Technical Requirements

- Use NestJS as the framework
- Use TypeScript for all code
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
1. Create a private GitHub repository for your project
2. Implement the assignment according to the requirements
3. Include a README.md with:
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
