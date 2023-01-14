import { StoreType } from "../pages";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ?
  {
    type: Key
  } : {
    type: Key,
    payload: M[Key],
  }
}

export enum Types {
  SetLatLong = "SET_LAT_LONG",
  SetCoffeeStores = "SET_COFFEE_STORES",
};

type LatLongPayload = {
  [Types.SetLatLong]: {
    latLong: string;
  };
}

type CoffeeStoresPayload = {
  [Types.SetCoffeeStores]: {
    coffeeStores: StoreType[];
  };
};

export type LatLongActions = ActionMap<LatLongPayload>[keyof ActionMap<LatLongPayload>];
export type CoffeeStoresActions = ActionMap<CoffeeStoresPayload>[keyof ActionMap<CoffeeStoresPayload>];

export const LatLongReducer = (state: string, action: LatLongActions | CoffeeStoresActions) => {
  switch (action.type) {
    case Types.SetLatLong:
      return {
        latLong: action.payload.latLong
      }
    default:
      throw new Error(action.type);
  }
}

export const CoffeeStoresReducer = (state: StoreType[], action: LatLongActions | CoffeeStoresActions) => {
  switch (action.type) {
    case Types.SetCoffeeStores:
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores,
      }
    default:
      throw new Error(action.type);
  }
};