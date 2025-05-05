import { useCallback } from 'react';
import { setDarkMode } from '../store';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Returns event handler to toggle Dark/Light modes
 * @returns {function} calling this event toggles dark/light mode
 */
export function useEventSwitchDarkMode() {
  //const [state, dispatch] = useAppStore();
  const dispatch = useDispatch();
  const auth = useSelector((state: AppStore) => state.auth);
  return useCallback(() => {
    const darkMode= !auth.darkMode;
    dispatch(setDarkMode(darkMode))
    // dispatch({
    //   type: 'DARK_MODE',
    //   payload: !state.darkMode,
    // });
  }, [auth,dispatch]);
}
