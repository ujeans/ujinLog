---
title: ThemeProvider로 theme.ts에서 디자인 시스템 설정하기
authors: ujeans
tags: [web frontend]
keywords:
  [emotion, styled.ts, theme.ts, ThemeProvider, typescript, 디자인시스템]
description: ThemeProvider로 theme.ts에서 디자인 시스템 설정하기
---

## 시작하기 앞서

이번에 당근 마켓이 리브랜딩 되면서 로고의 색상이 바뀌었다. 만약 hex값을 그대로 사용하였다면 수정하는데 일일이 수정해야하는 번거로움이 있을 것이다.

이와 같이 이번에 진행하는 프로젝트에서는 프로젝트의 테마 후보가 2개가 있었다. 우린 퍼블리싱을 먼저 진행 후에 더 잘 어울리는 테마를 적용하기로 하였는데 만약 테마 색상을 디자인 시스템으로 만들지 않는다면 해당 색상이 사용되는 곳을 찾아가며서 바꿔야 하는 번거로움이 생기기 때문에 **디자인 토큰을 이용한 디자인 시스템을 미리 세팅**하기로 하였다.

> **디자인 토큰**은 디자인 시스템의 시각적 원자(atom)이며, 특히 시각적 디자인 속성을 저장하는 실체로 정의한다. 확장 가능하고 일관된 시스템을 유지하기 위해 하드 코딩된 값 대신 이 값(디자인 토큰)을 사용합니다.

`@emotion/react`에서 제공되는 `ThemeProvider`를 사용하기로 하였다.

## 1. theme.ts 생성하기

`theme.ts`란, 자주 사용되거나 공통으로 사용되는 스타일(폰트, 색상 등)을 모아두고, 각 컴포넌트에서 `theme.ts`에 선언한 상수값을 사용하는 것이다.

```jsx
// 색상 및 폰트 설정하기
const colors = {
  white: "#fff",
  gray50: "#EBEBF5",
  gray100: "rgba(235, 235, 245, 0.6)",
  gray200: "#9A9DAC",
  gray300: "rgba(154, 157, 172, 0.6)",
...
};

const typography = {
  headers: {
    h1: {
      fontFamily: "Inter",
      fontSize: "32px",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "normal",
      letterSpacing: "-0.32px",
    },
    ...
  },
};

// theme라는 하나의 객체로 export하기
export const theme = { colors, typography };
```

## 2. styled.d.ts 파일에서 Theme 인터페이스 확장

`Typescript`를 사용하여 `Emtion`의 `Theme` 인터페이스를 확장하는 방법에는 주로 두가지 접근 방식이 있다.

### 1. 객체 기반 타입 추론 방식

```jsx
// types > styled.d.ts
import { Theme as EmotionTheme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme extends EmotionTheme {
    colors: typeof colors;
    typography: typeof typography;
  }
}
```

장점:

- **객체 기반 타입 추론**: 이미 정의된 colors 및 typography 객체를 사용하여 타입을 추론한다. 따라서 colors와 typography 객체에 변경이 생기면 자동으로 타입에도 반영이된다.
- **자동 완성 지원**: 정의된 객체에 기반한 타입 추론 덕분에 IDE에서 자동 완성이 잘 작동한다.

단점:

- **유연성 부족**: 객체 구조가 고정되어 있어, 객체 구조를 변경하면 해당 타입의 정의도 함께 수정해야 한다.

### 2. 키-값 기반 타입 정의 방식

```jsx
import '@emotion/react';

type Font = 'white' | 'gray50' | 'gray100' | 'gray200' | 'gray300' | 'gray400' | 'gray500' | 'blue50' | 'blue100' | 'blue200' | 'blue300' | 'blue400' | 'blue500' | 'blue600' | 'red50' | 'red100';
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'paragraphDefault' | 'paragraphBold' | 'disclaimerDefault' | 'disclaimerBold';

declare module '@emotion/react' {
  export interface Theme {
    font: {
      [key in Palette]: string;
    };
    typography: {
      [key in TypographyVariant]: {
        fontFamily: string;
        fontSize: string;
        fontStyle: string;
        fontWeight: number;
        lineHeight: string;
        letterSpacing?: string;
        textTransform?: string;
      };
    };
  }
}
```

장점:

- **유연성**: 키-값 구조를 사용하여 타입으로 정의하므로, 각 키에 대한 타입을 명확하게 지정할 수 있다. 이는 특히 여러 개의 고유한 스타일 규칙이 있을 때 유용하다.
- **명시적 정의**: 필요한 모든 타입을 명시적으로 정의하므로 코드 가독성이 높아질 수 있다.

단점:

- **중복 가능성**: 타입 정의가 별도로 존재하기 때문에 실제 객체와 동기화되지 않을 수 있다. 즉, 객체 구조가 변경되면 타입 정의도 함께 수정해야 한다.
- **자동 완성**: 첫 번째 방법보다는 객체 기반 타입 추론이 없으므로 자동 완성 기능이 덜 강력할 수 있다.

### 결론

- **작고 간단한 프로젝트**: 만약 프로젝트가 작고 단순하다면, **객체 기반 타입 추론 방식**이 더 적합할 수 있다. 코드가 간결하고, 타입을 자동으로 추론하므로 더 빠르게 개발할 수 있다.
- **크고 복잡한 프로젝트**: 프로젝트가 크고 복잡하며, 다양한 스타일 속성을 관리해야 한다면, **키-값 기반의 타입 정의 방식**이 더 나을 수 있다. 이 방법은 타입을 명시적으로 정의하며 더 큰 유연성과 확장성을 제공한다.

이번 프로젝트의 규모는 작았기에 우리는 **객체 기반 타입 추론 방식**을 택하였다.

## 3. ThemeProvider로 theme.ts 사용하기

```jsx
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/theme";
import Router from "./components/Router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
```

이번 프로젝트에서는 `App.tsx`에서 `router`를 설정하지 않고 `Router.tsx` 컴포넌트를 만들어서 사용하였다.

저렇게 `ThemeProvider theme={theme}`을 사용하면, 하위 컴포넌트에서 `theme.ts`에 지정한 상수값을 사용할 수 있다.

```jsx
import styled from "@emotion/styled";

export default function HomePage() {
  return <Test>HomePage</DDD>;
}

const Test = styled.div`
  ${props => props.theme.typography.headers.h2}
`;
```

<p align="center">
 <img src="https://github.com/user-attachments/assets/d84d38dc-573f-4cdb-85e2-fb9cbfd649c1" width="400" />
</p>

위의 결과처럼, 단 한줄로 원하는 스타일을 묶어서 사용할 수 있게 된다.
