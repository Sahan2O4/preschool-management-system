import React from "react";

/**
 * PrintButton — drop into any admin page.
 * Pass `printAreaId` matching the id of the div you want to print.
 * Pass `title` for the printed page header.
 */
const PrintButton = ({ printAreaId = "print-area", title = "Merry Kids International" }) => {
  const handlePrint = () => {
    // Build a clean print window with just the target content
    const content = document.getElementById(printAreaId);
    if (!content) { window.print(); return; }

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} — Merry Kids International</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: "Segoe UI", sans-serif;
            color: #222;
            padding: 30px;
            font-size: 13px;
          }

          /* ── Header ── */
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #ff4fa3;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .print-header h1 {
            font-size: 22px;
            color: #ff4fa3;
            margin-bottom: 4px;
          }
          .print-header p { font-size: 12px; color: #888; }
          .print-meta { text-align: right; font-size: 12px; color: #888; }

          /* ── Tables ── */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #ff4fa3;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-size: 12px;
          }
          td {
            padding: 9px 12px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
            color: #333;
          }
          tr:nth-child(even) td { background: #fdf4f9; }

          /* ── Badges / pills ── */
          .id-badge {
            background: #e0f0ff;
            color: #4facfe;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 11px;
          }
          .status-active   { color: #16a34a; font-weight: 700; }
          .status-inactive { color: #dc2626; font-weight: 700; }
          .status-late     { color: #b45309; font-weight: 700; }

          /* ── Cards (progress, sessions) ── */
          .print-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .print-card {
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 14px;
          }
          .print-card h3 { font-size: 14px; color: #ff4fa3; margin-bottom: 6px; }
          .print-card p  { font-size: 12px; color: #555; line-height: 1.5; }
          .grade-badge {
            display: inline-block;
            background: #ff4fa3;
            color: white;
            padding: 2px 10px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
          }

          /* ── Financial ── */
          .fin-summary {
            display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
          }
          .fin-box {
            border: 1px solid #eee; border-radius: 10px;
            padding: 14px 20px; flex: 1; min-width: 140px;
          }
          .fin-box label { font-size: 11px; color: #888; display: block; margin-bottom: 4px; }
          .fin-box span  { font-size: 18px; font-weight: 800; }
          .income  { color: #16a34a; }
          .expense { color: #dc2626; }
          .balance { color: #4facfe; }

          /* ── Footer ── */
          .print-footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #eee;
            font-size: 11px;
            color: #aaa;
            text-align: center;
          }

          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>${title}</h1>
            <p>Merry Kids International Montessori School</p>
            <p>Pituwala Road, Elpitiya, Sri Lanka</p>
          </div>
          <div class="print-meta">
            <p>Printed by: Admin</p>
            <p>${new Date().toLocaleDateString("en-LK", {
              weekday: "long", year: "numeric",
              month: "long", day: "numeric"
            })}</p>
            <p>${new Date().toLocaleTimeString("en-LK")}</p>
          </div>
        </div>
        ${content.innerHTML}
        <div class="print-footer">
          © ${new Date().getFullYear()} Merry Kids International Montessori School — Confidential
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <>
      <button className="print-btn" onClick={handlePrint}>
        🖨️ Print / Save PDF
      </button>
      <style>{`
        .print-btn {
          padding: 11px 22px;
          border-radius: 25px;
          border: 2px solid #ff4fa3;
          background: white;
          color: #ff4fa3;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .print-btn:hover {
          background: linear-gradient(90deg, #4facfe, #ff7eb3);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default PrintButton;
