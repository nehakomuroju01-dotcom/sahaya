import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Feed from "./pages/Feed";
import CreateDonation from "./pages/CreateDonation";
import DonationDetails from "./pages/DonationDetails";
import MyClaims from "./pages/MyClaims";
import MyDonations from "./pages/MyDonations";
import AdminReceivers from "./pages/AdminReceivers";
import VolunteerMissions from "./pages/VolunteerMissions";
import ChatWidget from "./components/ChatWidget";
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/feed" className="logo" aria-label="Sahaya home">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M7 28C14 27 18 21 20 10C12 12 7 17 7 28Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M10 33C18 26 24 19 30 8"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M21 23C21 16 27 11 34 12C34 19 29 24 21 23Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            sahaya<span className="logo-period">.</span>
          </span>
        </Link>

        <nav className="nav-actions">
          {user ? (
            <>
              {user.role === "DONOR" && (
                <Link to="/my-donations" className="btn btn-secondary">
                  My Donations
                </Link>
              )}

              {user.role === "RECEIVER_ORG" && (
                <Link to="/my-claims" className="btn btn-secondary">
                  My Claims
                </Link>
              )}

              {user.role === "ADMIN" && (
                <Link to="/admin/receivers" className="btn btn-secondary">
                  Verify Receivers
                </Link>
              )}

              {user.role === "VOLUNTEER" && (
                <Link to="/missions" className="btn btn-secondary">
                  Missions
                </Link>
              )}

              {user.role === "DONOR" && (
                <Link to="/create" className="btn btn-primary">
                  <span aria-hidden="true">+</span> Donate
                </Link>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
  path="/admin/receivers"
  element={
    <RoleRoute allowedRoles={["ADMIN"]}>
      <AdminReceivers />
    </RoleRoute>
  }
/>
        <Route
  path="/my-donations"
  element={
    <RoleRoute allowedRoles={["DONOR"]}>
      <MyDonations />
    </RoleRoute>
  }
/>

        <Route
          path="/donations/:id"
          element={<DonationDetails />}
        />

        <Route
          path="/create"
          element={
            <RoleRoute allowedRoles={["DONOR"]}>
              <CreateDonation />
            </RoleRoute>
          }
        />

        <Route
          path="/my-claims"
          element={
            <RoleRoute allowedRoles={["RECEIVER_ORG"]}>
              <MyClaims />
            </RoleRoute>
          }
        />

        <Route
          path="/missions"
          element={
            <RoleRoute allowedRoles={["VOLUNTEER"]}>
              <VolunteerMissions />
            </RoleRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/feed" replace />}
        />
      </Routes>

      <ChatWidget />
    </>
  );
}