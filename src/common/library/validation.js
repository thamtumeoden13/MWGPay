export function ValidationField(typelist, fieldValue, fieldCaption) {
    let IsEr = 0;
    let result;
    if (typelist.includes("required") && IsEr == 0) {
        if (fieldValue == undefined || fieldValue.length == 0) {
            IsEr = 1;
            result = {
                IsError: true,
                fieldValue: fieldValue,
                Message: "Vui lòng nhập " + fieldCaption.toLowerCase()
            }
        }
        else {
            IsEr = 0;
            result = {
                IsError: false,
                fieldValue: fieldValue,
                Message: ""
            }
        }
    }

    if (typelist.includes("number") && IsEr == 0) {
        if (/^[1-9][0-9]*$/.test(fieldValue)) {
            IsEr = 0;
            result = {
                IsError: false,
                fieldValue: fieldValue,
                Message: ""
            }
        }
        else {
            IsEr = 1;
            result = {
                IsError: true,
                fieldValue: fieldValue,
                Message: "Vui lòng nhập số "
            }

        }
    }
    /*kiểm tra ký tự đặc biệt */
    if (typelist.includes("special") && IsEr == 0) {

        regEx = fieldValue.replace(/[`~!@#$%^&*_|+\-=?;:",.<>\{\}\[\]\\\/]/g, "");
        result = {
            IsError: true,
            fieldValue: fieldValue,
            Message: "Vui lòng nhập không nhập kí tự đặt biệt"
        }
    }

    /*Chỉ viết Hoa*/
    if (typelist.includes("toUpperCase") && IsEr == 0) {
        fieldValue = fieldValue.replace(/[`~!@#$%^&*_|+\-=?;:",.<>\{\}\[\]\\\/]/g, "");
        fieldValue.toUpperCase();
        result = {
            IsError: false,
            fieldValue: fieldValue,
            Message: ""
        }
    }
    /*Viết hoa kí tự đầu của string*/
    if (typelist.includes("capitalize") && IsEr == 0) {
        fieldValue.capitalize();
        IsEr = 0;
        result = {
            IsError: false,
            fieldValue: fieldValue,
            Message: ""
        }
    }

    /*Viết hoa kí tự đầu của string*/
    if (typelist.includes("capitalize") && IsEr == 0) {
        fieldValue.capitalize();
        IsEr = 0;
        result = {
            IsError: false,
            fieldValue: fieldValue,
            Message: ""
        }
    }


    if (typelist.includes("Email") && IsEr == 0) {
        var regEx = new RegExp(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
        if (fieldValue.length > 0) {
            if (regEx.test(fieldValue.trim())) {
                IsEr = 0;
                result = {
                    IsError: false,
                    fieldValue: fieldValue,
                    Message: ""
                }
            }
            else {
                IsEr = 1;
                result = {
                    IsError: true,
                    fieldValue: fieldValue,
                    Message: "Vui lòng nhập email đúng định dạng như (@gmail.com ,@yahoo.com,@abc.vn...... )."
                }
            }
        }
    }


    if (typelist.includes("phone") && IsEr == 0) {
        const arrayPrefixMobileNumber = new Array("0120", "0121", "0122", "0123", "0124", "0125", "0126", "0127", "0128", "0129", "0160", "0161", "0162", "0163", "0164", "0165", "0166", "0167", "0168", "0169", "0186", "0188", "0199", "08", "083", "086", "0868", "088", "089", "090", "091", "092", "093", "094", "095", "096", "097", "098", "099");
        const arrayPrefixNumber = new Array("0200", "0201", "0202", "0203", "0204", "0205", "0206", "0207", "0208", "0209", "0210", "0211", "0212", "0213", "0214", "0215", "0216", "0217", "0218", "0219", "0220", "0221", "0222", "0223", "0224", "0225", "0226", "0227", "0228", "0229", "0230", "0231", "0232", "0233", "0234", "0235", "0236", "0237", "0238", "0239", "0240", "0241", "0242", "0243", "0244", "0245", "0246", "0247", "0248", "0249", "0250", "0251", "0252", "0253", "0254", "0255", "0256", "0257", "0258", "0259", "0260", "0261", "0262", "0263", "0264", "0265", "0266", "0267", "0268", "0269", "0270", "0271", "0272", "0273", "0274", "0275", "0276", "0277", "0278", "0279", "0280", "0281", "0282", "0283", "0284", "0285", "0286", "0287", "0288", "0289", "0290", "0291", "0292", "0293", "0294", "0295", "0296", "0297", "0298", "0299");
        fieldValue = fieldValue.replace(/-/g, '');
        const regEx = new RegExp(/^ *[0-9]+ *$/);
        if (fieldValue.length > 0) {
            if ((fieldValue.trim().length == 10 || fieldValue.trim().length == 11) && regEx.test(fieldValue.trim())) {
                const strPrefixNumber = strNumber.replace('-', '');
                let flagPrefix = false;
                let flagNumber = false;

                for (var j = 0; j < arrayPrefixNumber.length; j++) {
                    if (strPrefixNumber.startsWith(arrayPrefixNumber[j])) {
                        flagPrefix = true;
                    }
                    if (strPrefixNumber.startsWith(arrayPrefixNumber[j]) && strNumber.trim().length == 11) {
                        flagNumber = true;
                    }
                }
                for (var j = 0; j < arrayPrefixMobileNumber.length; j++) {
                    if (strPrefixNumber.startsWith(arrayPrefixMobileNumber[j])) {
                        flagPrefix = true;
                    }
                    if ((strPrefixNumber.startsWith(arrayPrefixMobileNumber[j]) && strNumber.trim().length == 10 && arrayPrefixMobileNumber[j].length == 3) || (strPrefixNumber.startsWith(arrayPrefixMobileNumber[j]) && strNumber.trim().length == 11 && arrayPrefixMobileNumber[j].length == 4)) {
                        flagNumber = true;
                    }
                }

                if (!flagPrefix) {
                    IsEr = 1;
                    result = {
                        IsError: true,
                        fieldValue: fieldValue,
                        Message: "Đầu số điện thoại không đúng. )."
                    }
                }
                else if (!flagNumber) {
                    IsEr = 1;
                    result = {
                        IsError: true,
                        fieldValue: fieldValue,
                        Message: "Đầu số điện thoại không đúng. )."
                    }
                }
                else {
                    IsEr = 0;
                    result = {
                        IsError: false,
                        fieldValue: fieldValue,
                        Message: ""
                    }
                }

            }
            else {
                IsEr = 1;
                result = {
                    IsError: true,
                    fieldValue: fieldValue,
                    Message: "Điện thoại không đúng định dạng (10 hoặc 11 số)."
                }
            }
        }
        else {
            IsEr = 0;
            result = {
                IsError: false,
                fieldValue: fieldValue,
                Message: ""
            }
        }
    }
    return result;
}