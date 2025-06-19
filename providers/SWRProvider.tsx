"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global configuration cho SWR
        refreshInterval: 0, // Không tự động refresh
        revalidateOnFocus: false, // Không revalidate khi focus window
        revalidateOnReconnect: true, // Revalidate khi reconnect internet
        revalidateIfStale: true, // Revalidate nếu data cũ
        dedupingInterval: 2000, // Dedupe requests trong 2 giây

        // Error handling
        onError: () => {
          // Có thể thêm notification ở đây
        },

        // Loading behavior
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,

        // Fallback data
        fallback: {},
      }}
    >
      {children}
    </SWRConfig>
  );
}
