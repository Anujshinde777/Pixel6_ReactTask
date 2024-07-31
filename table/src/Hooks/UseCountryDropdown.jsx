import { useState, useEffect } from "react";

const useCountryDropdown = (limit = 300, initialSkip = 0) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
 
    try {
      const response = await fetch(
        `https://dummyjson.com/users`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      if (data.users && data.users.length > 0) {
        const newCountries = data.users
          .map((user) => user.address.country)
          .filter((state, index, self) => self.indexOf(state) === index);

        setCountries((prevCountries) => {
          const updatedCountries = [
            ...new Set([...prevCountries, ...newCountries]),
          ];
          return updatedCountries.sort();
        });

      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  return { countries  };
};

export default useCountryDropdown;
