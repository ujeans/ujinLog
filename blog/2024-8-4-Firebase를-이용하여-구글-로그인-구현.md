---
title: Firebase를 이용하여 구글 로그인 구현
authors: ujeans
tags: [web frontend]
keywords: [firebase, 구글 로그인 구현]
description: Firebase를 이용하여 구글 로그인 구현하기
---

<p align="center">
  <img src="https://github.com/user-attachments/assets/dc14fd10-8616-4bd6-80d9-73733460d046" width="400" />
</p>

이번 프로젝트 회원가입은 일반 그리고 구글 로그인 이렇게 두가지를 구현해야했다.

구글 로그인 구현을 위해 파이어베이스를 이용하는 방식을 선택하였다.

> Firebase란 Backend-as-a-Service(Baas) 방식의 서비스로, 백엔드에서의 여러 도구들과 기능을 제공해준다.

그럼 파이어베이스를 이용하여 소셜 로그인을 적용하는 방법에 대해 알아보자.

### Firebase 프로젝트 생성

처음에는 파이어베이스에서 프로젝트를 생성 후 firebaseConfig를 발급받는다.

### Firebase Authentication 세팅하기

작업할 프로젝트로 와서 firebase를 설치한다.

```
npm install firebase

yarn add firebase
```

그 후 src > firebaseApp.ts 파일을 만들고 이전에 발급받은 firebaseConfig 코드를 입력해준다.

```jsx
import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export let app: FirebaseApp;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

try {
  app = getApp("app");
} catch (e) {
  app = initializeApp(firebaseConfig, "app");
}

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { firebase, auth };
```

firebaseConfig에 있는 value는 환경변수에 저장하고 export let app:FirebaseApp으로 정의하였다.

이렇게 수정한 이유는 매번 initialize를 호출하는 것이 아니라 처음에 initialize가 되어 있으면 getApp을 통해서 해당 App을 가져오고 그게 아닌 경우에만 initialize하기 위해서이다.

### Google 제공업체 객체를 사용해 Firebase에 인증

처음에 Google 제공업체 객체의 인스턴스를 생성한다.

```jsx
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
```

그리고 signInWithPopup를 이용하면 팝업창을 이용해서 로그인을 진행한다.

```jsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// firebaseimport { auth } from "../../firebaseApp";

const GoogleAuth = () => {
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const data = await signInWithPopup(auth, provider);
      const user = data.user;

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container onClick={handleGoogleSignUp}>
      <Logo src={googleLogo} alt="logo" />
      <Text>구글 로그인</Text>
    </Container>
  );
};

export default GoogleAuth;
```

console에 찍어보면 로그인이 성공적으로 완료 되었을 때 해당 정보를 볼 수 있다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ab679e7a-b15f-440c-b062-bfeb4ab03e2b" width="400"/>
</p>
