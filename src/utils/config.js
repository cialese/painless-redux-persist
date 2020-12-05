import { hasValidItemsType } from './utils';

const defaults = {
  storage: 'localStorage',
  localkey: 'localStore',
  blacklist: [],
};

let settings = {};

export const resetConfig = () => {
  settings = { ...defaults };
  return settings;
};

export const storeConfig = () => settings;

export const setStorageConfig = (config) => {
  if (Object.prototype.hasOwnProperty.call(config, 'storage')) {
    settings.storage = config.storage;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'localkey')) {
    settings.localkey = config.localkey;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'blacklist')) {
    if (!hasValidItemsType(config.blacklist)) {
      throw new Error('Backlist item type should be string');
    }
    settings.blacklist = config.blacklist;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'whitelist')) {
    if (!hasValidItemsType(config.whitelist)) {
      throw new Error('Whitelist item type should be string');
    }
    settings.whitelist = config.whitelist;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'encrypt')) {
    settings.encrypt = config.encrypt;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'decrypt')) {
    settings.decrypt = config.decrypt;
  }
};

export const getStorage = () => window[settings.storage];
