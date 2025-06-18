import { useState, useCallback } from "react";

export interface AnalyticsReport {
  reportId: string;
  generatedDate: Date;
  reportType: string;
  details: any;
  lostOrDamagedAssets?: any;
  complianceFlag: boolean;
  createdAt: Date;
}

export interface UseAnalyticsReturn {
  reports: AnalyticsReport[];
  loading: boolean;
  error: string | null;
  fetchReports: (
    reportType?: string,
    dateFrom?: Date,
    dateTo?: Date
  ) => Promise<void>;
  fetchReport: (reportId: string) => Promise<AnalyticsReport | null>;
  generateReport: (
    reportType: string,
    dateFrom?: Date,
    dateTo?: Date
  ) => Promise<AnalyticsReport | null>;
  deleteReport: (reportId: string) => Promise<boolean>;
  getAssetUtilizationReport: (dateFrom?: Date, dateTo?: Date) => Promise<any>;
  getMaintenanceReport: (dateFrom?: Date, dateTo?: Date) => Promise<any>;
  getFinancialReport: (dateFrom?: Date, dateTo?: Date) => Promise<any>;
  getComplianceReport: () => Promise<any>;
  exportReport: (
    reportId: string,
    format: "pdf" | "csv" | "excel"
  ) => Promise<string>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(
    async (reportType?: string, dateFrom?: Date, dateTo?: Date) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAnalyticsReports($reportType: String, $dateFrom: DateTime, $dateTo: DateTime) {
              analyticsReports(reportType: $reportType, dateFrom: $dateFrom, dateTo: $dateTo) {
                reportId
                generatedDate
                reportType
                details
                lostOrDamagedAssets
                complianceFlag
                createdAt
              }
            }
          `,
            variables: { reportType, dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setReports(result.data.analyticsReports);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch reports"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchReport = useCallback(
    async (reportId: string): Promise<AnalyticsReport | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAnalyticsReport($reportId: ID!) {
              analyticsReport(reportId: $reportId) {
                reportId
                generatedDate
                reportType
                details
                lostOrDamagedAssets
                complianceFlag
                createdAt
              }
            }
          `,
            variables: { reportId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.analyticsReport;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch report");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateReport = useCallback(
    async (
      reportType: string,
      dateFrom?: Date,
      dateTo?: Date
    ): Promise<AnalyticsReport | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation GenerateAnalyticsReport($reportType: String!, $dateFrom: DateTime, $dateTo: DateTime) {
              generateAnalyticsReport(reportType: $reportType, dateFrom: $dateFrom, dateTo: $dateTo) {
                reportId
                generatedDate
                reportType
                details
                lostOrDamagedAssets
                complianceFlag
                createdAt
              }
            }
          `,
            variables: { reportType, dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newReport = result.data.generateAnalyticsReport;
        setReports((prev) => [...prev, newReport]);
        return newReport;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate report"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteReport = useCallback(
    async (reportId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteAnalyticsReport($reportId: ID!) {
              deleteAnalyticsReport(reportId: $reportId)
            }
          `,
            variables: { reportId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteAnalyticsReport) {
          setReports((prev) =>
            prev.filter((report) => report.reportId !== reportId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete report"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAssetUtilizationReport = useCallback(
    async (dateFrom?: Date, dateTo?: Date): Promise<any> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssetUtilizationReport($dateFrom: DateTime, $dateTo: DateTime) {
              assetUtilizationReport(dateFrom: $dateFrom, dateTo: $dateTo) {
                totalAssets
                assignedAssets
                availableAssets
                maintenanceAssets
                retiredAssets
                utilizationRate
                departmentBreakdown
                assetTypeBreakdown
              }
            }
          `,
            variables: { dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.assetUtilizationReport;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to get asset utilization report"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMaintenanceReport = useCallback(
    async (dateFrom?: Date, dateTo?: Date): Promise<any> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetMaintenanceReport($dateFrom: DateTime, $dateTo: DateTime) {
              maintenanceReport(dateFrom: $dateFrom, dateTo: $dateTo) {
                totalMaintenanceRecords
                resolvedIssues
                pendingIssues
                warrantyCovered
                averageResolutionTime
                maintenanceByAssetType
                maintenanceByDepartment
                costBreakdown
              }
            }
          `,
            variables: { dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.maintenanceReport;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to get maintenance report"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getFinancialReport = useCallback(
    async (dateFrom?: Date, dateTo?: Date): Promise<any> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetFinancialReport($dateFrom: DateTime, $dateTo: DateTime) {
              financialReport(dateFrom: $dateFrom, dateTo: $dateTo) {
                totalRevenue
                totalExpenses
                netProfit
                assetPurchases
                maintenanceCosts
                shippingCosts
                revenueByMonth
                expenseBreakdown
                profitMargin
              }
            }
          `,
            variables: { dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.financialReport;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get financial report"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getComplianceReport = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetComplianceReport {
              complianceReport {
                totalAssets
                compliantAssets
                nonCompliantAssets
                complianceRate
                complianceByDepartment
                complianceByAssetType
                auditTrail
                recommendations
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.complianceReport;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get compliance report"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(
    async (
      reportId: string,
      format: "pdf" | "csv" | "excel"
    ): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation ExportReport($reportId: ID!, $format: String!) {
              exportReport(reportId: $reportId, format: $format)
            }
          `,
            variables: { reportId, format },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.exportReport;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to export report"
        );
        return "";
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    reports,
    loading,
    error,
    fetchReports,
    fetchReport,
    generateReport,
    deleteReport,
    getAssetUtilizationReport,
    getMaintenanceReport,
    getFinancialReport,
    getComplianceReport,
    exportReport,
  };
};
