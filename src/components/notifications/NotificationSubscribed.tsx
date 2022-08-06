import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { NotificationProps } from './Notifications';
import * as Icons from "assets/icons"
import { Button, IconButton } from 'components/shared';
import Link from 'next/link';

export const NotificationSubscribed: React.FC<NotificationProps> = ({handleNotificationClose }) => {
  
   const { t } = useTranslation("")
  return (
    <div className=' p-5'>
      <div className='flex items-center'> 
        <div className='text-content-primary text-subtitle font-semibold'>
          {t("common:notifications.notifications")}
          
        </div>
        <div className='gap-x-2 ml-auto text-content-primary flex items-center'>
          <div className=''>
          <Link href="notifications"><><Icons.GearringAltIcon /></></Link> 

          </div>
          <div>

          </div>
          <div className='font-semibold'>
            {t("common:notifications.only-show-unread")}
          </div>
          <div>
            <IconButton
                      className="top-1 "
                      icon={<Icons.CrossIcon />}
              onClick={() => {
                handleNotificationClose()
                
              }
              }
                    />
          </div>

        </div>
      </div>
      <div className='flex text-content-primary pt-6'>
        <div className='text-subtitel font-semibold'>
          {t("common:notifications.new")}
        </div>
        <div className='ml-auto'>
          <Button
            size={"small"}
            startIcon={<Icons.CheckIcon/>}
                    title={`${t("common:notifications.mark-all-as-read")}`}
                  />
         
            
              
        </div>
      </div>

      <div>
        
      </div>
      
    </div>
  );
}
