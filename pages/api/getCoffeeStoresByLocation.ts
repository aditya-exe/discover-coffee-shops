import { NextApiRequest, NextApiResponse } from "next";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

export default async function getCoffeeStoresByLocation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores();

    res.status(200);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }

  return;
}