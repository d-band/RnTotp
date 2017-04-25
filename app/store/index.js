import yax from 'yax';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import totp from './totp';

const store = yax({
  modules: {
    totp
  }
}, autoRehydrate());

persistStore(store, { storage: AsyncStorage })

export default store;
