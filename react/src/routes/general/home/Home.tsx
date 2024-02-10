import { FC } from "react";
import { JoinMeetingModal } from ".";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";

const Home: FC = () => {
  const { hidden: modalState, setHidden: setModalState } = useModal();

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
            fugiat rem ea.
          </p>
          <span className="flex flex-row items-center justify-center gap-x-14">
            <Button>Start a Meeting</Button>
            <Button onClick={() => setModalState(false)}>Join a Meeting</Button>
          </span>
        </hgroup>
        <h1>image</h1>
      </div>

      <JoinMeetingModal hidden={modalState} setHidden={setModalState} />
    </>
  );
};

export default Home;
