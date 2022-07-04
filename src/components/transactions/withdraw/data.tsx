import EnterWithdrawAmount from "./steps/enterWithdrawAmount";
import ConfirmWithdraw from "./steps/confirmWithdraw";
import Withdrawing from "./steps/Withdrawing";

interface withdrawStep{
    
    component: React.FC<withdrawProps>

}
export interface withdrawProps{
    setCurrentStep: (step:number)=>void,
}

export const WithdrawStepsList: withdrawStep[] = [
    {
        
        component: (props:withdrawProps) => <EnterWithdrawAmount {...props} />,
    },
    {
        
      component:(props:withdrawProps) => <ConfirmWithdraw {...props} />,
    },
    {
        
      component: (props:withdrawProps) => <Withdrawing {...props} />,
    },
  ];