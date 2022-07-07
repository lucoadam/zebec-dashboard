import React, { FC, useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { CollapseDropdown } from "./CollapseDropdown";
import { useClickOutside } from "hooks";
import * as Icons from "assets/icons";

interface RowsPerPageProps {
    setNoOfRows: Dispatcher<number>;

}
type Dispatcher<S> = Dispatch<SetStateAction<S>>;
export const RowsPerPage: FC<RowsPerPageProps> = (props) => {
    const { setNoOfRows } = props;
    const [toggleNoOfRows, settoggleNoofRows] = useState(false);
    const RowsDropdownWrapper = useRef(null);
    const [noOfRows,setRowPerPage]=useState(10)

    const handleClose = () => {
        settoggleNoofRows(false);
    };

    useClickOutside(RowsDropdownWrapper, {
        onClickOutside: handleClose,
    });

    return (
        <>

            <div className="flex gap-x-2 absolute ">
                <div className="text-content-secondary pl-5" >
                    <span className="">Rows per page:</span>
                </div>

                <div className="">
                <div onClick={() => settoggleNoofRows((prev) => !prev)} className="flex text-black max-w-[60px] ml-[5px] overflow-x-hidden text-black">
                  
                        {noOfRows}
                    
                    <Icons.CheveronDownIcon className="text-sm w-[28px]" />
                </div>

                <CollapseDropdown ref={RowsDropdownWrapper}
                    show={toggleNoOfRows}
                    className="relative text-caption text-content-primary top-2"
                    variant="default"
                >
                    <div
                     onClick={(e)=>{e?.stopPropagation(); 
                     settoggleNoofRows(false); 
                     setNoOfRows(10);
                     setRowPerPage(10)}}
                     className="text-content-secondary py-2 pl-4 pr-4  flex cursor-pointer overflow-hidden justify-center items-center hover:text-primary  h-auto">
                        10
                        </div>
                    <div 
                    onClick={(e)=>{e?.stopPropagation(); 
                    settoggleNoofRows(false); 
                    setNoOfRows(20);
                    setRowPerPage(20)
                    }}
                    className=" text-content-secondary py-2 pl-4 pr-4 flex cursor-pointer overflow-hidden justify-center items-center hover:text-primary h-auto">
                        20
                        </div>
                    <div
                     onClick={(e)=>{e?.stopPropagation(); 
                     settoggleNoofRows(false); 
                     setNoOfRows(30);
                     setRowPerPage(30)}}
                     className="text-content-secondary py-2 pl-4  pr-4  flex cursor-pointer overflow-hidden  justify-center items-center hover:text-primary  h-auto">
                        30
                        </div>

                </CollapseDropdown>
                </div>
                

            </div>

        </>
    );
}