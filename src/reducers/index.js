import { combineReducers } from 'redux';
import {
  REGISTER_CLIENT_REQUEST, REGISTER_CLIENT_SUCCESS, REGISTER_CLIENT_FAILURE,
  REGISTER_CLIENT_LOAD_FROM_LOCAL,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, UPDATE_USERINFO,
  FETCH_API_REQUEST, FETCH_API_SUCCESS, FETCH_API_FAILURE,
  CHECK_PERMISSION_SUCCESS,
  GET_CACHE_REQUEST, GET_CACHE_SUCCESS, GET_CACHE_FAILURE, GET_CACHE_FROM_LOCAL,
  PAGE_UPDATEPATH, SHOW_MODAL, HIDE_MODAL,
  WALLET_UPDATE_ACCOUNT_BALANCE,
  WALLET_UPDATE_ACCOUNT_INFO,
  UPDATE_STATUS_MODAL_LOADING
} from "@constants/actionTypes";

const initialLoginInfoState = {
  IsLoginRequest: false,
  IsLoginCompleted: false,
  IsLoginSuccess: false,
  IsLoginError: false,
  Username: "",
  Password: ""
};


const initialRegisterClientInfoState = {
  AuthenAPI:
  {
    IsRegisterClientRequest: false,
    ClientID: '',
    ClientPublicKey: '',
    ClientPrivateKey: ''
  }
};

const initialFetchAPIInfoState = {
  IsFetchAPIRequest: false,
  IsFetchAPICompleted: false,
  IsFetchAPISuccess: false,
  Hostname: "",
  HostURL: "",
  PostData: {},
  ResultMessage: "",
  ResultObject: {}

};

const initialGetCacheInfoState = {
  IsGetCacheRequest: false,
  IsGetCacheCompleted: false,
  IsGetCacheError: false,
  CacheKeyID: "",
  ResultMessage: "",
  ResultObject: {}

};




const initialPageInfoState = {
  PagePath: []
};

const initialModal = {
  type: null,
  props: {}
};

const initialAccountBalanceState = {
  CurrentAccountBalance: 0
};

const initialEWalletInfo = {
  EWalletInfo: {}
};

const initialModalLoading = {
  isLoading: true
};

function registerClientInfo(state = initialRegisterClientInfoState, action) {
  switch (action.type) {
    case REGISTER_CLIENT_REQUEST:

      const clientInfo1 = Object.assign({}, state[action.Hostname],
        {
          IsRegisterClientRequest: true,
          IsRegisterClientCompleted: false,
          IsRegisterClientSuccess: false,
          IsRegisterClientError: false,

          ClientID: action.ClientID,
          ClientPublicKey: action.ClientPublicKey,
          ClientPrivateKey: action.ClientPrivateKey
        });
      return Object.assign({}, state, {
        [action.Hostname]: clientInfo1
      });

    case REGISTER_CLIENT_SUCCESS:
      const clientInfo2 = Object.assign({}, state[action.Hostname],
        {
          IsRegisterClientRequest: false,
          IsRegisterClientCompleted: true,
          IsRegisterClientSuccess: true,
          IsRegisterClientError: false,
          ServerPublicKey: action.ServerPublicKey
        });
      return Object.assign({}, state, {
        [action.Hostname]: clientInfo2
      });

    case REGISTER_CLIENT_FAILURE:
      const clientInfo3 = Object.assign({}, state[action.Hostname],
        {
          IsRegisterClientRequest: false,
          IsRegisterClientCompleted: true,
          IsRegisterClientSuccess: false,
          IsRegisterClientError: true,
          ErrorMessage: action.ErrorMessage
        });

      return Object.assign({}, state, {
        [action.Hostname]: clientInfo3
      });

    case REGISTER_CLIENT_LOAD_FROM_LOCAL:

      const clientInfo4 = Object.assign({}, state[action.Hostname],
        {
          IsRegisterClientRequest: action.ClientInfo.IsRegisterClientRequest,
          IsRegisterClientCompleted: action.ClientInfo.IsRegisterClientCompleted,
          IsRegisterClientSuccess: action.ClientInfo.IsRegisterClientSuccess,
          IsRegisterClientError: action.ClientInfo.IsRegisterClientError,

          ClientID: action.ClientInfo.ClientID,
          ClientPublicKey: action.ClientInfo.ClientPublicKey,
          ClientPrivateKey: action.ClientInfo.ClientPrivateKey,
          ServerPublicKey: action.ClientInfo.ServerPublicKey

        });
      return Object.assign({}, state, {
        [action.Hostname]: clientInfo4
      });

    default:
      return state;

  }
}

