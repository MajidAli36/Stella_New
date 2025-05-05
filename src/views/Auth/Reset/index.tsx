import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '../..';
import ResetPasswordView from './ResetPasswordView';

/**
 * Routes for "Reset Password" flow
 * url: /auth/rest/*
 */
const ResetPasswordRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ResetPasswordView />} />
      <Route path="code" element={<ResetPasswordView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default ResetPasswordRoutes;
