"use client";

import { useState } from "react";
import type { Store } from "@/lib/types";
import {
  downloadBlob,
  EXPORT_HEADERS,
  exportFilename,
  storesToCsv,
  storesToRows,
} from "@/lib/export";

export default function ExportButtons({
  stores,
  resolvedAddress,
}: {
  stores: Store[];
  resolvedAddress: string;
}) {
  const [exporting, setExporting] = useState(false);

  function exportCsv() {
    const csv = `\uFEFF${storesToCsv(stores)}`;
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      exportFilename(resolvedAddress, "csv"),
    );
  }

  async function exportXlsx() {
    setExporting(true);
    try {
      const { Workbook } = await import("exceljs");
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Stores");
      worksheet.addRows([[...EXPORT_HEADERS], ...storesToRows(stores)]);
      worksheet.columns = EXPORT_HEADERS.map((header) => ({
        width: Math.min(Math.max(header.length + 2, 14), 42),
      }));
      worksheet.getRow(1).font = { bold: true };
      worksheet.views = [{ state: "frozen", ySplit: 1 }];
      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        exportFilename(resolvedAddress, "xlsx"),
      );
    } finally {
      setExporting(false);
    }
  }

  const buttonClass =
    "rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-semibold normal-case tracking-normal text-neutral-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-wait disabled:opacity-60";

  return (
    <div className="flex shrink-0 gap-1.5">
      <button type="button" onClick={exportCsv} className={buttonClass}>
        CSV
      </button>
      <button
        type="button"
        onClick={exportXlsx}
        disabled={exporting}
        className={buttonClass}
      >
        {exporting ? "Saving…" : "Excel"}
      </button>
    </div>
  );
}
