import { createContext, Dispatch, useReducer } from "react";

const initialState = {
  latLong: "",
  coffeeStores: [],
};

export type CoffeeStoreType = {
  fsq_id: string;
  name: string;
  address: string;
  neighborhood: string;
  imageUrl: string;
  votes: number;
  recordId: string
};

export enum ACTION_TYPES {
  SET_LAT_LONG = "SET_LAT_LONG",
  SET_COFFEE_STORES = "SET_COFFEE_STORES",
};

type StoreContextType = {
  latLong: string;
  coffeeStores: CoffeeStoreType[],
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ?
  { type: Key } : { type: Key, payload: M[Key] }
}

type StorePayload = {
  [ACTION_TYPES.SET_LAT_LONG]: {
    latLong: string,
  };
  [ACTION_TYPES.SET_COFFEE_STORES]: {
    coffeeStores: CoffeeStoreType[],
  };
}

type StoreActions = ActionMap<StorePayload>[keyof ActionMap<StorePayload>];

const StoreContext = createContext<{
  state: StoreContextType;
  dispatch: Dispatch<StoreActions>
}>({
  state: initialState,
  dispatch: () => null,
});


const storeReducer = (state: StoreContextType, action: StoreActions) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {
        ...state,
        latLong: action.payload.latLong,
      };
    case ACTION_TYPES.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores,
      };
    default:
      return state;
  }
}

type Props = {
  children: React.ReactNode,
};

const StoreProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider, StoreContext };