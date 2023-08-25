import BaseLayout from "@/components/layout/BaseLayout";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body data-theme="dracula">
        <BaseLayout>
          <Main />
        </BaseLayout>
        <NextScript />
      </body>
    </Html>
  );
}
