import React, { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { cancelledModal, toggleCancelModal } from "features/transaction/cancelModal/cancelSlice";
import * as Icons from "assets/icons";



const CancelModal: FC = ({ }) => {
    const cancelModal = useAppSelector((state) => state.cancel.cancelModal)
    const isCancelled = useAppSelector((state) => state.cancel.isCancelled);
    const dispatch = useDispatch();
    const [onClick, setOnClick] = useState(false)
    const { t } = useTranslation("transactions");

    return (
        <Modal
            show={!isCancelled && cancelModal}
            toggleModal={() => dispatch(toggleCancelModal())}
            className="rounded w-96"
            hasCloseIcon={false}
            size="small"
        >



            {!onClick && (<><div className="text-content-primary text-subtitle font-semibold">
                {t("outgoing-actions.cancel-modal-header")}
            </div><div className="pt-[12px] pb-[12px]">
                    <Button
                        className="w-full "
                        variant="gradient"
                        title={t("outgoing-actions.yes-cancel")}
                        onClick={() => {
                            setOnClick(!onClick);
                            setTimeout(() => {
                                dispatch(cancelledModal());
                            }, 10000);



                        }} />

                </div><div className="">
                    <Button
                        className="w-full "

                        title={t("outgoing-actions.no-cancel")}
                        onClick={() => {
                            dispatch(toggleCancelModal());



                        }} />
                </div></>)}
            {onClick && (<>
                <div className="flex items-center justify-center text-content-primary text-heading-5 pb-4">
                    Cancelling
                </div>
                <div className="flex items-center justify-center">
                    <Icons.Loading />
                </div>
            </>)}


        </Modal>


    );
}
export default CancelModal;
