// api/aeApi.js
import { doGet,doPost,doPostForm } from "../../../apiHandler";
/* ---------------- HELPERS ---------------- */
const formatEffectiveDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/* ================= LOAD WITHOUT EXCEL ================= */
export const loadAeTransactions = async ({
  year,
  month,
  effectiveDate,
  page,
  size = 10,
}) => {
  return doGet("/ae/getGeneralLedger", {
    year,
    month: String(month).padStart(2, "0"),
    page,
    size,
    effectiveDate: formatEffectiveDate(effectiveDate),
  });
};

/* ================= LOAD WITH EXCEL ================= */
export const uploadAeExcel = async ({
  year,
  month,
  effectiveDate,
  file,
}) => {
  const formData = new FormData();
  formData.append("year", year);
  formData.append("month", month);
  formData.append("effectiveDate", effectiveDate);
  formData.append("file", file);

  return doPostForm("/ae/upload-excel", formData);
};

/* ================= GENERATE GL ================= */
export const generateAeGl = async ({ year, month }) => {
  return doPost("/ae/uploadGl", null, {
    params: {
      year,
      month: String(month).padStart(2, "0"),
    },
  });
};

/* ================= VALIDATE GL ================= */
export const validateAeGl = async ({ periodName }) => {
  return doGet("/ae/validate", {
    periodName,
    errorFlag: 1,
    page: 0,
    size: 50,
  });
};

/* ================= UPLOAD SUMMARY ================= */
export const getAeUploadSummary = async ({ periodName }) => {
  return doGet("/ae/upload-summary", { periodName });
};
