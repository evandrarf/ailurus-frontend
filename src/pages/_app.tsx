import BaseLayout from "@/components/layout/BaseLayout";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </QueryClientProvider>
  );
}
