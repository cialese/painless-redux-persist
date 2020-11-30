# Synchronize Redux state with localStorage or sessionStorage

Subscribe Redux Store and replicate to `localStorage` or `sessionStorage`. The user will can refresh page and keep the redux state.

### Store config

Import the **_default method_** (you can call storePersist as the example above) from `'painless-redux-persist'` and pass store as parameter

```javascript
import { createStore, combineReducers } from 'redux';
import storePersist from 'painless-redux-persist';

const combineReducer = combineReducers({
  Category,
  Post
});

export const store = createStore(combineReducer);

storePersist(store); // the default config synchronizes the entire store
```

### localStorage / sessionStorage

The default browser storage is the `localStorage` (persists until the **_browser_** is closed), but you can change the default to `sessionStorage` (persists until the **_tab_** is closed).

```javascript
storePersist(store, {
  storage: 'sessionStorage'
});
```

If you want to use your own key in `localStorage` or `sessionStorage`, you can use the **localkey** configuration:

```javascript
storePersist(store, {
  localkey: 'localRedux'
});
```

### Blacklist

If you need to ignore some reducer, you can use the **blacklist** configuration:

```javascript
storePersist(store, {
  blacklist: ['Category']
});
```

### Whitelist

If you want to sync just specific reducers, you can use the **whitelist** configuration:

```javascript
storePersist(store, {
  whitelist: ['Post']
});
```

### Reducer example

To populate the initalState from browser storage, import **_defineState_** method from `'painless-redux-persist'`, pass your `initialState` as first parameter and the reducer key as second. (note that it's using currying)

```javascript
import { defineState } from 'painless-redux-persist';

const defaultState = {
  data: null
};

const initialState = defineState(defaultState)('Post');

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ACTION1':
      return {
        ...state,
        data: action.payload
      };
    case 'ACTION2':
      return {
        ...state,
        data: null
      };
    default:
      return state;
  }
};
```

### Getting local state

This method gets the persisted state. It shouldn't be actually necessary, since the state from your redux store is supposed to be the same.

```javascript
import { getState } from 'painless-redux-persist';

const state = getState();
```

### If you need to reset the local store

```javascript
import { resetState } from 'painless-redux-persist';

resetState();
```
