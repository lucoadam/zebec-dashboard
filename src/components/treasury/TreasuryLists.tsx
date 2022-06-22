import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import * as AvatarImages from "../../assets/images/avatars";
import * as Icons from "../../assets/icons";
import { toSubstring } from "../../utils";
import Link from "next/link";

const treasuries = [
  {
    id: "1",
    name: "Zebec Safe",
    owners: 120,
    vault_address: "1AdXF31AdXF3DuV15DuV15",
    slug: "zebec-safe",
  },
  {
    id: "2",
    name: "Ricks Safe",
    owners: 120,
    vault_address: "1AdXF31AdXF3DuV15DuV15",
    slug: "ricks-safe",
  },
  {
    id: "3",
    name: "Web3 DAO",
    owners: 120,
    vault_address: "1AdXF31AdXF3DuV15DuV15",
    slug: "web3-dao",
  },
  {
    id: "4",
    name: "Zebec Safe 2",
    owners: 120,
    vault_address: "1AdXF31AdXF3DuV15DuV15",
    slug: "zebec-safe-2",
  },
];

const TreasuryLists: FC = () => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {treasuries.map((treasury, index) => {
          return (
            <Link key={treasury.id} href={`/treasury/${treasury.slug}`}>
              <div className="p-6 bg-background-secondary rounded">
                <Image
                  src={Avatars[index % 3]}
                  layout="fixed"
                  width={48}
                  height={48}
                  alt={`Avatar ${index + 1}`}
                />
                <div className="flex flex-col gap-y-4 mt-6">
                  <div className="text-subtitle text-content-primary font-semibold">
                    {treasury.name}
                  </div>
                  <div className="flex gap-x-3 items-center">
                    <div className="flex gap-x-1.5 items-center text-content-primary">
                      <Icons.UserGroupIcon className="text-base" />
                      <div>{treasury.owners} Owners</div>
                    </div>
                    <div className="flex gap-x-1.5 items-center text-content-primary">
                      <Icons.NotebookIcon className="text-base" />
                      <div>{toSubstring(treasury.vault_address, 6, true)}</div>
                      <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                        <Icons.CopyIcon className="text-base" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default TreasuryLists;
