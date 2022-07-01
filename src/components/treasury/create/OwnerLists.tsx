import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import * as AvatarImages from "assets/images/avatars";
import * as Icons from "assets/icons";
import { toSubstring } from "utils";
import { Owner } from "./CreateTreasury.d";
import { IconButton } from "components/shared";
import CopyButton from "components/shared/CopyButton";

const OwnerLists: FC<{
  maxItems?: number;
  owners: Owner[];
  setOwners?: (owners: Owner[]) => void;
  showCopy?: boolean;
  className?: string;
}> = ({ owners, setOwners, maxItems = 3, showCopy, className = ""}) => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];
  const height = `h-[${maxItems * 4.5}rem]`;
  // const styles = {
  //   ...(owners.length > maxItems
  //     ? {
  //         height: `${maxItems * 4.5}rem`,
  //       }
  //     : {}),
  // };
  const classes = owners.length > maxItems ? `${height} overflow-y-scroll` : "";
  const rowClasses = owners.length > maxItems ? `pr-[8px]` : "";

  return (
    <div className={`divide-y divide-outline ${classes} ${className}`}>
      {owners.map((owner, index) => {
        return (
          <div key={index} className="w-full flex py-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={Avatars[index % 3].src}
              width={48}
              height={48}
              className="object-contain"
              alt={`Avatar ${index + 1}`}
            />
            <div className={`flex flex-1 justify-between items-center ${rowClasses}`}>
              <div className="flex  flex-col mx-3">
                <div className="text-subtitle text-content-primary font-semibold">
                  {owner.name}
                </div>
                <div className="flex items-center text-content-primary text-body">
                  {toSubstring(owner.wallet, showCopy ? 12 : 6, true)}{" "}
                  {showCopy && (
                    <CopyButton className="ml-[5px]" content={owner.wallet}/>
                  )}
                </div>
              </div>
              {setOwners && (
                <IconButton
                  onClick={() => {
                    setOwners(owners.filter((o) => o.wallet !== owner.wallet));
                  }}
                  className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer bg-background-secondary"
                  icon={<Icons.CrossIcon className="text-base" />}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OwnerLists;
