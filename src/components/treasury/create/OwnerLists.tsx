import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import * as AvatarImages from "assets/images/avatars";
import * as Icons from "assets/icons";
import { toSubstring } from "utils";
import { Owner } from "./CreateTreasury.d";

// const owners = [
//   {
//     id: "1",
//     name: "Your",
//     wallet: "1AdXF3rBme...179frUSDuV",
//   },
//   {
//     id: "2",
//     name: "Owner1",
//     wallet: "mu2Meswu9Q...RKFKzZpDXYq",
//   },
//   {
//     id: "3",
//     name: "Naruto",
//     wallet: "0x2327e939b...0a18e257bA",
//   },
// ];

const OwnerLists: FC<{
  owners: Owner[],
  setOwners?: (owners: Owner[]) => void,
}> = ({owners, setOwners}) => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];

  return (
    <>
      <div className="divide-y divide-inherit">
        {owners.map((owner, index) => {
          return (
            <div
              key={index}
              className="w-full flex pb-3 pt-3"
            >
              <Image
                src={Avatars[index % 3]}
                layout="fixed"
                width={48}
                height={48}
                alt={`Avatar ${index + 1}`}
              />
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col mx-3">
                  <div className="text-xs text-content-primary font-semibold">
                    {owner.name}
                  </div>
                  <div className="flex items-center text-content-primary">
                      {toSubstring(owner.wallet, 6, true)}
                  </div>
                </div>
                {setOwners && <div onClick={()=>{
                  setOwners(owners.filter(o=>o.wallet!==owner.wallet))
                }} className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer bg-background-secondary">
                        <Icons.CrossIcon className="text-base text-[8px]" />
                </div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OwnerLists;
