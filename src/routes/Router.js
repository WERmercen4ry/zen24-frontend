import { element } from "prop-types";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from "../views/ui/Login.js";

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
const ProfilePage = lazy(() => import("../views/ui/admin/ProfilePage .js"));
const Dashboard = lazy(() => import("../views/ui/admin/Dashboard.js"));

// User

const ThemeRoutes = [
  {
    path: "/admin",
    element: <AdminFullLayout />,
    children: [
      { path: "", element: <Navigate to="/admin/dashboard" /> },
      { path: "dashboard", exact: true, element: <Dashboard /> },
      { path: "breadcrumbs", exact: true, element: <Subscription /> },
      { path: "timetable", exact: true, element: <Timetable /> },
      { path: "timetables", exact: true, element: <Timetables /> },
      {
        path: "customers-manager",
        exact: true,
        element: <CustomersManager />,
      },
      { path: "transactions", exact: true, element: <Transactions /> },
      { path: "create-user", exact: true, element: <UserForm /> },
      { path: "profile", exact: true, element: <ProfilePage /> },
    ],
  },
  {
    path: "/",
    element: <UserFullLayout />,
    children: [
      { path: "", element: <Navigate to="/dashboard" /> },
      { path: "dashboard", exact: true, element: <Dashboard /> },
      { path: "breadcrumbs", exact: true, element: <Subscription /> },
      { path: "timetable", exact: true, element: <Timetable /> },
      { path: "timetables", exact: true, element: <Timetables /> },
      {
        path: "customers-manager",
        exact: true,
        element: <CustomersManager />,
      },
      { path: "transactions", exact: true, element: <Transactions /> },
      { path: "create-user", exact: true, element: <UserForm /> },
      { path: "profile", exact: true, element: <ProfilePage /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
