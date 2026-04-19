import {
  DELETE_AUTH_USER_DATA,
  SAVE_AUTH_TOKEN,
  SAVE_AUTH_USER_DATA,
} from '../../action-types';

const INITIAL_STATE = {
  isAuthenticated: false,
  token: '',
  user: null,
};

export default (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case SAVE_AUTH_TOKEN:
      return {
        ...state,
        token: payload,
        // РАДИКАЛЬНОЕ ИСПРАВЛЕНИЕ: 
        // Если пришел токен (не пустой), значит пользователь залогинен.
        // Это восстановит вход сразу после краша, как только токен будет считан из кэша.
        isAuthenticated: !!payload, 
      };

    case SAVE_AUTH_USER_DATA:
      return {
        ...state,
        user: payload,
        // Если данные пользователя пришли, подтверждаем вход (на случай, если токена еще нет)
        isAuthenticated: true, 
      };

    case DELETE_AUTH_USER_DATA:
      // При выходе сбрасываем всё в начальное состояние
      return {
        ...state,
        token: '',
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};