import * as FileSystem from "expo-file-system/legacy";
import { DoctorFormData, WeekDay, VisitPeriod } from "../types";

const COL_NAME = [
  "nome",
  "name",
  "medico",
  "doutor",
  "dr",
  "dra",
  "nomecompleto",
  "nomemedico",
];
const COL_SPECIALTY = [
  "especialidade",
  "specialty",
  "esp",
  "especializacao",
  "area",
];
const COL_ADDRESS = [
  "endereco",
  "address",
  "end",
  "logradouro",
  "local",
  "localizacao",
  "rua",
];
const COL_HOURS = [
  "horario",
  "hours",
  "atendimento",
  "hora",
  "horariodeatendimento",
  "horatendimento",
];
const COL_VISIT_DAYS = [
  "dias",
  "diasatendimento",
  "diasemana",
  "visitdays",
  "days",
  "diasdeatendimento",
  "diaatendimento",
];
const COL_CYCLE = [
  "ciclo",
  "ciclos",
  "visitasciclo",
  "cycle",
  "cycletarget",
  "trimestre",
  "visitastrimestre",
  "frequencia",
];
const COL_PERIOD = [
  "periodo",
  "turno",
  "period",
  "visitperiod",
  "periodododia",
];

function normalizeStr(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function findCol(headers: string[], candidates: string[]): string | null {
  for (const h of headers) {
    const n = normalizeStr(h);
    if (!n) continue;
    for (const c of candidates) {
      if (n === c || n.includes(c) || c.includes(n)) {
        return h;
      }
    }
  }
  return null;
}

function parseDays(raw: string): WeekDay[] {
  if (!raw) return [];
  const map: Record<string, WeekDay> = {
    seg: "monday",
    segunda: "monday",
    segundafeira: "monday",
    mon: "monday",
    monday: "monday",
    ter: "tuesday",
    terca: "tuesday",
    tercafeira: "tuesday",
    tue: "tuesday",
    tuesday: "tuesday",
    qua: "wednesday",
    quarta: "wednesday",
    quartafeira: "wednesday",
    wed: "wednesday",
    wednesday: "wednesday",
    qui: "thursday",
    quinta: "thursday",
    quintafeira: "thursday",
    thu: "thursday",
    thursday: "thursday",
    sex: "friday",
    sexta: "friday",
    sextafeira: "friday",
    fri: "friday",
    friday: "friday",
  };
  return raw
    .split(/[,;\/ ]+/)
    .map((d) => map[normalizeStr(d)])
    .filter((d): d is WeekDay => !!d);
}

function parsePeriod(raw: string): VisitPeriod {
  if (!raw) return "both";
  const n = normalizeStr(raw);
  if (n.includes("manha") || n.includes("morning") || n === "m") {
    return "morning";
  }
  if (n.includes("tarde") || n.includes("afternoon") || n === "t") {
    return "afternoon";
  }
  return "both";
}

function parseCycle(raw: string): number {
  if (!raw) return 1;
  const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) || n < 1 ? 1 : n;
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
  visit_days: WeekDay[];
  visit_period: VisitPeriod;
  cycle_target: number;
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
  const colVisitDays = findCol(headers, COL_VISIT_DAYS);
  const colCycle = findCol(headers, COL_CYCLE);
  const colPeriod = findCol(headers, COL_PERIOD);

  if (!colName || !colAddress) {
    const detected = headers
      .map((h) => `"${h}"(${normalizeStr(h)})`)
      .join(", ");
    if (!colName) {
      errors.push(`Coluna "Nome" não encontrada.`);
    }
    if (!colAddress) {
      errors.push(`Coluna "Endereço" não encontrada.`);
    }
    errors.push(`Cabeçalhos detectados: ${detected}`);
    return { rows: [], errors, total: matrix.length - 1 };
  }

  const idxName = headers.indexOf(colName);
  const idxSpecialty = colSpecialty ? headers.indexOf(colSpecialty) : -1;
  const idxAddress = headers.indexOf(colAddress);
  const idxHours = colHours ? headers.indexOf(colHours) : -1;
  const idxVisitDays = colVisitDays ? headers.indexOf(colVisitDays) : -1;
  const idxCycle = colCycle ? headers.indexOf(colCycle) : -1;
  const idxPeriod = colPeriod ? headers.indexOf(colPeriod) : -1;

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
      visit_days: idxVisitDays >= 0 ? parseDays(cols[idxVisitDays] ?? "") : [],
      visit_period:
        idxPeriod >= 0 ? parsePeriod(cols[idxPeriod] ?? "") : "both",
      cycle_target: idxCycle >= 0 ? parseCycle(cols[idxCycle] ?? "") : 1,
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

export function rowToExtra(row: ImportRow) {
  return {
    visit_days: row.visit_days,
    visit_period: row.visit_period,
    cycle_target: row.cycle_target,
  };
}
