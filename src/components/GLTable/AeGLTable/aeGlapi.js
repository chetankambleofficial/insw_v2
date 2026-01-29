// // api/aeApi.js
// import { doGet,doPost,doPostForm } from "../../../apiHandler";
// /* ---------------- HELPERS ---------------- */
// const formatEffectiveDate = (date) => {
//   if (!date) return "";

//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}/${month}/${year}`;
// };

// /* ================= LOAD WITHOUT EXCEL ================= */
// export const loadAeTransactions = async ({
//   year,
//   month,
//   effectiveDate,
//   page,
//   size = 10,
// }) => {
//   return doGet("/ae/getGeneralLedger", {
//     year,
//     month: String(month).padStart(2, "0"),
//     page,
//     size,
//     effectiveDate: formatEffectiveDate(effectiveDate),
//   });
// };

// /* ================= LOAD WITH EXCEL ================= */
// export const uploadAeExcel = async ({
//   year,
//   month,
//   effectiveDate,
//   file,
// }) => {
//   const formData = new FormData();
//   formData.append("year", year);
//   formData.append("month", month);
//   formData.append("effectiveDate", effectiveDate);
//   formData.append("file", file);

//   return doPostForm("/ae/upload-excel", formData);
// };

// /* ================= GENERATE GL ================= */
// export const generateAeGl = async ({ year, month }) => {
//   return doPost("/ae/uploadGl", null, {
//     params: {
//       year,
//       month: String(month).padStart(2, "0"),
//     },
//   });
// };

// /* ================= VALIDATE GL ================= */
// export const validateAeGl = async ({ periodName }) => {
//   return doGet("/ae/validate", {
//     periodName,
//     errorFlag: 1,
//     page: 0,
//     size: 50,
//   });
// };

// /* ================= UPLOAD SUMMARY ================= */
// export const getAeUploadSummary = async ({ periodName }) => {
//   return doGet("/ae/upload-summary", { periodName });
// };



// api/aeApi.js
// api/aeApi.js
import { doGet, doPost, doPostForm } from "../../../apiHandler";

/* ---------------- HELPERS ---------------- */
const formatEffectiveDate = (date, type = "DDMMYYYY") => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return type === "MMDDYYYY"
    ? `${month}/${day}/${year}`
    : `${day}/${month}/${year}`;
};

/* ================= LOAD WITHOUT EXCEL ================= */
export const loadAeTransactions = async ({
  year,
  month,
  effectiveDate,
  page = 0,
  size = 5,
}) => {
  const formattedMonth = String(month).padStart(2, "0");

  const endpoint =
    `/ae/getGeneralLedger` +
    `?year=${year}` +
    `&month=${formattedMonth}` +
    `&page=${page}` +
    `&size=${size}` +
    `&effectiveDate=${formatEffectiveDate(effectiveDate)}`;

  return doPost(endpoint, {});
};

/* ================= LOAD WITH EXCEL ================= */
export const uploadAeExcel = async ({
  year,
  month,
  effectiveDate,
  file,
  page = 0,
  size = 20,
}) => {
  const formattedMonth = String(month).padStart(2, "0");

  const endpoint =
    `/ae/upload-excel` +
    `?year=${year}` +
    `&month=${formattedMonth}` +
    `&effectiveDate=${formatEffectiveDate(effectiveDate, "DDMMYYYY")}` +
    `&page=${page}` +
    `&size=${size}`;

  const formData = new FormData();
  formData.append("file", file);

  return doPostForm(endpoint, formData);
};

/* ================= GENERATE GL ================= */
/* switch of no errors */

export const validateAeGl = async ({ periodName, page = 0, size = 100 }) => {
  const endpoint =
    `/ae/validate` +
    `?periodName=${periodName}` +
    `&errorFlag=0` +
    `&page=${page}` +
    `&size=${size}`;

  return doGet(endpoint);
};

/* ================= UPLOAD SUMMARY ================= */
/* display upload summary */
export const getAeUploadSummary = async ({ periodName }) => {
  const endpoint =
    `/ae/upload-summary?periodName=${periodName}`;

  return doGet(endpoint);
};
/* switch on errors */
export const getAeErrors = async ({ periodName }) => {
  const endpoint =
    `/ae/errors?periodName=${periodName}`;

  return doGet(endpoint);
};

/* ================= POST GL ================= */
export const postAeGl = async ({ year, month }) => {
  const formattedMonth = String(month).padStart(2, "0");

  const endpoint =
    `/ae/uploadGl` +
    `?year=${year}` +
    `&month=${formattedMonth}`;

  return doPost(endpoint, {});
};