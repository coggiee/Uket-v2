"use client";

import {
  ErrorBoundary,
  ErrorBoundaryFallbackProps,
  QueryErrorResetBoundary,
} from "@uket/api";
import { FunctionComponent } from "react";
import CustomAxiosError from "../../../packages/api/src/error/default";
import DefaultErrorFallback from "./error-fallback/default-error-fallback";

export default function RetryApiErrorBoundary({
  children,
  fallback,
}: Readonly<{
  children: React.ReactNode;
  fallback?: React.ReactNode | FunctionComponent<ErrorBoundaryFallbackProps>;
}>) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          shouldCatch={[
            CustomAxiosError,
            error => {
              return (
                error instanceof CustomAxiosError &&
                error.response?.status !== 500
              );
            },
          ]}
          onReset={reset}
          fallback={fallback || DefaultErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
