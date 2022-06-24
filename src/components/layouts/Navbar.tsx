import React, { FC } from "react";
// import { useTheme } from "next-themes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import NavLink from "./NavLink";
import { routes } from "./routes";
import { Button } from "../shared";
import NavGroup from "./NavGroup";
import Profile from "./Profile";
import * as Images from "../../assets/images";
import * as Icons from "../../assets/icons";

const Navbar: FC = () => {
  // const [mounted, setMounted] = useState<boolean>(false);
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
      <nav className="px-6 py-4 flex justify-between items-center shadow-2">
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
        {/* <div className="">{themeChanger()}</div> */}
        <>
          {!useWalletObject.connected ? (
            <Button
              title="Connect Wallet"
              variant="gradient"
              onClick={handleConnectWallet}
            />
          ) : (
            <Profile />
          )}
        </>
      </nav>
    </>
  );
};

export default Navbar;
