import React, { useState } from "react";

const PrintButton = ({
  printAreaId = "print-area",
  title = "Merry Kids International",
  metaLines = [],
}) => {
  const [open, setOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState(title);
  const [options, setOptions] = useState({
    schoolHeader: true,
    printedMeta: true,
    colors: true,
    autoClose: true,
  });
  const [error, setError] = useState("");

  const toggleOption = (key) => setOptions(prev => ({ ...prev, [key]: !prev[key] }));

  const buildPrintDocument = () => {
    const content = document.getElementById(printAreaId);
    if (!content) {
      setError("Printable section was not found.");
      return null;
    }

    setError("");
    const now = new Date();
    const safeTitle = reportTitle.trim() || title;
    const metaHtml = metaLines
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${safeTitle} - Merry Kids International</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            color: #222;
            padding: 30px;
            font-size: 13px;
            background: white;
          }
          .print-header {
            display: ${options.schoolHeader ? "flex" : "none"};
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #ff4fa3;
            padding-bottom: 16px;
            margin-bottom: 18px;
            gap: 24px;
          }
          .print-header h1 { font-size: 22px; color: #ff4fa3; margin-bottom: 4px; }
          .print-header p, .print-meta p { font-size: 12px; color: #777; line-height: 1.5; }
          .print-meta { text-align: right; min-width: 190px; display: ${options.printedMeta ? "block" : "none"}; }
          .report-meta {
            display: ${options.printedMeta ? "grid" : "none"};
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 8px 16px;
            margin-bottom: 18px;
            padding: 12px 14px;
            border: 1px solid #eee;
            border-radius: 8px;
            background: ${options.colors ? "#f8fbff" : "white"};
          }
          .report-meta p { color: #555; font-size: 12px; }
          .no-print { display: none !important; }
          .table-wrap { box-shadow: none !important; border-radius: 0 !important; overflow: visible !important; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th {
            background: ${options.colors ? "#ff4fa3" : "#f2f2f2"};
            color: ${options.colors ? "white" : "#111"};
            padding: 10px 12px;
            text-align: left;
            font-size: 12px;
          }
          td {
            padding: 9px 12px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
            color: #333;
            vertical-align: top;
          }
          tr:nth-child(even) td { background: ${options.colors ? "#fdf4f9" : "white"}; }
          .cat-tag, .status-pill, .id-badge, .grade-badge {
            display: inline-block;
            border: 1px solid #ddd;
            color: #222 !important;
            background: ${options.colors ? "transparent" : "white"} !important;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
          }
          .print-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .print-card { border: 1px solid #eee; border-radius: 8px; padding: 14px; }
          .print-card h3 { font-size: 14px; color: #ff4fa3; margin-bottom: 6px; }
          .print-card p { font-size: 12px; color: #555; line-height: 1.5; }
          .print-footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #eee;
            font-size: 11px;
            color: #888;
            text-align: center;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>${safeTitle}</h1>
            <p>Merry Kids International Montessori School</p>
            <p>Pituwala Road, Elpitiya, Sri Lanka</p>
          </div>
          <div class="print-meta">
            <p>Printed by: Staff</p>
            <p>${now.toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p>${now.toLocaleTimeString("en-LK")}</p>
          </div>
        </div>
        <div class="report-meta">${metaHtml}</div>
        ${content.innerHTML}
        <div class="print-footer">
          Copyright ${now.getFullYear()} Merry Kids International Montessori School - Confidential
        </div>
      </body>
      </html>
    `;
  };

  const openReportWindow = (shouldPrint) => {
    const html = buildPrintDocument();
    if (!html) return;

    const printWindow = window.open("", "_blank", "width=980,height=760");
    if (!printWindow) {
      setError("Popup was blocked. Please allow popups for this site.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    if (shouldPrint) {
      setTimeout(() => {
        printWindow.print();
        if (options.autoClose) printWindow.close();
      }, 500);
    }
  };

  return (
    <>
      <button className="print-btn" onClick={() => setOpen(true)}>
        Print / Save PDF
      </button>

      {open && (
        <div className="print-modal-overlay" onClick={() => setOpen(false)}>
          <div className="print-modal" onClick={e => e.stopPropagation()}>
            <button className="print-close" onClick={() => setOpen(false)}>x</button>
            <h2>Print Report</h2>
            <p className="print-help">Choose what to include before opening the print dialog.</p>

            {error && <div className="print-error">{error}</div>}

            <label className="print-field">
              <span>Report title</span>
              <input value={reportTitle} onChange={e => setReportTitle(e.target.value)} />
            </label>

            <div className="print-options">
              <label><input type="checkbox" checked={options.schoolHeader} onChange={() => toggleOption("schoolHeader")} /> School header</label>
              <label><input type="checkbox" checked={options.printedMeta} onChange={() => toggleOption("printedMeta")} /> Report details</label>
              <label><input type="checkbox" checked={options.colors} onChange={() => toggleOption("colors")} /> Use colors</label>
              <label><input type="checkbox" checked={options.autoClose} onChange={() => toggleOption("autoClose")} /> Close after print</label>
            </div>

            <div className="print-actions">
              <button className="preview-btn" onClick={() => openReportWindow(false)}>Preview</button>
              <button className="print-primary" onClick={() => openReportWindow(true)}>Print / Save PDF</button>
              <button className="print-cancel" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
        .print-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .print-modal {
          width: 100%;
          max-width: 460px;
          background: white;
          border-radius: 16px;
          padding: 28px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.28);
        }
        .print-close {
          position: absolute;
          top: 14px;
          right: 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 18px;
          cursor: pointer;
        }
        .print-modal h2 { color: #ff4fa3; font-size: 22px; margin-bottom: 6px; }
        .print-help { color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 18px; }
        .print-error { background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:10px 12px; border-radius:10px; font-size:13px; font-weight:600; margin-bottom:14px; }
        .print-field { display:flex; flex-direction:column; gap:7px; margin-bottom:16px; }
        .print-field span { font-size:13px; font-weight:700; color:#555; }
        .print-field input { padding:11px 13px; border-radius:10px; border:2px solid #eee; font-size:14px; outline:none; }
        .print-field input:focus { border-color:#ff4fa3; }
        .print-options { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:22px; }
        .print-options label { display:flex; gap:8px; align-items:center; color:#444; font-size:14px; font-weight:600; }
        .print-options input { accent-color:#ff4fa3; }
        .print-actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
        .preview-btn, .print-primary, .print-cancel { padding:11px 18px; border-radius:22px; font-size:14px; font-weight:700; cursor:pointer; }
        .preview-btn { border:2px solid #4facfe; background:white; color:#4facfe; }
        .print-primary { border:none; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; }
        .print-cancel { border:2px solid #ddd; background:white; color:#666; }
        @media(max-width:560px){ .print-options{grid-template-columns:1fr;} .print-actions{justify-content:stretch;} .preview-btn,.print-primary,.print-cancel{flex:1;} }
      `}</style>
    </>
  );
};

export default PrintButton;
