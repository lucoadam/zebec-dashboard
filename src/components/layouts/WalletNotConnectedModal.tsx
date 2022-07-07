import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button, Modal } from "components/shared";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";

const WalletNotConnectedModal: NextPage = () => {
  const { t } = useTranslation("common");
  const walletObject = useWallet();
  const walletModalObject = useWalletModal();

  const handleConnectWallet: () => void = () => {
    walletObject.wallet
      ? walletObject.connect()
      : walletModalObject.setVisible(!walletModalObject.visible);
  };
  return (
    <Modal
      show={!walletObject.connected}
      toggleModal={() => {}}
      className="rounded-2xl"
      hasCloseIcon={false}
    >
      <div className="text-center px-6 py-8">
        <span className="text-content-primary text-2xl font-semibold">
          {t("wallet-not-connected.title")}
        </span>
        <p className="text-sm space-x-1 text-content-secondary mt-3">
          {t("wallet-not-connected.description")}
        </p>
        <Button
          className="w-full mt-10"
          title={t("wallet-not-connected.connect-previous-wallet")}
          variant="gradient"
          onClick={handleConnectWallet}
        />
        <Button
          className="w-full mt-3"
          title={t("wallet-not-connected.connect-different-wallet")}
          variant="default"
          onClick={() => walletModalObject.setVisible(true)}
        />
      </div>
    </Modal>
  );
};

export default WalletNotConnectedModal;
