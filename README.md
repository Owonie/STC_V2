# STC_V2

STC version up (CRA -> vite + React + Typescript 마이그레이션)

Repo[구버전]: [https://github.com/Owonie/STC]
작업일지: [https://debonair-quality-71d.notion.site/STC_V2-caef3457fd4f4398b46b71f1df12595c?pvs=4]
## 개요

### 개발 목적

1. 보일러 플레이트를 제거하고 필요한 부분만 셋팅한다.
2. 프론트엔드 프로젝트 배포 (CI/CD)
3. 예전의 프로젝트를 새로운 코드를 다시 짜는 것으로 초점을 둔다.

### 개발스택

1. vite + ts + React
2. context + firebase
3. youtube API

### 실제 기능

0. Auth 처리
1. 스트리밍 방 기능 (인원관리)
2. 채팅기능 (Text editor)
3. 영상 리스트 CRUD
4. 에러 처리

---

## 개발일지

### 프로젝트 빌드

git에서 repo를 하나 파줬다.
vite를 사용해 react + ts로 프로젝트를 생성해주었으며, 라우팅 기능을 위해 react-router-dom을 별도로 설치해줬다.

스타일 구현은 추후에 진행될 예정이기에, tailwind 설치는 하지않았다.

### 라우터

라우터를 코어 모듈로 만들어 app에 제공하려 한다. app에서 따로 코드를 구현하는 것 보단 훨씬 깔끔할 거라 예상한다.
모든 페이지를 감싸줄 layout을 하나 작성했다.

```ts
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/mainPage';
import RoomPage from '../pages/roomPage';
import SearchPage from '../pages/searchPage';
import RootLayout from '../components/common/rootLayout';
import ErrorPage from '../pages/errorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <MainPage /> },
      { path: 'room', element: <RoomPage /> },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);
```

loader -> data를 컴포넌트의 마운트 전 시점부터 불러온다. useLoaderData로 데이터를 불러올 수 있다.
캐싱이 필요 없다면 사용해봐도 좋다.

### auth 구현

기존에 로그인 기능은 firebase를 이용한 소셜계정 로그인 방식이었다. 구글과 github 두가지 방식이 있는데, 이번에도 똑같이 구현해보려 한다.

firebase에서 제공 하는 auth는 provider를 사용해야하기 때문에, 예전엔 authService class를 구현하여 인스턴스를 전역으로 관리했었다.

함수형프로그래밍을 사용하여, props drilling을 없에보자했다. 예전엔 모든 서비스와 repository를 자식 컴포넌트에게 일일이 상속시켜줬어야 했기에, 유지보수성이 많이 떨어졌었다.

(할거): unsinged 페이지를 제공하여, 무조건 로그인을 해야 사용할 수 있도록 하자.

firebase와 auth를 연동시키는 과정에서 문제가 생겼다. 예전엔 authService를 생성할 때 props로 firebaseApp이라는 firebase서비스 역할의 인스턴스를 넘겨줘서 문제가 없었지만, 지금 authService는 함수형으로서 동작하기에, 동시성 문제가 생기는 것 같다.

어차피 firebase에서 모든 인스턴스를 최초로 제공하기 때문에, auth나 auth 관련provider를 firebase.ts에서 선언하고 authService 내부에 제공해주는 방식으로 처리해줬다. 그리고 오류는 해결됐다.

(할 것): dev mode일 때 devServer 넣자.

하나의 오류를 해결하자 마자 다음과 같은 문제를 마주쳤다. vite에선 process가 아닌 import.meta를 사용하기에 생기는 오류같았다.

기존엔 CRA로 작성되어있기에 process.env로 env 파일을 불러왔다면 vite 환경이기에 import.meta로 수정해주자.
추가해줬지만, 에러가 해결되진 않았다. 유효한 API 값이 아니라는 에러를 반환받았다.

마이그레이션을 위해 새롭게 모든 API key를 갱신해줬기에 유효기간이 지났을 일은 없다. 아마도 .env 파일을 불러오는 과정에 문제가 생긴 것 같다.

https://ko.vitejs.dev/guide/env-and-mode.html
vite 공식문서를 찾아보니 env에 있는 값을 사용하기 위해선 반드시

```
VITE_SOME_KEY= 123    -> O
DB_PASSWORD=foobar    -> X
```

그래서 .env에 기존에 있는 키 이름을 변경해줬다.

ex: REACT_APP_FIREBASE_AUTH_DOMAIN -> VITE_FIREBASE_AUTH_DOMAIN

이제 정상적으로 로그인을 할 수 있게 됐다.

github 로그인은 도메인 문제때문에 계속 에러가 뜨는 것 같았다. firebase authentication에서 같은 메일 여러개의 소셜 계정 로그인을 할 수 있도록 설정해줬다.

auth 기능은 기본적으로 완성했다.

### 상태관리 with Recoil

context만으로 token과 같은 값들을 관리해줘도 상관은 없으나, 프로젝트 특성 상 사용자의 많고 복잡한 정보를 관리해줘야 하기에 상태관리 라이브러리를 사용하도록 했다.

Recoil을 선택한 이유는 다음과 같다:

- 낮은 러닝커브
- Redux에 비해 가볍고 보일러플레이트가 적다
- 리액트답게 프로젝트를 구현할 수 있다.

Recoil로 관리 할 상태는 다음과 같다:

- 유저 정보
- 채팅 방 정보

나중에 확장을 할 수도 있지만, 일단 지금 당장 필요한 건 유저 정보와 입장되어있는 채팅방 정보다.

App에 recoilRoot를 제공해줬다.

```ts
import { RouterProvider } from 'react-router-dom';
import { router } from './core/router';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
            <RouterProvider router={router} />   {' '}
    </RecoilRoot>
  );
}

export default App;
```

```ts
// 사용할 때
const onLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
  login(e.currentTarget.name).then((user) => {
    if (user) setAuth(user.displayName);
  });
};

// 선언할 때
export async function login(providerName: string) {
  const provider = getProvider(providerName);
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('login success', user);
      return user;
    })
    .catch(console.error);
}
```

이렇게 타입가드를 해줘야 user의 타입을 <user | null> 에서 user로 타입추론이 가능해진다.

Trouble Shooting:

```ts
export async function login(providerName: string) {
  const provider = getProvider(providerName);
  return signInWithPopup(auth, provider)
    .then((result) => {
      let credential;
      // provider의 타입은 GithubProvider|GoogleProvider이며 credentialFromResult 메서드가 없음
      credential = provider.credentialFromResult(result);
      //
      const user = result.user;
      return user;
    })
}

---------------------------------------------
// 아래처럼 타입가드를 해주면 문제가 없긴 하다.

export async function login(providerName: string) {
  const provider = getProvider(providerName);
  return signInWithPopup(auth, provider)
    .then((result) => {
      let credential;
      if (provider instanceof GoogleAuthProvider) {
        credential = GoogleAuthProvider.credentialFromResult(result);
      } else {
        credential = GithubAuthProvider.credentialFromResult(result);
      }
      const user = result.user;
      return user;
    })

```

이를 해결하기 위해서 인스턴스 타입가드를 사용했지만, 아직 너저분한 것 같다. 훨씬 깔끔한 코드짜는 법을 아직
찾지 못했다.

(궁금): 패턴매칭을 이용하는건 어떨까?
-> 라이브러리 의존성이 추가되며, 대량의 데이터 처리를 하는 것이 아니기에 TS-Pattern을 사용하는 건 좋은 선택은 아닌 것 같다.

**TODO: indexedDB 사용하여 채팅 메시지 캐싱하기 (기간은 대략 10일 어치만)**

recoil-persist를 도입하여 페이지 전환 시에도 로그인 정보를 유지할 수 있도록 했다.

(할것): 세션 만료 시 자동 로그인

### 채널 및 채팅 구현

채널과 채팅은 각각 복잡한 데이터를 들고 있다.

채널에는 인원과 역할, 카테고리 등 다양한 속성을 갖고 있으며, 채팅에는 이미지, 이모티콘, 폰트 뿐만 아니라, 발신한 사람과 수신여부에 대한 내용도 반영이 되야한다.

초기에 내가 생각한 방법은 두가지가 있다:

1.  서버채널 데이터와 채팅 데이터는 서로 다른 테이블에 존재
2.  서버채널 테이블 내부에 채팅 데이터가 내재

채팅 데이터는 갈 수록 복잡해질 뿐더러, 채팅 데이터 외에도 영상 셋 리스트와 같은 부가적인 요소들이 채널 데이터와 연관된다.

확장성과 유지보수 측면에서 가장 좋은 방법은 서로 다른 데이터들을 각자 다른 테이블에 저장하는 방식이 아닐까 싶다.

https://engineering.linecorp.com/ko/blog/the-architecture-behind-chatting-on-line-live

큰 기업에서는 구체적으로 어떻게 구현했는지 살펴봤다.

1. 웹 소켓으로 서버와 클라이언트 간의 실시간 양방향 메시징을 지원한다.
2. 서버 내에서는 Akka toolkit을 이용하여 고속 병렬처리한다.
3. 레디스로 일시적인 데이터를 저장하고 Pub/Sub에 의한 서버 간 코멘트 정보 동기화

만약 서비스 규모가 좀 더 커진다면 웹 소켓과 레디스를 고려해봐도 좋을 것 같다. 일단 프론트엔드 구현에 초점을 둔 프로젝트이니 간단하게 구현하도록 한다.

채널과 채팅 그리고 비디오 셋 리스트는 각각 다른 컬렉션에 저장하도록 하겠다.

Repository를 객체지향으로 구현할지 아니면 함수형으로 구현을 할지 고민이다. 일반적으로 레이어드 아키텍처를 사용한다면 함수형으로 구현하면 상반되는 부분들이 많다. 일단은 함수 형식으로 데이터베이스를 다룰 수 있도록,
기존의 repository -> service로 형식을 바꿔줬다.

결국 프론트 측에서 다뤄야하는 내용은 UI 와 렌더링을 위한 데이터의 요청이라고 생각하여, 구조를 좀 더 간단하게 가져가기로 결정했다.

또한 기존의 Room은 RoomServer로 이름을 바꿔줬다. 한명의 유저는 여러개의 RoomServer를 갖고있을 수 있으며, RoomServer 내부엔 여러개의 채널이 존재할 수 있다. 이는 디스코드의 서버 / 채널과 흡사한 구조다.

**TODO: 온라인 / 오프라인 / 자리비움 표시**

서버 생성은 시간과 상관이 없어 orderBy 매개변수를 제거해줘야 정상적으로 동작한다. 이를 해결하는데 1시간이 걸렸다.

```ts
export function syncRoomServerList(userId: string, onUpdate: any) {
  const ref = collection(database, `User/${userId}/RoomServerList`);
  const q = query(ref, orderBy('time', 'asc')); // 여기서 오류가 뜬다
  const unsub = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      roomServerName: doc.data().roomServerName,
    }));
    console.log('data', data);
    data && onUpdate(data);
  });
  return () => unsub();
}
```

syncRoomServerList를 구현하는데, db에 대한 구독과 구독 해지에 해당하는 콜백 함수의 타입을 지정해주는데 조금의 어려움을 겪고 있다.

결과적으로 프론트에서 사용 될 데이터들은 DTO type처럼 외부 파일에 따로 분리를 해줬고, recoil에서 사용 될 state 타입들 또한 같은 type 파일에서 추출하여 쓰도록 했다.

RoomServer의 채널명이 출력되는 것을 확인했다. 서버와 유저 / 영상은 db 동기화 원리가 흡사하기에 빠르게 구현할 수 있다. 3가지 주요 db 연동 작업을 마치면, 본격적으로 채팅방의 인원 관리 기능을 구현 할 예정이다.

서버를 새로 생성하면 RoomServer 컬렉션에 추가할 뿐 더러, User의 RoomServerList 컬렉션 내부에도 서버를 추가해줘야한다. 이는 firebase 자체가 NoSql이기에, sql에선 간단하게 foreign key만 set해주면 되는 과정을 복잡하게 처리해야한다.

문제는 아래의 코드를 보면 알 수 있다:

```ts
export function createRoomServer(userId: string, roomServerName: string) {
  addDoc(collection(database, 'RoomServer'), {
    RoomServerName: roomServerName,
    masterUid: userId,
  }); // getDoc을 통해 새로 생성된 서버의 UID를 알아낸 다음 User의 RoomServerList에 넣어줘야한다.
  addDoc(collection(database, `User/${userId}/RoomServerList`), {
    roomServerName: roomServerName,
  });
}
```

서버를 한번 생성하면 최소한 세번의 firestore API 요청이 필요하다는 것이다. firebase는 DB의 조작 수에 따라서 금액을 추산하는 방식이기에, 데이터 요청 수를 최소한으로 줄이는 것이 좋다. 또한 여러 작업들을 동시에 처리한다면, 동시성 문제 또한 고려해야한다. 이 모든 것을 해결하기 위해, transaction과 batched 기능을 참조해봤다.

Nosql에서도 transaction과 batched가 잘 작동하는지 잘 몰랐기에, 열심히 firebase의 공식문서를 뒤져보며 구현을 시작했다.
