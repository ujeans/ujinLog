import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

function Comment() {
  const containerRef = useRef(null);
  const utterancesRef = useRef(null);

  const { colorMode } = useColorMode();
  const utterancesTheme = colorMode === "dark" ? "github-dark" : "github-light";

  useEffect(() => {
    const createUtterancesEl = () => {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", "ujeans/ujinLog");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "comments");
      script.setAttribute("theme", "github-light");
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => {
        utterancesRef.current = document.querySelector(".utterances-frame");
      };

      containerRef.current.appendChild(script);
    };
    createUtterancesEl();
  }, []);

  useEffect(() => {
    if (!utterancesRef.current) return;
    const message = {
      type: "set-theme",
      theme: utterancesTheme,
    };

    utterancesRef.current.contentWindow.postMessage(
      message,
      "https://utteranc.es"
    );
  }, [utterancesTheme]);

  return <div ref={containerRef} />;
}
export default Comment;
