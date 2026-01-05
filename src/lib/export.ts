import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel file
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1"
): void {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => String(row[key] || "").length)
    );
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
}

/**
 * Export HTML element to PDF
 */
export async function exportToPDF(
  elementId: string,
  filename: string,
  options?: {
    format?: "a4" | "letter";
    orientation?: "portrait" | "landscape";
    margin?: number;
  }
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const {
    format = "a4",
    orientation = "portrait",
    margin = 10,
  } = options || {};

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF(orientation, "mm", format);

  const imgWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = pdf.internal.pageSize.getHeight();
  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth - margin * 2, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position,
      imgWidth - margin * 2,
      imgHeight
    );
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(`${filename}_${Date.now()}.pdf`);
}

/**
 * Get current date/time string for filenames
 */
export function getTimestampString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/:/g, "-");
}

