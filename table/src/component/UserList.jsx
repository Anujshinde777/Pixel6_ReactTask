import { useState, useEffect } from "react";
import React from "react";
import { HiOutlineArrowSmUp } from "react-icons/hi";
import { HiMiniArrowSmallDown } from "react-icons/hi2";
import Loader from "./Loader";
import { CODE, LIMIT,BASE_API } from "../Constant/Fixed";

const UserList = ({ selectedCountry, selectedGender }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortColumns, setSortColumns] = useState([
    { column: "id", order: "asc" },
    { column: "fullName", order: "asc" },
    { column: "age", order: "asc" },
  ]);
  useEffect(() => {
    fetchUsers();
  }, [page]);
  useEffect(() => {
    if (selectedCountry || selectedGender) {
      setUsers([]);
      setPage(2);
      setHasMore(true);
      fetchUsers();
    }
  }, [selectedCountry, selectedGender]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_API}?limit=${LIMIT}&skip=${(page - 1) * LIMIT}`
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
            location: `${user.address.state},${CODE[user.address.country]}`,
          }));
          //As we change the drop down we need to check that unique value should be their in the list
        if (selectedCountry || selectedGender) {
          setUsers((prevUsers) => {
            // Combine previous and new users
            const combinedUsers = [...prevUsers, ...newUsers];

            // Remove duplicates based on user id
            const uniqueUsers = Array.from(
              new Set(combinedUsers.map((user) => user.id))
            ).map((id) => combinedUsers.find((user) => user.id === id));

            return uniqueUsers;
          });
        } else {
          setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        }

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
//Sorting the users based on the column
  const sortUsers = (usersToSort) => {
    return [...usersToSort].sort((a, b) => {
      for (let { column, order } of sortColumns) {
        let compareResult;
        if (column === "fullName") {
          compareResult = a.fullName.localeCompare(b.fullName);
        } else if (column === "age" || column === "id") {
          compareResult = a[column] - b[column];
        } else {
          compareResult = String(a[column]).localeCompare(String(b[column]));
        }

        if (compareResult !== 0) {
          return order === "asc" ? compareResult : -compareResult;
        }
      }
      return 0;
    });
  };
  useEffect(() => {
    setUsers(sortUsers(users));
  }, [sortColumns]);
  const handleSort = (newSortColumns) => {
    setLoading(true);
    setSortColumns(newSortColumns);
    setLoading(false);
  };
//As we scroll down we need to load more users so here we add page and above in useEffect we call data based on page
  useEffect(() => {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, users]);
  return (
    <div className="mt-6 border rounded-3xl w-auto">
      <UserTable users={users} onSort={handleSort} sortColumns={sortColumns} />
      {loading && (
        <p className="text-center mt-4">
          <Loader />
        </p>
      )}
      {!hasMore && <p className="text-center mt-4">No more users to load</p>}
    </div>
  );
};
const UserTable = ({ users, onSort, sortColumns }) => {
  //define the column and order of the column as we click on arrow icon
  const handleSort = (column) => {
    const existingSort = sortColumns.find((sc) => sc.column === column);
    const newOrder =
      existingSort && existingSort.order === "asc" ? "desc" : "asc";
    console.log("newOrder", newOrder);
    onSort([{ column, order: newOrder }]);
  };
  //Icon of up and down arrow change according asc and desc order
  const SortIcon = ({ column }) => {
    const sort = sortColumns.find((sc) => sc.column === column);
    if (!sort) return null;
    return (
      <>
        <HiOutlineArrowSmUp
          className={`w-4 h-4 inline-block -mt-1 ${
            sort.order === "asc" ? "text-red-500" : ""
          }`}
        />
        <HiMiniArrowSmallDown
          className={`w-4 h-4 inline-block -mt-1 -ml-2 ${
            sort.order === "desc" ? "text-red-500" : ""
          }`}
        />
      </>
    );
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left text-gray-500 text-sm border-b w-full ">
          <th
            className="py-3 px-4 font-bold cursor-pointer"
            onClick={() => handleSort("id")}
          >
            ID <SortIcon column="id" />
          </th>
          <th className="py-3 px-4 font-bold">Image</th>
          <th
            className="py-3 px-4 font-bold cursor-pointer"
            onClick={() => handleSort("fullName")}
          >
            Full Name <SortIcon column="fullName" />
          </th>
          <th
            className="py-3 px-4 font-bold cursor-pointer"
            onClick={() => handleSort("age")}
          >
            Demography <SortIcon column="age" />
          </th>
          <th className="py-3 px-4 font-bold">Designation</th>
          <th className="py-3 px-4 font-bold">Location</th>
        </tr>
      </thead>
      <tbody className="text-sm w-full">
        {users.map((user, index) => (
          <tr
            key={user.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-3 px-4 text-gray-500">
              {user.id.toString().padStart(2, "0")}
            </td>
            <td className="py-3 px-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user.gender === "F"
                    ? "bg-green-200 text-green-700"
                    : "bg-blue-200 text-blue-700"
                }`}
              >
                <img
                  src={user.image}
                  alt="user"
                  className="w-6 h-6 rounded-full"
                />
              </div>
            </td>
            <td className="py-3 px-4">{user.fullName}</td>
            <td className="py-3 px-4">{`${user.gender}/${user.age}`}</td>
            <td className="py-3 px-4">{user.designation}</td>
            <td className="py-3 px-4">{user.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
