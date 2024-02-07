import { FC, ReactNode } from "react";

type Props = {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
};

const Card: FC<Props> = ({ title, className, children }) => {
  return (
    <article className={className}>
      <div className="mx-auto flex flex-col items-center justify-center py-8">
        {title ? (
          <h1 className="mb-6 flex items-center text-3xl font-semibold text-amber-400 dark:text-amber-300">
            {title}
          </h1>
        ) : (
          ""
        )}
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          {children}
        </div>
      </div>
    </article>
  );
};

export default Card;
