import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "./lib/supabaseClient";


import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Toaster } from "react-hot-toast";

import { StudentDashboard } from "./pages/StudentDashboard";
import { StudentEvents } from "./pages/StudentEvents";
import { StudentRegistrations } from "./pages/StudentRegistrations";
import { StudentAttendance } from "./pages/StudentAttendance";
import { ProfileCompletion } from "./pages/ProfileCompletion";
import { StudentNotifications } from "./pages/StudentNotifications";
import { StudentClubs } from "./pages/StudentClubs";
import { ClubAdminManageClubs } from "./pages/ClubAdminManageClubs";
import { ClubAdminDashboard } from "./pages/ClubAdminDashboard";
import { ClubAdminCreateEvent } from "./pages/ClubAdminCreateEvent";
import { ClubAdminManageEvents } from "./pages/ClubAdminManageEvents";
import { ClubAdminRegisteredStudents } from "./pages/ClubAdminRegisteredStudents";
import { ClubAdminAttendanceRequest } from "./pages/ClubAdminAttendanceRequest";
import { ClubAdminCreateClub } from "./pages/ClubAdminCreateClub";
import { FacultyDashboard } from "./pages/FacultyDashboard";
import { FacultyAttendanceRequests } from "./pages/FacultyAttendanceRequests";
import { FacultyChat } from "./pages/FacultyChat";
import { FacultyNotifications } from "./pages/FacultyNotifications";

function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: "student" | "club_admin" | "faculty";
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      navigate({ to: "/auth" });
      return;
    }

    const userRole = data.session.user.user_metadata?.role;

    if (userRole !== allowedRole) {
      if (userRole === "student") {
        navigate({ to: "/student/dashboard" });
      } else if (userRole === "club_admin") {
        navigate({ to: "/club-admin/dashboard" });
      } else if (userRole === "faculty") {
        navigate({ to: "/faculty/dashboard" });
      } else {
        navigate({ to: "/auth" });
      }
      return;
    }

    setChecking(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main>
        <Outlet />
      </main>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  ),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Auth,
});

const profileCompletionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/profile-completion",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <ProfileCompletion />
    </ProtectedRoute>
  ),
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/dashboard",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  ),
});
const studentClubsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/clubs",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentClubs />
    </ProtectedRoute>
  ),
});
const studentEventsRoute = createRoute({
  
  getParentRoute: () => rootRoute,
  path: "/student/events",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentEvents />
    </ProtectedRoute>
  ),
});

const studentRegistrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/registrations",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentRegistrations />
    </ProtectedRoute>
  ),
});

const studentAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/attendance",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentAttendance />
    </ProtectedRoute>
  ),
});

const studentNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/notifications",
  component: () => (
    <ProtectedRoute allowedRole="student">
      <StudentNotifications />
    </ProtectedRoute>
  ),
});

const clubAdminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/dashboard",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminDashboard />
    </ProtectedRoute>
  ),
});

const clubAdminCreateEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/create-event",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminCreateEvent />
    </ProtectedRoute>
  ),
});

const clubAdminManageEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/manage-events",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminManageEvents />
    </ProtectedRoute>
  ),
});

const clubAdminRegisteredStudentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/registered-students",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminRegisteredStudents />
    </ProtectedRoute>
  ),
});

const clubAdminAttendanceRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/attendance-request",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminAttendanceRequest />
    </ProtectedRoute>
  ),
});
const clubAdminCreateClubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/create-club",
  component: ClubAdminCreateClub,
});
const clubAdminManageClubsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/club-admin/manage-clubs",
  component: () => (
    <ProtectedRoute allowedRole="club_admin">
      <ClubAdminManageClubs />
    </ProtectedRoute>
  ),
});
const facultyDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty/dashboard",
  component: () => (
    <ProtectedRoute allowedRole="faculty">
      <FacultyDashboard />
    </ProtectedRoute>
  ),
});

const facultyAttendanceRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty/attendance-requests",
  component: () => (
    <ProtectedRoute allowedRole="faculty">
      <FacultyAttendanceRequests />
    </ProtectedRoute>
  ),
});

const facultyChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty/chat",
  component: () => (
    <ProtectedRoute allowedRole="faculty">
      <FacultyChat />
    </ProtectedRoute>
  ),
});

const facultyNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty/notifications",
  component: () => (
    <ProtectedRoute allowedRole="faculty">
      <FacultyNotifications />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,

  profileCompletionRoute,

  studentDashboardRoute,
  studentEventsRoute,
  studentRegistrationsRoute,
  studentAttendanceRoute,
  studentNotificationsRoute,
studentClubsRoute,
  clubAdminDashboardRoute,
  clubAdminCreateEventRoute,
  clubAdminManageEventsRoute,
  clubAdminRegisteredStudentsRoute,
  clubAdminAttendanceRequestRoute,
  clubAdminCreateClubRoute,
  clubAdminManageClubsRoute,

  facultyDashboardRoute,
  facultyAttendanceRequestsRoute,
  facultyChatRoute,
  facultyNotificationsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}