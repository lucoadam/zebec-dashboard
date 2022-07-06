import { IncomingMessage } from "http";
import React, { FC, useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import * as Icons from "assets/icons";
import { number } from "yup";
import { RowsPerPage } from "./RowsPerPage";

interface PaginationProps {
    pages: number;
    setCurrentPage: Dispatcher<number>;
    setNoOfRows: Dispatcher<number>;
    

}
type Dispatcher<S> = Dispatch<SetStateAction<S>>;
export const Pagination: FC<PaginationProps> = (props) => {

const [activeClass,setActiveClass]=useState<String>("");
    const {
        pages, setCurrentPage,setNoOfRows
    } = props;
    const numberOfPages = useMemo(() => {
        let numOfPages: any = [];
        for (let i = 1; i <= pages; i++) {
            numOfPages.push(i);
        }
        return numOfPages;
    }, [pages]);

    // Current active button number
    const [currentButton, setCurrentButton] = useState<any>(1);

    // Array of buttons what we see on the page
    const [arrOfCurrButtons, setArrOfCurrButtons] = useState<any>([]);

    useEffect(() => {
        //Temp no of Pages
        let tempNumberOfPages: any = [...arrOfCurrButtons];

        //Set dots
        let dotsInitial = "...";
        let dotsLeft = "... ";
        let dotsRight = " ...";

        if (numberOfPages.length < 5) {
            //num of pages < 6
            tempNumberOfPages = numberOfPages;
        } else if (currentButton >= 1 && currentButton <2) {
            //current button 1 to 3
            tempNumberOfPages = [1, 2, 3,  dotsInitial, numberOfPages.length];
        }
         else if (currentButton === 3 || currentButton === 2) {
            //current button 4
            const sliced = numberOfPages.slice(0, 4);
            tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
        } else if (currentButton===numberOfPages.length-2){
            const sliced1 = numberOfPages.slice(currentButton - 3, currentButton); // sliced1 (5-2, 5) -> [4,5]
            const sliced2 = numberOfPages.slice(currentButton, currentButton ); // sliced2 (5, 5+2) -> [6,7]
            tempNumberOfPages = [
                1,
                dotsLeft,
                ...sliced1,
                ...sliced2,
                dotsRight,
                numberOfPages.length,
            ]; // [1, '...', 4, 5, 6, 7,'...', 10]

        }
        else if (currentButton > 3 && currentButton < numberOfPages.length -1) {
            // from 5 to 8 -> (10 - 2)
            
            const sliced1 = numberOfPages.slice(currentButton - 2, currentButton); // sliced1 (5-2, 5) -> [4,5]
            const sliced2 = numberOfPages.slice(currentButton, currentButton + 1); // sliced2 (5, 5+2) -> [6,7]
            tempNumberOfPages = [
                1,
                dotsLeft,
                ...sliced1,
                ...sliced2,
                dotsRight,
                numberOfPages.length,
            ]; // [1, '...', 4, 5, 6, 7,'...', 10]
        } else if (currentButton > numberOfPages.length - 3) {
            // > 7
            const sliced = numberOfPages.slice(numberOfPages.length - 3); // slice last 4 [7, 8, 9, 10]
            tempNumberOfPages = [1, dotsLeft, ...sliced];
        } else if (currentButton === dotsInitial) {
            // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
            // arrOfCurrButtons[3] = 4 + 1 = 5
            // or
            // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
            // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
            setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
        } else if (currentButton === dotsRight) {
            // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
            // arrOfCurrButtons[3] = 6 + 2 = 8
            setCurrentButton(arrOfCurrButtons[3] + 2);
        } else if (currentButton === dotsLeft) {
            // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
            // arrOfCurrButtons[3] = 6 - 2 = 4
            setCurrentButton(arrOfCurrButtons[3] - 2);
        } else if (numberOfPages.length < currentButton) {
            setCurrentButton(1);
        }

        setArrOfCurrButtons(tempNumberOfPages);
        setCurrentPage(currentButton);
        // eslint-disable-next-line
    }, [currentButton, numberOfPages, numberOfPages.length]);


    return (
        <>
         
            
                <div className="flex gap-x-[2px] ml-auto pr-5">
                    {/* Previous Button */}
                    <button
                        className={`w-8  px-3 py-1.5  ${currentButton === 1
                                ? "opacity-50 cursor-default"
                                : "cursor-pointer"
                            }`}
                        onClick={() =>{
                           
                            setCurrentButton((prev: number) => (prev <= 1 ? prev : prev - 1))
                           

                        }
                            
                        }
                    >
                        <Icons.PaginationLeftArrow />
                    </button>

                    {/* Array of Current Buttons */}
                    {arrOfCurrButtons.map((item: any, index: any) => {
                        return (
                            <div
                                key={index}
                                className={`w-8 h-8 text-center p-1.5 text-content-primary ${item=="..."?"cursor-default" :"cursor-pointer "} ${currentButton === item
                                        ? "transition-colors duration-700 ease-in bg-primary rounded-lg"
                                        : "bg-background-primary rounded-lg"
                                    }`}
                                onClick={() => setCurrentButton(item)}
                            >
                                {item}
                            </div>
                        );
                    })}

                    {/* Next Button */}
                    <button
                        className={` w-8 px-3 py-2 ${currentButton === numberOfPages.length
                                ? "opacity-50 cursor-default"
                                : numberOfPages.length === 0
                                    ? "opacity-50 cursor-default"
                                    : "cursor-pointer"
                            }`}
                        onClick={() =>
                            setCurrentButton((prev: number) =>
                                prev >= numberOfPages.length ? prev : prev + 1,
                            )
                        }
                    >
                        <Icons.PaginationRightArrow />
                    </button>
                </div>
           
        </>
    );

}