function loginInfo(state = initialLoginInfoState, action) {
  switch (action.type) {
    case LOGIN_REQUEST: return Object.assign({}, state, {
      IsLoginRequest: true,
      IsLoginSuccess: false,
      IsLoginCompleted: false,
      IsLoginError: false,
      Username: action.Username,
      Password: action.Password
    });
    case LOGIN_SUCCESS: return Object.assign({}, state, {
      IsLoginRequest: false,
      IsLoginCompleted: true,
      IsLoginSuccess: true,
      IsLoginError: false,
      LoginUserInfo: action.LoginUserInfo,
      TokenString: action.TokenString,
      PhoneNumber: action.LoginUserInfo.PhoneNumber,
      Password: action.Password
    });

    case LOGIN_FAILURE: return Object.assign({}, state, {
      IsLoginRequest: false,
      IsLoginCompleted: true,
      IsLoginSuccess: false,
      IsLoginError: true,
      ErrorMessage: action.ErrorMessage
    });

    case LOGOUT: return Object.assign({}, state, {
      IsLoginSuccess: false,
      IsLogout: true,
      LoginUserInfo: {},
      TokenString: ""
    });

    case UPDATE_USERINFO: return Object.assign({}, state, {
      LoginUserInfo: action.UserInfo
    });

    default:
      return state;

  }
}

function fetchAPIInfo(state = initialFetchAPIInfoState, action) {
  switch (action.type) {
    case FETCH_API_REQUEST: return Object.assign({}, state, {
      IsFetchAPIRequest: true,
      IsFetchAPICompleted: false,
      IsFetchAPISuccess: false,
      IsFetchAPIError: false,
      Hostname: action.Hostname,
      HostURL: action.HostURL,
      PostData: action.PostData
    });
    case FETCH_API_SUCCESS: return Object.assign({}, state, {
      IsFetchAPIRequest: false,
      IsFetchAPICompleted: true,
      IsFetchAPISuccess: true,
      IsFetchAPIError: false,
      ResultMessage: action.ResultMessage,
      ResultObject: action.ResultObject
    });

    case FETCH_API_FAILURE: return Object.assign({}, state, {
      IsFetchAPIRequest: false,
      IsFetchAPICompleted: true,
      IsFetchAPISuccess: false,
      IsFetchAPIError: true,
      ErrorStatus: action.ErrorStatus,
      ResultMessage: action.ResultMessage
    });
    case CHECK_PERMISSION_SUCCESS: return Object.assign({}, state, {
      IsFetchAPIRequest: false,
      IsFetchAPICompleted: true,
      IsFetchAPISuccess: false,
      IsFetchAPIError: true,
      ErrorStatus: action.ErrorStatus,
      ResultMessage: action.ResultMessage
    });

    default:
      return state;

  }
}

function getCacheInfo(state = initialGetCacheInfoState, action) {
  switch (action.type) {
    case GET_CACHE_REQUEST: return Object.assign({}, state, {
      IsGetCacheRequest: true,
      IsGetCacheCompleted: false,
      IsGetCacheError: false,
      CacheKeyID: action.CacheKeyID
    });
    case GET_CACHE_SUCCESS: return Object.assign({}, state, {
      IsGetCacheRequest: false,
      IsGetCacheCompleted: true,
      IsGetCacheError: false,
      ResultMessage: action.ResultMessage,
      ResultObject: action.ResultObject
    });

    case GET_CACHE_FAILURE: return Object.assign({}, state, {
      IsGetCacheRequest: false,
      IsGetCacheCompleted: true,
      IsGetCacheError: true,
      ErrorStatus: action.ErrorStatus,
      ResultMessage: action.ResultMessage
    });

    case GET_CACHE_FROM_LOCAL: return Object.assign({}, state, {
      IsGetCacheRequest: false,
      IsGetCacheCompleted: true,
      IsGetCacheError: false,
      ResultMessage: action.ResultMessage,
      ResultObject: action.ResultObject
    });



    default:
      return state;

  }
}



function accountBalance(state = initialAccountBalanceState, action) {
  switch (action.type) {
    case WALLET_UPDATE_ACCOUNT_BALANCE: return Object.assign({}, state, { CurrentAccountBalance: action.CurrentAccountBalance });

    default:
      return state;

  }
}


function eWalletInfo(state = initialEWalletInfo, action) {
  switch (action.type) {
    case WALLET_UPDATE_ACCOUNT_INFO:
      return Object.assign({}, state, { EWalletInfo: action.eWalletInfo });

    default:
      return state;

  }
}


function modalLoading(state = initialModalLoading, action) {
  switch (action.type) {
    case UPDATE_STATUS_MODAL_LOADING: return Object.assign({}, state, { isLoading: action.isLoading });

    default:
      return state;

  }
}


const authenticationReducer = combineReducers({
  RegisterClientInfo: registerClientInfo,
  LoginInfo: loginInfo,
  FetchAPIInfo: fetchAPIInfo,
  GetCacheInfo: getCacheInfo,
  AccountBalance: accountBalance,
  EWalletInfo: eWalletInfo,
  ModalLoading: modalLoading,
});
export default authenticationReducer;