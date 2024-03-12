import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Arrow as ArrowIcon } from "../../../assets/icons/symbols";
import { ProfilePicture } from "../../../assets/icons/user";
import { useModal } from "../../../hooks/components";
import { useGetTeams } from "../../../hooks/teams";
import { useGetProfile } from "../../../hooks/user";
import { DeleteAccountModal, EditProfileModal } from "./modals";

const Profile: FC = () => {
  const navigate = useNavigate();

  const {
    hidden: hideDeleteAccountModal,
    setHidden: setHideDeleteAccountModal,
  } = useModal();

  const { hidden: hideEditProfileModal, setHidden: setHideEditProfileModal } =
    useModal();

  const { user } = useGetProfile();

  const { teams } = useGetTeams();

  return (
    <div className="mx-auto my-5 px-10 md:mt-10 md:px-16">
      <div className="mx-auto w-max align-top md:inline-block">
        <ProfilePicture className="size-36" />
      </div>
      <div className="mt-10 w-max min-w-52 align-top md:ml-10 md:mt-2 md:inline-block lg:ml-20">
        <h1 className="text-lg font-medium text-amber-500 dark:text-amber-300">
          Profile
        </h1>
        <h2>username: {user?.username}</h2>
        <h2>email: {user?.email}</h2>
        <h2>password: *********</h2>
        <h2
          className="group mt-2 flex w-max cursor-pointer flex-row gap-x-1 py-px text-[15px] uppercase transition-all hover:gap-x-2"
          onClick={() => setHideEditProfileModal(false)}
        >
          <span className="group-hover:text-amber-500 group-hover:dark:text-amber-300">
            Update Information
          </span>
          <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
        </h2>
        <h2
          className="group flex w-max cursor-pointer flex-row gap-x-1 py-px text-[15px] uppercase transition-all hover:gap-x-2"
          onClick={() => setHideDeleteAccountModal(false)}
        >
          <span className="group-hover:text-amber-500 group-hover:dark:text-amber-300">
            Delete Account
          </span>
          <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
        </h2>
      </div>
      <div className="mt-10 w-max min-w-52 align-top md:ml-10 md:mt-2 md:inline-block lg:ml-20">
        <h1 className="text-lg font-medium text-amber-500 dark:text-amber-300">
          Teams
        </h1>
        {teams && teams.length > 0 ? (
          teams.map((team) => <h2 key={team.id}>{team.name}</h2>)
        ) : (
          <h2>No teams available</h2>
        )}
        <h2
          className="group mt-2 flex w-max cursor-pointer flex-row gap-x-1 py-px text-[15px] uppercase transition-all hover:gap-x-2"
          onClick={() => navigate("/teams")}
        >
          <span className="group-hover:text-amber-500 group-hover:dark:text-amber-300">
            View Teams
          </span>
          <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
        </h2>
      </div>

      <EditProfileModal
        hidden={hideEditProfileModal}
        setHidden={setHideEditProfileModal}
      />

      <DeleteAccountModal
        hidden={hideDeleteAccountModal}
        setHidden={setHideDeleteAccountModal}
      />
    </div>
  );
};

export default Profile;
