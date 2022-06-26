import React from "react";
import * as Icons from "assets/icons";

const CopyButton: React.FC<{
  content: string;
}> = ({ content }) => {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  return (
    <>
      {isClicked ? (
        <Icons.CheckIcon
          onClick={(e: Event) => {
            e.stopPropagation();
          }}
          className="text-base text-primary transition ease-in-out delay-150"
        />
      ) : (
        <Icons.CopyIcon
          onClick={(e: Event) => {
            e.stopPropagation();
            setIsClicked(true);
            setTimeout(() => {
              setIsClicked(false);
            }, 1000);
            navigator.clipboard.writeText(content);
          }}
          className="text-base"
        />
      )}
    </>
  );
};

export default CopyButton;
