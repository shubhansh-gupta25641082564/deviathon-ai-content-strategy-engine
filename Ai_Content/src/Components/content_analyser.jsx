import React, { useState } from "react";

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");

  const handleContentChange = (e) => setContent(e.target.value);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #181B23, #000000, #000000)",
        minHeight: "100vh",
        width: "100vw",
        paddingTop: "56px",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 40px",
          marginBottom: "48px"
        }}
      >
        <div
          style={{
            background: "#191c27",
            borderRadius: "0 0 24px 24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            padding: "32px 40px",
            display: "flex",
            alignItems: "center",
            gap: "24px"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            <span style={{ fontSize: "36px", fontWeight: "800", color: "#191c27" }}>CA</span>
          </div>
          <h2
            style={{
              color: "#fff",
              margin: "0",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              fontSize: "2.25rem",
              lineHeight: "1"
            }}
          >
            Content Analyzer
          </h2>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 40px 96px",
        }}
      >
        <div
          style={{
            background: "#22252e",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            padding: "64px 40px 40px",
            width: "100%",
            maxWidth: "700px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px"
          }}
        >
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste content or link"
            style={{
              height: "200px",
              width: "100%",
              minHeight: "80px",
              resize: "vertical",
              borderRadius: "12px",
              border: "1.5px solid #3a3f4d",
              padding: "19px",
              fontSize: "1.13rem",
              background: "#181d23",
              color: "#fff",
              outline: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              transition: "border 0.23s"
            }}
          />
          <div style={{
            display: "flex",
            gap: "16px",
            width: "100%",
            alignItems: "stretch"
          }}>
            <button
              style={{
                flex: 1,
                background: "#fff",
                color: "#000",
                borderRadius: "12px",
                border: "none",
                height: "56px",
                fontWeight: "700",
                fontSize: "1.09rem",
                cursor: "pointer",
                letterSpacing: "0.2px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "background 0.2s",
                padding: 0
              }}
              onClick={() => alert("Analyze clicked!")}
            >
              ✦ Analyze
            </button>
            <button
              style={{
                flex: 1,
                background: "#22252e",
                color: "#fff",
                borderRadius: "12px",
                border: "2px solid #fff",
                height: "56px",
                fontWeight: "700",
                fontSize: "1.09rem",
                cursor: "pointer",
                letterSpacing: "0.2px",
                boxShadow: "0 2px 8px rgba(255,255,255,0.1)",
                transition: "background 0.2s, color 0.2s",
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