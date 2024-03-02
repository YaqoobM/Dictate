import { FC } from "react";
import { FilledResources } from ".";

type Props = {
  resources: FilledResources;
};

const Resources: FC<Props> = ({ resources }) => {
  return <div>{resources.map((resource) => resource.id).join(", ")}</div>;
};

export default Resources;
