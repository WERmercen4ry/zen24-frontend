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

/*****Routes******/

// Admin
const Timetable = lazy(() => import("../views/ui/admin/Timetable.js"));
const Timetables = lazy(() => import("../views/ui/admin/Timetables.js"));
const CustomersManager = lazy(() =>
  import("../views/ui/admin/CustomersManager.js")
);
const Transactions = lazy(() => import("../views/ui/admin/Transactions.js"));
const Subscription = lazy(() => import("../views/ui/admin/Subscription.js"));
const UserForm = lazy(() => import("../views/ui/admin/UserForm.js"));
const ProfilePage = lazy(() => import("../views/ui/admin/ProfilePage.js"));
const Dashboard = lazy(() => import("../views/ui/admin/Dashboard.js"));

// User
const WorkoutHistory = lazy(() => import("../views/ui/user/WorkoutHistory.js"));
const BookingScreen = lazy(() => import("../views/ui/user/BookingScreen.js"));
const Reverse = lazy(() => import("../views/ui/user/Reverse.js"));
const NotificateDetail = lazy(() =>
  import("../views/ui/user/NotificateDetail.js")
);
const AccountOptions = lazy(() => import("../views/ui/user/AccountOptions.js"));
const ChangePassword = lazy(() => import("../views/ui/user/ChangePassword.js"));
const TrainnerCalendar = lazy(() => import("../views/ui/user/TrainnerCalendar.js"));
const Support = lazy(() => import("../views/ui/user/Support.js"));
const Policy = lazy(() => import("../views/ui/user/Policy.js"));



const ThemeRoutes = [

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminFullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="/admin/dashboard" /> },
      { path: "dashboard", exact: true, element: <Dashboard /> },
      { path: "packages", exact: true, element: <Subscription /> },
      { path: "timetable", exact: true, element: <Timetable /> },
      { path: "timetables", exact: true, element: <Timetables /> },
      {
        path: "customers-manager",
        exact: true,
        element: <CustomersManager />,
      },
      { path: "transactions", exact: true, element: <Transactions /> },
      { path: "user", exact: true, element: <UserForm /> },
      { path: "profile", exact: true, element: <ProfilePage /> },
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
      { path: "booking", exact: true, element: <BookingScreen /> },
      { path: "history", exact: true, element: <WorkoutHistory /> },
      { path: "account/reverse", exact: true, element: <Reverse /> },
      {
        path: "notification-detail",
        exact: true,
        element: <NotificateDetail />,
      }
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
      { path: "", exact: true, element: <AccountOptions /> },
      { path: "change-password", exact: true, element: <ChangePassword /> },
      { path: "update-user", exact: true, element: <UpdateUser /> },
      { path: "policy", exact: true, element: <Policy /> },
      { path: "support", exact: true, element: <Support /> },

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
      { path: "calendar", exact: true, element: <TrainnerCalendar /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
