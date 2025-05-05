import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {setSignout } from '../store';
import { SignInManager } from "../hooks";
import { useDispatch } from 'react-redux';
/**
 * Hook to get currently logged user
 * @returns {object | undefined} user data as object or undefined if user is not logged in
 */
export function useCurrentUser(token?: string): CurrentUser | undefined {
  const result = parseJwt(token || '');
  var newUser = {
    id: result.id,
    email: result.email,
    role: result.role,
    name: result.name
  }

  return newUser;
}

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {

  let result = new SignInManager().IsAuthenticated;

  // TODO: AUTH: add access token verification or other authentication check here
  // result = Boolean(sessionStorageGet('access_token', ''));

  return result;
}

export const parseJwt = (token: string) => {
  var signIn= new SignInManager();
  if(token==null || token ==undefined || token=="" ){
    token= signIn.GetToken();
   
  }
  
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
 
  return JSON.parse(jsonPayload || '{}');
 
};

// export const UserRole = (token?: string): 'ADMIN' | 'SENIOR_USER' | 'USER' | 'HOUSE_MANAGER' | '' => {
//   return parseJwt(token || '')?.role || '';
// };


/**
 * Returns event handler to Logout current user
 * @returns {function} calling this event logs out current user
 */
export function useEventLogout() {
  const navigate = useNavigate();
  //const [, dispatch] = useAppStore();
  const dispatch = useDispatch();
  return useCallback(() => {
    // TODO: AUTH: add auth and tokens cleanup here
    // sessionStorageDelete('access_token');
    dispatch(setSignout(false));
    //dispatch({ type: 'LOG_OUT' });
    navigate('/auth/login', { replace: true }); // Redirect to home page by reloading the App
  }, [dispatch, navigate]);
}





/**
 * Adds watchdog and calls different callbacks on user login and logout
 * @param {function} afterLogin callback to call after user login
 * @param {function} afterLogout callback to call after user logout
 */
export function useAuthWatchdog(afterLogin: () => void, afterLogout: () => void) {
  // const [state, dispatch] = useAppStore();
  let result = new SignInManager().IsAuthenticated;
  useEffect(() => {
    if (result) {
      afterLogin?.();
    } else {
      afterLogout?.();
    }
  }, [afterLogin, afterLogout]);
}
