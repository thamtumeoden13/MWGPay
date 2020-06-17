import { GET_CACHE_REQUEST, GET_CACHE_SUCCESS, GET_CACHE_FAILURE, GET_CACHE_FROM_LOCAL } from "@constants/actionTypes";
import { CACHE_HOSTNAME, API_HOST_LIST, CACHE_OBJECT_STORENAME } from "@constants/systemVars.js";
import { callFetchAPI } from "./fetchAPIAction";
import AsyncStorage from '@react-native-community/async-storage';

export function getCacheRequest(cacheKeyID) {
    //  console.log(GET_CACHE_REQUEST);
    return {
        type: GET_CACHE_REQUEST,
        CacheKeyID: cacheKeyID
    };
}

export function getCacheSuccess(resultObject, resultMessage) {
    //  console.log(GET_CACHE_SUCCESS, resultObect);
    //console.log(FETCH_API_SUCCESS);
    return {
        type: GET_CACHE_SUCCESS,
        IsGetCacheError: false,
        ResultMessage: resultMessage,
        ResultObject: resultObject
    };
}

export function getCacheFromCache(resultObject) {
    //console.log(GET_CACHE_FROM_LOCAL, resultObject);
    //console.log(FETCH_API_SUCCESS);
    return {
        type: GET_CACHE_FROM_LOCAL,
        IsGetCacheError: false,
        ResultMessage: "Load cache from local OK",
        ResultObject: resultObject
    };
}


export function getCacheFailure(errorStatus, resultMessage) {
    // console.log(GET_CACHE_FAILURE,resultMessage);
    return {
        type: GET_CACHE_FAILURE,
        ErrorStatus: errorStatus,
        ResultMessage: resultMessage
    };
}



export function callGetCache(cacheKeyID) {
    return (dispatch, getState) => {
        const state = getState();
        const userName = state.LoginInfo.LoginUserInfo.UserName;

        return new Promise((resolve, reject) => {
            if (state.GetCacheInfo.IsGetCacheRequest) {
                resolve({
                    IsError: true,
                    StatusID: 100,
                    Message: "Đang gọi cache"
                });
            }

            const localCacheData = AsyncStorage.getItem(cacheKeyID)
            //console.log("callGetCache cacheKeyID :", cacheKeyID, localCacheData);
            if (localCacheData != null) {
                dispatch(getCacheFromCache(localCacheData));
                resolve({
                    IsError: false,
                    StatusID: 0,
                    Message: "Load register client from DB OK!",
                    ResultObject: localCacheData
                });
            }
            else {
                resolve(dispatch(callGetCacheFromServer(cacheKeyID)));
            }
        });
    }


}


export function callGetCacheFromServer(cacheKeyID) {
    return (dispatch, getState) => {
        const state = getState();
        const userName = state.LoginInfo.LoginUserInfo.UserName;

        if (state.GetCacheInfo.IsGetCacheRequest) {
            return {
                IsError: true,
                StatusID: 100,
                Message: "Đang gọi cache"
            };
        }

        const apiPath = "api/Cache/Get";
        const postData = {
            CacheKeyID: cacheKeyID,
            UserName: userName,
            AdditionParamList: []
        };
        return dispatch(callFetchAPI(CACHE_HOSTNAME, apiPath, postData)).then((apiResult) => {
            if (!apiResult.IsError) {

                AsyncStorage.setItem(cacheKeyID, JSON.stringify(apiResult.ResultObject));
            }
            return {
                IsError: apiResult.IsError,
                StatusID: apiResult.StatusID,
                Message: apiResult.Message,
                MessageDetail: apiResult.MessageDetail,
                ResultObject: apiResult.ResultObject
            };

        });
    }

}


