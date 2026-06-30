import {
  SCHEMA_VERSION,
  buildRagChunkText,
  createPrRecord,
  validatePrRecord,
} from "./schema.js";

const STORAGE_KEY = "noevia_pr_ax_records_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.records) ? parsed.records : [];
  } catch {
    return [];
  }
}

function writeAll(records) {
  const payload = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    storage: "localStorage",
    note: "PoC demo — replace with Supabase/API in Phase 3",
    records: records.map(refreshRagMeta),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

function refreshRagMeta(record) {
  return {
    ...record,
    updatedAt: record.updatedAt || new Date().toISOString(),
    ragMeta: {
      ...record.ragMeta,
      chunkText: buildRagChunkText(record),
      embeddingReady: record.ragMeta?.embeddingReady ?? false,
    },
  };
}

export function listRecords(filters = {}) {
  let records = readAll().sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  if (filters.status) {
    records = records.filter((r) => r.status === filters.status);
  }
  if (filters.brand) {
    records = records.filter((r) => r.product?.brand === filters.brand);
  }
  return records;
}

export function getRecord(id) {
  return readAll().find((r) => r.id === id) || null;
}

export function saveRecord(record) {
  const normalized = refreshRagMeta(createPrRecord(record));
  if (!validatePrRecord(normalized)) {
    throw new Error("Invalid PR record");
  }
  const records = readAll();
  const idx = records.findIndex((r) => r.id === normalized.id);
  if (idx >= 0) {
    records[idx] = { ...records[idx], ...normalized, updatedAt: new Date().toISOString() };
  } else {
    records.push(normalized);
  }
  writeAll(records);
  return normalized;
}

export function deleteRecord(id) {
  writeAll(readAll().filter((r) => r.id !== id));
}

export function exportRecordsJson() {
  const payload = writeAll(readAll());
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noevia-pr-records-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importRecordsJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = Array.isArray(data.records) ? data.records : [];
        const existing = readAll();
        const merged = [...existing];
        incoming.forEach((rec) => {
          const idx = merged.findIndex((r) => r.id === rec.id);
          if (idx >= 0) merged[idx] = refreshRagMeta(rec);
          else merged.push(refreshRagMeta(rec));
        });
        writeAll(merged);
        resolve(merged.length);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function seedIfEmpty(seedRecords) {
  if (readAll().length > 0) return false;
  seedRecords.forEach((r) => saveRecord(r));
  return true;
}

export function getStorageStats() {
  const records = readAll();
  return {
    total: records.length,
    byStatus: records.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {}),
    ragReady: records.filter((r) => r.ragMeta?.embeddingReady).length,
  };
}
