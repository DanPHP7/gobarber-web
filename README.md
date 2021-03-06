# Gobarber Web

Utilize o `git clone` para fazer o download do repositório e execute:

```bash
yarn
```

ou:

```bash
npm i
```
Instale as sequintes dependências:

```bash
yarn add redux redux-saga react-redux reactotron-redux reactotron-redux-saga immer axios
```


# Redux & Redux SAGA

Um instrudução da configuração incial do `redux`, `redux-saga` & `Reactotron`.


## Configuração



O promeiro passo após a instação das dependências é criar o esquemas de pastas
do `Redux`, abaixo vou listar a `tree` da configuração de pastas do `Redux` &
`Redux-SAGA`, logo após vou destrinchar cada arquivo de cada pasta da `tree`,
vale salientar que a pasta `store` fica dentro da pasta `src`.

```
store
├── modules
│   ├── auth
│   │   ├── actions.js
│   │   ├── reducer.js
│   │   └── sagas.js
│   ├── rootReducer.js
│   └── rootSaga.js
└── index.js
```
Depois de criar essa estrutura de pastas e arquivos vamos a configuração de um reducer de `auth`,
vamos editar o arquivo `reducer.js`, deixe-o desta forma:

```jsx
const INITIAL_STATE = {};
export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}
// reducer.js
```

Este é um exemplo básico de um `reducer`, ele recebe por default 2 parâmetros,`state`(que se não estiver setado ele recebe um objeto vazio), e a `action`, como não temos nenhuma action no momento de configuração, a única coisa que eu fiz, foi retonar o `default`, que nosso `state`.

Agor vamos Configurar o arquivo de `sagas`, o arquivo onde nós vamos configurar o `redux-saga` é o `sagas.js`, deixe-o dessa forma:

```jsx
import { all } from 'redux-saga/effects';

export default all([]);
// sagas.js
```
Agora vamos configurar o arquivo `rootReducer.js`, ele será o responsável por unir todos os nossos reducers.

```jsx
import { combineReducers } from 'redux';

import auth from './auth/reducer';

export default combineReducers({ auth });

// rootReducer.js
```
Agora vamos configurar o arquivo `rootSaga.js`.

Aqui é onde nós vamos colocar nossas `Actions`, como não temos nenhuma, vamos deixar somente a estrutura pronta.

Agora vamos configurar o `rootSaga.js` pra poder unir todos os nossos `sagas`, deixe o arquivo `rootSaga.js` dessa forma.

```jsx
import { all } from 'redux-saga/effects';

import auth from './auth/sagas';

export default function* rootSaga() {
  return yield all([auth]);
}
// rootSaga.js
```
Básicamente, a parte de módulos está configurada, agora vamos de fato a configuração do `Redux`, vamos editar o arquivo `index.js` que está na raiz da pasta `store/index.js`, antes disso na raiz da pasta `store`, crie um arquivo para abstrairmos os nossos `stores`.


Para criar o arquivo basta eecutar o seguinte comando:
```bash
touch src/store/createStore.js
```

Certo, agora vamos voltar a edição do arquivo `store/index.js`, essa é a configuração básica do `Redux`.

```jsx
import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, middlewares);

sagaMiddleware.run(rootSaga);

export default store;

// src/store/index.js
```

Agora vamos configurar o arquivo `src/store/createStore.js`.

```jsx
import { createStore } from 'redux';

export default (reducers, middlewares) => {
  return createStore(reducers, middlewares);
};

// src/store/createStore.js
```

Separamos a função `createStore()` para encapsular a configuração do `Reactotron`.

## Configurando Reactotron

Agora vamos Editar o arquivo de configurações do `Reactotron`, ele se encontra em  `src/config/ReactotronConfig.js`.

deixe o arquivo assim:

```jsx
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure({ host: '192.168.3.150' })
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}

// src/config/reactotronConfig.js
```

Agora que configuramos o `Reactotron` com o `Redux` & `Redux-Saga`, vamos realizar mais algumas configurações, no arquivo `src/store/index.js`, edite-o e deixe-o assim:

```jsx
import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : null;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, middlewares);

sagaMiddleware.run(rootSaga);

export default store;

// src/store/index.js
```


Finalizando isso, vamos editar o arquivo `src/store/createStore.js`, deixe-o exatamente assim:

```jsx
import { createStore, compose, applyMiddleware } from 'redux';

export default (reducers, middlewares) => {
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares);
  return createStore(reducers, enhancer);
};
// src/store/createStore.js
```

Agora, vamos editar o arquivo `App.js`, deixe-o exatamente assim:


```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import './config/ReactotronConfig';
import Routes from './routes';
import history from './services/history';
import GlobalStyles from './styles/global';

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <GlobalStyles />
        <Routes />
      </Router>
    </Provider>
  );
}

export default App;
// src/App.js
```

> É importante ficar atento a uma questão, o `import` do `store`, deve vir depois da importação da configuração do `Reactotron` para que ele tenha acesso as funções para realizarmos o `Debug` pelo `Reactotron`.

Agora vamos criar as actions de autenticação.

Edite o arquivo `src/modules/auth/actions.js`.

