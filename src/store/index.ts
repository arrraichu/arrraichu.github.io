import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const store = configureStore({ reducer });

export const getStore = () => store;