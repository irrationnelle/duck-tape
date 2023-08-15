import { type RefObject } from "react";
import useSticky from "./useStickyButton";

const createUseStickyButton = () => {
  if(/iPhone/.test(navigator.userAgent)) {
    return useSticky;
  }
  console.warn('useStickyButton is only supported on iOS')
  return (args:{
    inputs?: RefObject<HTMLInputElement>[]
    buttonMarginBottom: number;
  }) => ({
    buttonEl: {
      current: null
    }, 
    inputEl: {
      current: null
    }, 
    isButtonSticky: false
  });
};

export default createUseStickyButton;