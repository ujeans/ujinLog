---
title: IntersectionObserver를 활용한 Lazy Loading 적용
authors: ujeans
tags: [web frontend]
keywords: [IntersectionObserver, lazy loading, 무한스크롤, 이미지 최적화]
description: IntersectionObserver를 활용한 Lazy Loading 적용
---

### 문제

앞서 웹 성능 최적화 파트에 이어서 웹툰 목록을 조회하는 기능을 구현하던 중 많은 데이터 목록을 한 번에 불러와 렌더링 속도가 느려지는 현상이 있었다.

<iframe title="'유진이의 코딩일기'에서 업로드한 동영상" width="640" height="360" src="https://play-tv.kakao.com/embed/player/cliplink/447641922?service=player_share" allowfullscreen frameborder="0" scrolling="no" allow="autoplay; fullscreen; encrypted-media"></iframe>

영상에서 보면 한번에 이미지가 많이 불러와 지는 것을 볼 수 있다.

이를 해결하기 위해서 초기 화면에 보여지는 만큼의 목록만 불러오고, 사용자가 스크롤을 내릴 때 추가 이미지를 불러오는 방식을 적용했다. 이 과정에서 IntersectionObserver를 사용한 Lazy Loading을 도입하여 성능을 최적화 할 수 있었다.

### IntersectionObserver이란?

요소가 뷰포트(Viewport) 내에서 보이는지 여부를 비동기적으로 관찰할 수 있는 API이다. 스크롤 이벤트를 직접 다루지 않고도 특정 요소가 화면에 들어오거나 나가는 시점을 쉽게 감지할 수 있다.

### 해결

```jsx
const observer = useRef();

const handleLazyLoad = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // data-src 속성에 저장된 실제 이미지 URL을 img 태그의 src 속성으로 설정
      observer.unobserve(img); // 이미지가 로드되면 더 이상 관찰하지 않도록 설정
    }
  });
};

useEffect(() => {
  observer.current = new IntersectionObserver(handleLazyLoad); // IntersectionObserver 생성
  const images = document.querySelectorAll("img[data-src]"); // data-src 속성을 가진 모든 img 태그를 선택
  images.forEach(img => observer.current.observe(img)); // 각 img 태그를 관찰 대상으로 설정

  return () => {
    if (observer.current) {
      observer.current.disconnect(); // 컴포넌트가 언마운트될 때 관찰을 중단
    }
  };
}, [webtoons]); // webtoons가 변경될 때마다 새로 설정
```

```jsx
<Image data-src={webtoon.thumbnail[0]} alt="웹툰 이미지" loading="lazy" />
```

1. `IntersectionObserver` 생성
   - `handleLazyLoad` 함수는 요소가 뷰포트에 진입하거나 나갈 때 호출된다.
2. `handleLazyLoad` 함수
   - `entries` 배열을 순회하며 각 `entry`가 뷰토프에 진입했는지 (entry,isInterseting)를 확인한다.
   - 만약 요소가 진입했다면 `data-src` 속성에 저장된 실제 이미지 URL을 `src` 속성으로 설정하여 이미지를 로드한다.
   - 이미지가 로드되면 해당 요소를 더 이상 관찰하지 않도록 `observer.unobserve(img`)를 호출한다.
3. `useEffect` 훅
   1. `useEffect` 훅 내에서 `IntersectionObserver`를 생성하고, `data-src` 속성을 가진 모든 `img` 태그를 관찰 대상으로 설정한다.
   2. 컴포넌트가 언마운트될 때 `observer.current.disconnect()`를 호출하여 관찰을 중단한다.
   3. `webtoons`가 변경될 때마다 새로 설정한다

### 결과

<iframe title="'유진이의 코딩일기'에서 업로드한 동영상" width="640" height="360" src="https://play-tv.kakao.com/embed/player/cliplink/447642194?service=player_share" allowfullscreen frameborder="0" scrolling="no" allow="autoplay; fullscreen; encrypted-media"></iframe>
