import { useContext, useState } from "react";
import { StoreContext } from "../context/context";
import { ACTION_TYPES } from "../context/context";

const useTrackLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useContext(StoreContext);

  const success: PositionCallback = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong();
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationErrorMessage("");
    setIsFindingLocation(false);
  }

  const error: PositionErrorCallback = () => {
    setLocationErrorMessage("Unable to retrieve your location");
    setIsFindingLocation(false);
  }

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMessage("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMessage,
    isFindingLocation
  };
}

export default useTrackLocation;