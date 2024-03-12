import { lazy } from "react";

const Notes = lazy(() => {
  return import("../notes").then((module) => {
    return { default: module.Notes };
  });
});

export { Notes };
