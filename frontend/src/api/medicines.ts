// src/api/medicine.ts
export interface MedicineDto {
  id: number;
  name: string;
  company: string;
  manufactureNo?: string;
  appearance?: string;
  purpose?: string;
  intakeAmount?: string;
  intakeMethod?: string;
  storage?: string;
  expiration?: string;
  caution?: string;
}
function extract(desc: string, label: string): string {
  const regex = new RegExp(`\\[${label}\\]\\s*([^\\[]+)`);
  const match = desc.match(regex);
  return match ? match[1].trim() : '-';
}
// 전체 목록 조회
export async function getMedicineList(): Promise<MedicineDto[]> {
  const res = await fetch('/api/medicines');
  if (!res.ok) throw new Error('API 호출 실패');

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    id: Number(item.sttemntNo),
    name: item.title?.trim() || '',
    company: item.provider?.trim() || '',
    manufactureNo: item.sttemntNo,
    purpose: item.category ?? '',
  }));
}

/// src/api/medicine.ts
export async function getMedicineDetail(
  id: number | string
): Promise<MedicineDto | null> {
  const res = await fetch(`/api/medicines/${id}`);

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('API 호출 실패');

  const item = await res.json();
  if (!item) return null;

  const desc: string = item.description ?? '';

  return {
    id: Number(item.sttemntNo),
    name: item.title?.trim() || '제품명 정보 없음',
    company: item.provider?.trim() || '-',
    manufactureNo: item.sttemntNo,

    appearance: extract(desc, '기준규격'),
    purpose: extract(desc, '기능성'),
    intakeMethod: extract(desc, '섭취방법'),
    storage: extract(desc, '보관방법'),
    expiration: extract(desc, '유통기한'),
    caution: extract(desc, '주의사항'),
  };

}