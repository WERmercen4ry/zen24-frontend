import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from "../views/ui/Login.js";
import UpdateUser from "../views/ui/user/UpdateUser.js";
import ProtectedRoute from "../utils/ProtectedRoute.js";

/****Layouts*****/
const AdminFullLayout = lazy(() =>
  import("../layouts/admin/AdminFullLayout.js")
);
const UserFullLayout = lazy(() => import("../layouts/user/UserFullLayout.js"));

const NotFound = lazy(() => import("../layouts/not_found/NotFound.js"));
/*****Routes******/

// Admin
const Timetable = lazy(() => import("../views/ui/admin/Timetable.js"));
const Timetables = lazy(() => import("../views/ui/admin/Timetables.js"));
const CustomersManager = lazy(() =>
  import("../views/ui/admin/CustomersManager.js")
);
const Transactions = lazy(() => import("../views/ui/admin/Transactions.js"));
const Transaction = lazy(() => import("../views/ui/admin/Transaction.js"));

const Subscription = lazy(() => import("../views/ui/admin/Subscription.js"));
const UserForm = lazy(() => import("../views/ui/admin/UserForm.js"));
const ProfilePage = lazy(() => import("../views/ui/admin/ProfilePage.js"));
const Dashboard = lazy(() => import("../views/ui/admin/Dashboard.js"));
const Locations = lazy(() => import("../views/ui/admin/Locations.js"));


// User
const WorkoutHistory = lazy(() => import("../views/ui/user/WorkoutHistory.js"));
const BookingScreen = lazy(() => import("../views/ui/user/BookingScreen.js"));
const Reverse = lazy(() => import("../views/ui/user/Reverse.js"));
const NotificateDetail = lazy(() =>
  import("../views/ui/user/NotificateDetail.js")
);
const AccountOptions = lazy(() => import("../views/ui/user/AccountOptions.js"));
const ChangePassword = lazy(() => import("../views/ui/user/ChangePassword.js"));
const TrainnerCalendar = lazy(() =>
  import("../views/ui/user/TrainnerCalendar.js")
);
const Support = lazy(() => import("../views/ui/user/Support.js"));
const Policy = lazy(() => import("../views/ui/user/Policy.js"));

const ThemeRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin","receptionist"]}>
        <AdminFullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/admin/dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "packages", element: <Subscription /> },
      { path: "timetable", element: <Timetable /> },
      { path: "timetables", element: <Timetables /> },
      {
        path: "customers-manager",

        element: <CustomersManager />,
      },
      { path: "transactions", element: <Transactions /> },
      { path: "transaction", element: <Transaction /> },

      { path: "user", element: <UserForm /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "locations", element: <Locations /> },

    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["Student"]}>
        <UserFullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/booking" /> },
      { path: "booking", element: <BookingScreen /> },
      { path: "history", element: <WorkoutHistory /> },
      { path: "account/reverse", element: <Reverse /> },
      {
        path: "notification-detail",

        element: <NotificateDetail />,
      },
    ],
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute allowedRoles={["Student", "Trainer"]}>
        <UserFullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <AccountOptions /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "update-user", element: <UpdateUser /> },
      { path: "policy", element: <Policy /> },
      { path: "support", element: <Support /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["Trainer"]}>
        <UserFullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/calendar" /> },
      { path: "calendar", element: <TrainnerCalendar /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*", // Bắt mọi URL không khớp
    element: <NotFound />, // Chuyển hướng sang trang NotFound
  },
];

export default ThemeRoutes;
