import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "components/shared";
import { Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { togglePauseModal } from "features/transaction/pauseModal/pauseSlice";




const Pause: FC = ({  }) => {
    const pauseModal = useAppSelector((state)=> state.pause.pauseModal)
    const dispatch= useDispatch();
    const { t } = useTranslation("transactions");
    return (
        <Modal
            show={pauseModal}
            toggleModal={()=>dispatch(togglePauseModal())}
            className="rounded w-96"
            hasCloseIcon={false}
        >
            <div className="text-content-primary text-subtitle pb-[16px]">
                {t("outgoing-actions.pause-modal-header")} 
            </div>
            
            <div className="pt-[12px] pb-[12px]">
                <Button
                    className="w-full " 
                variant="gradient"
                title={t("outgoing-actions.yes-pause")}
                onClick={() => {
                    

                }}
            />

            </div>
            <div className="pb-[12px]">
            <Button
                className="w-full "

                title={t("outgoing-actions.no-pause")}
                onClick={() => {
                    dispatch(togglePauseModal());

                    
                }}
            />
            </div>

           

       </Modal>
    );
}
export default Pause;
