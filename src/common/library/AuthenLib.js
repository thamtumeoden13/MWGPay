import MD5Digest from "./cryptography/MD5Digest.js";
import { GenRSAKey, encryptData, decryptData } from './cryptography/DotNetRSACrypto.js';
import { AUTHEN_HOSTNAME } from "@constants/systemVars.js";

export function GUID() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

export function ConvertStr(intNum) {
    if (intNum > 9)
        return intNum.toString();
    return "0" + intNum.toString();
}

export function createIV() {
    const d = new Date();
    const month = d.getMonth() + 1;

    const dateString = d.getFullYear().toString() + ConvertStr(d.getMonth() + 1)
        + ConvertStr(d.getDate()) + "." + ConvertStr(d.getHours()) + ConvertStr(d.getMinutes());
    return dateString;
}


export function CreateLoginData(username, password, deviceID, state) {
    const serverPublicKey = state.RegisterClientInfo[AUTHEN_HOSTNAME].ServerPublicKey;
    //console.log("Middleware strServerPublicKey:", strServerPublicKey);
    //const username = action.Username;
    //const password =  action.Password;
    //console.log("Middleware username:", username);
    //console.log("action:", action);
    //console.log("state:", state);

    //const passowrdMD5 = MD5Digest(password);
    const passowrdMD5 = password;//MD5Digest(password);
    //console.log("password:", password);
    //console.log("passowrdMD5:", passowrdMD5);
    const loginData = username + "|" + passowrdMD5 + "|" + deviceID + "|2|";
    const encryptLoginData = encryptData(serverPublicKey, 1024, loginData);
    return encryptLoginData;
    //const sendData = {ClientID: this.state.ClientID, LoginData: encryptLoginData};
}


export function CreateAuthenData(hostname, state) {
    //console.log("CreateAuthenData hostname:", hostname);
    //console.log("CreateAuthenData state:", state);
    const serverPublicKey = state.RegisterClientInfo[hostname].ServerPublicKey;
    const tokenString = state.LoginInfo.TokenString;
    const authenData = tokenString + "|" + createIV();
    const encryptAuthenData = encryptData(serverPublicKey, 1024, authenData);
    return encryptAuthenData;
}

export function CheckIsRegisterClient(registerClientInfo) {

    // console.log("CheckIsRegisterClient: ", registerClientInfo);
    if (typeof registerClientInfo == "undefined")
        return false;
    if (registerClientInfo.ServerPublicKey == null)
        return false;

    if (registerClientInfo.ServerPublicKey.length == 0)
        return false;
    return registerClientInfo.IsRegisterClientSuccess;

}