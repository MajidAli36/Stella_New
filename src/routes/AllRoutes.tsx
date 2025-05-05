import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layout';
import { NotFoundView } from '../views';
import AboutView from '../views/About';
import DevView from '../views/Dev';
import LoginEmailView from '../views/Auth/Login/LoginEmailView';
import AuthRoutes from '../views/Auth';
import Dashboard from '../views/Dashboard/index';
import Kids from '../views/Kids/index';
import Houses from '../views/Homes';
import KidsDetail from '../views/Kids/KidsDetail';
import HomesDetail from '../views/Homes/HomesDetail';
import Users from '../views/Users';
import AdminOrgSettingsScreen from '../views/SecuritySettings/adminSettings';
import PrivateRoutes from './PrivateRoutes';
import WelcomeView from '../views/Welcome';
import { useAuthWatchdog, useIsAuthenticated } from '../hooks';
import { Sample } from '../views/Kids/Sample';
import StepperForm from '../views/Kids/StepperForm';
import CoachingStepperForm from '../views/Kids/CoachingStepperForm';
import Reports from '../views/Reports';
import FullActivityLog from '../views/Kids/FullActivityLog';
import Policy from '../views/Policy/index';

/**
 * List of routes available for anonymous users
 * Also renders the "Public Layout" composition
 * @routes PublicRoutes
 */
const AllRoutes = () => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <PublicLayout>
      <Routes>
        <Route path="sample" element={<CoachingStepperForm />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="/" element={isAuthenticated == true ? <WelcomeView /> : <LoginEmailView />} />
        <Route path="dashboard" element={<PrivateRoutes children={<Dashboard />} />} />
        <Route
          path="kids"
          element={<PrivateRoutes children={<Kids />} />}
        />
        <Route path="kids/:kidId" element={<PrivateRoutes children={<KidsDetail />} />} />
        <Route path="activities/:kidId" element={<PrivateRoutes children={<FullActivityLog />} />} />
        <Route path="homes" element={<PrivateRoutes children={<Houses />} />} />
        <Route path="policy" element={<PrivateRoutes children={<Policy />} />} />
        <Route path="reports" element={<PrivateRoutes children={<Reports/>} />} />
        <Route path="homes/:hId" element={<PrivateRoutes children={<HomesDetail />} />} />
        <Route path="users" element={<PrivateRoutes children={<Users />} />} />
        {/* <Route path="settings" element={<PrivateRoutes children={<AdminOrgSettingsScreen />} />} /> */}
        {process.env.REACT_APP_DEBUG === 'true' && <Route path="dev" element={<DevView />} />}
        <Route path="*" element={<NotFoundView />} />
        {/* <Route path="/" element={<LoginEmailView />} />
       
         <Route path="dashboard" element={<Dashboard />} />
        <Route path="kids" element={<Kids />} />
        <Route path="kids/:kidId" element={<KidsDetail />} />
        <Route path="about" element={<AboutView />} /> 
        <Route path="homes" element={<Houses />} />
        <Route path="homes/:id" element={<HomesDetail />} />
=
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<AdminOrgSettingsScreen />} />
        {process.env.REACT_APP_DEBUG === 'true' && <Route path="dev" element={<DevView />} />}
        <Route path="*" element={<NotFoundView />} /> */}
      </Routes>
    </PublicLayout>
  );
};

export default AllRoutes;
