import { all } from 'redux-saga/effects';

// necessário importar todos os sagas dos modules.
import auth from './auth/sagas';
import user from './user/sagas';

export default function* rootSaga() {
  return yield all([auth, user]);
}
