// src/api/medicine.ts

export interface Medicine {
  id: number;

  // 기본 정보
  productName: string;      // 제품명
  companyName: string;      // 업체명
  manufactureNo: string;    // 품목제조관리번호
  appearance: string;       // 성상

  // 섭취 정보
  purpose: string;          // 용도·용법
  intakeAmount: string;     // 섭취량
  intakeMethod: string;     // 섭취방법

  // 보관 / 유통
  storage: string;          // 보존방법
  expiration: string;       // 유통기한

  // 주의사항
  caution: string;          // 주의사항
}

// 🔥 가짜 비타민 DB (건강기능식품)
const MEDICINE_DATA: Medicine[] = [
  {
    id: 1,
    productName: '센트룸 멀티비타민 포 맨',
    companyName: '한국화이자제약㈜',
    manufactureNo: '20040020012345',
    appearance: '갈색의 장방형 필름코팅정',

    purpose: '성인 남성의 비타민 및 무기질 보충',
    intakeAmount: '1일 1회, 1회 1정',
    intakeMethod: '충분한 물과 함께 섭취',

    storage: '직사광선을 피하고 서늘한 곳에 보관',
    expiration: '제조일로부터 24개월',

    caution:
      '⚠️ 특정 질환이 있거나 의약품을 복용 중인 경우 전문가와 상담하십시오.\n' +
      '⚠️ 임산부 및 수유부는 섭취 전 전문가와 상담하십시오.',
  },
  {
    id: 2,
    productName: '고려은단 비타민C 1000',
    companyName: '고려은단㈜',
    manufactureNo: '20180030056789',
    appearance: '황색의 장방형 정제',

    purpose: '항산화 작용을 통한 건강 유지',
    intakeAmount: '1일 1회, 1회 1정',
    intakeMethod: '식후 물과 함께 섭취',

    storage: '습기와 직사광선을 피하여 보관',
    expiration: '제조일로부터 36개월',

    caution:
      '⚠️ 과다 섭취 시 설사를 유발할 수 있습니다.\n' +
      '⚠️ 이상사례 발생 시 섭취를 중단하십시오.',
  },
  {
    id: 3,
    productName: '종근당 락토핏 생유산균 골드',
    companyName: '종근당건강㈜',
    manufactureNo: '20190040099887',
    appearance: '연한 황색의 분말',

    purpose: '유산균 증식 및 유해균 억제',
    intakeAmount: '1일 1회, 1포',
    intakeMethod: '물 없이 섭취 가능',

    storage: '고온다습한 곳을 피하여 보관',
    expiration: '제조일로부터 24개월',

    caution:
      '⚠️ 알레르기 체질은 원료를 확인 후 섭취하십시오.',
  },
  {
  id: 4,
  productName: '얼라이브 원스데일리 포 우먼',
  companyName: '네이처스웨이',
  manufactureNo: '20200050011223',
  appearance: '연두색 타원형 정제',

  purpose: '여성 건강을 위한 비타민 및 미네랄 보충',
  intakeAmount: '1일 1회, 1정',
  intakeMethod: '식사 후 물과 함께 섭취',

  storage: '서늘하고 건조한 곳에 보관',
  expiration: '제조일로부터 36개월',

  caution:
    '⚠️ 철분이 포함되어 있으므로 과다 섭취에 주의하십시오.\n' +
    '⚠️ 어린이의 손이 닿지 않는 곳에 보관하십시오.',
},
{
  id: 5,
  productName: '닥터린 루테인 지아잔틴',
  companyName: '닥터린',
  manufactureNo: '20210060033445',
  appearance: '적갈색 연질캡슐',

  purpose: '눈 건강 개선에 도움을 줄 수 있음',
  intakeAmount: '1일 1회, 1캡슐',
  intakeMethod: '식후 물과 함께 섭취',

  storage: '직사광선을 피해 실온 보관',
  expiration: '제조일로부터 24개월',

  caution:
    '⚠️ 이상 반응 발생 시 섭취를 중단하십시오.\n' +
    '⚠️ 임산부는 섭취 전 전문가와 상담하십시오.',
},
{
  id: 6,
  productName: '뉴트리디데이 오메가3 1000',
  companyName: '뉴트리디데이',
  manufactureNo: '20220070055667',
  appearance: '투명한 황색 연질캡슐',

  purpose: '혈중 중성지질 개선에 도움을 줄 수 있음',
  intakeAmount: '1일 1회, 1캡슐',
  intakeMethod: '식사 후 충분한 물과 함께 섭취',

  storage: '고온 및 직사광선을 피하여 보관',
  expiration: '제조일로부터 24개월',

  caution:
    '⚠️ 항응고제 복용 시 전문가와 상담하십시오.\n' +
    '⚠️ 캡슐이 서로 달라붙을 수 있으나 품질에는 이상이 없습니다.',

},
{
    id: 7,
    productName: '닥터린 루테인 지아잔틴',
    companyName: '닥터린',
    manufactureNo: '20210060033445',
    appearance: '적갈색 연질캡슐',
    purpose: '눈 건강 개선에 도움을 줄 수 있음',
    intakeAmount: '1일 1회, 1캡슐',
    intakeMethod: '식후 물과 함께 섭취',
    storage: '직사광선을 피해 실온 보관',
    expiration: '제조일로부터 24개월',
    caution:
      '⚠️ 이상 반응 발생 시 섭취를 중단하십시오.\n' +
      '⚠️ 임산부는 섭취 전 전문가와 상담하십시오.',
  },
  {
    id: 8,
    productName: '헬씨프로바이오틱스',
    companyName: '헬씨코리아',
    manufactureNo: '20220070011234',
    appearance: '하얀색 캡슐',
    purpose: '장 건강 개선에 도움을 줄 수 있음',
    intakeAmount: '1일 2회, 1캡슐',
    intakeMethod: '식전 또는 식후 섭취 가능',
    storage: '냉장 보관 권장',
    expiration: '제조일로부터 18개월',
    caution:
      '⚠️ 알레르기 체질은 섭취 전 확인 요망\n' +
      '⚠️ 이상 증상 발생 시 섭취 중단',
  },
  {
    id: 9,
    productName: '오메가3 피쉬오일',
    companyName: '네이처랩',
    manufactureNo: '20210090055678',
    appearance: '노란색 연질캡슐',
    purpose: '혈행 개선 및 심혈관 건강에 도움',
    intakeAmount: '1일 1회, 2캡슐',
    intakeMethod: '식후 섭취',
    storage: '직사광선을 피해 서늘한 곳 보관',
    expiration: '제조일로부터 36개월',
    caution:
      '⚠️ 혈액 응고 질환자 섭취 전 전문가 상담\n' +
      '⚠️ 이상 증상 발생 시 섭취 중단',
  },
  {
    id: 10,
    productName: '비타민C 1000mg',
    companyName: '헬스비타',
    manufactureNo: '20210120077890',
    appearance: '하얀색 정제',
    purpose: '면역력 증진에 도움을 줄 수 있음',
    intakeAmount: '1일 1회, 1정',
    intakeMethod: '식후 물과 함께 섭취',
    storage: '습기 차단하여 실온 보관',
    expiration: '제조일로부터 24개월',
    caution:
      '⚠️ 위장 장애 발생 시 섭취 중단\n' +
      '⚠️ 과량 섭취 주의',
  },
  {
    id: 11,
    productName: '칼슘 마그네슘 아연',
    companyName: '헬씨라이프',
    manufactureNo: '20210315033422',
    appearance: '연질 캡슐',
    purpose: '뼈 건강 유지에 도움을 줄 수 있음',
    intakeAmount: '1일 1회, 2캡슐',
    intakeMethod: '식후 섭취',
    storage: '직사광선을 피해 서늘한 곳 보관',
    expiration: '제조일로부터 30개월',
    caution:
      '⚠️ 신장 질환자는 섭취 전 전문가 상담\n' +
      '⚠️ 이상 반응 발생 시 섭취 중단',
  },
  {
    id: 12,
    productName: '프로폴리스 스프레이',
    companyName: '네이처스',
    manufactureNo: '20210401011233',
    appearance: '액상 스프레이',
    purpose: '구강 건강 유지에 도움',
    intakeAmount: '1일 3회, 1~2회 분사',
    intakeMethod: '입 안에 직접 분사',
    storage: '직사광선을 피해 서늘한 곳 보관',
    expiration: '제조일로부터 24개월',
    caution:
      '⚠️ 알레르기 체질 주의\n' +
      '⚠️ 이상 증상 발생 시 섭취 중단',
  },
  {
    id: 13,
    productName: '멀티비타민 미네랄',
    companyName: '비타헬스',
    manufactureNo: '20210520044567',
    appearance: '다색 정제',
    purpose: '영양 균형 및 활력 증진에 도움',
    intakeAmount: '1일 1회, 1정',
    intakeMethod: '식후 물과 함께 섭취',
    storage: '습기 차단하여 실온 보관',
    expiration: '제조일로부터 36개월',
    caution:
      '⚠️ 과량 섭취 시 부작용 가능\n' +
      '⚠️ 이상 증상 발생 시 섭취 중단',
  }
];


// ✅ 목록 조회 (검색)
export const getMedicineList = async (keyword: string) => {
  await new Promise((r) => setTimeout(r, 500));

  if (!keyword) return MEDICINE_DATA;

  return MEDICINE_DATA.filter((item) =>
    item.productName.includes(keyword)
  );
};

// ✅ 상세 조회
export const getMedicineDetail = async (id: number) => {
  await new Promise((r) => setTimeout(r, 300));

  const medicine = MEDICINE_DATA.find((item) => item.id === id);
  if (!medicine) throw new Error('건강기능식품 정보 없음');

  return medicine;
};