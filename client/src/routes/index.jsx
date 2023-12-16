import MainLayout from '@layouts/MainLayout';
import AdminLayout from '@layouts/AdminLayout';

import ForgotPassword from '@pages/ForgotPassword';
import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';
import PaymentResponse from '@pages/PaymentResponse';
import CallBack from '@pages/CallBack';
import UserProfile from '@pages/UserProfile';
import Reservation from '@pages/Reservation';
import DetailCabins from '@pages/DetailCabins';
import CreateDeatilCabin from '@pages/CreateDeatilCabin';
import Orders from '@pages/Orders';

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
    path: '/user/orders',
    name: 'User Orders',
    protected: true,
    component: Orders,
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
  {
    path: '/reservation/:slugCabin/:roomId',
    name: 'Reservation',
    protected: true,
    component: Reservation,
    adminOnly: false,
    layout: MainLayout,
  },
  {
    path: '/cabins/:slugCabin',
    name: 'Detail Cabins',
    protected: false,
    component: DetailCabins,
    adminOnly: false,
    layout: MainLayout,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    protected: true,
    component: CreateDeatilCabin,
    adminOnly: true,
    layout: AdminLayout,
  },

  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
