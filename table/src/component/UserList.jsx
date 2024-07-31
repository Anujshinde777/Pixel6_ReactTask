import React, { useEffect, useState } from "react";
import { HiOutlineArrowSmUp } from "react-icons/hi";
import { HiMiniArrowSmallDown } from "react-icons/hi2";

const UserTable = ({ users, onSort, sortColumns }) => {
  const handleSort = (column) => {
    const existingSort = sortColumns.find((sc) => sc.column === column);
    const newOrder = existingSort && existingSort.order === "asc" ? "desc" : "asc";
    onSort([{ column, order: newOrder }]);
  };

  useEffect(() => {
    console.log("sortColumns", sortColumns);
  }, [sortColumns]);

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
          className={`w-4 h-4 inline-block -mt-1 -ml-1 ${
            sort.order === "desc" ? "text-red-500" : ""
          }`}
        />
      </>
    );
  };

  return (
    <table className="w-full border-collapse ">
      <thead>
        <tr className="text-left text-gray-500 text-sm border-b w-full ">
          <th
            className="py-3 px-4 font-bold cursor-pointer text-wrap"
            onClick={() => handleSort("id")}
          >
            ID <SortIcon column="id" />
          </th>
          <th className="py-3 px-4 font-bold text-wrap">Image</th>
          <th
            className="py-3 px-4 font-bold cursor-pointer text-wrap"
            onClick={() => handleSort("fullName")}
          >
            Full Name <SortIcon column="fullName" />
          </th>
          <th
            className="py-3 px-4 font-bold cursor-pointer text-wrap"
            onClick={() => handleSort("age")}
          >
            Demography <SortIcon column="age" />
          </th>
          <th className="py-3 px-4 font-bold text-wrap">Designation</th>
          <th className="py-3 px-4 font-bold text-wrap">Location</th>
        </tr>
      </thead>
      <tbody className="text-sm w-full text-wrap">
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

const UserList = ({ data, hasMore, loading }) => {
  const [users, setUsers] = useState(data);
  const [sortColumns, setSortColumns] = useState([{ column: "id", order: "asc" }]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  useEffect(() => {
    sortUsers();
  }, [sortColumns]);

  const sortUsers = () => {
    const sortedUsers = [...users].sort((a, b) => {
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

    setUsers(sortedUsers);
  };

  const handleSort = (newSortColumns) => {
    setSortColumns(newSortColumns);
  };

  return (
    <div className="mt-6 border rounded-3xl w-auto">
      <UserTable users={users} onSort={handleSort} sortColumns={sortColumns} />
    </div>
  );
};

export default UserList;
