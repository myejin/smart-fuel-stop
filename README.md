# 🚗 스마트 주유소 추천
주유소와 실시간 교통 정보를 활용한 운전자 맞춤형 주유소 추천 서비스

<br/>

## 🚀 Story

1. 운전자의 현재 상황에 맞게 충전소를 추천할 수 있다.
```mermaid
flowchart LR
    classDef defaultNode fill:none,stroke:#333333,stroke-width:2px,color:#333333,font-weight:bold;
    classDef pastelBlue fill:#a8c5f0,stroke:#333333,stroke-width:2px,color:#333333,font-weight:bold;
    classDef grey fill:#d3d3d3,stroke:#333333,stroke-width:2px,color:#333333,font-weight:bold;

    A[연료 타입, 현재 위치,<br>주행 가능 거리 입력] --> B{"주행 가능 거리 K"}
    B -->|안전 주행 가능<br>K >= 30| B1[저렴한 가격 최우선]
    B -->|불가능<br>K < 30| B2[빠른 도착 최우선]
    B1 --> C[추천 충전소 목록 응답<br>결과에 따른 노티 발송]
    B2 --> C
    
    class A,C defaultNode
    class B grey
    class B1,B2 pastelBlue
```

