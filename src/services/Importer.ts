// SDK 54+: importa da versão legacy para manter compatibilidade
import * as FileSystem from "expo-file-system/legacy";
import { DoctorFormData } from "../types";

const COL_NAME = ["nome", "name", "medico", "doutor"];
const COL_SPECIALTY = ["especialidade", "specialty", "esp", "especializacao"];
const COL_ADDRESS = ["endereco", "address", "end", "logradouro"];
const COL_HOURS = ["horario", "hours", "atendimento", "hora"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findCol(headers: string[], candidates: string[]): string | null {
  for (const h of headers) {
    if (candidates.includes(normalize(h))) return h;
  }
  return null;
}

function parseCsv(text: string): string[][] {
  const firstLine = text.split("\n")[0] ?? "";
  const sep = firstLine.includes(";") ? ";" : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  while (i < src.length) {
    const ch = src[i];

    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === sep) {
        row.push(field.trim());
        field = "";
        i++;
      } else if (ch === "\n") {
        row.push(field.trim());
        if (row.some((c) => c !== "")) rows.push(row);
        row = [];
        field = "";
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  row.push(field.trim());
  if (row.some((c) => c !== "")) rows.push(row);

  return rows;
}

export interface ImportRow {
  name: string;
  specialty: string;
  address: string;
  hours: string;
}

export interface ImportPreview {
  rows: ImportRow[];
  errors: string[];
  total: number;
}

export async function parseSpreadsheet(
  fileUri: string,
  fileName: string,
): Promise<ImportPreview> {
  const errors: string[] = [];
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (ext !== "csv") {
    return {
      rows: [],
      errors: [
        "Formato não suportado.",
        "Abra no Excel ou Google Sheets e salve como CSV antes de importar.",
      ],
      total: 0,
    };
  }

  // Copia para o cache do app — garante acesso de leitura
  let localUri = fileUri;
  try {
    const dest = `${FileSystem.cacheDirectory}import_${Date.now()}.csv`;
    await FileSystem.copyAsync({ from: fileUri, to: dest });
    localUri = dest;
  } catch {
    // Se falhar a cópia, tenta ler direto
  }

  let text = "";
  try {
    text = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (e: any) {
    return {
      rows: [],
      errors: [`Erro ao ler o arquivo: ${e.message}`],
      total: 0,
    };
  }

  if (!text || text.trim().length === 0) {
    return { rows: [], errors: ["Arquivo vazio."], total: 0 };
  }

  // Remove BOM UTF-8
  const cleaned = text.replace(/^\uFEFF/, "");
  const matrix = parseCsv(cleaned);

  if (matrix.length < 2) {
    return {
      rows: [],
      errors: [
        "O arquivo precisa ter cabeçalho na linha 1 e pelo menos uma linha de dados.",
      ],
      total: 0,
    };
  }

  const headers = matrix[0];
  const colName = findCol(headers, COL_NAME);
  const colSpecialty = findCol(headers, COL_SPECIALTY);
  const colAddress = findCol(headers, COL_ADDRESS);
  const colHours = findCol(headers, COL_HOURS);

  if (!colName) {
    errors.push(
      `Coluna "Nome" não encontrada. Detectadas: ${headers.join(", ")}`,
    );
  }
  if (!colAddress) {
    errors.push(
      `Coluna "Endereço" não encontrada. Detectadas: ${headers.join(", ")}`,
    );
  }
  if (!colName || !colAddress) {
    return { rows: [], errors, total: matrix.length - 1 };
  }

  const idxName = headers.indexOf(colName);
  const idxSpecialty = colSpecialty ? headers.indexOf(colSpecialty) : -1;
  const idxAddress = headers.indexOf(colAddress);
  const idxHours = colHours ? headers.indexOf(colHours) : -1;

  const rows: ImportRow[] = [];
  const dataRows = matrix.slice(1);

  dataRows.forEach((cols, i) => {
    const name = (cols[idxName] ?? "").trim();
    const address = (cols[idxAddress] ?? "").trim();

    if (!name) {
      errors.push(`Linha ${i + 2}: nome em branco — ignorada.`);
      return;
    }
    if (!address) {
      errors.push(`Linha ${i + 2}: endereço em branco — ignorada.`);
      return;
    }

    rows.push({
      name,
      specialty:
        idxSpecialty >= 0
          ? (cols[idxSpecialty] ?? "").trim() || "Não informada"
          : "Não informada",
      address,
      hours: idxHours >= 0 ? (cols[idxHours] ?? "").trim() : "",
    });
  });

  return { rows, errors, total: dataRows.length };
}

export function rowToFormData(row: ImportRow): DoctorFormData {
  return {
    name: row.name,
    specialty: row.specialty || "Não informada",
    address: row.address,
    hours: row.hours,
  };
}
