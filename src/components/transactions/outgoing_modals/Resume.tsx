import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { toggleResumeModal } from "features/transaction/resumeModal/resumeSlice";


const Resume: FC= ({  }) => {
    const resumeModal= useAppSelector((state)=>state.resume.resumeModal)
    const dispatch =useDispatch();
    const { t } = useTranslation("transactions");
    return (

        <Modal
        show={resumeModal}
        toggleModal={()=>dispatch(toggleResumeModal())}
        className="rounded w-96"
        hasCloseIcon={false}
    >
        <div className="text-content-primary text-subtitle pb-[16px]">
            {t("outgoing-actions.resume-modal-header")} 
        </div>
        
        <div className="pt-[12px] pb-[12px]">
            <Button
                className="w-full " 
            variant="gradient"
            title={t("outgoing-actions.yes-resume")}
            onClick={() => {
                

            }}
        />

        </div>
        <div className="pb-[12px]">
        <Button
            className="w-full "

            title={t("outgoing-actions.no-resume")}
            onClick={() => {
                dispatch(toggleResumeModal());

                
            }}
        />
        </div>

       

   </Modal>
    );
}
export default Resume;
