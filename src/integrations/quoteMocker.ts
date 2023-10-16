import axios from "axios";

// Mocked API endpoint
const mockApiUrl = "http://localhost:3001/quotes";

export async function getQuotes(insScore: number) {
  try {
    const quotesResponse = await axios.get(mockApiUrl);
    const quotesData = quotesResponse.data;

    const filteredQuotes = quotesData.filter((quote: any) => {
      const { low_score, max_score } = quote.score_range;
      return insScore >= low_score && insScore <= max_score;
    });

    return filteredQuotes;
  } catch (err) {
    console.log("Error while fetching quotes data from mock api");
    return [];
  }
}
