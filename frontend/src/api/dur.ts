export interface DurItem {
  itemSeq: string;
  itemName: string;
  entpName: string;
}

export interface DurInteraction {
  withDrug: string;
  level: string; // 예: "금지"
  description: string; // PROHBT_CONTENT
}

const BASE = 'http://localhost:8080';

export async function searchDurItems(keyword: string, limit = 20): Promise<DurItem[]> {
  if (!keyword?.trim()) return [];

  const url = `${BASE}/api/dur/search?q=${encodeURIComponent(keyword)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DUR search failed: ${res.status}`);
  return res.json();
}

export async function checkDurTaboo(itemSeqs: string[]): Promise<DurInteraction[]> {
  if (!itemSeqs || itemSeqs.length < 2) return [];

  const res = await fetch(`${BASE}/api/dur/taboo/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemSeqs }),
  });

  if (!res.ok) throw new Error(`DUR taboo check failed: ${res.status}`);
  return res.json();
}
