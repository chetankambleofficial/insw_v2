const BASE_URL = "http://localhost:8055/api";

/* ================= LOAD WITHOUT EXCEL ================= */
const formatEffectiveDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};


export const loadVshipsTransactions = async ({
  year,
  month,
  effectiveDate,
  page,
  size = 10,
}) => {
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDate = formatEffectiveDate(effectiveDate);

  const res = await fetch(
    `${BASE_URL}/ae/getGeneralLedger?year=${year}&month=${formattedMonth}&page=${page}&size=${size}&effectiveDate=${formattedDate}`
  );

  if (!res.ok) throw new Error("Failed to load transactions");

  return res.json();
};


/* ================= LOAD WITH EXCEL ================= */
export const uploadVshipsExcel = async ({
  year,
  month,
  effectiveDate,
  page = 0,
  size = 100,
  file,
}) => {
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDate = formatEffectiveDate(effectiveDate);
  const encodedDate = encodeURIComponent(formattedDate);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${BASE_URL}/v-ships/upload-excel?year=${year}&month=${formattedMonth}&page=${page}&size=${size}&effectiveDate=${encodedDate}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Failed to upload excel");

  return res.json();
};

/* ================= GENERATE GL ================= */
export const generateVshipsGl = async ({ year, month }) => {
  // 🔹 Ensure month is always 2 digits (01–12)
  const formattedMonth = String(month).padStart(2, "0");

  const res = await fetch(
    `${BASE_URL}/v-ships/uploadGl?month=${formattedMonth}&year=${year}`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to generate GL");

  return res.json();
};


/* ================= VALIDATE GL ================= */
export const validateVshipsGl = async ({ periodName }) => {
  const res = await fetch(
    `${BASE_URL}/v-ships/validate?periodName=${periodName}&errorFlag=1&page=0&size=50`
  );
  if (!res.ok) throw new Error("Failed to validate GL");
  return res.json(); // 🔥 ARRAY
};

/* ================= UPLOAD SUMMARY ================= */
export const getVshipsUploadSummary = async ({ periodName }) => {
  const res = await fetch(
    `${BASE_URL}/v-ships/upload-summary?periodName=${periodName}`
  );
  if (!res.ok) throw new Error("Failed to fetch upload summary");
  return res.json();
};
