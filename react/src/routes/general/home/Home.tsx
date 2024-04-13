import { FC } from "react";
import { Link } from "react-router-dom";
import { CreateMeetingModal, JoinMeetingModal } from ".";
import { Globe } from "../../../assets/art";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";

const Home: FC = () => {
  const { hidden: joinMeetingModal, setHidden: setJoinMeetingModal } =
    useModal();
  const { hidden: createMeetingModal, setHidden: setCreateMeetingModal } =
    useModal();

  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center justify-items-center gap-x-16 gap-y-20 px-10 py-10 text-center lg:grid-cols-2 lg:py-20">
          <hgroup>
            <h1 className="mb-6 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300 lg:mb-4">
              real-time, face-to-face, fast meetings
            </h1>
            <p className="mb-8 lg:mb-6">
              Access quick, response and high quality meetings with your team
              now! Start a meeting below or join an ongoing meeting using your
              custom meeting link.{" "}
              <Link to="/login" className="text-amber-500 dark:text-amber-300">
                Login
              </Link>{" "}
              or{" "}
              <Link
                to="/signup"
                className="capitalize text-amber-500 dark:text-amber-300"
              >
                create an account
              </Link>{" "}
              to access team calendars, recordings and much more!
            </p>
            <span className="flex flex-row items-center justify-center gap-x-14">
              <Button onClick={() => setCreateMeetingModal(false)}>
                Start a Meeting
              </Button>
              <Button onClick={() => setJoinMeetingModal(false)}>
                Join a Meeting
              </Button>
            </span>
          </hgroup>
          <Globe className="max-w-[500px] stroke-amber-500 dark:stroke-amber-300" />
        </div>
      </div>

      <JoinMeetingModal
        hidden={joinMeetingModal}
        setHidden={setJoinMeetingModal}
      />
      <CreateMeetingModal
        hidden={createMeetingModal}
        setHidden={setCreateMeetingModal}
      />
    </>
  );
};

export default Home;
