# MEDI — 복약 안전 확인 서비스

> 약과 건강기능식품을 함께 먹어도 되는지, 전문 지식 없이도 한눈에 확인할 수 있게 만든 웹 서비스입니다.
> 4인 팀 프로젝트이며, 이 README는 제가 맡은 **DUR(의약품 안전사용) 연동과 병용금기 확인 기능**을 중심으로 설명합니다.

| 항목 | 내용 |
|---|---|
| 기간 | 2026.01.24 ~ 2026.02.14 (K-디지털 트레이닝 지능형 블록체인 웹 개발자 양성과정) |
| 팀 구성 | 4인 (프론트엔드 2 · 백엔드 2) |
| 내 역할 | DUR API 연동, 병용금기 판별 로직, 판별 결과 화면 (백엔드~프론트엔드) |
| 기술 | Java 21, Spring Boot 3.2, Jackson XML, MySQL, React, TypeScript, Vite |

---

## 1. 서비스 소개

공공데이터포털의 의약품 정보는 원본 그대로는 일반 사용자가 읽기 어렵습니다. MEDI는 이 데이터를 가공해 다음 기능을 한 곳에서 제공합니다.

- **병용금기 확인** — 복용 중인 약을 등록하면 함께 먹으면 안 되는 조합을 경고로 표시 *(담당)*
- 의약품 정보 검색, 근처 약국 지도, 연령대별 영양제 추천, 게시판·Q&A *(팀원 담당)*

## 2. 내가 구현한 범위

| 위치 | 내용 |
|---|---|
| [`backend/src/service/DurService.java`](./backend/src/service/DurService.java) | DUR 품목 검색, 병용금기 조회·판별 |
| [`backend/src/controller/DurController.java`](./backend/src/controller/DurController.java) | `GET /api/dur/search`, `POST /api/dur/taboo/check`, `GET /api/dur/all` |
| [`frontend/src/api/dur.ts`](./frontend/src/api/dur.ts) | DUR API 호출 |
| `frontend/src/pages/Home.tsx` (DUR 관련 부분) | 약 이름 자동완성, 병용금기 경고·안전 상태 표시 |

## 3. 병용금기 판별 흐름

```
[사용자] 복용 중인 약 등록 (2개 이상)
   │
   ▼
POST /api/dur/taboo/check  { itemSeqs: [...] }
   │
   ├─ 입력 정리: 빈 값 제거, 중복 품목 제거 (2개 미만이면 바로 빈 결과)
   ├─ 품목마다 DUR 병용금기 API 호출 (XML)
   ├─ 응답 중 "내가 등록한 약끼리의 조합"만 남김
   └─ A+B / B+A 같은 조합은 한 번만 표시
   │
   ▼
[화면] 금기 조합과 사유를 경고로 표시
```

## 4. 문제 해결

### 응답 개수에 따라 형식이 바뀌는 XML 응답

DUR API는 결과가 **1건이면 객체**, **여러 건이면 배열**로 `item`을 돌려줘서, 한 가지 형식만 가정한 코드는 결과 개수에 따라 파싱에 실패했습니다.
Jackson `XmlMapper`로 트리를 읽은 뒤 `isArray()` / `isObject()`로 분기해 어느 형식이 와도 같은 방식으로 처리하도록 했습니다.

```java
JsonNode itemNode = root.path("body").path("items").path("item");
if (itemNode.isArray()) {
    for (JsonNode it : itemNode) maybeAddTaboo(result, pairDedup, selected, it);
} else if (itemNode.isObject()) {
    maybeAddTaboo(result, pairDedup, selected, itemNode);
}
```

### 같은 조합이 두 번 경고되는 문제

A약 기준으로 조회해도, B약 기준으로 조회해도 같은 금기 조합이 나옵니다. 두 품목 코드를 정렬해 `A|B` 형태의 키를 만들고 `Set`으로 중복을 걸러, 같은 조합은 한 번만 보여 주도록 했습니다.

### 자동완성 호출 줄이기

약 이름을 입력할 때마다 검색 API가 호출되던 것을 **250ms 디바운스**로 바꿔, 입력이 멈췄을 때만 호출하도록 했습니다.

## 5. 알게 된 한계와 개선 계획

- **API 오류와 "금기 없음"이 구분되지 않음.** 지금은 공공데이터 API 호출이 실패하면 서버가 빈 목록을 돌려주고, 화면은 이를 "확인된 병용금기 정보가 없습니다"로 표시합니다. 복약 안전 서비스에서 **확인하지 못한 것을 안전하다고 보여 주는 것**은 위험하므로, 오류를 별도 상태로 내려 "확인할 수 없음"으로 표시하도록 고칠 예정입니다.
- **품목 수만큼 순차 호출.** 등록한 약이 많아질수록 응답이 느려집니다. 병렬 호출이나 결과 캐싱으로 개선할 수 있습니다.

## 6. 실행 방법

```bash
# backend
cp backend/src/resources/application-example.properties backend/src/resources/application.properties
# DB 정보와 공공데이터포털 서비스키를 채운 뒤
cd backend && mvn spring-boot:run

# frontend
cp frontend/.env.example frontend/.env   # 카카오 지도 키 등 입력
cd frontend && npm install && npm run dev
```
