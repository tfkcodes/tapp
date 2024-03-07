import moment from "moment";

/**
 * Formats a number into comma-separated sections.
 * @param number {Number} Number to be formatted
 * @returns {String}
 */
export const numberFormat = (number) => {
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

/**
 * Parses an integer from a `text`.
 * @param text {String}
 * @returns {Number}
 */
export const parseInteger = (text) => {
  let results = /\d+/.exec(text || "");
  return results && results.length ? parseInt(results[0]) : 0;
};

/**
 * Strips all non-digit characters from `text` and returns a string of digits.
 * @param text {String}
 * @returns {String}
 */
export const validateInteger = (text) => {
  return Array.prototype.slice
    .call(text)
    .filter((c) => /\d+/.test(c))
    .join("");
};

/**
 * Capitalizes each first letter of each word in a `text`.
 * @param text {String}
 * @returns {String}
 */
export const capitalize = (text) => {
  return text
    .split(" ")
    .map((e) => e.charAt(0).toUpperCase() + e.substr(1))
    .join(" ");
};

/**
 * Generates pagination links from response data.
 * @param data {Object}
 * @returns {Array}
 */
export const generatePaginationLinks = (data) => {
  let lastPage = data.last_page,
    curPage = data.current_page,
    linksLimit = 10;
  let links = [];

  if (lastPage && linksLimit) {
    let sideLinks = Math.floor(linksLimit / 2);

    // links before current page
    if (curPage >= sideLinks) {
      links.push({ label: "First", page: 1 });
      links.push({ label: "Previous", page: curPage - 1 });
    }

    for (let i = curPage - sideLinks; i <= curPage; i++) {
      if (i === curPage) {
        links.push({ label: i, page: i, css: "current-page" });
      } else {
        if (i > 0 && i <= lastPage) {
          links.push({ label: i, page: i });
        }
      }
    }

    // links after current page
    for (let i = curPage + 1; i <= curPage + sideLinks; i++) {
      if (i === curPage) {
        links.push({ label: i, page: i, css: "current-page" });
      } else {
        if (i > 0 && i <= lastPage) {
          links.push({ label: i, page: i });
        }
      }
    }

    if (curPage < lastPage && lastPage > sideLinks + 1) {
      links.push({ label: "Next", page: curPage + 1 });
      links.push({ label: "Last", page: lastPage });
    }
  }

  return links;
};

/**
 * Returns an empty object if the argument is null.
 * @param object
 * @returns {*}
 */
export const requireNonNull = (object) => (object ? object : {});

/**
 * Formats a date object or string to the format of year-month-date.
 * @param date
 * @returns {string}
 */
export const formatDateForDb = (date) => {
  if (typeof date === "string") date = new Date(date);
  let day = `00${date.getDate()}`.slice(-2);
  let month = `00${date.getMonth() + 1}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Formats a date object or string to the format of year-month-date hour:minute:second.
 * @param date
 * @returns {string}
 */
export const formatDateTimeForDb = (date) => {
  if (typeof date === "string") date = new Date(date);
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * Formats a date object or string to the format of hour:minute:second.
 * @param date
 * @returns {string}
 */
export const formatTimeForDb = (date) => {
  if (typeof date === "string") date = new Date(date);
  return moment(date).format("HH:mm:ss");
};

/**
 * Returns a random number between min (inclusive) and max (exclusive).
 */
export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Custom styles for react-select.
 */
export const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#fff" : "#000",
    backgroundColor: state.isFocused ? "#ccc" : "#fff",
    cursor: "pointer",
  }),
  control: (provided, state) => ({
    width: "100%",
    padding: "0 0.75em",
    display: "flex",
    flexDirection: "row",
    backgroundColor: state.isDisabled ? "#f5f5f5" : "#fff",
    borderRadius: "4px",
    border: "1px solid #ccc",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.85 : 1;
    const transition = "opacity 300ms";
    return { ...provided, opacity, transition };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    padding: 0,
    height: "2.25em",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "2.25em",
  }),
  menu: (provided, state) => ({
    ...provided,
    left: 0,
    top: "calc(100% - 5px)",
    boxShadow: "0 2px 1px #eee",
    border: "1px solid #ccc",
  }),
};

export const getFinancialYearStatusClassName = (status) => {
  switch (status) {
    case "active":
      return "bg-green";
    case "inactive":
      return "bg-red";
    case "closed":
      return "bg-black";
  }
  return "bg-blue";
};

export const reportErrors = (alert, errorBody) => {
  let message = "Something went wrong.";
  if (errorBody.response) {
    const statusCode = parseInt(errorBody.response.status);
    switch (statusCode) {
      case 401:
        {
          message = "You were logged out.";
        }
        break;
      case 403:
        {
          let data = errorBody.response.data;
          if (data.data) {
            message = data.data;
          }
        }
        break;
      case 404:
        {
          message = "The requested resource was not found.";
        }
        break;
      case 422:
        {
          // validation errors
          let data = errorBody.response.data;
          if (data.data) {
            message = data.data;
          } else {
            let errors = [];
            Object.keys(data).forEach((e, i) => errors.push(data[e][0]));
            message = errors.join("\n");
          }
        }
        break;
    }
  } else if (errorBody.request) {
    message = "Network connectivity error.";
  }

  if (alert) {
    alert.showError(message);
  }
};

export const dateDifference = (dateOne, dateTwo) => {
  dateOne = new Date(dateOne);
  dateTwo = new Date(dateTwo);
  let dateDiffInTime = dateTwo.getTime() - dateOne.getTime();
  return dateDiffInTime / (1000 * 3600 * 24);
};

export const convertISODateToDate = (startTimeISOString) => {
  let startTime = new Date(startTimeISOString);
  const date = new Date(
    startTime.getTime() + startTime.getTimezoneOffset() * 60000
  );
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const convertISODateToDateTime = (startTimeISOString) => {
  let isoDate = Date.parse(startTimeISOString);
  return moment(isoDate).format("YYYY-MM-DD HH:mm:ss");
};

export const formatDateToISODateToDate = (startTimeISOString) => {
  return new Date(startTimeISOString).toISOString();
};
