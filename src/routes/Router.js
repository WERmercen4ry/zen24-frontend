import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/

// Zen pilates
const Timetable = lazy(() => import("../views/ui/Timetable.js"));
const Timetables = lazy(() => import("../views/ui/Timetables.js"));
const CustomersManager = lazy(() => import("../views/ui/CustomersManager.js"));
const Transactions = lazy(() => import("../views/ui/Transactions.js"));
const Subscription = lazy(() => import("../views/ui/Subscription.js"));
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/about", exact: true, element: <About /> },
      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Subscription /> },
      { path: "/timetable", exact: true, element: <Timetable /> },
      { path: "/timetables", exact: true, element: <Timetables /> },
      { path: "/customers-manager", exact: true, element: <CustomersManager /> },
      { path: "/transactions", exact: true, element: <Transactions /> },

    ],
  },
];

export default ThemeRoutes;
