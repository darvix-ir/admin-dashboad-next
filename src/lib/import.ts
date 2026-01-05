import Papa from "papaparse";
import { User } from "@/types";

export interface ImportResult {
  success: boolean;
  data: User[];
  errors: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export interface CSVRow {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Parse CSV file and return parsed data
 */
export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors.map((e) => e.message).join(", ")));
          return;
        }
        resolve(results.data as CSVRow[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Validate user data from CSV
 */
export function validateUserData(row: CSVRow, index: number): {
  valid: boolean;
  user?: User;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!row.name || row.name.trim() === "") {
    errors.push(`Row ${index + 1}: Name is required`);
  }

  if (!row.email || row.email.trim() === "") {
    errors.push(`Row ${index + 1}: Email is required`);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
    errors.push(`Row ${index + 1}: Invalid email format`);
  }

  // Optional fields with defaults
  const role = row.role?.trim() || "Viewer";
  const validRoles = ["Admin", "Editor", "Viewer"];
  if (!validRoles.includes(role)) {
    errors.push(`Row ${index + 1}: Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  const status = row.status?.trim()?.toLowerCase() || "active";
  const validStatuses = ["active", "inactive"];
  if (!validStatuses.includes(status)) {
    errors.push(`Row ${index + 1}: Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const user: User = {
    id: `imported-${Date.now()}-${index}`,
    name: row.name!.trim(),
    email: row.email!.trim(),
    role: role,
    status: status as "active" | "inactive",
    createdAt: new Date().toLocaleDateString(),
  };

  return { valid: true, user, errors: [] };
}

/**
 * Import users from CSV file
 */
export async function importUsersFromCSV(file: File): Promise<ImportResult> {
  try {
    const rows = await parseCSV(file);
    const result: ImportResult = {
      success: true,
      data: [],
      errors: [],
      totalRows: rows.length,
      validRows: 0,
      invalidRows: 0,
    };

    rows.forEach((row, index) => {
      const validation = validateUserData(row, index);
      if (validation.valid && validation.user) {
        result.data.push(validation.user);
        result.validRows++;
      } else {
        result.errors.push(...validation.errors);
        result.invalidRows++;
      }
    });

    if (result.validRows === 0) {
      result.success = false;
      result.errors.unshift("No valid users found in the file");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : "Unknown error"],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
    };
  }
}

/**
 * Merge imported users with existing users
 * Returns new array with merged users (imported users replace existing ones with same email)
 */
export function mergeUsers(importedUsers: User[], existingUsers: User[]): User[] {
  const userMap = new Map<string, User>();

  // Add existing users to map
  existingUsers.forEach((user) => {
    userMap.set(user.email.toLowerCase(), user);
  });

  // Overwrite with imported users (if email matches) or add new ones
  importedUsers.forEach((user) => {
    userMap.set(user.email.toLowerCase(), user);
  });

  return Array.from(userMap.values());
}

