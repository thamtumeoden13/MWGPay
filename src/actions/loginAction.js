import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, UPDATE_USERINFO } from "@constants/actionTypes";
import { AUTHEN_HOSTNAME, AUTHEN_HOST_BASEURL, CLIENT_INFO_OBJECT_STORENAME } from "@constants/systemVars.js";
import WebRequest from "@common/library/net/WebRequest.js";
import { GenRSAKey, encryptData, decryptData } from '@common/library/cryptography/DotNetRSACrypto.js';
//import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { callRegisterClient } from "./registerClient";

import { CreateLoginData, CheckIsRegisterClient } from "@common/library/AuthenLib.js";
import AsyncStorage from '@react-native-community/async-storage';
// import SyncStorage from 'sync-storage';
import { getNetInfo } from '@common/library/NetInfo'

export function loginRequest(username, password) {
    //  console.log(LOGIN_REQUEST);
    return {
        type: LOGIN_REQUEST,
        Username: username,
        Password: password
    };
}

export function loginSuccess(loginUserInfo, tokenString, password) {
    //console.log(LOGIN_SUCCESS, loginUserInfo);
    return {
        type: LOGIN_SUCCESS,
        IsLoginSuccess: true,
        LoginUserInfo: loginUserInfo,
        TokenString: tokenString,
        Password: password
    };
}


export function loginFailure(errorMessage) {
    //  console.log(LOGIN_FAILURE);
    return {
        type: LOGIN_FAILURE,
        ErrorMessage: errorMessage
    };
}

export function logout() {
    //  console.log(LOGOUT);
    return {
        type: LOGOUT
    };
}

export function updateUserInfo(userInfo) {
    //  console.log(LOGOUT);
    return {
        type: UPDATE_USERINFO,
        UserInfo: userInfo
    };
}



/*export function callLogin(username,password)
{
    return (dispatch, getState) => {

        const state = getState();
        console.log("callLogin:", state); 
        return username;

      }
}*/



export function callLogin(username, password, deviceID) {
    //console.log("callLogin action:", username, password);
    return (dispatch, getState) => {
        const state = getState();
        //console.log("state LoginInfo:", username, password);
        if (state.LoginInfo.IsLoginSuccess || state.LoginInfo.IsLoginRequest)
            return;
        if (!CheckIsRegisterClient(state.RegisterClientInfo[AUTHEN_HOSTNAME])) {
            return dispatch(callRegisterClient(AUTHEN_HOSTNAME, username, password)).then((registerResult) => {
                if (!registerResult.IsError) {

                    return dispatch(callLoginAPI(username, password, deviceID));
                }
                else {
                    return {
                        IsError: true,
                        StatusID: 100,
                        Message: registerResult.Message
                    };
                }
            }

            );
        }
        else {
            return dispatch(callLoginAPI(username, password, deviceID)).then(async (apiResult) => {
                if (apiResult.StatusID == 7) {

                    // SyncStorage.remove(AUTHEN_HOSTNAME);
                    await AsyncStorage.removeItem(AUTHEN_HOSTNAME);


                    return dispatch(callRegisterClient(AUTHEN_HOSTNAME, username, password)).then((registerResult) => {
                        if (!registerResult.IsError) {

                            return dispatch(callLoginAPI(username, password, deviceID));
                        }
                        else {
                            return {
                                IsError: true,
                                StatusID: 100,
                                Message: registerResult.Message
                            };
                        }
                    });

                }
                else {
                    return apiResult;
                    //return dispatch(callLoginAPI(username, password));
                    //dispatch(loginSuccess(apiResult.ResultObject.LoginUserInfo, plainTokenString, password));
                }
            });
        }
    }
}


export function callLoginAPI(username, password, deviceID) {
    return async (dispatch, getState) => {
        const state = getState();

        const clientID = state.RegisterClientInfo[AUTHEN_HOSTNAME].ClientID;
        const clientPrivateKey = state.RegisterClientInfo[AUTHEN_HOSTNAME].ClientPrivateKey;
        //   console.log("callLogin:", state); 
        dispatch(loginRequest(username, password));
        const loginData = CreateLoginData(username, password, deviceID, state);
        //console.log("callLogin loginData:", loginData); 
        const sendData = { ClientID: clientID, LoginData: loginData };
        const url = AUTHEN_HOST_BASEURL + "api/Authentication/Authenticate";

        const netInfo = await getNetInfo();
        //console.log("netInfo2", netInfo)
        if (netInfo.status == true) {
            return WebRequest.postData(url, sendData).then((apiResult) => {
                if (apiResult) {
                    if (!apiResult.IsError) {
                        //console.log("Login OK:");
                        //console.log(apiResult); 
                        const encryptedTokenString = apiResult.ResultObject.TokenString;
                        //console.log(encryptedServerPublicKey);

                        const plainTokenString = decryptData(clientPrivateKey, 1024, encryptedTokenString);
                        //this.props.addLoginSuccess(apiResult.ResultObject.LoginUserInfo, plainTokenString);
                        // console.log("callLogin apiResult:", apiResult); 
                        dispatch(loginSuccess(apiResult.ResultObject.LoginUserInfo, plainTokenString, password));
                        //console.log(plainTokenString);

                        //this.testCallServices();
                        //this.setState({IsLoginOK: true});
                        const userInfo = {
                            defaultPictureURL: apiResult.ResultObject.LoginUserInfo.DefaultPictureURL,
                            fullName: apiResult.ResultObject.LoginUserInfo.FullName,
                            userName: apiResult.ResultObject.LoginUserInfo.UserName,
                            hasSignIn: true
                        }
                        AsyncStorage.setItem("UserInfo", JSON.stringify(userInfo));

                        // console.log("callLogin apiResult:", apiResult.ResultObject.LoginUserInfo);

                        return {
                            IsError: false,
                            StatusID: apiResult.StatusID,
                            Message: "",
                            DefaultAccountTotalAmount: 0
                        };

                    }
                    else {
                        //console.log(apiResult.Message);
                        dispatch(loginFailure(apiResult.Message));
                        return {
                            IsError: true,
                            StatusID: apiResult.StatusID,
                            Message: apiResult.Message
                        };
                    }
                }
                else {
                    dispatch(loginFailure("Lỗi đăng nhập: không kết nối được với máy chủ"));
                    return {
                        IsError: true,
                        StatusID: 100,
                        Message: "Lỗi đăng nhập: không kết nối được với máy chủ"
                    };
                }


            }

            ).catch((err) => {
                // console.error(err);
                dispatch(loginFailure("Lỗi đăng nhập: không kết nối được với máy chủ"));
                return {
                    IsError: true,
                    StatusID: 100,
                    Message: "Lỗi đăng nhập: không kết nối được với máy chủ"
                };

            });
        }
        else {
            // console.log({ netInfo });
            dispatch(registerClientFailure(hostname, netInfo.messageDetail));
            return {
                IsError: true,
                Message: netInfo.message,
                MessageDetail: netInfo.messageDetail
            };
        }

    };
}
