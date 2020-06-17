import {
    REGISTER_CLIENT_REQUEST, REGISTER_CLIENT_SUCCESS, REGISTER_CLIENT_FAILURE,
    REGISTER_CLIENT_LOAD_FROM_LOCAL
} from "@constants/actionTypes";
import { AUTHEN_HOSTNAME, AUTHEN_HOST_BASEURL, API_HOST_LIST, CLIENT_INFO_OBJECT_STORENAME } from "@constants/systemVars.js";



import WebRequest from "@common/library/net/WebRequest.js";
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { GenRSAKey, encryptData, decryptData } from '@common/library/cryptography/DotNetRSACrypto.js';
import { GUID, CreateLoginData } from "@common/library/AuthenLib.js";
import AsyncStorage from '@react-native-community/async-storage';
import { getNetInfo } from '@common/library/NetInfo'

export function registerClientLoadFromLocal(hostname, clientInfo) {
    // console.log(REGISTER_CLIENT_LOAD_FROM_LOCAL, clientInfo);
    return {
        type: REGISTER_CLIENT_LOAD_FROM_LOCAL,
        Hostname: hostname,
        ClientInfo: clientInfo
    };
}



export function registerClientRequest(hostname, ClientID, ClientPublicKey, ClientPrivateKey) {
    // console.log(REGISTER_CLIENT_REQUEST);
    return {
        type: REGISTER_CLIENT_REQUEST,
        Hostname: hostname,
        ClientID: ClientID,
        ClientPublicKey: ClientPublicKey,
        ClientPrivateKey: ClientPrivateKey
    };
}

export function registerClientSuccess(hostname, serverPublicKey) {
    //console.log(REGISTER_CLIENT_SUCCESS);
    return {
        type: REGISTER_CLIENT_SUCCESS,
        Hostname: hostname,
        ServerPublicKey: serverPublicKey
    };
}


export function registerClientFailure(hostname, errorMessage) {
    //console.log(REGISTER_CLIENT_FAILURE);
    return {
        type: REGISTER_CLIENT_FAILURE,
        Hostname: hostname,
        ErrorMessage: errorMessage
    };
}

export function callRegisterClient(hostname, username, password) {
    return (dispatch, getState) => {

        return new Promise(async (resolve, reject) => {
            const result = await AsyncStorage.getItem(hostname)
            // console.log("result", result);
            if (result != null) {
                //console.log("result1", result);
                dispatch(registerClientLoadFromLocal(hostname, result));
                resolve({
                    IsError: false,
                    Message: "Load register client from DB OK!"
                });
            }
            else {
                //console.log("result2", result);
                resolve(dispatch(callRegisterClientFromServer(hostname, username, password)));
            }
        }
        );


    };

}

export function callRegisterClientFromServer(hostname, username, password) {

    return async (dispatch, getState) => {

        /* getData(hostname).then((result) => 
             {
                 if(result !=null)
                 {
                     dispatch(registerClientLoadFromLocal(hostname,result));
                     return {
                         IsError: false,
                         Message: "Load register client from DB OK!"
                     };
                 }    
             }

         );*/

        const key = GenRSAKey(1024);
        const clientID = GUID();
        dispatch(registerClientRequest(hostname, clientID, key.PublicKey, key.PrivateKey));
        const sendData = {
            ClientID: clientID,
            PhoneNumber: username,
            Password: password,
            ClientPublicKey: key.PublicKey
        };
        //console.log({ sendData });

        //const receiveData = WebRequest.postData("http://localhost:62152/api/RegisterClient/", sendData);

        const url = API_HOST_LIST[hostname].HostBaseURL + "api/RegisterClient/Register";
        const netInfo = await getNetInfo();
        // console.log("netInfo1", netInfo)
        if (netInfo.status == true) {
            return WebRequest.postData(url, sendData).then((apiResult) => {
                //console.log("WebRequest", apiResult, url);
                if (apiResult) {
                    if (apiResult.StatusID == 0) {
                        const encryptedServerPublicKey = apiResult.ResultObject.ServerPublicKey;
                        //console.log("encryptedServerPublicKey:", encryptedServerPublicKey);
                        const plainServerPublicKey = decryptData(key.PrivateKey, 1024, encryptedServerPublicKey);
                        //console.log("plainServerPublicKey:", plainServerPublicKey);

                        const saveRegisterClientData = {
                            IsRegisterClientRequest: false,
                            IsRegisterClientCompleted: true,
                            IsRegisterClientSuccess: true,
                            IsRegisterClientError: false,
                            ClientID: clientID,
                            ClientPublicKey: key.PublicKey,
                            ClientPrivateKey: key.PrivateKey,
                            ServerPublicKey: plainServerPublicKey
                        };
                        /*const db = new indexedDBLib(CLIENT_INFO_OBJECT_STORENAME); 
                        db.set(hostname, saveRegisterClientData).catch((error) =>
                        {
                            //console.log("callRegisterClientFromServer:", error);
                        }
         
                        );*/
                        AsyncStorage.setItem(hostname, JSON.stringify(saveRegisterClientData));
                        dispatch(registerClientSuccess(hostname, plainServerPublicKey));



                        //   console.log("after dispatch(registerClientSuccess)");
                        //this.callLogin(username,password);
                        //console.log("apiResult.Message 1", apiResult);
                        return {
                            IsError: false,
                            Message: apiResult.Message
                        };
                    }
                    else {
                        //console.log("apiResult.Message", apiResult);
                        dispatch(registerClientFailure(hostname, apiResult.Message));
                        return {
                            IsError: true,
                            Message: apiResult.Message
                        };

                    }
                }
                else {
                    // console.log("apiResult.Message", apiResult);
                    dispatch(registerClientFailure(hostname, "Lỗi đăng ký client: không kết nối được với máy chủ "));
                    return {
                        IsError: true,
                        Message: "Lỗi đăng ký client: không kết nối được với máy chủ "
                    };

                }

            }

            ).catch((err) => {
                //console.log(err);
                // dispatch(registerClientFailure(hostname, "Lỗi đăng ký client: không kết nối được với máy chủ"));
                return {
                    IsError: true,
                    Message: "Lỗi đăng ký client: không kết nối được với máy chủ 1"
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

