import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateLayout } from '../layout';
import { NotFoundView } from '../views';
import AboutView from '../views/About';
import DevView from '../views/Dev';
import WelcomeView from '../views/Welcome';
import Dashboard from '../views/Dashboard/index';
import Kids from '../views/Kids/index';
import AuthRoutes from '../views/Auth';
import Houses from '../views/Homes';
import Users from '../views/Users';
import KidsDetail from '../views/Kids/KidsDetail';
import HomesDetail from '../views/Homes/HomesDetail';
import AdminOrgSettingsScreen from '../views/SecuritySettings/adminSettings';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { parseJwt } from '../hooks';
/**
 * List of routes available  for authenticated users
 * Also renders the "Private Layout" composition
 * @routes PrivateRoutes
 */
// const PrivateRoutes = () => {
//   return (
//     <PrivateLayout>
//       <Routes>
//          <Route path="/" element={<WelcomeView />} /> 
//          <Route
//           // This fixes other tabs with unfinished auth flow
//           path="auth/*"
//           element={<Navigate to="/" replace />}
//         /> 
        
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="about" element={<AboutView />} />
//          <Route path="kids" element={<Kids />} />
//          <Route path="kids/:kidId" element={<KidsDetail />} />
//          <Route path="homes" element={<Houses />} />
//          <Route path="homes/:id" element={<HomesDetail />} />
//          <Route path="users" element={<Users />} />
//          <Route path="settings" element={<AdminOrgSettingsScreen />} />
        
//         {process.env.REACT_APP_DEBUG && <Route path="dev" element={<DevView />} />}
//         <Route path="*" element={<NotFoundView />} />
//       </Routes>
//     </PrivateLayout>
//   );
// };

export const PrivateRoutes = (props: { children: JSX.Element}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const auth = useSelector((state: AppStore) => state.auth);


  useEffect(() => {

      if (!auth.isAuthenticated) {
        navigate('/auth/login', { replace: true });
      }

  }, [!auth.isAuthenticated && !auth.accessToken?.token]);


  if ( !auth.isAuthenticated && !auth.accessToken?.token) {

    navigate('/auth/login', { replace: true });
        
  }
  

  if (auth.isAuthenticated ) {
    
          return props.children;
      

  }
  else {
      return <div>Loading...</div>;
  }

}

export default PrivateRoutes;
