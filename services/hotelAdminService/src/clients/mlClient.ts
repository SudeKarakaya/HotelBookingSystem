import axios from "axios";

const ML_PRICE_URL = process.env.ML_PRICE_URL || "http://localhost:5000";

export const predictPrice = async (
  season: number,
  capacity: number
): Promise<number> => {
  const response = await axios.post(`${ML_PRICE_URL}/predict`, {
    season,
    capacity
  });

  return response.data.predictedPrice;
};
