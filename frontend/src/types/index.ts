// 공공데이터 항목 타입
export interface IPublicData {
  id: number;
  title: string;
  description: string;
  category: string;
  provider: string;
  updateDate: string;
}

// 게시글 타입
export interface IBoard {
  idx: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createDate: string;
}

// 회원 정보 타입
export interface IMember {
  username: string;
  password?: string;
  name: string;
}
