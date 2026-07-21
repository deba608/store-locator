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
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.aoa_to_sheet([EXPORT_HEADERS, ...storesToRows(stores)]);
      worksheet["!cols"] = EXPORT_HEADERS.map((header) => ({
        wch: Math.min(Math.max(header.length + 2, 14), 42),
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Stores");
      XLSX.writeFile(workbook, exportFilename(resolvedAddress, "xlsx"), {
        compression: true,
      });
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
