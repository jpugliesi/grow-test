import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { Client } from "pg";

// https://www.apollographql.com/docs/apollo-server/

// Database
// Exposes DynamoDB schema 
// Cache requests. Expire Cache on writes 

// Queries?
// all => returns an array of days with data 
// daterange(start, end) => returns array of days with a daterange 
// day(date) => returns a day object 

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    all: [Day],
    range(start: String, end: String): [Day],
    day(date: String): Day
  },
  type Day {
    date: String,
    weather: Weather
  },
  type Weather {
    time: Int,
    summary: String,
    icon: String,
    sunriseTime: Int,
    sunsetTime: Int,
    moonPhase: Float,
    precipIntensity: Float,
    precipIntensityMax: Float,
    precipIntensityMaxTime: Int,
    precipProbability: Float,
    precipType: String,
    temperatureHigh: Float,
    temperatureHighTime: Int,
    temperatureLow: Float,
    temperatureLowTime: Int,
    apparentTemperatureHigh: Float,
    apparentTemperatureHighTime: Int,
    apparentTemperatureLow: Float,
    apparentTemperatureLowTime: Int,
    dewPoint: Float,
    humidity: Float,
    pressure: Float,
    windSpeed: Float,
    windGust: Float,
    windGustTime: Int,
    windBearing: Int,
    cloudCover: Float,
    uvIndex: Int,
    uvIndexTime: Int,
    visibility: Float,
    ozone: Float,
    temperature: Float,
    apparentTemperature: Float,
    nearestStormDistance: Int,
    nearestStormBearing: Int
  }
`;

// The resolvers
const resolvers = {
  Query: {
    all: () => console.log("Get all the data!"),
    range: (root, args, context) => console.log("Get a range of data!"),
    day: (root, args, context) => console.log("Get a specific day!")
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const PORT = process.env.PORT || 4200;
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

if (process.env.NODE_ENV !== "production") {
  // GraphiQL, a visual editor for queries
  app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
}

const pg = new Client({
  host     : "growdb.crpvvgq8rg3k.us-west-2.rds.amazonaws.com", //process.env.RDS_HOSTNAME,
  database : "growdb",
  user     : "dreamqueen", //process.env.RDS_USERNAME,
  port     : 5432, //process.env.RDS_PASSWORD,
  password : "420calipussy!" //process.env.RDS_PORT
});

pg.connect();

pg.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pg.end();
})

// Start the server
app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
});
