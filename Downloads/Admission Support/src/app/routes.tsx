import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import Home from "./pages/Home";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import AdmissionSupport from "./pages/AdmissionSupport";
import MedicalAdmission from "./pages/MedicalAdmission";
import Accommodation from "./pages/Accommodation";
import Tutorial from "./pages/Tutorial";
import Notice from "./pages/Notice";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import PolytechnicAdmission from "./pages/PolytechnicAdmission";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      { path: "universities", Component: Universities },
      { path: "universities/:id", Component: UniversityDetail },
      { path: "admission-bondu", Component: AdmissionSupport },
      { path: "medical-admission", Component: MedicalAdmission },
      { path: "polytechnic-admission", Component: PolytechnicAdmission },
      { path: "accommodation", Component: Accommodation },
      { path: "tutorial", Component: Tutorial },
      { path: "notice", Component: Notice },
      { path: "dashboard", Component: Dashboard },
      { path: "login", Component: Login },
      { path: "contact", Component: Contact },
      { path: "*", Component: ErrorPage },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, Component: Admin },
      { path: "login", Component: AdminLogin },
    ],
  },
]);
