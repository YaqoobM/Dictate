import { FC } from "react";
import { GridElement } from ".";
import { FilledResources } from "..";
import { useGetParticipants } from "../../../../hooks/meetings";
import { Meeting } from "../../../../types";

type Props = {
  resources: FilledResources;
};

const ResourcesGrid: FC<Props> = ({ resources }) => {
  const {
    participants,
    isPending: isParticipantsPending,
    isError: isParticipantsError,
  } = useGetParticipants(
    resources.map<Meeting>((resource) => resource.meetingObject),
  );

  return (
    <div className="flex w-full flex-row flex-wrap gap-4">
      {resources.length > 0 ? (
        resources.map((resource) => (
          <GridElement
            resource={resource}
            participants={participants}
            isParticipantsPending={isParticipantsPending}
            isParticipantsError={isParticipantsError}
            key={`${resource.resource}_${resource.id}`}
          />
        ))
      ) : (
        <h1 className="text-lg text-amber-500 dark:text-amber-300">
          No Resources Available
        </h1>
      )}
    </div>
  );
};

export default ResourcesGrid;
