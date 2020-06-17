export function getAPIMessageFromReduxState(reduxState, isClickSubmit) {
    const isFetchAPICompleted = reduxState.FetchAPIInfo.IsFetchAPICompleted;
    const isFetchAPIError = reduxState.FetchAPIInfo.IsFetchAPIError;
    //console.log("reduxState:", reduxState);


    if (isClickSubmit && isFetchAPICompleted) {
        return {
            ResultMessage: reduxState.FetchAPIInfo.ResultMessage,
            IsError: isFetchAPIError
        };
    }

    return {
        ResultMessage: "",
        IsError: false
    };

}

export function getRegisterClientResultFromReduxState(hostname, reduxState) {
    const isRegisterClientSuccess = reduxState.RegisterClientInfo[hostname].IsRegisterClientSuccess;
    const isRegisterClientCompleted = reduxState.RegisterClientInfo[hostname].IsRegisterClientCompleted;
    const isRegisterClientError = reduxState.RegisterClientInfo[hostname].IsRegisterClientError;


    if (isRegisterClientCompleted) {
        return {
            IsRegisterClientCompleted: true,
            IsRegisterClientSuccess: isRegisterClientSuccess,
            ErrprMessage: reduxState.RegisterClientInfo[hostname].ErrorMessage,
            IsError: isRegisterClientError
        };
    }

    return {
        IsRegisterClientCompleted: false,
        IsRegisterClientSuccess: false,
        ErrprMessage: "",
        IsError: false
    };

}

export function ConvertStr(intNum) {
    if (intNum > 9)
        return intNum.toString();
    return "0" + intNum.toString();
}

export function formatDate(dateString, notGetTime) {
    if (dateString) {
        try {
            const d = new Date(Date.parse(dateString));
            let dateStringFormated = ConvertStr(d.getDate()) + "/" + ConvertStr(d.getMonth() + 1) + "/" + d.getFullYear().toString()
            if (!notGetTime)
                dateStringFormated += " " + ConvertStr(d.getHours()) + ":" + ConvertStr(d.getMinutes());
            return dateStringFormated;
        } catch (error) {
            return dateString;
        }
    }
    return dateString;
}
export function setCookie(cname, cvalue, exminute) {
    var d = new Date();
    d.setTime(d.getTime() + (exminute * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
export function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}