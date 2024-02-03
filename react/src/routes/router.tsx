import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Login, ProtectedRoute, SignUp } from "./auth";
import { Home, Meeting } from "./general";
import { Root } from "./layouts";
import { Calendars, Profile, Resources, Teams } from "./lazy";
import { Error } from "./utils";

// todo: fix paths (variables)
// add Suspense for lazy routes

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="meeting/:meetingId" element={<Meeting />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />

      <Route
        path="calendars"
        element={
          <ProtectedRoute>
            <Calendars />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />
      <Route
        path="teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);
