import { NextApiRequest, NextApiResponse } from "next";
import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable";

export default async function getCoffeeStoreById(req: NextApiRequest, res: NextApiResponse) {
  const { fsq_id } = req.query;

  try {
    if (fsq_id) {
      res.json(await findRecordByFilter(fsq_id as string));
    } else {
      res.status(400);
      res.json({ message: "ID is missing" });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
}