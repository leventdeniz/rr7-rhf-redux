import { useDispatch, useSelector } from 'react-redux';
import type { StoreState, AppDispatch } from './index';

// Typisierte Hooks für bessere TypeScript-Unterstützung
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: StoreState) => TSelected) =>
  useSelector(selector); 