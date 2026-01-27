import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";

import GLFilterSection from "../components/GLTable/AeGLTable/GLFilterSection";
import GLMainContentSection from "../components/GLTable/AeGLTable/GLMainContentSection";
import GLTable from "../components/GLTable/AeGLTable/GLTable";

import {
  loadVshipsTransactions,
  uploadVshipsExcel,
  generateVshipsGl,
  validateVshipsGl,
  getVshipsUploadSummary,
} from "../components/GLTable/VshipsGLTable/VshipsGlapi";

const PAGE_SIZE = 10;

function VshipsGLTablePage() {
  /* ================= SEARCH ================= */
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= WORKFLOW ================= */
  const [workflow, setWorkflow] = useState({
    load: false,
    generate: false,
    post: false,
  });

  /* ================= FILTERS (START EMPTY ✅) ================= */
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    effectiveDate: "",
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

  /* ================= RESET WHEN PERIOD CHANGES ================= */
  useEffect(() => {
    setWorkflow({ load: false, generate: false, post: false });
    setData([]);
    setNormalData([]);
    setErrorData([]);
    setUploadSummary(null);
    setShowErrorsOnly(false);
    setExcelFile(null);

    setCurrentPage(1);
    setTotalPages(0);
    setTotalRecords(0);
  }, [filters.month, filters.year]);

  /* ================= LOAD ================= */
  const handleLoad = async (file) => {
    if (!file) {
      showToast("Excel file is mandatory", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await uploadVshipsExcel({
        ...filters,
        file,
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
      showToast("Load failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGE CHANGE ================= */
  const handlePageChange = async (newPage) => {
    if (loading || workflow.generate) {
      setCurrentPage(newPage);
      return;
    }

    setLoading(true);
    try {
      const res = await loadVshipsTransactions({
        ...filters,
        page: newPage - 1,
        size: PAGE_SIZE,
      });

      setData(res.ledgers || []);
      setCurrentPage(newPage);
    } catch (err) {
      console.error("Pagination failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const periodName = `${new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}-${filters.year}`;

      const genRes = await generateVshipsGl(filters);
      const generatedData = genRes.data || [];
      setNormalData(generatedData);

      const valRes = await validateVshipsGl({ periodName });
      const errors = Array.isArray(valRes) ? valRes : valRes.data || [];
      setErrorData(errors);

      const summary = await getVshipsUploadSummary({ periodName });
      setUploadSummary(summary);

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
      console.error("Generate failed:", err);
      showToast("Generate failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ERROR TOGGLE ================= */
  const handleErrorToggle = (showErrors) => {
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
      await generateVshipsGl(filters);
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
        Please select Month, Year, Date and Excel file
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

export default VshipsGLTablePage;
