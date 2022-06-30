import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import * as Icons from "../../assets/icons";
import * as Images from "../../assets/images";
import { Button, IconButton } from "../shared";
import NavGroup from "./NavGroup";
import NavLink from "./NavLink";
import Profile from "./Profile";
import { getMainRoutes, getMenuRoutes } from "./routes";

const Navbar: FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const useWalletObject = useWallet();
  const useWalletModalObject = useWalletModal();

  const [mounted, setMounted] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  
  useEffect(() => {
    setMounted(true);
    setWidth(window.outerWidth);
    window.addEventListener("resize",(()=>{
      setWidth(window.outerWidth);
    }));
  }, []);

  //theme toggle
  const themeChanger: () => JSX.Element | null = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    if (currentTheme === "dark") {
      return (
        <IconButton
          icon={<Icons.DayIcon />}
          variant="plain"
          size="small"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <IconButton
          icon={<Icons.NightIcon />}
          variant="plain"
          size="small"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };

  const handleConnectWallet: () => void = () => {
    useWalletObject.wallet
      ? useWalletObject.connect()
      : useWalletModalObject.setVisible(!useWalletModalObject.visible);
  };

  return (
    <>
      <nav className="shadow-2">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex flex-col px-4">
              <Image
                src={Images.ZebecLogo}
                alt="Zebec Logo"
                layout="fixed"
                width={87}
                height={24}
              />
              <div className="ml-10 text-caption text-content-contrast">
                Mainnet Beta
              </div>
          </div>
          
          {/* NavLinks */}
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-x-3 lg:gap-x-8">
              {getMainRoutes(width).map((route, index) => {
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
                endIcon={<Icons.ArrowUpRightIcon />}
                onClick={() => alert("Send")}
              />
            </div>

            <div className="flex items-center gap-x-3 px-4">
              <>{themeChanger()}</>
              {!useWalletObject.connected ? (
                <Button
                  title="Connect Wallet"
                  variant="gradient"
                  onClick={handleConnectWallet}
                />
              ) : (
                <Profile />
              )}
            </div>
            
            <div className="md:hidden px-4">
                <IconButton
                  icon={<Icons.MenuIcon />}
                  variant="plain"
                  size="medium"
                  onClick={() => setShowMenu(!showMenu)}
                />
            </div>
          </div>
        </div>
        {showMenu && <div className={`px-6 divide-y divide-outline`}>
          {getMenuRoutes(width).map((route, index) => (
                <div className="py-4" key={index}>
                  <NavLink key={index} {...route} />
                </div>
              ))
            }
        </div>}
      </nav>
    </>
  );
};

export default Navbar;
