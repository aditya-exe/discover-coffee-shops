export const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.FSQ_API
  }
};

const getImages = async (fsq_id: string) => {
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

export const fetchCoffeeStores = async () => {
  const response = await fetch('https://api.foursquare.com/v3/places/search?query=coffee&ll=41.8781%2C-87.6298&limit=6', options);
  const res = await response.json();
  let data: any = [];
  const results = await res.results;
  // console.log(results);
  results.map(async (res: any) => {
    const imageUrl = await getImages(res.fsq_id);
    const x = {
      imageUrl,
      fsq_id: res.fsq_id,
      name: res.name,
      address: res.location.address,
      neighborhood: res?.location?.neighborhood[0]
    }
    data.push(x);
  })
  // console.log(data);
  return data;
}