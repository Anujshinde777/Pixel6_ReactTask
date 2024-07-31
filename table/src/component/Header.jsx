import React from 'react'
import { HiOutlineBars3 } from "react-icons/hi2";
import LOGO from "../Assets/Pixel6.png"
const Header = () => {
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          <img src={LOGO} alt="logo" className="w-12 h-12" />
        </div>
        <div className="flex items-center">
          <HiOutlineBars3 className="text-2xl" />
        </div>
      </div>
      <hr className=" -mt-2 mb-4" />
    </>
  );
}

export default Header
