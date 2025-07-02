import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for better consistency
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;