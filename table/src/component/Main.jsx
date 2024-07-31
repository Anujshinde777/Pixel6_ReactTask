import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import { FaFilter } from "react-icons/fa6";
import useCountryDropdown from "../Hooks/UseCountryDropdown";
import { GENDER } from "../Constant/Fixed";
//here we  pass dropdown value to the userlist component and filter the data based on the dropdown value
const Main = () => {
  const { countries } = useCountryDropdown();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const countryOptions = countries.map((country) => ({
    id: country,
    name: country,
  }));
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Employee</h1>
          </div>
          <div className="flex gap-4 px-2">
            <FaFilter
              className="mt-1 text-red-500"
              size={24}
            />
            <div>
              <Dropdown
                data={countryOptions}
                placeholder="Country"
                selectedValue={selectedCountry}
                setSelectedValue={setSelectedCountry}
              />
            </div>
            <div>
              <Dropdown
                data={GENDER}
                placeholder="Gender"
                selectedValue={selectedGender}
                setSelectedValue={setSelectedGender}
              />
            </div>
          </div>
        </div>
        <div className="w-full mx-auto">
          <UserList
            selectedCountry={selectedCountry}
            selectedGender={selectedGender}
          />
        </div>
        
      </div>
    </>
  );
};
const Dropdown = ({ data, placeholder, selectedValue, setSelectedValue }) => {
  return (
    <div>
      <select
        className="rounded-lg border border-gray-200 px-3 py-1 focus:outline-none cursor-pointer"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {data.map((item) => (
          <option key={item.id} value={item.id} className="bg-slate-100 px-2">
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Main;
