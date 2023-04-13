import { BehaviorSubject } from "rxjs";

const authData = new BehaviorSubject(null);

const fuelTokenCache = new BehaviorSubject(null);

export const setAuthData = (data) => {
  authData.next(data);
};

export const getAuthData = () => {
  return authData.value;
};

export const setFuelTokenCache = (data) => {
  fuelTokenCache.next(data);
};

export const getFuelTokenCache = () => {
  return fuelTokenCache.value;
};
