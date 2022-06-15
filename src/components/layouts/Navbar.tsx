import React, { FC } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useTheme } from "next-themes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import NavLink from "./NavLink";
import { routes } from "./routes";
import { Button } from "../shared";
import NavGroup from "./NavGroup";
import * as Images from "../../assets/images";
import * as Icons from "../../assets/icons";
import { toSubstring } from "../../utils";

const Navbar: FC = () => {
  // const [mounted, setMounted] = useState<boolean>(false);
  // const router = useRouter();
  // const { theme, setTheme, systemTheme } = useTheme();
  const useWalletObject = useWallet();
  const useWalletModalObject = useWalletModal();

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // const themeChanger: () => JSX.Element | null = () => {
  //   if (!mounted) return null;
  //   const currentTheme = theme === "system" ? systemTheme : theme;
  //   if (currentTheme === "dark") {
  //     return (
  //       <button className="float-right" onClick={() => setTheme("light")}>
  //         Light Mode
  //       </button>
  //     );
  //   } else {
  //     return (
  //       <button className="float-right" onClick={() => setTheme("dark")}>
  //         Dark Mode
  //       </button>
  //     );
  //   }
  // };

  const handleConnectWallet: () => void = () => {
    useWalletObject.wallet
      ? useWalletObject.connect()
      : useWalletModalObject.setVisible(!useWalletModalObject.visible);
  };

  return (
    <>
      <div className="px-6 py-4 flex justify-between items-center shadow-2">
        <div className="flex flex-col">
          <Image src={Images.ZebecLogo} layout="fixed" width={87} height={24} />
          <div className="ml-10 text-caption text-content-contrast">
            Mainnet Beta
          </div>
        </div>
        <div className="flex items-center gap-x-8">
          {routes.map((route, index) => {
            switch (route.type) {
              case "link":
                return <NavLink key={index} {...route} />;
              case "group":
                return <NavGroup key={index} {...route} />;
            }
          })}
          <Button
            title="Send"
            variant="gradient"
            EndIcon={Icons.ArrowUpRightIcon}
            onClick={() => alert("Send")}
          />
        </div>
        {/* <div className="">
          <ul>
            {router.locales?.map((locale) => {
              return (
                <li key={locale}>
                  <Link href={router.asPath} locale={locale}>
                    <a>{locale}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div>
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
        </div> */}
        {/* <div className="">{themeChanger()}</div> */}
        <div className="">
          {!useWalletObject.connected ? (
            <Button
              title="Connect Wallet"
              variant="gradient"
              onClick={handleConnectWallet}
            />
          ) : (
            <div className="flex gap-x-2">
              <Image
                src={Images.Avatar1}
                layout="fixed"
                width={32}
                height={32}
              />
              <div className="flex items-center gap-x-3">
                <div className="flex flex-col justify-between h-full">
                  <div className="text-avatar-title font-medium text-content-primary">
                    {toSubstring(
                      useWalletObject?.publicKey?.toString(),
                      4,
                      true,
                    )}
                  </div>
                  <div className="text-caption leading-[14px] text-content-contrast">
                    {useWalletObject?.wallet?.adapter.name} Wallet
                  </div>
                </div>
                <Icons.CheveronDownIcon className="text-base cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
