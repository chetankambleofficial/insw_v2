import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";

import GLFilterSection from "../components/GLTable/AeGLTable/GLFilterSection";
import GLMainContentSection from "../components/GLTable/AeGLTable/GLMainContentSection";
import GLTable from "../components/GLTable/AeGLTable/GLTable";

import {
  loadAeTransactions,
  uploadAeExcel,
  generateAeGl,
  validateAeGl,
  getAeUploadSummary,
} from "../components/GLTable/AeGLTable/aeGlapi";

const PAGE_SIZE = 10;

function AeGLTablePage() {
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= WORKFLOW ================= */
  const [workflow, setWorkflow] = useState({
    load: false,
    generate: false,
    post: false,
  });

  /* ================= FILTERS ================= */
  const [filters, setFilters] = useState({
    month: 1,
    year: 2024,
    effectiveDate: "2024-01-01",
  });

  /* ================= FILE ================= */
  const [excelFile, setExcelFile] = useState(null);

  /* ================= DATA ================= */
  const [data, setData] = useState([]);
  const [normalData, setNormalData] = useState([]);
  const [errorData, setErrorData] = useState([]);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  /* ================= UI STATE ================= */
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  /* ================= RESET ON PERIOD CHANGE ================= */
  useEffect(() => {
    setWorkflow({ load: false, generate: false, post: false });
    setData([]);
    setNormalData([]);
    setErrorData([]);
    setUploadSummary(null);
    setShowErrorsOnly(false);
    setExcelFile(null);

    // pagination reset
    setCurrentPage(1);
    setTotalPages(0);
    setTotalRecords(0);
  }, [filters.month, filters.year]);

  /* ================= LOAD PAGE ================= */
  const handleLoad = async (file) => {
    setLoading(true);
    try {
      const response = file
        ? await uploadAeExcel({ ...filters, file })
        : await loadAeTransactions({
            ...filters,
            page: 0,
            size: PAGE_SIZE,
          });

      const result = response.ledgers || response.data || [];
      const total = response.totalRecords || response.total || result.length;

      setData(result);
      setCurrentPage(1);
      setTotalRecords(total);
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));

      setWorkflow({ load: true, generate: false, post: false });
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD SPECIFIC PAGE ================= */
  const handlePageChange = async (newPage) => {
    if (loading) return;

    // Don't call API for generated/error data - just update page
    if (workflow.generate) {
      setCurrentPage(newPage);
      return;
    }

    setLoading(true);
    try {
      const res = await loadAeTransactions({
        ...filters,
        page: newPage - 1, // API uses 0-based indexing
        size: PAGE_SIZE,
      });

      const result = res.ledgers || [];
      setData(result);
      setCurrentPage(newPage);
    } catch (err) {
      console.error("Page change failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE + VALIDATE + SUMMARY ================= */
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const periodName = `${new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}-${filters.year}`;

      /* 1️⃣ Generate GL */
      const genRes = await generateAeGl(filters);
      const generatedData = genRes.data || [];
      setNormalData(generatedData);

      /* 2️⃣ Validate GL */
      const valRes = await validateAeGl({ periodName });
      const errors = Array.isArray(valRes) ? valRes : valRes.data || [];
      setErrorData(errors);

      /* 3️⃣ Upload Summary */
      const summary = await getAeUploadSummary({ periodName });
      setUploadSummary(summary);

      /* 4️⃣ View Logic */
      if (errors.length > 0) {
        setData(errors);
        setShowErrorsOnly(true);
        showToast("Can’t post, it has errors", "error");
      } else {
        setData(generatedData);
        setShowErrorsOnly(false);
      }

      setWorkflow({ load: true, generate: true, post: false });
    } catch (err) {
      console.error("Generate flow failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ERROR SWITCH ================= */
  const handleErrorToggle = (showErrors) => {
    if (errorData.length === 0) {
      setShowErrorsOnly(false);
      setData(normalData);
      return;
    }

    setShowErrorsOnly(showErrors);
    setData(showErrors ? errorData : normalData);
  };

  /* ================= POST ================= */
  const handlePost = async () => {
    if (errorData.length > 0) {
      showToast("Can’t post, it has errors", "error");
      return;
    }

    setLoading(true);
    try {
      await generateAeGl(filters);
      setWorkflow({ load: true, generate: true, post: true });
      showToast("Posted successfully", "success");
    } catch (err) {
      showToast("Post failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TABLE ================= */
  const getColumns = () =>
    data.length
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (c) => c.toUpperCase()),
        }))
      : [];

  const renderTable = () =>
    workflow.load ? (
      <GLTable
        data={data}
        columns={getColumns()}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        rowTextColor={showErrorsOnly ? "error" : "default"}
      />
    ) : (
      <Box sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
        Please select Month, Year and Effective Date to retrieve data
      </Box>
    );

  /* ================= UI ================= */
  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 96px)" }}>
      <GLFilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <GLMainContentSection
          filters={filters}
          setFilters={setFilters}
          workflow={workflow}
          showErrorsOnly={showErrorsOnly}
          setShowErrorsOnly={handleErrorToggle}
          onLoad={handleLoad}
          onGenerate={handleGenerate}
          onPost={handlePost}
          excelFile={excelFile}
          setExcelFile={setExcelFile}
          hasErrors={errorData.length > 0}
          loading={loading}
          uploadSummary={uploadSummary}
        />

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          {renderTable()}
        </Box>
      </Box>

      {/* ================= TOAST ================= */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AeGLTablePage;
