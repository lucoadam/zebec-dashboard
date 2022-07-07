import React, { FC,useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "components/shared";
import { useAppSelector } from "app/hooks";
import { useDispatch } from "react-redux";
import { resumedModal, toggleResumeModal } from "features/transaction/resumeModal/resumeSlice";
import * as Icons from "assets/icons";


const ResumeModal: FC= ({  }) => {
    const resumeModal= useAppSelector((state)=>state.resume.resumeModal)
    const isResumed = useAppSelector((state)=>state.resume.isResumed)
    const dispatch =useDispatch();
    const [onClick, setOnClick] = useState(false)
    const id = "Resuming"
    const { t } = useTranslation("transactions");
    return (

        <Modal
        show={!isResumed && resumeModal}
        toggleModal={()=>dispatch(toggleResumeModal())}
        className="rounded w-96"
        hasCloseIcon={false}
        size="small"
    >
       {!onClick && (<><div className="text-content-primary text-subtitle font-semibold">
                {t("outgoing-actions.resume-modal-header")}
            </div><div className="pt-[12px] pb-[12px]">
                    <Button
                        className="w-full "
                        variant="gradient"
                        title={t("outgoing-actions.yes-resume")}
                        onClick={() => {
                            setOnClick(!onClick);
                            setTimeout(() => {
                                dispatch(resumedModal());
                            }, 10000);


                        } } />

                </div><div className="">
                    <Button
                        className="w-full "

                        title={t("outgoing-actions.no-resume")}
                        onClick={() => {
                            dispatch(toggleResumeModal());



                        } } />
                </div></>)}
            {onClick && (<>
            <div className="flex items-center justify-center text-content-primary text-heading-5 pb-4">Resumimg</div>
            <div className="flex items-center justify-center">
                <Icons.Loading />
            </div>
            </>)}

   </Modal>
    );
}
export default ResumeModal;
