import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import * as AvatarImages from "assets/images/avatars";
import * as Icons from "assets/icons";
import { toSubstring } from "utils";
import { Owner } from "./CreateTreasury.d";

const OwnerLists: FC<{
  maxItems?: number;
  owners: Owner[];
  setOwners?: (owners: Owner[]) => void;
  showCopy?: boolean;
}> = ({ owners, setOwners, maxItems = 3, showCopy }) => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];
  const height = `h-[${maxItems * 4.5}rem]`;
  const styles = {
    ...(owners.length > maxItems
      ? {
          height: `${maxItems * 4.5}rem`,
        }
      : {}),
  };
  const classes = owners.length > maxItems ? `${height} overflow-y-scroll` : "";

  return (
    <div className={`divide-y divide-outline ${classes}`} style={styles}>
      {owners.map((owner, index) => {
        return (
          <div key={index} className="w-full flex pb-[36px]">
            <Image
              src={Avatars[index % 3]}
              layout="fixed"
              width={48}
              height={48}
              objectFit="contain"
              alt={`Avatar ${index + 1}`}
            />
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col mx-3">
                <div className="text-subtitle text-content-primary font-semibold">
                  {owner.name}
                </div>
                <div className="flex items-center text-content-primary text-xs">
                  {toSubstring(owner.wallet, showCopy ? 12 : 6, true)}{" "}
                  {showCopy && (
                    <div className="ml-2 p-2 bg-background-secondary rounded-full">
                      <Icons.CopyIcon className="text-base text-[8px]" />
                    </div>
                  )}
                </div>
              </div>
              {setOwners && (
                <div
                  onClick={() => {
                    setOwners(owners.filter((o) => o.wallet !== owner.wallet));
                  }}
                  className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer bg-background-secondary"
                >
                  <Icons.CrossIcon className="text-base text-[8px]" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OwnerLists;
