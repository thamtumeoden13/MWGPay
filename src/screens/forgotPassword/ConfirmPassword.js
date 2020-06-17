import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { connect } from 'react-redux';
import { callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";

import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ConfirmPasswordComponent } from '@components/confirmPassword';
import ImageBackgroundCom from '@componentsCommon/imageBackground';

class ConfirmPasswordForgotPasswordCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            phoneNumber: '',
            forgetPassOTPID: '',
            walletID: '',
            OTP: ''
        };
    }

    componentDidMount() {
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        const forgetPassOTPID = this.props.navigation.getParam('forgetPassOTPID', '');
        const walletID = this.props.navigation.getParam('walletID', '');
        const OTP = this.props.navigation.getParam('OTP', '');
        this.setState({
            phoneNumber,
            forgetPassOTPID,
            walletID,
            OTP
        })
    }

    onConfirmPassword = (password, confirmPassword) => {
        this.setState({ isLoading: true });
        const { phoneNumber, forgetPassOTPID, walletID, OTP } = this.state;
        const signature = createSignature(forgetPassOTPID + walletID + phoneNumber + OTP + HashingSHA256(password));
        const resetPassObject = {
            ForgetPassOTPID: forgetPassOTPID,
            WalletID: walletID,
            PhoneNumber: phoneNumber,
            OTP: OTP,
            NewPassword: HashingSHA256(password),
            Signature: signature
        }
        this.callResetPassword(resetPassObject);
    }

    callResetPassword = (resetPassObject) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/RessetPassword";
        this.props.callAPIWithoutAuthen(APIHostName, APIPath, resetPassObject).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    Alert.alert("Lỗi đổi mật khẩu", apiResult.Message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                            }
                        ],
                        { cancelable: false });
                }
                else {
                    Alert.alert("Thay đổi mật khẩu thành công", "",
                        [
                            {
                                text: 'Đồng ý', onPress: () => this.asyncModalLoading(resetPassObject)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else {

            }
        });
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.navigation.navigate('SignIn', {
                phoneNumber: result.PhoneNumber,
                password: result.NewPassword,
                isAutoSignIn: true
            });
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isLoading, isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert } = this.state;
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
                    <ConfirmPasswordComponent
                        isLoading={isLoading}
                        onConfirmPassword={this.onConfirmPassword}
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

const ConfirmPasswordForgotPassword = connect(mapStateToProps, mapDispatchToProps)(ConfirmPasswordForgotPasswordCom);
export default ConfirmPasswordForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});