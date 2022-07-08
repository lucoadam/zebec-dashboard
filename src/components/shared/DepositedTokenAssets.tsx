import React, { FC } from "react";

export const DepositedTokenAssets: FC = () => {
  return (
    <>
      <div className="flex flex-col gap-y-6 h-full">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          DEPOSITED ASSETS
        </div>
        {/* Assets Table */}
        <div className="flex flex-col gap-y-8 overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr className="bg-background-secondary">
                  <td className="pb-3"></td>
                  <td className="pl-4 text-left text-caption text-content-contrast pb-3">
                    Balance
                  </td>
                  <td className="pl-4 text-left text-caption text-content-contrast pb-3">
                    Streaming
                  </td>
                </tr>
              </thead>
              <tbody className="w-full border-separate">
                {/* SOL */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6 pt-3">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-3">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-3">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* USDC */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        USDC
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* BLOCK */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%]">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        BLOCK
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* SOL */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6 pt-6">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* USDC */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        USDC
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* BLOCK */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%]">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        BLOCK
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* SOL */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6 pt-6">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6 pt-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* USDC */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%] pb-6">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        USDC
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4 pb-6">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
                {/* BLOCK */}
                <tr className="">
                  <td className="whitespace-nowrap w-[1%]">
                    <div className="flex flex-col items-center gap-y-1">
                      <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary"></div>
                      <div className="text-caption text-content-primary">
                        BLOCK
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <div className="flex flex-col gap-y-2 mt-1">
                      <div className=" text-subtitle-sm text-content-primary font-medium">
                        $8,43,459.33
                      </div>
                      <div className=" text-caption text-content-contrast">
                        140.59 SOL
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
