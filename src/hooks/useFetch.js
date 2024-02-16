import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "../constants";

async function fetchData(uri, queryString) {
  const params = queryString ? JSON.parse(queryString) : {};
  return await window.axios.get(BASE_URL + uri, { params });
}

/**
 * Simple hook to fetch data from an external api.It
 * passes the api token so you don't have to pass it manually
 * @param {string} uri - relative path to fetch data. e.g /patient-registration
 * @param {object} params - Query params e.g {registration_ID: 1}
 * @param {boolean} fetchOnMount - Determine if we should fetch data on component mount. The default value is true
 * @param {object} initialData - Default data
 * @param {Function} callback - Callback for response data
 * @returns {object}
 */
export function useFetch(uri, params = null, fetchOnMount = true, initialData = null, callback = null) {
  const ignore = useRef();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryString = params ? JSON.stringify(params) : null;

  const doFetch = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchData(uri, queryString)
      .then((response) => {
        if (!ignore.current) {
          const records = response.data.data;
          setData(
            typeof callback === "function" ? callback(response) : records
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!ignore.current) {
          setLoading(false);
          setError(error);
        }
      });
  }, [uri, queryString]);

  useEffect(() => {
    ignore.current = false;
    if (queryString || fetchOnMount) {
      doFetch();
    }

    return () => {
      ignore.current = true;
    };
  }, [uri, queryString, fetchOnMount]);

  return { data, loading, error, doFetch, setData };
}

export default useFetch;
