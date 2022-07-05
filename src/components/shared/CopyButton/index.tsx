import React from "react";
import * as Icons from "assets/icons";

const CopyButton: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className = '' }) => {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  return (
    <>
      {isClicked ? (
        <Icons.CheckIcon
          onClick={(e: Event) => {
            e.stopPropagation();
          }}
          className={`text-base cursor-pointer text-success transition ease-in-out delay-150 ${className}`}
        />
      ) : (
        <Icons.CopyIcon
          onClick={(e: Event) => {
            e.stopPropagation();
            setIsClicked(true);
            setTimeout(() => {
              setIsClicked(false);
            }, 800);
            navigator.clipboard.writeText(content);
          }}
          className={`text-base cursor-pointer ${className}`}
        />
      )}
    </>
  );
};

export default CopyButton;
