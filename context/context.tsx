import { createContext, Dispatch, useReducer } from "react";
import { StoreType } from "../pages";
import { CoffeeStoresActions, CoffeeStoresReducer, LatLongActions, LatLongReducer } from "./reducers";

type ContextStateType = {
  latLong: string;
  coffeeStores: StoreType[];
};

const initialState = {
  latLong: "",
  coffeeStores: [],
}

const StoreContext = createContext<{
  state: ContextStateType;
  dispatch: Dispatch<LatLongActions | CoffeeStoresActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = ({ latLong, coffeeStores }: ContextStateType, action: LatLongActions | CoffeeStoresActions) => {
  return ({
    latLong: LatLongReducer(latLong, action),
    coffeeStores: CoffeeStoresReducer(coffeeStores, action),
  });
};

type Props = {
  children?: React.ReactNode,
};

const StoreProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider };