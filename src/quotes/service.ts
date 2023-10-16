import * as dbService from "./dbservice";
import { quotesError } from "./error";
import { getQuotes } from "../integrations/quoteMocker";
import { calculateInsuranceScore } from "../utils/helper";

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

    const ins_score = calculateInsuranceScore(age, yearsOfExperience);
    const quotes = await getQuotes(ins_score);

    if (!quotes || quotes.length === 0) {
      return 'There are no quotes from mock api, hence an error while generating the quotes'
    }

    await saveQuotes(user_id, quotes);
    
    return { user_id };
  } catch (err) {
    console.log("error : ", err);
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

export const saveQuote = async (user_id: number, amount: number) => {
  // Checks
  if (!user_id || !amount) {
    throw quotesError.validation.missingfield;
  }

  const quote = await dbService.saveQuote(user_id, amount);
  if (!quote) {
    return;
  }

  return quote;
};

export const saveQuotes = async (
  user_id: number,
  quotesData: { amount: number }[]
) => {
  // Checks
  if (!user_id || !quotesData) {
    throw quotesError.validation.missingfield;
  }

  const quotes = await dbService.saveQuotes(user_id, quotesData);

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
    
    const bestQuotes = await dbService.getBestQuotes(user_id);

    if(!bestQuotes) {
        return;
    }

    return bestQuotes;
  } catch (err) {
    return 'There is been an error while getting the best quotes'
  }
}