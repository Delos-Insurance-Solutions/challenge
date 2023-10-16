// test/unit/quotes.test.ts

import { getBestQuotes } from '../../src/quotes/service';
import { Users } from '../../src/entities/Users';

describe('getBestQuotes function', () => {
  it('returns an empty array when user has no quotes', async () => {
    const user = new Users();
    user.id = 1; // Assign a sample user ID

    const quotes = await getBestQuotes(user.id);

    expect(quotes).toEqual([]);
  });

  // Add more unit tests as needed...
});
