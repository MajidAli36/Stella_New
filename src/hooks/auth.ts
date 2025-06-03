import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSignout } from '../store';
import { SignInManager } from "../hooks";
import { useDispatch } from 'react-redux';

/**
 * Parse JWT and return claims
 */
export const parseJwt = (token: string) => {
  const signIn = new SignInManager();
  if (!token) {
    token = signIn.GetToken();
  }

  const parts = token?.split('.');
  if (parts.length < 2) return {};

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("JWT parsing error:", err);
    return {};
  }
};

/**
 * ✅ FIXED: Return user data immediately (synchronously)
 */
export function useCurrentUser(token?: string): CurrentUser | undefined {
  const result = parseJwt(token || '');
  if (!result || !result.email) return undefined;

  return {
    id: result.id,
    email: result.email,
    role: result.role,
    name: result.name
  };
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  return new SignInManager().IsAuthenticated;
}

/**
 * Logout event handler
 */
export function useEventLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(setSignout(false));
    navigate('/auth/login', { replace: true });
  }, [dispatch, navigate]);
}

/**
 * Auth state watcher
 */
export function useAuthWatchdog(afterLogin: () => void, afterLogout: () => void) {
  const isAuth = new SignInManager().IsAuthenticated;
  useEffect(() => {
    if (isAuth) {
      afterLogin?.();
    } else {
      afterLogout?.();
    }
  }, [afterLogin, afterLogout]);
}
