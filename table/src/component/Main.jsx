import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import { FaFilter } from "react-icons/fa6";
import useCountryDropdown from "../Hooks/UseCountryDropdown";
import Loader from "./Loader";

const Main = () => {
  const { countries } = useCountryDropdown();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  const Gender = [
    { id: "F", name: "Female" },
    { id: "M", name: "Male" },
  ];

  const countrycode = {
    "United States": "USA",
    "United Kingdom": "UK",
    India: "IN",
  };

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    if (hasMore) {
      fetchUsers();
    }
  }, [page, selectedCountry, selectedGender]);

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers();
  }, [selectedCountry, selectedGender]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=${LIMIT}&skip=${(page - 1) * LIMIT}`
      );
      const data = await response.json();

      if (data.users && data.users.length > 0) {
        const newUsers = data.users
          .filter(
            (user) =>
              (!selectedCountry || user.address.country === selectedCountry) &&
              (!selectedGender ||
                user.gender === (selectedGender === "M" ? "male" : "female"))
          )
          .map((user) => ({
            id: user.id,
            image: user.image,
            fullName: `${user.firstName} ${user.lastName}`,
            gender: user.gender === "male" ? "M" : "F",
            age: user.age,
            designation: user.company.title,
            location: `${user.address.state},${
              countrycode[user.address.country]
            }`,
          }));

        setUsers((prevUsers) => [...prevUsers, ...newUsers]);

        if (data.users.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const clearSelections = () => {
    setSelectedCountry("");
    setSelectedGender("");
  };

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
              onClick={clearSelections}
              className="mt-1 text-red-500 cursor-pointer"
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
                data={Gender}
                placeholder="Gender"
                selectedValue={selectedGender}
                setSelectedValue={setSelectedGender}
              />
            </div>
          </div>
        </div>

        <div className="w-full mx-auto">
          <UserList data={users} loading={loading} hasMore={hasMore} />
        </div>
        {loading && (
          <p>
            <Loader />
          </p>
        )}
        {!hasMore && <p>No more users to load</p>}
      </div>
    </>
  );
};

const Dropdown = ({ data, placeholder, selectedValue, setSelectedValue }) => {
  return (
    <div>
      <select
        className="rounded-lg border border-gray-200 px-6 py-1 focus:outline-none cursor-pointer"
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
