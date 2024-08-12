import { quotesError } from "./error";
import { createConnection, getRepository } from "typeorm";
import { Users } from "../entities/Users";
import { Quote } from "../entities/Quote";

/*
 * ======
 * QUOTES
 * ======
 */

export async function findOrCreateUser(
  name: string,
  age: number,
  carModel: string,
  yearsOfExperience: number
): Promise<Users> {
  const userRepository = getRepository(Users);

  // Check if the user already exists
  let user = await userRepository.findOne({ where: { name } });

  // If not, create a new user
  if (!user) {
    user = new Users();
    user.name = name;
    user.age = age;
    user.carModel = carModel;
    user.yearsOfExperience = yearsOfExperience;

    // Save the user to the database
    await userRepository.save(user);
  }

  return user;
}

export async function findUsers() {
  const userRepository = getRepository(Users);

  const users = await userRepository.find();

  return users;
}

export async function findQuotes() {
  const quoteRepository = getRepository(Quote);

  const quotes = await quoteRepository.find();

  return quotes;
}

export async function getUser(user_id: number) {
  const userRepository = getRepository(Users);

  const user = await userRepository.findOne({ where: { id: user_id } });

  return user;
}

export async function saveQuote(user_id: number, amount: number) {
  const quoteRepository = getRepository(Quote);
  const quote = new Quote();
  quote.user_id = user_id;
  quote.amount = amount;

  return await quoteRepository.save(quote);
}

export async function saveQuotes(
  user_id: number,
  quotesData: { amount: number }[]
): Promise<Quote[]> {
  const quoteRepository = getRepository(Quote);

  // Create an array of Quote entities
  const quotes = quotesData.map((quoteData) => {
    const quote = new Quote();
    quote.user_id = user_id;
    quote.amount = quoteData.amount;
    return quote;
  });

  // Save all quotes in one query
  return await quoteRepository.save(quotes);
}

export async function getBestQuotes(user_id: number) {
  const quoteRepository = getRepository(Quote);

  // Assuming there is a 'quotes' field in the User entity representing the one-to-many relationship
  const quotes = await quoteRepository.find({ where: { user_id: user_id } });

  if (!quotes || quotes.length === 0) {
    // Handle the case where the user has no quotes
    return [];
  }

  // Sort quotes by amount in ascending order
  quotes.sort((a, b) => a.amount - b.amount);

  // Get the best three quotes
  const bestThreeQuotes = quotes.slice(0, 3);

  return bestThreeQuotes;
}
