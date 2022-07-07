import React, { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "components/shared";
import { Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { togglePauseModal } from "features/transaction/pauseModal/pauseSlice";
import { pausedModal } from "features/transaction/pauseModal/pauseSlice";
import * as Icons from "assets/icons";




const PauseModal: FC = ({ }) => {
    const pauseModal = useAppSelector((state) => state.pause.pauseModal)
    const isPaused = useAppSelector((state) => state.pause.isPaused)
    const dispatch = useDispatch();
    const [onClick, setOnClick] = useState(false)
    const { t } = useTranslation("transactions");
    return (
        <Modal
            show={pauseModal && !isPaused}
            toggleModal={() => dispatch(togglePauseModal())}
            className="rounded w-96 "
            hasCloseIcon={false}
            size="small"
        >
            {!onClick && (<><div className="text-content-primary text-subtitle font-semibold ">
                {t("outgoing-actions.pause-modal-header")}
            </div><div className="pt-[12px] pb-[12px]">
                    <Button
                        className="w-full "
                        variant="gradient"
                        title={t("outgoing-actions.yes-pause")}
                        onClick={() => {
                            setOnClick(!onClick);
                            setTimeout(() => {
                                dispatch(pausedModal())
                            }, 10000)
                        }} />

                </div><div className="">
                    <Button
                        className="w-full "

                        title={t("outgoing-actions.no-pause")}
                        onClick={() => {
                            dispatch(togglePauseModal());



                        }} />
                </div></>)}

            {onClick && (
                <>

                    <div className="flex items-center justify-center text-content-primary text-heading-5 pb-4">
                        Pausing
                    </div>
                    <div className="flex items-center justify-center">
                        <Icons.Loading />
                    </div>
                </>)}



        </Modal>
    );
}
export default PauseModal;
