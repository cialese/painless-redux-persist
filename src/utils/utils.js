export const isNull = (value) => value === 'undefined' || value === null;

export const hasSameProps = (obj1, obj2) => Object.keys(obj1).every((prop) => Object.prototype.hasOwnProperty.call(obj2, prop));

export const hasValidItemsType = (array = []) => array.every((item) => typeof item === 'string');
