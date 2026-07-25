import { Navigate, createBrowserRouter } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LoginAccountPicker from './pages/auth/LoginAccountPicker';
import SignupAccountPicker from './pages/auth/SignupAccountPicker';
import GoogleCallback from './pages/auth/GoogleCallback';

import CustomerLayout from './layouts/CustomerLayout';
import Coupons from './pages/customer/Coupons';
import VendorBranches from './pages/customer/VendorBranches';
import BranchLoyalty from './pages/customer/BranchLoyalty';
import History from './pages/customer/History';
import ClaimReward from './pages/customer/ClaimReward';
import MyQRCode from './pages/customer/MyQRCode';
import Location from './pages/customer/Location';
import CustomerProfile from './pages/customer/Profile';

import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProfile from './pages/vendor/Profile';
import VendorEditProfile from './pages/vendor/EditProfile';
import ShopSetup from './pages/vendor/ShopSetup';
import Promotions from './pages/vendor/Promotions';
import CreatePromotion from './pages/vendor/CreatePromotion';
import EditPromotion from './pages/vendor/EditPromotion';
import Branches from './pages/vendor/Branches';
import BranchDetail from './pages/vendor/BranchDetail';
import AddEditBranch from './pages/vendor/AddEditBranch';
import Scanner from './pages/vendor/Scanner';
import UserWallet from './pages/vendor/UserWallet';
import Activity from './pages/vendor/Activity';
import VendorAnalytics from './pages/vendor/Analytics';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import VendorApprovals from './pages/admin/VendorApprovals';
import ReviewVendor from './pages/admin/ReviewVendor';
import AdminAnalytics from './pages/admin/Analytics';
import More from './pages/admin/More';

export const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/auth/google/complete', element: <GoogleCallback /> },

    { path: '/login', element: <Login /> },
    { path: '/login/choose-account', element: <LoginAccountPicker /> },
    { path: '/signup', element: <Signup /> },
    { path: '/signup/choose-account', element: <SignupAccountPicker /> },

    // Customer
    {
        element: <RequireAuth role="customer" />,
        children: [
            {
                path: '/customer',
                element: <CustomerLayout />,
                children: [
                    { index: true, element: <Navigate to="coupons" replace /> },
                    { path: 'coupons', element: <Coupons /> },
                    { path: 'vendors/:vendorId/branches', element: <VendorBranches /> },
                    { path: 'vendors/:vendorId/branches/:branchId', element: <BranchLoyalty /> },
                    { path: 'vendors/:vendorId/history', element: <History /> },
                    { path: 'vendors/:vendorId/claim-reward', element: <ClaimReward /> },
                    { path: 'qr-code', element: <MyQRCode /> },
                    { path: 'location', element: <Location /> },
                    { path: 'profile', element: <CustomerProfile /> },
                ],
            },
        ],
    },

    // Vendor
    {
        element: <RequireAuth role="vendor" />,
        children: [
            {
                path: '/vendor',
                element: <VendorLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <VendorDashboard /> },
                    { path: 'shop-setup', element: <ShopSetup /> },
                    { path: 'profile', element: <VendorProfile /> },
                    { path: 'profile/edit', element: <VendorEditProfile /> },
                    { path: 'promotions', element: <Promotions /> },
                    { path: 'promotions/create', element: <CreatePromotion /> },
                    { path: 'promotions/:promotionId/edit', element: <EditPromotion /> },
                    { path: 'branches', element: <Branches /> },
                    { path: 'branches/new', element: <AddEditBranch /> },
                    { path: 'branches/:branchId', element: <BranchDetail /> },
                    { path: 'branches/:branchId/edit', element: <AddEditBranch /> },
                    { path: 'scanner', element: <Scanner /> },
                    { path: 'wallet/:customerId', element: <UserWallet /> },
                    { path: 'activity', element: <Activity /> },
                    { path: 'analytics', element: <VendorAnalytics /> },
                ],
            },
        ],
    },

    // Branch Staff
    {
        element: <RequireAuth role="branch_staff" />,
        children: [
            {
                path: '/staff',
                element: <VendorLayout />,
                children: [
                    { index: true, element: <Navigate to="scanner" replace /> },
                    { path: 'scanner', element: <Scanner basePath="/staff" /> },
                    { path: 'wallet/:customerId', element: <UserWallet /> },
                ],
            },
        ],
    },

    // Admin
    {
        element: <RequireAuth role="admin" />,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <AdminDashboard /> },
                    { path: 'vendors', element: <VendorApprovals /> },
                    { path: 'vendors/:vendorId/review', element: <ReviewVendor /> },
                    { path: 'analytics', element: <AdminAnalytics /> },
                    { path: 'more', element: <More /> },
                ],
            },
        ],
    },

    { path: '*', element: <Navigate to="/login" replace /> },
]);
