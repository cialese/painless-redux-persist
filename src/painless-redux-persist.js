import { hasSameProps, isNull } from './utils';
import {
  getStorage, resetConfig, setStorageConfig, storeConfig,
} from './utils/config';

const getLocalStore = () => {
  const { localkey, decrypt } = storeConfig();
  try {
    const storeString = getStorage().getItem(localkey);
    const store = decrypt ? decrypt(storeString) : storeString;
    return JSON.parse(store);
  } catch (e) {
    return {};
  }
};

const filterBlacklist = (state) => {
  const localState = { ...state };
  const { blacklist } = storeConfig();

  blacklist.forEach((key) => {
    localState[key] = undefined;
  });

  return localState;
};

const filterWhitelist = (state) => {
  const localState = {};
  const { whitelist } = storeConfig();

  if (whitelist.length) {
    whitelist.forEach((key) => {
      localState[key] = state[key];
    });
  }

  return localState;
};

const getStoreToPersist = (store) => {
  if (storeConfig().whitelist) {
    return filterWhitelist(store.getState());
  }
  return filterBlacklist(store.getState());
};

const setLocalStore = (store) => {
  const { localkey, encrypt } = storeConfig();
  try {
    const storeString = JSON.stringify(getStoreToPersist(store));
    const storeToPersist = encrypt ? encrypt(storeString) : storeString;
    return getStorage().setItem(localkey, storeToPersist);
  } catch (e) {
    return {};
  }
};
export const getState = () => (!isNull(getLocalStore()) ? getLocalStore() : {});

export const defineState = (defaultState) => (reducer) => {
  if (Object.prototype.hasOwnProperty.call(getState(), reducer)) {
    const localReducer = getState()[reducer];
    return hasSameProps(defaultState, localReducer) ? localReducer : defaultState;
  }
  return defaultState;
};

export const resetState = () => {
  const { localkey } = storeConfig();
  getStorage().removeItem(localkey);
};

export default (store, config = null) => {
  resetConfig();
  if (config) {
    setStorageConfig(config);
  }
  return store.subscribe(() => setLocalStore(store));
};
