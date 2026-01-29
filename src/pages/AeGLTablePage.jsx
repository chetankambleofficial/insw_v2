import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import GLFilterSection from "../components/GLTable/AeGLTable/GLFilterSection";
import GLMainContentSection from "../components/GLTable/AeGLTable/GLMainContentSection";
import GLTable from "../components/GLTable/AeGLTable/GLTable";
import LoadingScreen from "../components/common/LoadingScreen";

import {
  loadAeTransactions,
  uploadAeExcel,
  validateAeGl,
  getAeErrors,
  getAeUploadSummary,
  postAeGl
} from "../components/GLTable/AeGLTable/aeGlapi";

const PAGE_SIZE = 20

function AeGLTablePage() {
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= WORKFLOW STATE ================= */
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
  const [generatedData, setGeneratedData] = useState([]);
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
    setGeneratedData([]);
    setErrorData([]);
    setUploadSummary(null);
    setShowErrorsOnly(false);
    setExcelFile(null);
    setCurrentPage(0);
    setHasNextPage(true);
  }, [filters.month, filters.year]);

  /* ================= 1️⃣ LOAD ================= */
  const handleLoad = async (file) => {
    setLoading(true);
    setLoadingMessage("Loading transactions...");
    try {
      const response = file
        ? await uploadAeExcel({ ...filters, file })
        : await loadAeTransactions({
            ...filters,
            page: 0,
            size: PAGE_SIZE,
          });

      const result = response.ledgers || response.data || response || [];

      setData(result);
      setCurrentPage(0);
      setHasNextPage(result.length === PAGE_SIZE);
      setWorkflow({ load: true, generate: false, post: false });
    } catch (err) {
      console.error("Load failed:", err);
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        showToast("Request timeout - try reducing date range or check connection", "error");
      } else {
        showToast("Failed to load data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD NEXT PAGE ================= */
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
        // For generated/error data
        if (showErrorsOnly) {
          // No pagination API for errors - client-side only
          return;
        } else {
          // Call validate API with pagination
          res = await validateAeGl({ periodName, page: nextPage, size: PAGE_SIZE });
          result = Array.isArray(res) ? res : res.data || res.content || res.ledgers || [];
        }
      } else {
        // For loaded data (including Excel uploads)
        if (excelFile) {
          res = await uploadAeExcel({
            ...filters,
            file: excelFile,
            page: nextPage,
            size: PAGE_SIZE,
          });
        } else {
          res = await loadAeTransactions({
            ...filters,
            page: nextPage,
            size: PAGE_SIZE,
          });
        }
        result = res.ledgers || res.data || res || [];
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
        // For generated/error data
        if (showErrorsOnly) {
          // No pagination API for errors - client-side only
          return;
        } else {
          // Call validate API with pagination
          res = await validateAeGl({ periodName, page: prevPage, size: PAGE_SIZE });
          result = Array.isArray(res) ? res : res.data || res.content || res.ledgers || [];
        }
      } else {
        // For loaded data (including Excel uploads)
        if (excelFile) {
          res = await uploadAeExcel({
            ...filters,
            file: excelFile,
            page: prevPage,
            size: PAGE_SIZE,
          });
        } else {
          res = await loadAeTransactions({
            ...filters,
            page: prevPage,
            size: PAGE_SIZE,
          });
        }
        result = res.ledgers || res.data || res || [];
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

  /* ================= 3️⃣ GENERATE + 4️⃣ VALIDATE + 5️⃣ SUMMARY ================= */
  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMessage("Generating GL entries...");
    try {
      const periodName = `${new Date(0, filters.month - 1)
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}-${String(filters.year).slice(-2)}`;

      // Call all 3 APIs simultaneously
      const [errRes, genRes, summary] = await Promise.all([
        getAeErrors({ periodName }),
        validateAeGl({ periodName }),
        getAeUploadSummary({ periodName })
      ]);

      // Process errors
      const errors = Array.isArray(errRes) ? errRes : 
                    errRes.data || errRes.content || errRes.ledgers || errRes || [];
      setErrorData(errors);

      // Process generated data
      const generated = Array.isArray(genRes) ? genRes : 
                      genRes.data || genRes.content || genRes.ledgers || genRes || [];
      setGeneratedData(generated);

      // Set upload summary
      setUploadSummary(summary);

      // Display logic: If errors exist, show error table first
      if (errors.length > 0) {
        setData(errors);
        setShowErrorsOnly(true);
      } else {
        setData(generated);
        setShowErrorsOnly(false);
      }

      // Reset pagination for new data
      setCurrentPage(0);
      setHasNextPage(true);

      setWorkflow({ load: true, generate: true, post: false });
    } catch (err) {
      console.error("Generate failed:", err);
      showToast("Failed to generate GL entries", "error");
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
      // Show normal data - use generatedData
      setData(generatedData);
    }
  };

  /* ================= 6️⃣ POST ================= */
  const handlePost = async () => {
    // Strict business rule enforcement
    if (!workflow.generate) {
      showToast("Must generate GL entries first", "error");
      return;
    }

    if (errorData.length > 0) {
      showToast("Cannot post - validation errors exist", "error");
      return;
    }

    setLoading(true);
    setLoadingMessage("Posting transactions...");
    try {
      await postAeGl(filters);
      setWorkflow({ load: true, generate: true, post: true });
      showToast("GL entries posted successfully", "success");
    } catch (err) {
      console.error("Post failed:", err);
      showToast("Failed to post GL entries", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!workflow.load) {
      return (
        <Box sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
          Please select Month, Year and Effective Date to retrieve data
        </Box>
      );
    }

    // Determine table type based on data source
    let tableType = "gl"; // default for /ae/getGeneralLedger
    
    if (excelFile) {
      tableType = "upload"; // for /ae/upload-excel
    }
    
    if (showErrorsOnly) {
      tableType = "error";
    } else if (workflow.generate) {
      tableType = "validate";
    }

    return (
      <GLTable
        data={data}
        tableType={tableType}
        currentPage={currentPage + 1}
        hasNextPage={hasNextPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        rowTextColor={showErrorsOnly ? "error" : "default"}
      />
    );
  };

  /* ================= UI RENDER ================= */
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

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
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

export default AeGLTablePage;