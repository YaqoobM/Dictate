import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Login, SignUp } from "./auth";
import { Home, Meeting } from "./general";
import {
  LoginRequired,
  LogoutRequired,
  Main,
  Root,
  Sidebar,
  Suspense,
} from "./layouts";
import { Calendars, Profile, Resources, Teams } from "./lazy";
import { Error, NotFound } from "./utils";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<Error />}>
      <Route element={<Main />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        <Route element={<LogoutRequired />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        <Route element={<LoginRequired />}>
          <Route element={<Suspense />}>
            <Route element={<Sidebar sidebar="meetings" />}>
              <Route path="calendars" element={<Calendars />} />
              <Route path="resources" element={<Resources />} />
            </Route>
            <Route element={<Sidebar sidebar="teams" />}>
              <Route path="teams" element={<Teams />} />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      <Route path="meeting/:meetingId" element={<Meeting />} />

      <Route element={<Main />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>,
  ),
);
