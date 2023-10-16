import * as dbService from "./dbservice";
import { quotesError } from "./error";
import { User } from "../entities/User";

/*
 * ======
 * QUOTES
 * ======
 */

export const generateQuotes = async (
    name: string,
    age: number,
    carModel: string,
    yearsOfExperience: number  
) => {
  try {
    const user = await findOrCreateUser(name, age, carModel, yearsOfExperience);

    const user_id = user.id;

    await saveQuotes(user, [{ amount: 500 },
        { amount: 600 },
        { amount: 450 }]);
    
    return user_id;
  } catch (err) {
    return 'There is been an error while generating the quotes'
  }
}

export const findOrCreateUser = async (
  name: string,
  age: number,
  carModel: string,
  yearsOfExperience: number
) => {
  // Checks
  if (!name || !age || !carModel || !yearsOfExperience) {
    throw quotesError.validation.missingfield;
  }

  const user: any = await dbService.findOrCreateUser(
    name,
    age,
    carModel,
    yearsOfExperience
  );
  if (!user) {
    return;
  }

  return user;
};

export const saveQuote = async (user: User, amount: number) => {
  // Checks
  if (!user || !amount) {
    throw quotesError.validation.missingfield;
  }

  const quote = await dbService.saveQuote(user, amount);
  if (!quote) {
    return;
  }

  return quote;
};

export const saveQuotes = async (
  user: User,
  quotesData: { amount: number }[]
) => {
  // Checks
  if (!user || !quotesData) {
    throw quotesError.validation.missingfield;
  }

  const quotes = await dbService.saveQuotes(user, quotesData);

  if (!quotes) {
    return;
  }

  return quotes;
};

export const getBestQuotes = async(
    user_id: number
) => {
  try {
    if (!user_id) {
        throw quotesError.validation.missingfield;
    }

    const user = await dbService.getUser(user_id);

    if(!user) {
        return
    }
    
    const bestQuotes = await dbService.getBestQuotes(user);

    if(!bestQuotes) {
        return;
    }

    return bestQuotes;
  } catch (err) {
    return 'There is been an error while getting the best quotes'
  }
}