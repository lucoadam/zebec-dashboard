import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { toggleCancelModal } from "features/transaction/cancelModal/cancelSlice";



const Cancel: FC = ({ }) => {
    const cancelModal =useAppSelector((state)=>state.cancel.cancelModal)
    const dispatch = useDispatch();
    const { t } = useTranslation("transactions");
    return (
        <Modal
            show={cancelModal}
            toggleModal={()=>dispatch(toggleCancelModal())}
            className="rounded w-96"
            hasCloseIcon={false}
        >
            <div className="text-content-primary text-subtitle pb-[16px]">
                {t("outgoing-actions.cancel-modal-header")}
            </div>

            <div className="pt-[12px] pb-[12px]">
                <Button
                    className="w-full "
                    variant="gradient"
                    title={t("outgoing-actions.yes-cancel")}
                    onClick={() => {


                    }}
                />

            </div>
            <div className="pb-[12px]">
                <Button
                    className="w-full "

                    title={t("outgoing-actions.no-cancel")}
                    onClick={() => {
                        dispatch(toggleCancelModal())


                    }}
                />
            </div>




        </Modal>


    );
}
export default Cancel;
