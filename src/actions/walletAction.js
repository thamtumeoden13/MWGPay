import { WALLET_UPDATE_ACCOUNT_BALANCE } from "@constants/actionTypes";
export function updateAccountBalance(currentAccountBalance) {
    //   console.log(PAGE_UPDATEPATH);
    return {
        type: WALLET_UPDATE_ACCOUNT_BALANCE,
        CurrentAccountBalance: currentAccountBalance
    };
}

import { WALLET_UPDATE_ACCOUNT_INFO } from "@constants/actionTypes";
export function updateEWalletInfo(eWalletInfo) {
    return {
        type: WALLET_UPDATE_ACCOUNT_INFO,
        eWalletInfo: eWalletInfo
    };
}

import { UPDATE_STATUS_MODAL_LOADING } from "@constants/actionTypes";
export function updateModalLoading(isLoading) {
    return {
        type: UPDATE_STATUS_MODAL_LOADING,
        isLoading: isLoading
    };
}