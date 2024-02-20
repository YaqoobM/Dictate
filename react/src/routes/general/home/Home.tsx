import { FC } from "react";
import { CreateMeetingModal, JoinMeetingModal } from ".";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";

const Home: FC = () => {
  const { hidden: joinMeetingModal, setHidden: setJoinMeetingModal } =
    useModal();
  const { hidden: createMeetingModal, setHidden: setCreateMeetingModal } =
    useModal();

  return (
    <>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 px-5 pt-10 text-center lg:grid-cols-2 lg:pt-20">
        <hgroup>
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300 lg:mb-4">
            My Title Here
          </h1>
          <p className="mb-8 lg:mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde qui
            provident porro cum autem quo id eveniet blanditiis perferendis.
            Assumenda ab deleniti maiores facere laboriosam cupiditate atque
            fugiat rem ea. <span>Login to access calendars.</span>
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
        <h1>image</h1>
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
