import { quotesError } from "./error";
import { createConnection, getRepository } from "typeorm";
import { User } from "../entities/User";
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
): Promise<User> {
  const userRepository = getRepository(User);

  // Check if the user already exists
  let user = await userRepository.findOne({ where: { name } });

  // If not, create a new user
  if (!user) {
    user = new User();
    user.name = name;
    user.age = age;
    user.carModel = carModel;
    user.yearsOfExperience = yearsOfExperience;

    // Save the user to the database
    await userRepository.save(user);
  }

  return user;
}

export async function getUser(user_id: number) {
  const userRepository = getRepository(User);

  const user = await userRepository.findOne({ where: { id: user_id } });

  return user;
}

export async function saveQuote(user: User, amount: number) {
  const quoteRepository = getRepository(Quote);
  const quote = new Quote();
  quote.user = user;
  quote.amount = amount;

  return await quoteRepository.save(quote);
}

export async function saveQuotes(
  user: User,
  quotesData: { amount: number }[]
): Promise<Quote[]> {
  const quoteRepository = getRepository(Quote);

  // Create an array of Quote entities
  const quotes = quotesData.map((quoteData) => {
    const quote = new Quote();
    quote.user = user;
    quote.amount = quoteData.amount;
    return quote;
  });

  // Save all quotes in one query
  return await quoteRepository.save(quotes);
}

export async function getBestQuotes(user: User) {
  const userRepository = (await createConnection()).getRepository(User);
  const bestThreeQuotes = await userRepository.find({
    order: { quote: "ASC" },
    take: 3,
  });

  return bestThreeQuotes;
}
