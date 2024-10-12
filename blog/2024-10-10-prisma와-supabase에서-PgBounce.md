---
title: prisma와 supabase에서 PgBounce 문제
authors: ujeans
tags: [Database]
keywords: [next.js, pgbouncer, prisma, supabase, 마이그레이션 오류]
description: prisma와 supabase에서 PgBounce 문제
---

### 문제

`Prisma`를 사용해 `PostgreSQL`과 `Supabase`를 연결하는 도중에 마이그레이션이 제대로 적용되지 않는 문제가 발생했다.

<p align="center">
 <img src="https://github.com/user-attachments/assets/e36d8108-59e0-41a5-b497-db6f124288f6" width="700" />
</p>

문제 원인은 `Supabase`에서 기본으로 사용하는 `PgBouncer`**라는 연결 폴링 서비스**에 있었다.

```
📌 PgBouncer는 PostgreSQL 데이터베이스 서버 앞에서 동작하는 경량의 데이터베이스 커넥션 풀러(Connection Pooler)로 여러 클라이언트 연결, 처리 시간 단축, 리소스 최적화 등의 기능을 제공한다.

데이터베이스 연결을 관리해 성능을 최적화하지만, Prisma와 같은 ORM은 트랜잭션 및 대규모 처리 기능을 사용하려면 PgBouncer를 통해서가 아닌 직접 연결이 필요하다. 이러한 이유로 "pgbouncer=true"옵션이 설정된 `DATABASE_URL`만으로는 Prisma의 기능이 제한되었다.
```

### 해결

다음과 같이 기존 `DATABASE_URL` 변수 하나를 복사해 `DIRECT_URL` 변수로 이름을 수정한다. 그리고 `DATABASE_URL` 변수는 포트 번호를 `6543`으로 변경하고 `?pgbouncer=true` 쿼리스트링을 추가한다. `pgbouncer` 옵션은 자동으로 커넥션 폴링을 활성화하고, 호환성을 보장할 수 있다.

```jsx
DATABASE_URL =
  "postgresql://...aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
DIRECT_URL =
  "postgresql://...aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";
```

그리고 새로 추가한 `DIRECT_URL` 변수를 `Prisma`에서 사용할 수 있도록, 다음과 같이 `schema.prisma` 파일을 수정한다.

```jsx
// ...

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ...
```

그러면 정상적으로 마이그레이션이 되는 것을 볼 수 있다.

<p align="center">
 <img src="https://github.com/user-attachments/assets/2c30eb9d-b316-457f-bbdc-852c6109cbfa" width="700" />
</p>

<p align="center">
 <img src="https://github.com/user-attachments/assets/2a111854-bc83-4ac2-80e4-7036dae4234e" width="400" />
</p>
