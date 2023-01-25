import { CoffeeStoreType } from "../context/context";

export const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // Authorization: "fsq3pCnaTi2G2Ql3QurfWdHZXjFCPjcPnps9LHYkqipeQbw="
    Authorization: process.env.NEXT_PUBLIC_FSQ_API as string
  }
};

export async function fetchStoreImages(fsq_id: string) {
  const res = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=5&sort=POPULAR&classifications=indoor`, options);
  let data = await res.json();
  data = await data;
  // console.log(data);  
  if (data.length == 0) {
    return "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";
  }

  const imageUrl = data[0]?.prefix + "original" + data[0]?.suffix;
  // console.log(imageUrl);
  return imageUrl;
}

function getUrlForCoffeeStores(latLong: string, query: string, limit: string) {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
}

//"41.8781%2C-87.6298"
export async function fetchCoffeeStores(latLong: string = "41.8781%2C-87.6298", limit: number = 6): Promise<CoffeeStoreType[]> {
  const response = await fetch(getUrlForCoffeeStores(latLong, "coffee", limit.toString()), options);
  const res = await response.json();
  const results = await res.results;
  let data: any = [];
  results.map(async (res: any) => {
    const x = {
      fsq_id: res.fsq_id,
      name: res.name,
      address: res.location.address,
      neighborhood: res?.location?.neighborhood[0],
      votes: 0,
    };
    data.push(x);
  });

  for (let i = 0; i < data.length; i++) {
    const image = await fetchStoreImages(data[i].fsq_id);
    data[i].imageUrl = image;
  }

  return data;
}