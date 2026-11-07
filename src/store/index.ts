import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import investigationReducer from './investigationSlice';
import rcaReducer from './rcaSlice';
import evidenceReducer from './evidenceSlice';
import capaReducer from './capaSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    investigations: investigationReducer,
    rca: rcaReducer,
    evidence: evidenceReducer,
    capa: capaReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
