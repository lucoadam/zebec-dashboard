import React, { useRef, useState } from "react"
import { CollapseDropdown } from "components/shared"
import * as Icons from "assets/icons"
import { useClickOutside } from "hooks"
import { NotificationSubscribed } from "./NotificationSubscribed"
import { NotificationForm } from "./NotificationForm"

interface NotificationStep {
  component: React.FC<NotificationProps>
}
export interface NotificationProps {
  setCurrentStep: (step: number) => void
  handleNotificationClose: () => void
}

export const NotificationStepsList: NotificationStep[] = [
  {
    component: (props: NotificationProps) => <NotificationForm {...props} />
  },
  {
    component: (props: NotificationProps) => (
      <NotificationSubscribed {...props} />
    )
  }
]

const NotificationsComponent = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const [toggleNotificationsDropdown, setToggleNotificationsDropdown] =
    useState<boolean>(false)

  const handleNotificationClose = () => {
    setToggleNotificationsDropdown(false)
  }
  const NotificationsDropdownWrapperRef = useRef(null)

  //handle clicking outside
  useClickOutside(NotificationsDropdownWrapperRef, {
    onClickOutside: handleNotificationClose
  })
  return (
    <>
      <div className="relative h-8" ref={NotificationsDropdownWrapperRef}>
        <div
          className={` text-content-primary`}
          onClick={() =>
            setToggleNotificationsDropdown(!toggleNotificationsDropdown)
          }
        >
          <Icons.BellEditIcon className="cursor-pointer  w-6 h-6" />
        </div>
        <CollapseDropdown
          show={toggleNotificationsDropdown}
          className="top-12 w-[400px]"
        >
          {NotificationStepsList[currentStep]?.component({
            setCurrentStep,
            handleNotificationClose
          })}
        </CollapseDropdown>
        {/* </div> */}
      </div>
    </>
  )
}

export default NotificationsComponent
