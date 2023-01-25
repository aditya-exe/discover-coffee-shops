
import { NextApiRequest, NextApiResponse } from "next";
import { CoffeeStoreType } from "../../context/context";
import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable";

export default async function favCoffeeStoreById(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {

    try {
      const { fsq_id } = req.body;
      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);
        if (records.length !== 0) {
          const record = records[0];
          // console.log(record);
          const calc = (record.votes ?? 0) + 1;
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                votes: calc
              }
            }
          ]);
          if (updateRecord) {
            res.json(getMinifiedRecords(updateRecord));
          }
        } else {
          res.json({ message: "Not found" });
        }
      }
    } catch (err) {
      res.status(500);
      console.error(err);
    }
  }
}