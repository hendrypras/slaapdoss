import MainLayout from '@layouts/MainLayout';

import ForgotPassword from '@pages/ForgotPassword';
import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';
import PaymentResponse from '@pages/PaymentResponse';
import CallBack from '@pages/CallBack';
import UserProfile from '@pages/UserProfile';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
    adminOnly: false,
  },
  {
    path: '/login',
    name: 'Login',
    protected: false,
    component: Login,
    adminOnly: false,
  },
  {
    path: '/register',
    name: 'Register',
    protected: false,
    adminOnly: false,
    component: Register,
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    protected: false,
    adminOnly: false,
    component: ForgotPassword,
  },
  {
    path: '/reset-password/:token',
    name: 'Reset Password',
    protected: false,
    component: ResetPassword,
    adminOnly: false,
  },
  {
    path: '/payment/:status/:orderId',
    name: 'Response Payment',
    protected: true,
    component: PaymentResponse,
    adminOnly: false,
    layout: MainLayout,
  },
  {
    path: '/user/profile',
    name: 'User Profile',
    protected: true,
    component: UserProfile,
    adminOnly: false,
    layout: MainLayout,
  },
  {
    path: '/callback/:status/:data',
    name: 'Call Back page',
    protected: false,
    component: CallBack,
    adminOnly: false,
  },

  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