```jsx
export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}
// src/modules/auth/actions.js
```

Aqui criamos 3 `actions` base para configuramos a autenticação da nossa aplicação com o `Redux`.

Antes de prosseguir com a configuração do `Saga` de autenticação, vamos configurar o `service` de API.

Dentro da pasta `src/services` crie um arquivo chamado `api.js`.

```bash
touch src/services/api.js
```
Agora, edite o arquivo `api.js` e deixe-o exatamente assim:

```jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export default api;

// src/services/api.js
```

Agora vamos configurar o `Saga` de autenticação, edite o arquivo `src/store/modules/auth/sagas.js`.

```jsx
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import history from '~/services/history';

import { signInSuccess } from './actions';

export function* signIn({ payload }) {
  const { email, password } = payload;

  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });

  const { token, user } = response.data;

  if (!user.provider) {
    console.tron.error('Usuário não é provider');
    return;
  }
  yield put(signInSuccess(token, user));

  history.push('/dashboard');
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);


// src/store/modules/auth/sagas.js

```
Feito isso, dentro do seu componente de `Login`, você deve importar a `function`, `useDispatch()` do pacote `react-redux`, e a action de request para o Login, que nós cahamamos de `signInRequest()`, e colocando a action por volta da função `useDispatch()` e passando seus respectivos parâmetros dessa forma:


```jsx
const dispatch = useDispatch();

function handleSubmit({email, password}){

  dispatch(signInRequest(email, password))

}
```
> Este é um exemplo genérico de como deve ser feito.

Agora vamos configurar o `reducer` de autenticação, edite o arquivo  `src/store/modules/auth/reducer.js`, deixe-o dessa forma.

```jsx
import produce from 'immer';

const INTIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};
export default function auth(state = INTIAL_STATE, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_SUCCESS':
      return produce(state, draft => {
        draft.token = action.payload.token;
        draft.signed = true;
      });
    default:
      return state;
  }
}

```
> Um `Reducer` sempre pode ouvir todas as actions de todos os outros modules.

## Persistindo dados com Redux

Agora vamos instalar uma lib pra que possamos persistir os dados do usuário, mesmo quando ele dar um refresh(`F5`) na página.

```bash
yarn add redux-persist
```

Na pasta `src/store`, crie um arquivo com o nome `persistReducer.js`, deixe-o dessa forma:

```jsx
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'gobarber',
      storage,
      whitelist: ['auth', 'user'],
    },
    reducers
  );
  return persistedReducer;
};

```

Aqui eu especifiquei os modules que terão seus dados persistidos na aplicação dentro da minha `key`=> `whitelist`, se você não quer que um module tenha seus dados ṕersistindo na aplicação, simplesmente deixe-o de fora do `array` da `key`=>`whitelist`.

Agora, vamos modificar o arquivo `src/store/index.js`, deixe-o dessa forma:

```jsx
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import createStore from './createStore';
import persistReducer from './persistReducer';
import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : null;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middlewares = [sagaMiddleware];

const store = createStore(persistReducer(rootReducer), middlewares);
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export { store, persistor };
// src/store/index.js
```


Como nós modificamos  a importação da varável `store` nos temos que mudar em todos os locais onde nos importamos ela como `default`,para que a aplicação não quebre.

#### 1

***src/App.js***

```jsx
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import './config/ReactotronConfig';
import Routes from './routes';
import history from './services/history';
import GlobalStyles from './styles/global';

import { store, persistor } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <GlobalStyles />
          <Routes />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

```


#### 2

***src/routes/Route.js***

```jsx
import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

import { store } from '~/store';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  // importando store temos acesso a todos os modulos atravez da função getState();
  const { signed } = store.getState().auth;

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }
  const Layout = signed ? DefaultLayout : AuthLayout;
  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};

```

## Loading

Agora vamos configurar o `loading` da autenticação.

Vamos editar o arquivo `src/store/modules/auth/reducer.js`, deixe-o assim:

```jsx
import produce from 'immer';

const INTIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};
export default function auth(state = INTIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;

        break;
      }
      case '@auth/SIGN_FAILURE': {
        draft.loading = false;
        break;
      }

      default:
        return state;
    }
  });
}
// src/store/modules/auth/reducer.js
```

Aqui fizemos um Switch báisoc pra alternar de acordo com a resposta da nossa action.

Temos que modificar também nosso saga de autenticação, edite o arquivo `src/store/modules/auth/sagas.js`, deixe-o dessa forma:

```jsx
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import history from '~/services/history';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!user.provider) {
      console.tron.error('Usuário não é provider');
      return;
    }
    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (error) {
    yield put(signFailure());
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
// src/store/modules/auth/sagas.js
```

Aqui nós colocamos um `try/catch` por volta da nossa chamada a `API`, se cai no erro importamos a action de `signFailure()` para executar ela.


Para que possamos utilizar a variavel de Loading que fica dentro do nosso Reducer de Autenticação, devemos importar o metodo `useSelector()`, e acessar nosso reducer de autenticação até nossa varivel `loading` qu foi declarada no nosso reducer.

ex:

```jsx
import { useSelector} from 'react-redux';

const loading = useSelector(state => state.auth.loading)
```
