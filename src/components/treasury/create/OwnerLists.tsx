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
}> = ({ owners, setOwners, maxItems = 3, showCopy, className = "" }) => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];
  const styles = {
    ...(owners.length > maxItems
      ? {
          height: `${maxItems * 4.5}rem`,
        }
      : {}),
  };
  const classes = owners.length > maxItems ? `overflow-y-scroll` : "";
  const rowClasses = owners.length > maxItems ? `pr-5` : "";

  return (
    <div
      className={`divide-y divide-outline ${classes} ${className}`}
      style={styles}
    >
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
            <div
              className={`flex flex-1 justify-between items-center ${rowClasses}`}
            >
              <div className="flex  flex-col mx-3">
                <div className="text-subtitle text-content-primary font-semibold">
                  {owner.name}
                </div>
                <div className="flex items-center text-content-primary text-body">
                  {toSubstring(owner.wallet, 10, true)}{" "}
                  {showCopy && (
                    <div className="ml-1.5 w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                      <CopyButton content={owner.wallet} />
                    </div>
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
