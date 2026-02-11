export interface DrugInteraction {
  a: string;
  b: string;
  level: '주의' | '위험' | '금지';
  description: string;
}

export const drugInteractions: DrugInteraction[] = [

  // ===== NSAIDs 중복 =====
  {
    a: 'D001', b: 'D002',
    level: '위험',
    description: '아스피린과 이부프로펜 병용 시 위장 출혈 위험이 증가합니다.',
  },
  {
    a: 'D002', b: 'D004',
    level: '위험',
    description: '이부프로펜과 덱시부프로펜은 동일 계열로 중복 복용 시 위험합니다.',
  },
  {
    a: 'D006', b: 'D007',
    level: '위험',
    description: '부루펜과 이지엔6는 성분 중복으로 위장 및 신장 부담이 큽니다.',
  },
  {
    a: 'D007', b: 'D008',
    level: '위험',
    description: 'NSAIDs 중복 복용은 위궤양 및 출혈 위험이 있습니다.',
  },

  // ===== 타이레놀 + 복합 감기약 =====
  {
    a: 'D003', b: 'D101',
    level: '위험',
    description: '판콜에이에 아세트아미노펜이 포함되어 간 손상 위험이 있습니다.',
  },
  {
    a: 'D003', b: 'D102',
    level: '위험',
    description: '판콜에스와 타이레놀 성분 중복으로 간 독성 위험이 있습니다.',
  },
  {
    a: 'D003', b: 'D106',
    level: '위험',
    description: '테라플루는 아세트아미노펜을 포함하고 있어 중복 복용 시 위험합니다.',
  },

  // ===== 감기약 + 감기약 =====
  {
    a: 'D101', b: 'D103',
    level: '위험',
    description: '감기약을 동시에 복용하면 항히스타민 및 해열 성분이 중복됩니다.',
  },
  {
    a: 'D102', b: 'D104',
    level: '위험',
    description: '복합 감기약 병용 시 졸림·심계항진 위험이 증가합니다.',
  },

  // ===== 위장약 =====
  {
    a: 'D206', b: 'D207',
    level: '주의',
    description: '겔포스와 알마겔은 동일 계열 제산제로 중복 효과가 있습니다.',
  },
  {
    a: 'D208', b: 'D207',
    level: '주의',
    description: '마그밀과 알마겔 병용 시 설사 및 전해질 이상이 발생할 수 있습니다.',
  },

  // ===== 비타민 중복 =====
  {
    a: 'D301', b: 'D302',
    level: '주의',
    description: '고함량 비타민 B군 중복 섭취로 신경계 부작용 가능성이 있습니다.',
  },
  {
    a: 'D303', b: 'D305',
    level: '주의',
    description: '종합비타민 중복 섭취로 지용성 비타민 과잉 위험이 있습니다.',
  },

  // ===== 알레르기약 =====
  {
    a: 'D401', b: 'D403',
    level: '주의',
    description: '항히스타민제 중복 복용 시 심한 졸림이 발생할 수 있습니다.',
  },
  {
    a: 'D402', b: 'D403',
    level: '주의',
    description: '유사 계열 항알레르기약 병용은 효과 증가보다 부작용 위험이 큽니다.',
  },
];