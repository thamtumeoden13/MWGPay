import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

import { OTPComponent } from '@components/otp';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import ImageBackgroundCom from '@componentsCommon/imageBackground';

import { connect } from 'react-redux';
import { callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";

class ConfirmOTPForgotPasswordCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phoneNumber: '',
            errors: '',
            countCallOTP: 0,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            forgetPassOTPID: '',
            walletID: ''
        };
    }

    componentDidMount() {
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        const forgetPassOTPID = this.props.navigation.getParam('forgetPassOTPID', '');
        const walletID = this.props.navigation.getParam('walletID', '');
        this.setState({
            phoneNumber,
            forgetPassOTPID,
            walletID
        })
    }

    reSendOTP = (phoneNumber) => {
        let { countCallOTP } = this.state
        this.setState({
            countCallOTP: countCallOTP + 1
        })
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/ForgetPassOTP/ReSentOTP";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, phoneNumber).then(apiResult => {
            if (apiResult.IsError) {
                Alert.alert("Lỗi đăng ký thông tin OTP", apiResult.Message,
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.setState({
                    forgetPassOTPID: apiResult.ResultObject.ForgetPassOTPID
                })
                let detailMess = '';
                if (countCallOTP == 2) {
                    detailMess = 'Bạn sẽ bị khoá 24h, nếu thực hiện gửi OTP lần nữa.'
                }
                // Alert.alert("Gửi lại OTP thành công!", `Số lần còn lại ${4 - countCallOTP}`,
                Alert.alert("Gửi lại OTP thành công!", detailMess,
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading()
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    changePhoneNumber = (phoneNumber) => {
        this.props.navigation.navigate("ForgotPassword");
    }

    onConfirmOTP = (OTP) => {
        const { forgetPassOTPID, countCallOTP, phoneNumber, walletID } = this.state;
        this.setState({
            countCallOTP: countCallOTP + 1
        })
        if (OTP && OTP.length > 0 && countCallOTP < 5) {
            this.setState({
                isLoading: true,
            })
            const signature = createSignature(forgetPassOTPID + walletID + phoneNumber + OTP);
            const forgetPassOTP = {
                ForgetPassOTPID: forgetPassOTPID,
                OTP: OTP,
                WalletID: walletID,
                PhoneNumber: phoneNumber,
                Signature: signature
            };
            this.callVerifyOTP(forgetPassOTP);
        }
        else {
            let errors = '';
            if (OTP.length <= 0) {
                errors = "Vui lòng nhập mã OTP";
            }
            if (countCallOTP >= 5) {
                Alert.alert("Lỗi nhập OTP",
                    "Bạn đã nhập sai OTP quá 5 lần.",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.asyncModalLoading();
                this.setState({ errors })
            }
        }
    }

    callVerifyOTP = (forgetPassOTP) => {
        let { countCallOTP } = this.state
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/ForgetPassOTP/VerifyForgetPassOTP";
        this.props.callAPIWithoutAuthen(APIHostName, APIPath, forgetPassOTP).then(apiResult => {
            if (apiResult.IsError) {
                if (countCallOTP == 4) {
                    Alert.alert("Lỗi nhập OTP",
                        "Bạn đã nhập sai OTP quá 5 lần.",
                        [
                            {
                                text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                            }
                        ],
                        { cancelable: false }
                    );
                }
                else {
                    this.setState({
                        errors: apiResult.MessageDetail,
                        isLoading: false
                    })
                }
            }
            else {
                this.setState({ isLoading: false })
                this.props.navigation.navigate("ConfirmPasswordForgotPassword", {
                    forgetPassOTPID: forgetPassOTP.ForgetPassOTPID,
                    phoneNumber: forgetPassOTP.PhoneNumber,
                    walletID: forgetPassOTP.WalletID,
                    OTP: forgetPassOTP.OTP
                });
            }
        });
    }

    asyncModalLoading = (isGoBack) => {
        this.setState({ isLoading: false })
        if (isGoBack) {
            this.props.navigation.goBack();
        }
    }

    changeErrors = () => {
        this.setState({ errors: '' })
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
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                <ImageBackgroundCom>
                    <OTPComponent
                        phoneNumber={phoneNumber}
                        isLoading={isLoading}
                        reSendOTP={this.reSendOTP}
                        changePhoneNumber={this.changePhoneNumber}
                        onConfirmOTP={this.onConfirmOTP}
                        errors={errors}
                        changeErrors={this.changeErrors}
                    />
                    <View>
                        <ModalLoading
                            isVisible={isLoading}
                        />
                    </View>
                </ImageBackgroundCom>
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
        }
    };
};

const ConfirmOTPForgotPassword = connect(mapStateToProps, mapDispatchToProps)(ConfirmOTPForgotPasswordCom);
export default ConfirmOTPForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});