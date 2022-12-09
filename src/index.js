import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import '@/utils/http'
import { store,persistor } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
// import 'default-passive-events'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter><Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
    </BrowserRouter>
);

