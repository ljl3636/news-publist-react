import { legacy_createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import reducers from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'isCollpased',
    storage,
    /* 添加黑名单 把 IsLoadingReducer 不本地存储同步 */
    blacklist: ['IsLoadingReducer'],
    // whitelist:['CollpasedReducer']   也可以写白名单  也就是 需要做同步存储本地
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = legacy_createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
const persistor = persistStore(store)

export { store, persistor }