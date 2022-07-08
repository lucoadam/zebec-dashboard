import * as Icons from "assets/icons";
import { ReactElement } from "react";
export interface confirmWithdrawStep{
    
    text: string,
    image: ReactElement

    

}


export const confirmWithdrawStepsList: confirmWithdrawStep[] = [
    {
        
        text: "Withdrawing: ",
        image:  <Icons.WithdrawDownLeft />
    },
    {
        
        text: "Fees(0.25%): ",
        image:  <Icons.Line />
    },
    {
        
        text: "Withdraw Amount: ",
        image:  <Icons.Equals />
    },
  ];