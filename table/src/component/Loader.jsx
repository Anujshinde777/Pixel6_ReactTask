import React from "react";

const Loader = () => {
  return (
    <>
      <style>
        {`.spinner {
   width: 8px;
   height: 8px;
   border-radius: 8px;
   box-shadow: 28px 0px 0 0 rgba(253,138,101,0.2), 22.7px 16.5px 0 0 rgba(253,138,101,0.4), 8.68px 26.6px 0 0 rgba(253,138,101,0.6), -8.68px 26.6px 0 0 rgba(253,138,101,0.8), -22.7px 16.5px 0 0 #fd8a65;
   animation: spinner-b87k6z 1.2s infinite linear;
}

@keyframes spinner-b87k6z {
   to {
      transform: rotate(360deg);
   }
}`}
      </style>
      <div className="flex justify-center w-full items-center gap-2 h-96 ">
        <div class="spinner"></div>
      </div>
    </>
  );
};
export default Loader;
