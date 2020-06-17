import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import { callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';

import { Logo, SignInInput, SignInButton, SignInSocial } from '@components/signIn';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { regExEmail } from '@utils/function';
import ImageBackgroundCom from '@componentsCommon/imageBackground';
import DeviceInfo from 'react-native-device-info';

class InfoCustomerCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            fullName: '',
            errors: {},
            phoneNumber: '',
            password: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            walletRegOTPId: '',
            OTP: ''
        };
    }

    componentDidMount() {
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        const password = this.props.navigation.getParam('password', '');
        const walletRegOTPId = this.props.navigation.getParam('walletRegOTPId', '');
        const otp = this.props.navigation.getParam('OTP', '');
        this.setState({ phoneNumber, password, walletRegOTPId, OTP: otp })
    }


    onConfirmSignup = () => {
        const { walletRegOTPId, OTP, phoneNumber, password, fullName, email } = this.state
        let errors = {}
        if (fullName.length > 0 && email.length > 0 && regExEmail.test(email) == true) {
            this.setState({ isLoading: true });
            const uniqueId = DeviceInfo.getUniqueId();
            const modelName = DeviceInfo.getModel();
            const signature = createSignature(walletRegOTPId + OTP + phoneNumber + HashingSHA256(password) + fullName.replace(/ {2,}/g, ' ') + email);
            const walletInfo = {
                walletRegOTPId: walletRegOTPId,
                OTP: OTP,
                PhoneNumber: phoneNumber,
                Password: HashingSHA256(password),
                FullName: fullName.replace(/ {2,}/g, ' '),
                Email: email,
                CurrentDeviceID: uniqueId,
                CurrentDeviceModelName: modelName,
                Signature: signature
            };
            this.registerWallet(walletInfo);
        }
        else {
            if (fullName.length <= 0)
                errors.fullName = "Vui lòng nhập Họ và Tên";
            if (!regExEmail.test(email))
                errors.email = "Email không hợp lệ. Vui lòng kiểm tra lại!"
            this.setState({ errors, isLoading: false })
        }
    }

    registerWallet = (walletInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/Register";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, walletInfo).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading(true);
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi đăng ký ví",
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            }
            else {
                Alert.alert("Thông báo",
                    "Đăng ký ví thành công",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(false)
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    asyncModalLoading = (isError) => {
        this.setState({ isLoading: false })
        if (!isError) {
            this.props.navigation.popToTop()
        }
    }
    onchangeTextHandle = (value) => {
        this.setState({
            fullName: value.trimStart()
        })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { fullName, email, isLoading, errors,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                    <ImageBackgroundCom>
                        <View style={styles.signInView}>
                            <Logo />
                            <View style={styles.smallTile}>
                                <Text style={styles.title}>Hoàn tất thông tin tài khoản ví</Text>
                            </View>
                            <View style={styles.signInInput}>
                                <Input
                                    leftIcon={
                                        <Icon
                                            name="user-o"
                                            type="font-awesome"
                                            color="rgba(171, 189, 219, 1)"
                                            size={25}
                                        />
                                    }
                                    onChangeText={(value) => this.setState({ fullName: value.trimStart() })}
                                    value={fullName}
                                    inputStyle={{ marginLeft: 10, color: '#000', }}
                                    keyboardAppearance="light"
                                    placeholder="Nhập Họ và Tên"
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="default"
                                    maxLength={50}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    placeholderTextColor="#000"
                                    errorStyle={{ textAlign: 'left', fontSize: 12 }}
                                    errorMessage={errors.fullName}
                                />
                            </View>
                            <View style={[styles.signInInput, { marginTop: 15 }]}>
                                <Input
                                    leftIcon={
                                        <Icon
                                            name="envelope"
                                            type="font-awesome"
                                            color="rgba(171, 189, 219, 1)"
                                            size={25}
                                        />
                                    }
                                    onChangeText={(value) => this.setState({ email: value.trim() })}
                                    value={email}
                                    inputStyle={{ marginLeft: 10, color: '#000' }}
                                    keyboardAppearance="light"
                                    placeholder="Nhập email"
                                    autoFocus={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    placeholderTextColor="#000"
                                    errorStyle={{ textAlign: 'left', fontSize: 12 }}
                                    errorMessage={errors.email}
                                />
                            </View>
                            <SignInButton onPress={this.onConfirmSignup} title="XÁC NHẬN" />
                            <ModalLoading
                                isVisible={isLoading}
                            />
                            <ModalCenterAlert
                                isCancel={true}
                                isOK={true}
                                isVisible={isModalAlert}
                                typeModal={typeModalAlert}
                                titleModal={titleModalAlert}
                                contentModal={contentModalAlert}
                                onCloseModalAlert={this.onCloseModalAlert}
                            />
                        </View>
                    </ImageBackgroundCom>
                </KeyboardAwareScrollView>
            </View>
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

const InfoCustomer = connect(mapStateToProps, mapDispatchToProps)(InfoCustomerCom);
export default InfoCustomer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    signInView: {
        flex: 1,
        top: 100,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    signInInput: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    signInSocial: {
        width: '90%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerAccount: {
        width: '90%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    signInInput: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    smallTile: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '80%',
        marginBottom: 20,
    },
    title: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
});