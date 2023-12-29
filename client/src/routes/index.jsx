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
import CreateCabin from '@pages/CreateCabin';
import Orders from '@pages/Orders';
import CreateTypeRoom from '@pages/CreateTypeRoom';
import CreateBanner from '@pages/CreateBanner';
import OrdersAdmin from '@pages/OrdersAdmin';
import CreateRoom from '@pages/CreateRoom';
import ListBanner from '@pages/ListBanner';
import EditTypeRoom from '@pages/EditTypeRoom';

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
    userOnly: true,
    layout: MainLayout,
  },
  {
    path: '/user/profile',
    name: 'User Profile',
    protected: true,
    component: UserProfile,
    adminOnly: false,
    userOnly: true,
    layout: MainLayout,
  },
  {
    path: '/user/orders',
    name: 'User Orders',
    protected: true,
    component: Orders,
    adminOnly: false,
    userOnly: true,
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
    userOnly: true,
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
    path: '/dashboard/create-cabin',
    name: 'dashboard create cabin',
    protected: true,
    component: CreateCabin,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/create-type-room',
    name: 'dashboard create cabin',
    protected: true,
    component: CreateTypeRoom,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/edit-type-room/:typeRoomId',
    name: 'dashboard update cabin',
    protected: true,
    component: EditTypeRoom,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/create-room',
    name: 'dashboard create room',
    protected: true,
    component: CreateRoom,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/create-banner',
    name: 'dashboard create banner',
    protected: true,
    component: CreateBanner,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/list-order',
    name: 'dashboard list order',
    protected: true,
    component: OrdersAdmin,
    adminOnly: true,
    layout: AdminLayout,
  },
  {
    path: '/dashboard/list-banner',
    name: 'dashboard list banner',
    protected: true,
    component: ListBanner,
    adminOnly: true,
    layout: AdminLayout,
  },

  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
