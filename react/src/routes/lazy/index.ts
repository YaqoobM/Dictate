import { FC, lazy } from "react";

/*
Importing entire module instead of individual components to group lazy bundle
- i.e. import("../user") instead of import("../user/calendars")
*/
const Calendars: FC = lazy(() => {
  return import("../user").then((module) => {
    return { default: module.Calendars };
  });
});
const Profile: FC = lazy(() => {
  return import("../user").then((module) => {
    return { default: module.Profile };
  });
});
const Resources: FC = lazy(() => {
  return import("../user").then((module) => {
    return { default: module.Resources };
  });
});
const Teams: FC = lazy(() => {
  return import("../user").then((module) => {
    return { default: module.Teams };
  });
});

export { Calendars, Profile, Resources, Teams };
