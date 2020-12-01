const isNull = (value) => value === 'undefined' || value === null;

const hasSameProps = (obj1, obj2) => Object.keys(obj1).every((prop) => Object.prototype.hasOwnProperty.call(obj2, prop));

const hasValidItemsType = (array = []) => array.every((item) => typeof item === 'string');

const convertArrayToObject = (array = []) => array.reduce((obj, item) => ({
  ...obj,
  [item]: item,
}), {});

const defaults = {
  storage: 'localStorage',
  localkey: 'localStore',
  blacklist: {},
};

export const storeConfig = () => defaults;

const setStorageConfig = (config) => {
  if (Object.prototype.hasOwnProperty.call(config, 'storage')) {
    defaults.storage = config.storage;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'localkey')) {
    defaults.storage = config.localkey;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'blacklist')) {
    if (!hasValidItemsType(config.blacklist)) {
      throw new Error('Backlist item type should be string');
    }
    defaults.blacklist = convertArrayToObject(config.blacklist);
  }

  if (Object.prototype.hasOwnProperty.call(config, 'whitelist')) {
    if (!hasValidItemsType(config.whitelist)) {
      throw new Error('Whitelist item type should be string');
    }
    defaults.whitelist = convertArrayToObject(config.whitelist);
  }
};

const getStorage = () => window[defaults.storage];

const getLocalStore = () => {
  const { localkey } = storeConfig();
  try {
    return JSON.parse(getStorage().getItem(localkey));
  } catch (e) {
    return {};
  }
};

const filterBlacklist = (state) => {
  const localState = { ...state };
  const { blacklist } = storeConfig();
  Object.keys(state).forEach((value) => {
    if (blacklist[value]) {
      localState[value] = undefined;
    }
  });
  return localState;
};

const filterWhitelist = (state) => {
  const localState = {};
  const { whitelist } = storeConfig();
  Object.keys(state).forEach((value) => {
    if (whitelist[value]) {
      localState[value] = state[value];
    }
  });
  return localState;
};

const getStoreToPersist = (store) => {
  if (storeConfig().whitelist) {
    return filterWhitelist(store.getState());
  }
  return filterBlacklist(store.getState());
};

const setLocalStore = (store) => {
  const { localkey } = storeConfig();
  try {
    return getStorage().setItem(localkey, JSON.stringify(getStoreToPersist(store)));
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
  if (config) {
    setStorageConfig(config);
  }
  return store.subscribe(() => setLocalStore(store));
};
