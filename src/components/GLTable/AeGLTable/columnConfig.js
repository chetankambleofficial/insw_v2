// AE Column Configurations

// For /ae/getGeneralLedger endpoint
export const AE_GET_GL_COLUMNS = [
  { key: "accountingNumber", label: "Account", apiField: "accountingNumber" },
  { key: "accountName", label: "Account Name", apiField: "accountName" },
  { key: "vesselImo", label: "Vessel IMO", apiField: "vesselImo" },
  { key: "accountingPeriod", label: "Accounting Period", apiField: "accountingPeriod" },
  { key: "documentNumber", label: "Document Number", apiField: "documentNumber" },
  { key: "accountingNumber", label: "Accounting Number", apiField: "accountingNumber" },
  { key: "transactionDate", label: "Transaction Date", apiField: "transactionDate" },
  { key: "baseCurrency", label: "Base Currency", apiField: "baseCurrency" },
  { key: "baseAmount", label: "Base Amount", apiField: "baseAmount" },
  { key: "foreignCurrency", label: "Foreign Currency", apiField: "foreignCurrency" },
  { key: "foreignAmount", label: "Foreign Amount", apiField: "foreignAmount" },
  { key: "grossAmount", label: "Gross Amount", apiField: "grossAmount" },
  { key: "memo", label: "Memo", apiField: "memo" },
  { key: "lineMemo", label: "Line Memo", apiField: "lineMemo" },
  { key: "transactionType", label: "Transaction Type", apiField: "transactionType" },
  { key: "projectCode", label: "Project Code", apiField: "projectCode" },
  { key: "analysisCode", label: "Analysis Code", apiField: "analysisCode" },
  { key: "vendorCode", label: "Vendor Code", apiField: "vendorCode" },
  { key: "ownerAccountNumber", label: "Owner Account Number", apiField: "ownerAccountNumber" },
  { key: "vesselName", label: "Vessel Name", apiField: "vesselName" },
  { key: "aeReferencePO", label: "AE Reference PO", apiField: "aeReferencePO" },
];

// For /ae/upload-excel endpoint
export const AE_UPLOAD_EXCEL_COLUMNS = [
  { key: "account", label: "Account", apiField: "account" },
  { key: "accountName", label: "Account Name", apiField: "accountName" },
  { key: "vesselImo", label: "Vessel IMO", apiField: "vesselImo" },
  { key: "period", label: "Accounting Period", apiField: "period" },
  { key: "documentNumber", label: "Document Number", apiField: "documentNumber" },
  { key: "accountNumber", label: "Accounting Number", apiField: "accountNumber" },
  { key: "date", label: "Transaction Date", apiField: "date" },
  { key: "baseCurrency", label: "Base Currency", apiField: "currency" },
  { key: "baseAmount", label: "Base Amount", apiField: "baseAmount" },
  { key: "foreignCurrency", label: "Foreign Currency", apiField: "currency" },
  { key: "foreignAmount", label: "Foreign Amount", apiField: "foreignAmount" },
  { key: "grossAmount", label: "Gross Amount", apiField: "grossAmount" },
  { key: "memo", label: "Memo", apiField: "memo" },
  { key: "lineMemo", label: "Line Memo", apiField: "lineMemo" },
  { key: "type", label: "Transaction Type", apiField: "type" },
  { key: "projectCode", label: "Project Code", apiField: "projectCode" },
  { key: "analysisCode", label: "Analysis Code", apiField: "analysisCode" },
  { key: "vendorCode", label: "Vendor Code", apiField: "vendorCode" },
  { key: "ownerAccountNumber", label: "Owner Account Number", apiField: "ownerAccountNumber" },
  { key: "aeShip", label: "Vessel Name", apiField: "aeShip" },
  { key: "aeRefPo", label: "AE Reference PO", apiField: "aeRefPo" },
];

// Legacy columns (keeping for backward compatibility)
export const AE_GL_COLUMNS = AE_GET_GL_COLUMNS;

export const AE_VALIDATE_COLUMNS = [
  { key: "status", label: "Status", apiField: "extStatus" },
  { key: "accountingDate", label: "Accounting Date", apiField: "extAccountingDate" },
  { key: "currencyCode", label: "Currency Code", apiField: "extCurrencyCode" },
  { key: "jeSourceName", label: "JE Source Name", apiField: "extUserJeSourceName" },
  { key: "jeCategoryName", label: "JE Category Name", apiField: "extUserJeCategoryName" },
  { key: "accountingCompanyId", label: "Accounting Company Id", apiField: "extSegment1" },
  { key: "shipId", label: "Ship Id", apiField: "extSegment4" },
  { key: "glAccountNo", label: "GL Account No", apiField: "extSegment3" },
  { key: "departmentCode", label: "Department Code", apiField: "extSegment2" },
  { key: "projectCode", label: "Project Code", apiField: "extSegment5" },
  { key: "interCompany", label: "Inter Company", apiField: "extSegment6" },
  { key: "future", label: "Future", apiField: "extSegment7" },
  { key: "enteredDr", label: "Entered Dr", apiField: "extEnteredDr" },
  { key: "enteredCr", label: "Entered Cr", apiField: "extEnteredCr" },
  { key: "accountedDr", label: "Accounted Dr", apiField: "extAccountedDr" },
  { key: "accountedCr", label: "Accounted Cr", apiField: "extAccountedCr" },
  { key: "batchName1", label: "Batch Name 1", apiField: "extReference1" },
  { key: "batchName2", label: "Batch Name 2", apiField: "extReference2" },
  { key: "generalDesc", label: "General Description", apiField: "extReference10" },
  { key: "claimNo", label: "Claim No", apiField: "claims" },
  { key: "batchName", label: "Batch Name", apiField: "extBatchName" },
  { key: "periodName", label: "Period Name", apiField: "periodName" }
];

export const AE_ERROR_COLUMNS = [
  { key: "errorReason", label: "Error Reason", apiField: "errorReason" },
  { key: "vesselImo", label: "Vessel IMO", apiField: "vesselImo" },
  { key: "accountingPeriod", label: "Accounting Period", apiField: "accountingPeriod" },
  { key: "documentNumber", label: "Document Number", apiField: "documentNumber" },
  { key: "accountingNumber", label: "Accounting Number", apiField: "accountingNumber" },
  { key: "transactionDate", label: "Transaction Date", apiField: "transactionDate" },
  { key: "baseCurrency", label: "Base Currency", apiField: "baseCurrency" },
  { key: "baseAmount", label: "Base Amount", apiField: "baseAmount" },
  { key: "foreignCurrency", label: "Foreign Currency", apiField: "foreignCurrency" },
  { key: "foreignAmount", label: "Foreign Amount", apiField: "foreignAmount" },
  { key: "memo", label: "Memo", apiField: "memo" },
  { key: "transactionType", label: "Transaction Type", apiField: "transactionType" },
  { key: "aeReferencePO", label: "AE Reference PO", apiField: "aeReferencePO" },
  { key: "account", label: "Account", apiField: "account" },
  { key: "accountLineName", label: "Account Line Name", apiField: "accountLineName" },
  { key: "name", label: "Name", apiField: "name" },
  { key: "lineMemo", label: "Line Memo", apiField: "lineMemo" },
  { key: "aeShip", label: "AE Ship", apiField: "aeShip" }
];