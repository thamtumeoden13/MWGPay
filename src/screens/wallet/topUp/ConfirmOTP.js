import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { OTPComponent } from '@components/otp'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

import { connect } from 'react-redux';
import { callFetchAPI, callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

class ConfirmOTPCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            transactionID: '',
            isLoading: false,
            errors: '',
            phoneNumber: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {
        const transactionID = this.props.navigation.getParam('transactionID', '');
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        this.setState({
            transactionID,
            phoneNumber
        })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false })
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
                }, timeout);
            }, 500);
        });
        this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
            clearInterval(this.interval);
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.didBlurListener.remove();
        clearInterval(this.interval);
    }

    appSettingData = async () => {
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        return appSetting.timeout
    }

    reSendOTP = (phoneNumber) => {
        //console.log("reSendOTP")
    }

    changeErrors = () => {
        this.setState({ errors: '' })
    }

    onConfirmOTP = (OTP) => {
        let { transactionID } = this.state
        this.setState({
            isLoading: true
        })
        if (OTP && OTP.length > 0) {
            const signature = createSignature(transactionID + OTP);
            const walletRegOTP = {
                TransactionID: transactionID,
                OTP: OTP,
                Signature: signature,
            };
            this.verifyOTP(walletRegOTP);
        }
        else {
            let errors = '';
            if (OTP.length <= 0) {
                errors = "Vui lòng nhập mã OTP";
            }
            this.setState({
                errors
            })
            this.asyncModalLoading();
        }
    }

    verifyOTP = (walletRegOTP) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/TopupVerifyOTP";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, walletRegOTP).then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(apiResult, walletRegOTP);
                }
                else {
                    this.setState({
                        errors: apiResult.MessageDetail,
                    })
                    this.asyncModalLoading()
                }
            }
            else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API nạp tiền",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (result, walletRegOTP) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.gotoPaymentDetail(result, walletRegOTP);
        }
    }

    gotoPaymentDetail = (result, walletRegOTP) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PaymentDetail', {
            result: result,
            paymentInfo: walletRegOTP
        })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { phoneNumber, isLoading, errors,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <OTPComponent
                    phoneNumber={phoneNumber}
                    reSendOTP={this.reSendOTP}
                    changeErrors={this.changeErrors}
                    onConfirmOTP={this.onConfirmOTP}
                    errors={errors}
                />
                <View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                </View>
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
            </KeyboardAwareScrollView>
        );
    }
}



const mapStateToProps = state => {
    return {
        AppInfo: state,
        FetchAPIInfo: state.FetchAPIInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callAPIWithoutAuthen: (hostname, hostURL, postData) => {
            return dispatch(callAPIWithoutAuthen(hostname, hostURL, postData));
        },
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
    };
};

const ConfirmOTP = connect(mapStateToProps, mapDispatchToProps)(ConfirmOTPCom);
export default ConfirmOTP;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});