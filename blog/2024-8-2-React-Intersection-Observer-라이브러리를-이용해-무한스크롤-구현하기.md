---
title: React-Intersection-Observer 라이브러리를 이용해 무한스크롤 구현하기
authors: ujeans
tags: [web frontend]
keywords: [react-intersection-observer, 무한스크롤]
description: React-Intersection-Observer 라이브러리를 이용해 무한스크롤 구현하기
---

## 무한 스크롤

웹 페이지나 애플리케이션에서 사용자가 스크롤할 때마다 새로운 콘텐츠를 계속해서 불러오는 방식을 말한다.

사용자가 페이지의 끝에 도달하면 자동으로 다음 콘텐츠를 로드하여 화면에 추가하는 방식으로, 페이지를 새로고침하거나 추가적인 페이지로 이동할 필요 없이 연속적인 스크롤을 통해 콘텐츠를 볼 수 있다.

## React-Intersection-Observer이란?

`React-Intersection-Observer`는 `React` 를 위한 라이브러리로, 웹 페이지의 특정 요소가 사용자의 **Viewport(화면)** 내에 들어오는지를 감지하는 기능을 제공한다.

이 라이브러리는 브라우저의 기본 API인 Intersection Observer API를 기반으로 하여, **React 컴포넌트**에서 쉽게 사용할 수 있도록 만들어졌다.

[GitHub - thebuilder/react-intersection-observer](https://github.com/thebuilder/react-intersection-observer#readme)

## 사용 방법

### 설치

```jsx
// yarn
yarn add react-intersection-observer

// npm
npm install react-intersection-observer
```

### 1. 라이브러리 import

```jsx
import { useInView } from "react-intersection-observer";
```

### 2. useInView Hook 사용

```jsx
const [ref, inView] = useInView({
  /* 옵션 설정 가능 */
});
```

`useInview` 는 `React` 컴포넌트 내에서 특정 DOM 요소의 가시성을 감지하는데 사용되는 **Hook**이다.

이 **Hook**을 사용하면, 특정 요소가 사용자의 화면(뷰포트)에 들어왔는지를 감지하고, 해당 정보를 바탕으로 다양한 동작을 수행할 수 있다.

`useInView` **Hook**을 호출하며, `ref`, `inView`라는 두 가지 주요한 반환값을 얻을 수 있다.

- `ref` : React의 ref 객체이다. 감지하고자 하는 DOM 요소에 이 ref를 할당해야 한다.
- `inView` : 이것은 **불리언(boolean)**값이다. 감시하고 있는 요소가 화면에 보일 때 **true**가 되고, 화면에서 벗어나면 **false**가 된다.

### 3. 옵션 설정

`useInView`는 다양한 옵션을 설정할 수 있는데, 이 옵션들은 `useInView` 함수에 객체 형태로 전달된다.

- `threshold` : 요소의 어느 부분이 뷰포트에 들어와야 `inView`가 **true**가 될지 결정한다. 0에서 1사이의 값으로 설정할 수 있으며, 예를 들어 0.5는 요소의 50%가 화면에 들어왔을 때 `inView`를 **true**로 설정한다.
- `triggerOnce` : 이 옵션을 **true**로 설정하면, 요소가 한 번에 화면에 나타나고 나면 감지가 중지된다. 기본값은 **false**이다.
- `delay` : 감지에 **딜레이**를 추가할 수 있다. 예를 들어, 요소가 화면에 짧게 나타났다가 사라지는 경우를 필터링할 때 유용하다.

### 4. 컴포넌트에 ref 연결

```jsx
return (
  // 관찰할 객체에 ref를 달아준다.
  <div ref={ref}>무한스크롤</div>
);
```

나는 scroll area의 하단에 ‘무한스크롤’이라고 붙여 놓았다.

### 5. 로직 구현

```jsx
const fetchPosts = async () => {
  try {
    const response = await axiosInstance.get(`/posts?page=${page}&size=10`);

    if (Array.isArray(response.data)) {
      // 리스트 뒤로 붙여주기
      setPosts(prevPosts => [...prevPosts, ...response.data]);
      // 요청 성공 시에 페이지에 1 카운트 해주기
      setPage(page => page + 1);
      console.log(`Fetched posts for page ${page}:`, response.data);
    } else if (response.data && Array.isArray(response.data.posts)) {
      setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      setPage(page => page + 1);
      console.log(`Fetched posts for page ${page}:`, response.data.posts);
    } else {
      console.error("Unexpected response data format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

useEffect(() => {
  // inView가 true 일때만 실행한다.
  if (inView) {
    console.log(inView, "무한 스크롤 요청");

    // 실행할 함수
    fetchPosts();
  }
}, [inView]);
```

## 실행 결과

스크롤을 내릴때마다 페이ㅋ지가 증가하면서 데이터를 받아오는 것을 볼 수 있다.

![무제](https://github.com/user-attachments/assets/34d43b23-6e6c-4cc6-b7ee-c71c52ee3614)

<p align="center">
 <img src="https://github.com/user-attachments/assets/1fb1f2c9-e738-41dd-9b9c-3bc465eed249" width="400" />
</p>

마찬가지로 네트워크 탭에서도 확인할 수 있다.
