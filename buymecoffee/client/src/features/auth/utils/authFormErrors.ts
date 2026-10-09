export interface AuthFormErrorDetails {
  message: string;
  fieldErrors: Record<string, string>;
}

export const getAuthFormErrorDetails = (error: unknown): AuthFormErrorDetails => {
  const details: AuthFormErrorDetails = {
    message: "Something went wrong. Please try again.",
    fieldErrors: {},
  };

  if (!error || typeof error !== "object") {
    return details;
  }

  const errorRecord = error as Record<string, unknown>;
  if (error instanceof Error && error.message.trim()) {
    details.message = error.message;
  }

  const status = errorRecord.status;

  if (status === "FETCH_ERROR") {
    details.message = "Unable to connect. Check your internet connection and try again.";
  } else if (status === "TIMEOUT_ERROR") {
    details.message = "The request took too long. Please try again.";
  } else if (status === "PARSING_ERROR" || status === "CUSTOM_ERROR") {
    details.message = "We couldn't process that request. Please try again.";
  } else if (typeof status === "number") {
    if (status === 401) {
      details.message = "Your session has expired. Please sign in again.";
    } else if (status === 403) {
      details.message = "You don't have permission to do that.";
    } else if (status === 404) {
      details.message = "The requested page or record couldn't be found.";
    } else if (status === 429) {
      details.message = "Too many requests. Please wait a moment and try again.";
    } else if (status >= 500) {
      details.message = "The service is temporarily unavailable. Please try again.";
    }
  }

  const responseBody = errorRecord.data;

  if (responseBody && typeof responseBody === "object") {
    const body = responseBody as Record<string, unknown>;

    if (typeof body.message === "string" && body.message.trim()) {
      details.message = body.message;
    }

    if (Array.isArray(body.errors)) {
      for (const item of body.errors) {
        if (
          item &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).field === "string" &&
          typeof (item as Record<string, unknown>).message === "string"
        ) {
          const fieldError = item as { field: string; message: string };
          details.fieldErrors[fieldError.field] = fieldError.message;
        }
      }
    }
  }

  return details;
};