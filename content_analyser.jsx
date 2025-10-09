import React, { useState } from "react";

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");

  const handleContentChange = (e) => setContent(e.target.value);

  // % heights here are relative to the container box ("parent" div)
  return (
    <div
      style={{
        background: "#f6f6f9",
        minHeight: "100vh",
        width: "100vw",
        paddingTop: "56px",
      }}
    >
      <h2
        style={{
          color: "#181818",
          marginBottom: "50px",
          fontWeight: "700",
          letterSpacing: "1px",
          fontSize: "2.1rem",
          textShadow: "0 2px 10px rgba(100,100,100,0.07)",
          lineHeight: "1",
          textAlign: "center"
        }}
      >
        Content Analyzer
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "calc(100vh - 240px)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "26px",
            boxShadow: "0 8px 40px 12px rgba(50,50,80,0.17)",
            padding: "111px 40px 2px",
            width: "100%",
            maxWidth: "650px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "84px"
          }}
        >
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste content or link"
            style={{
              height: "45%", // about 38% of parent box height
              width: "100%",
              minHeight: "80px",
              resize: "vertical",
              borderRadius: "18px",
              border: "1.5px solid #ececec",
              padding: "19px",
              fontSize: "1.13rem",
              background: "#fafafd",
              color: "#222",
              outline: "none",
              boxShadow: "0 2px 10px rgba(200,200,200,0.08)",
              marginBottom: "18px",
              transition: "border 0.23s"
            }}
          />
          <div style={{
            display: "flex",
            gap: "24px",
            width: "100%",
            height: "17%", // buttons row takes about 17% of parent box height
            alignItems: "stretch"
          }}>
            <button
              style={{
                flex: 1,
                background: "#181818",
                color: "#fff",
                borderRadius: "15px",
                border: "none",
                height: "100%", // fills parent
                fontWeight: "600",
                fontSize: "1.09rem",
                cursor: "pointer",
                letterSpacing: "0.4px",
                boxShadow: "0 2px 8px rgba(40,40,40,0.07)",
                transition: "background 0.17s",
                padding: 0
              }}
              onClick={() => alert("Analyze clicked!")}
            >
              Analyze
            </button>
            <button
              style={{
                flex: 1,
                background: "#fff",
                color: "#181818",
                borderRadius: "15px",
                border: "2px solid #181818",
                height: "100%", // fills parent
                fontWeight: "600",
                fontSize: "1.09rem",
                cursor: "pointer",
                letterSpacing: "0.4px",
                boxShadow: "0 2px 8px rgba(180,180,180,0.04)",
                transition: "background 0.17s, color 0.17s",
                padding: 0
              }}
              onClick={() => alert("Generate using AI clicked!")}
            >
              Generate using AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;
