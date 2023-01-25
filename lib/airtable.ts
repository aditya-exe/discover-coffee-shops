// import Airtable from "airtable";
import { CoffeeStoreType } from "../context/context";

import Airtable, { FieldSet } from 'airtable';
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY }).base('appT1Wl0LtmlK842W');

const table = base("coffee-stores");


function getMinifiedRecord(record: any): CoffeeStoreType {
  return {
    recordId: record.id,
    ...record.fields,
  };
}

function getMinifiedRecords(records: any): CoffeeStoreType[] {
  return records.map((record: any) => getMinifiedRecord(record));
}

async function findRecordByFilter(id: any): Promise<CoffeeStoreType[]> {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `fsq_id="${id}"`,
    })
    .firstPage();
  const x = getMinifiedRecords(findCoffeeStoreRecords);
  console.log(x);
  return x;
}

export { table, getMinifiedRecords, findRecordByFilter };