/**
 * Example Component: Error Handling Usage
 *
 * This file demonstrates how to use the enhanced error handling utilities
 * in your React components with RTK Query.
 */

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  useErrorHandler,
  useMutationErrorHandler,
  useQueryErrorHandler,
} from "@/hooks/useErrorHandler";
import {
  useListPapersQuery,
  useUploadPaperMutation,
} from "@/redux/api/paperApi";

export const ExampleErrorHandlingUsage = () => {
  // Example 1: Query with error handling
  const {
    data: papers,
    isLoading: papersLoading,
    isError: papersError,
    error: papersErrorData,
    refetch: refetchPapers,
  } = useListPapersQuery({ page: 1, limit: 10 });

  // Use query error handler
  const { errorMessage, errorDetails, retry, isRetryable } =
    useQueryErrorHandler(
      {
        error: papersErrorData,
        isLoading: papersLoading,
        isError: papersError,
        refetch: refetchPapers,
      },
      {
        showToast: true, // Show error toast
        logError: true, // Log error details in development
        onError: (error) => {
          // Custom error handling
          console.log("Custom papers query error handler:", error);
        },
      }
    );

  // Example 2: Mutation with error handling
  const [
    uploadPaper,
    {
      isLoading: uploadLoading,
      isError: uploadError,
      error: uploadErrorData,
      reset: resetUpload,
    },
  ] = useUploadPaperMutation();

  // Use mutation error handler with retry capability
  const {
    errorMessage: uploadErrorMessage,
    retry: retryUpload,
    isRetryable: canRetryUpload,
  } = useMutationErrorHandler(
    {
      error: uploadErrorData,
      isLoading: uploadLoading,
      isError: uploadError,
      reset: resetUpload,
    },
    async () => {
      // Retry function - re-execute the mutation with the same parameters
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      const file = new File([""], "example.pdf", { type: "application/pdf" });

      return await uploadPaper({
        file,
        title: "Example Paper",
        authors: ["Example Author"],
        year: 2024,
        source: "Example Source",
      }).unwrap();
    },
    {
      showToast: true,
      onError: (error) => {
        console.log("Upload failed:", error);
      },
    }
  );

  // Example 3: Generic error handling for any error
  const someGenericError: undefined = undefined; // This could be any error from any source

  useErrorHandler(someGenericError, {
    showToast: false, // Don't show toast for this one
    logError: true,
    onError: (error) => {
      // Handle the error in a custom way
      console.log("Generic error occurred:", error);
    },
  });

  const handleUpload = async () => {
    try {
      const file = new File([""], "example.pdf", { type: "application/pdf" });

      await uploadPaper({
        file,
        title: "Example Paper",
        authors: ["Example Author"],
        year: 2024,
        source: "Example Source",
      }).unwrap();

      // Show success toast
      showSuccessToast(
        "Paper uploaded successfully!",
        "Your paper is now being processed."
      );

      // Refetch papers to update the list
      refetchPapers();
    } catch (error) {
      // Error is automatically handled by useMutationErrorHandler
      console.log("Upload error will be handled automatically");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Error Handling Examples</h2>

      {/* Papers List with Error Handling */}
      <div className="border rounded p-4">
        <h3 className="text-lg font-medium mb-2">Papers List</h3>
        {papersLoading && <p>Loading papers...</p>}
        {papersError && (
          <div className="text-red-600 space-y-2">
            <p>Error: {errorMessage}</p>
            {isRetryable && (
              <Button onClick={retry} variant="outline" size="sm">
                Retry Loading Papers
              </Button>
            )}
          </div>
        )}
        {papers && <p>Loaded {papers.meta.total} papers successfully</p>}
      </div>

      {/* Upload with Error Handling */}
      <div className="border rounded p-4">
        <h3 className="text-lg font-medium mb-2">Upload Paper</h3>
        <Button
          onClick={handleUpload}
          disabled={uploadLoading}
          className="mb-2"
        >
          {uploadLoading ? "Uploading..." : "Upload Example Paper"}
        </Button>

        {uploadError && (
          <div className="text-red-600 space-y-2">
            <p>Upload Error: {uploadErrorMessage}</p>
            {canRetryUpload && retryUpload && (
              <Button onClick={retryUpload} variant="outline" size="sm">
                Retry Upload
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error Details (for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(
              {
                papersError: errorDetails,
                uploadError: uploadErrorData ? "Present" : "None",
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Usage Summary:
 *
 * 1. useErrorHandler() - Generic error handling for any error
 *    - Automatically shows toast notifications
 *    - Logs errors in development
 *    - Allows custom error handling
 *
 * 2. useQueryErrorHandler() - Specialized for RTK Query queries
 *    - Provides retry capability via refetch
 *    - Returns error state and retry function
 *
 * 3. useMutationErrorHandler() - Specialized for RTK Query mutations
 *    - Allows defining a retry function
 *    - Automatically resets mutation state before retry
 *
 * 4. Sonner Toast Integration:
 *    - Uses the existing ToastProvider with Sonner
 *    - Consistent error messaging across the app
 *    - Respects theme and positioning settings
 *
 * 5. Error Classification:
 *    - Network errors (will retry automatically)
 *    - Client errors (won't retry, user needs to fix)
 *    - Server errors (will retry automatically)
 */
