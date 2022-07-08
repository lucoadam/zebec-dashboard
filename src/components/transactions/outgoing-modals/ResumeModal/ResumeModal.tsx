import React, { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { toggleResumeModal } from "features/transaction/resumeModal/resumeSlice";
import * as Icons from "assets/icons";


const ResumeModal: FC = ({ }) => {
    const resumeModal = useAppSelector((state) => state.resume.resumeModal)
    const dispatch = useDispatch();
    const [onClick, setOnClick] = useState(false)
    const id = "Resuming"
    const { t } = useTranslation("transactions");
    return (

        <Modal
            show={resumeModal}
            toggleModal={() => dispatch(toggleResumeModal())}
            className="rounded " 
            hasCloseIcon={false}
            size="small"
        >
            {(<><div className="text-content-primary text-subtitle font-semibold">
                {t("outgoing-actions.resume-modal-header")}
            </div><div className="pt-[12px] pb-[12px]">
                    <Button
                        className={`w-full ${onClick ? "cursor-not-allowed" : ""}`}
                        variant="gradient"
                        endIcon={onClick?<Icons.Loading/>:<></>}
                        disabled={onClick}
                        title={onClick ? t("outgoing-actions.resuming") : t("outgoing-actions.yes-resume")}
                        onClick={() => {
                            setOnClick(true);
                            setTimeout(() => {

                                dispatch(toggleResumeModal());
                                setOnClick(false)

                            }, 5000);

                        }} />

                </div><div className="">
                    <Button
                        className={`w-full ${onClick ? "hidden" : ""}`}
                        title={t("outgoing-actions.no-resume")}
                        onClick={() => {
                            dispatch(toggleResumeModal());  }} />
                </div></>)}


        </Modal>
    );
}
export default ResumeModal;
