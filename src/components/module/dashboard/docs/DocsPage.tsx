import { getUser } from "@/components/fetcher/user";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface DocsInterface {
  label: string;
  content: string;
}

function getDocs() {
  const { data: apiDoc } = useQuery({
    queryKey: ["apiDoc"],
    queryFn: () => getUser<string>("docs/api"),
  });
  const { data: patchDoc } = useQuery({
    queryKey: ["patchDoc"],
    queryFn: () => getUser<string>("docs/patching"),
  });
  const { data: scoreDoc } = useQuery({
    queryKey: ["scoreDoc"],
    queryFn: () => getUser<string>("docs/scoring"),
  });
  return { apiDoc, patchDoc, scoreDoc };
}

export default function DocsPage() {
  const { apiDoc, patchDoc, scoreDoc } = getDocs();

  const docsMenu: { [index: string]: DocsInterface } = {
    api: { label: "API", content: apiDoc?.data ?? "" },
    patching: { label: "Patching", content: patchDoc?.data ?? "" },
    scoring: { label: "Scoring", content: scoreDoc?.data ?? "" },
  };

  const [menuActive, setMenuActive] = useState("api");
  const [docsContent, setDocsContent] = useState(docsMenu["api"].content);

  useEffect(() => {
    // Replace $$ expressions with KaTeX rendering
    const htmlWithMath = docsMenu[menuActive].content;
    const renderedHtml = htmlWithMath.replace(
      /\$\$(.*?)\$\$/g,
      (_, mathExpression) => {
        return katex.renderToString(mathExpression);
      }
    );

    // Replace $ expressions with KaTeX rendering
    const finalRenderedHtml = renderedHtml.replace(
      /\$(.*?)\$/g,
      (_, mathExpression) => {
        return katex.renderToString(mathExpression, { displayMode: false });
      }
    );

    setDocsContent(finalRenderedHtml);
  }, [menuActive, docsMenu]);

  return (
    <div className="gap-4 px-4">
      <div className="tabs w-full justify-center">
        {Object.keys(docsMenu).map((key) => (
          <a
            key={`tab-docs-${key}`}
            onClick={() => setMenuActive(key)}
            className={
              "tab tab-lg tab-bordered" +
              (menuActive == key ? " tab-active" : "")
            }
          >
            {docsMenu[key].label}
          </a>
        ))}
      </div>
      <div className="p-4 rounded-md m-4">
        <article
          className="prose dark:prose-invert max-w-none"
          style={{color: "white"}}
          dangerouslySetInnerHTML={{ __html: docsContent ?? "" }}
        ></article>
      </div>
    </div>
  );
}
