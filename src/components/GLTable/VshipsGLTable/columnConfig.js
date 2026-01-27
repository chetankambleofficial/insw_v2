// columnConfig.js

// ---------------- MASTER COLUMN LIST ----------------
const RAW_GL_COLUMNS = [
  { key: "coyId", label: "Company ID" },
  { key: "claims", label: "Claims" },
  { key: "project", label: "Project" },
  { key: "docType", label: "Doc Type" },
  { key: "clientAccNo", label: "Client Account No" },
  { key: "clientAccDesc", label: "Account Description" },
  { key: "accountCode", label: "Account Code" },
  { key: "voucherNo", label: "Voucher No" },
  { key: "voucherType", label: "Voucher Type" },
  { key: "reference", label: "Reference" },
  { key: "vesselName", label: "Vessel Name" },
  { key: "text", label: "Description" },
  { key: "amountFunctional", label: "Amount" },
  { key: "currency", label: "Currency" },
  { key: "amountBase", label: "Base Amount" },
  { key: "detailedText", label: "Detailed Text" },
  { key: "delivery", label: "Delivery" },
  { key: "createdDate", label: "Created Date" },
  { key: "comment", label: "Comment" },
  { key: "ledgerDate", label: "Ledger Date" },
  { key: "vesselImo", label: "Vessel IMO" },
  { key: "effectiveDate", label: "Effective Date" },
  { key: "accountingPeriod", label: "Accounting Period" },
  { key: "documentNumber", label: "Document Number" },
  { key: "accountingNumber", label: "Accounting Number" },
  { key: "transactionDate", label: "Transaction Date" },
  { key: "baseCurrency", label: "Base Currency" },
  { key: "baseAmount", label: "Base Amount" },
  { key: "foreignCurrency", label: "Foreign Currency" },
  { key: "foreignAmount", label: "Foreign Amount" },
  { key: "memo", label: "Memo" },
  { key: "transactionType", label: "Transaction Type" },
  { key: "url", label: "URL" },
  { key: "projectCode", label: "Project Code" },
  { key: "analysisCode", label: "Analysis Code" },
  { key: "vendorCode", label: "Vendor Code" },
  { key: "ownerAccountNumber", label: "Owner Account Number" },
  { key: "aeReferencePO", label: "AE Reference PO" },
  { key: "pkSeqNo", label: "Pk Seq No" },
  { key: "requestId", label: "Request Id" },

  // -------- EXT fields --------
  { key: "extStatus", label: "Ext Status" },
  { key: "extSetOfBooksName", label: "Ext Set Of Books Name" },
  { key: "extAccountingDate", label: "Ext Accounting Date" },
  { key: "extCurrencyCode", label: "Ext Currency Code" },
  { key: "extActualFlag", label: "Ext Actual Flag" },
  { key: "extUserJeSourceName", label: "Ext User Je Source Name" },
  { key: "extUserJeCategoryName", label: "Ext User Je Category Name" },
  { key: "extSegment1", label: "Ext Segment1" },
  { key: "extSegment2", label: "Ext Segment2" },
  { key: "extSegment3", label: "Ext Segment3" },
  { key: "extSegment4", label: "Ext Segment4" },
  { key: "extSegment5", label: "Ext Segment5" },
  { key: "extSegment6", label: "Ext Segment6" },
  { key: "extSegment7", label: "Ext Segment7" },
  { key: "extEnteredDr", label: "Ext Entered Dr" },
  { key: "extEnteredCr", label: "Ext Entered Cr" },
  { key: "extAccountedDr", label: "Ext Accounted Dr" },
  { key: "extAccountedCr", label: "Ext Accounted Cr" },
  { key: "extReference1", label: "Ext Reference1" },
  { key: "extReference2", label: "Ext Reference2" },
  { key: "extReference10", label: "Ext Reference10" },
  { key: "extAttribute7", label: "Ext Attribute7" },
  { key: "extAttribute8", label: "Ext Attribute8" },
  { key: "extAttribute9", label: "Ext Attribute9" },
  { key: "extContext", label: "Ext Context" },
  { key: "extBatchName", label: "Ext Batch Name" },
  { key: "extDateCreated", label: "Ext Date Created" },

  // -------- Error fields --------
  { key: "errorFlag", label: "Error Flag" },
  { key: "errorReason", label: "Error Reason" },
];

// ---------------- DEDUPLICATION (IMPORTANT) ----------------
// Ensures only ONE column per key (order preserved)
export const GL_TABLE_COLUMNS = Array.from(
  new Map(RAW_GL_COLUMNS.map(col => [col.key, col])).values()
);

// ---------------- COLUMN SETS ----------------
export const COLUMN_SETS = {
  ALL: GL_TABLE_COLUMNS,
};

// ---------------- DEFAULT ----------------
export const DEFAULT_COLUMNS = COLUMN_SETS.ALL;
