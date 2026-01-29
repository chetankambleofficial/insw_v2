import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";

import GLFilterSection from "../components/GLTable/VshipsGLTable/GLFilterSection";
import GLMainContentSection from "../components/GLTable/VshipsGLTable/GLMainContentSection";
import GLTable from "../components/GLTable/VshipsGLTable/GLTable";
import LoadingScreen from "../components/common/LoadingScreen";

import {
  LoadVshipsGl,
  validateVshipsGl,
  getVshipsUploadSummary,
  getVshipsErrors,
  postVshipsGl,
} from "../components/GLTable/VshipsGLTable/VshipsGlapi";

const PAGE_SIZE = 15;

function VshipsGLTablePage() {
  /* ================= SEARCH ================= */
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= WORKFLOW ================= */
  const [workflow, setWorkflow] = useState({
    load: false,
    generate: false,
    post: false,
  });

  /* ================= FILTERS ================= */
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
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  /* ================= UI STATE ================= */
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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
    setCurrentPage(0);
    setHasNextPage(true);
  }, [filters.month, filters.year]);

  /* ================= LOAD (EXCEL) ================= */
  const handleLoad = async (file) => {
    if (!file) {
      showToast("Excel file is mandatory");
      return;
    }

    setLoading(true);
    setLoadingMessage("Loading VShips data...");
    try {
      const response = await LoadVshipsGl({
        ...filters,
        file,
        page: 0,
        size: PAGE_SIZE,
      });

      const result = response.ledgers || response.data || response.content || [];

      setData(result);
      setCurrentPage(0);
      setHasNextPage(result.length === PAGE_SIZE);

      setWorkflow({ load: true, generate: false, post: false });
    } catch (err) {
      console.error("Load failed:", err);
      showToast("Load failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGINATION ================= */
  const handleNextPage = async () => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    setLoadingMessage("Loading next page...");
    try {
      const nextPage = currentPage + 1;
      const periodName = `${new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}-${String(filters.year).slice(-2)}`;

      let res, result;
      
      if (workflow.generate) {
        if (showErrorsOnly) {
          return; // No pagination for errors
        } else {
          res = await validateVshipsGl({ periodName, page: nextPage, size: PAGE_SIZE });
          result = Array.isArray(res) ? res : res.data || res.content || res.ledgers || [];
        }
      } else {
        res = await LoadVshipsGl({
          ...filters,
          file: excelFile,
          page: nextPage,
          size: PAGE_SIZE,
        });
        result = res.ledgers || res.data || res.content || [];
      }

      if (result.length === 0) {
        setHasNextPage(false);
        return;
      }

      setData(result);
      setCurrentPage(nextPage);
      setHasNextPage(result.length === PAGE_SIZE);
    } catch (err) {
      console.error("Next page failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage === 0 || loading) return;

    setLoading(true);
    setLoadingMessage("Loading previous page...");
    try {
      const prevPage = currentPage - 1;
      const periodName = `${new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}-${String(filters.year).slice(-2)}`;

      let res, result;
      
      if (workflow.generate) {
        if (showErrorsOnly) {
          return; // No pagination for errors
        } else {
          res = await validateVshipsGl({ periodName, page: prevPage, size: PAGE_SIZE });
          result = Array.isArray(res) ? res : res.data || res.content || res.ledgers || [];
        }
      } else {
        res = await LoadVshipsGl({
          ...filters,
          file: excelFile,
          page: prevPage,
          size: PAGE_SIZE,
        });
        result = res.ledgers || res.data || res.content || [];
      }

      setData(result);
      setCurrentPage(prevPage);
      setHasNextPage(true);
    } catch (err) {
      console.error("Previous page failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMessage("Generating VShips GL entries...");
    try {
      const monthName = new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase();

      const yearShort = String(filters.year).slice(-2);
      const periodName = `${monthName}-${yearShort}`;

      // 1️⃣ Validate / Generate (get normal data)
      const normalResponse = await validateVshipsGl({ periodName });
      console.log('Normal response:', normalResponse);
      const normal = Array.isArray(normalResponse) ? normalResponse : 
                    normalResponse.data || normalResponse.content || normalResponse.ledgers || [];
      setNormalData(normal);

      // 2️⃣ Upload summary
      const summary = await getVshipsUploadSummary({ periodName });
      setUploadSummary(summary);

      // 3️⃣ Get errors
      const errorResponse = await getVshipsErrors({ periodName });
      console.log('Error response:', errorResponse);
      const errors = Array.isArray(errorResponse) ? errorResponse : 
                    errorResponse.data || errorResponse.content || errorResponse.ledgers || [];
      setErrorData(errors);

      // 4️⃣ Set initial display based on error count
      if (errors.length > 0) {
        setData(errors);
        setShowErrorsOnly(true);
      } else {
        setData(normal);
        setShowErrorsOnly(false);
      }

      setWorkflow({ load: true, generate: true, post: false });
    } catch (err) {
      console.error("Generate failed:", err);
      showToast("Generate failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ERROR TOGGLE ================= */
  const handleErrorToggle = (showErrors) => {
    setShowErrorsOnly(showErrors);
    setCurrentPage(0);
    setHasNextPage(true);
    if (showErrors) {
      // Show errors - use errorData
      setData(errorData);
    } else {
      // Show normal data - use normalData
      setData(normalData);
    }
  };

  /* ================= POST ================= */
  const handlePost = async () => {
    if (errorData.length > 0) {
      showToast("Can’t post, it has errors");
      return;
    }

    setLoading(true);
    setLoadingMessage("Posting VShips transactions...");
    try {
      await postVshipsGl(filters);
      setWorkflow({ load: true, generate: true, post: true });
      showToast("Posted successfully", "success");
    } catch (err) {
      showToast("Post failed");
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
        tableType={showErrorsOnly ? "error" : workflow.generate ? "validate" : "gl"}
        currentPage={currentPage + 1}
        hasNextPage={hasNextPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
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

        <Box sx={{ flex: 1, overflow: "hidden" }}>{renderTable()}</Box>
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

      <LoadingScreen open={loading} message={loadingMessage} />
    </Box>
  );
}

export default VshipsGLTablePage;
