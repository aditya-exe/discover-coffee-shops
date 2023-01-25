import { NextApiRequest, NextApiResponse } from "next";
import { CoffeeStoreType } from "../../context/context";
import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable";


export default async function createCoffeeStore(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    const { fsq_id, name, address, neighborhood, imageUrl, votes } = req.body;

    try {
      const records: CoffeeStoreType[] = await findRecordByFilter(fsq_id);
      // console.log(records);
      if (records.length !== 0) {
        res.json(records);
      } else if (fsq_id && name) {
        let record = await table.create([
          {
            fields: {
              fsq_id,
              name,
              address,
              neighborhood,
              votes,
              imageUrl,
            }
          }
        ]);
        const records = getMinifiedRecords(record);
        res.json(records);
      } else {
        res.status(400);
        res.json({ message: "Missing fields" });
      }
    } catch (error) {
      console.error(error);
    }

  }
}