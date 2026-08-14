import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Zimbabwe Rugby Union";
    const category = searchParams.get("category") || "OFFICIAL STATEMENT";
    const subtitle = searchParams.get("subtitle") || "National Squads · Domestic Leagues · Grassroots";
    const score = searchParams.get("score");
    const date = searchParams.get("date") || "Harare Sports Club";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0d131a",
            backgroundImage: "radial-gradient(circle at 25px 25px, #16222f 2%, transparent 0%), radial-gradient(circle at 75px 75px, #16222f 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px",
            color: "white",
            fontFamily: "sans-serif",
            border: "12px solid #006B3F",
          }}
        >
          {/* Header Strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#006B3F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0, 107, 63, 0.4)",
                }}
              >
                🏉
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "2px", color: "#ffffff" }}>
                  ZIMBABWE RUGBY UNION
                </span>
                <span style={{ fontSize: "12px", color: "#00a862", fontWeight: "bold", letterSpacing: "1px" }}>
                  OFFICIAL NATIONAL PORTAL
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(0, 107, 63, 0.25)",
                border: "1px solid rgba(0, 107, 63, 0.6)",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "900",
                color: "#F5B800",
                letterSpacing: "1.5px",
              }}
            >
              {category.toUpperCase()}
            </div>
          </div>

          {/* Main Headline & Score Body */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "auto 0" }}>
            {score && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  fontSize: "48px",
                  fontWeight: "900",
                  color: "#F5B800",
                  fontFamily: "monospace",
                }}
              >
                <span>{score}</span>
                <span style={{ fontSize: "16px", backgroundColor: "#006B3F", color: "white", padding: "4px 12px", borderRadius: "8px" }}>
                  FINAL SCORE
                </span>
              </div>
            )}

            <div
              style={{
                fontSize: title.length > 50 ? "42px" : "54px",
                fontWeight: "900",
                textTransform: "uppercase",
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                maxWidth: "1000px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "500",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer Ribbon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "rgba(255, 255, 255, 0.6)" }}>
              <span>📍 {date}</span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#00a862", letterSpacing: "1px" }}>
              zimrugby.co.zw
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OpenGraph image: ${e.message}`, { status: 500 });
  }
}
