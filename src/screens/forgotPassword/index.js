import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert,
    Button
} from 'react-native';
import { Input, Icon, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

import { Logo, SignInButton } from '@components/signIn';
import { InputPhoneNumber } from '@componentsCommon/input';
import { checkPhoneNumber, getDisplayDetailModalAlert } from '@utils/function';

import { connect } from 'react-redux';
import { callAPIWithoutAuthen } from "@actions/fetchAPIAction";
import ImageBackgroundCom from '@componentsCommon/imageBackground';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class ForgotPasswordCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isModalVisible: false,
            checked: false,
            phoneNumber: '',
            errors: {},
            forgetPassOTPID: '',
            walletID: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        };
    }

    componentDidMount() {
        // const userNameInfo = this.props.AppInfo.LoginInfo.LoginUserInfo.FullName;
        // this.setState({
        //     userNameInfo
        // })

        // this.focusListener = this.props.navigation.addListener('didFocus', () => {
        //     setTimeout(async () => {
        //         const timeout = await this.appSettingData();
        //         if (!timeout)
        //             timeout = 300000
        //         this.interval = setInterval(() => {
        //             this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
        //         }, timeout);
        //     }, 500);
        // });
        // this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
        //     clearInterval(this.interval);
        // });
    }

    // componentWillUnmount() {
    //     this.focusListener.remove();
    //     this.didBlurListener.remove();
    //     clearInterval(this.interval);
    // }

    // appSettingData = async () => {
    //     const StorageInfo = await AsyncStorage.getItem('AppSetting')
    //     const appSetting = JSON.parse(StorageInfo)
    //     return appSetting.timeout
    // }

    onChangePhoneNumber = (phoneNumber) => {
        this.setState({ phoneNumber })
    }

    acceptChange = async () => {
        const { phoneNumber, forgetPassOTPID, walletID } = this.state
        await this.setState({ isModalVisible: false });
        setTimeout(() => {
            this.props.navigation.navigate('ConfirmOTPForgotPassword', {
                phoneNumber: phoneNumber,
                forgetPassOTPID: forgetPassOTPID,
                walletID: walletID,
            });
        }, 500);
    }

    callForgotPassword = (phoneNumber) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/ForgetPassOTP/ForgetPass";
        const { isModalVisible } = this.state
        this.props.callAPIWithoutAuthen(APIHostName, APIPath, phoneNumber).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading()
                setTimeout(() => {
                    const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Lỗi lấy mã OTP quên mật khẩu', apiResult.Message)
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: type,
                        titleModalAlert: title,
                        contentModalAlert: content,
                        actionModalAlert: action
                    })
                }, 100);
            }
            else {
                this.setState({
                    isModalVisible: !isModalVisible,
                    isLoading: false,
                    forgetPassOTPID: apiResult.ResultObject.ForgetPassOTPID,
                    walletID: apiResult.ResultObject.WalletID,
                });
            }
        });
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false, })
    }

    getPhoneNumber = async (phoneNumber) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/CheckPhoneNumber";
        let result;
        await this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, phoneNumber).then(apiResult => {
            result = apiResult;
        });
        return result;
    }

    toggleModal = async () => {
        let errors = {}
        const { isModalVisible, phoneNumber, isLoading } = this.state;
        let resultErrors = checkPhoneNumber(phoneNumber);
        if (resultErrors.length > 0) {
            errors.phoneNumber = resultErrors;
            this.setState({ errors, isLoading: false })
        }
        else {
            let resultPhoneValid = await this.getPhoneNumber(phoneNumber);
            if (resultPhoneValid.ResultObject == false) {
                errors.phoneNumber = 'Số điện thoại chưa được đăng kí!';
                this.setState({ errors, isLoading: false })
            }
            else {
                this.callForgotPassword(phoneNumber);
            }

        }
    }

    closeModal = () => {
        this.setState({ isModalVisible: false });
    }

    onCloseModalAlert = (value) => {
        const { actionModalAlert } = this.state
        this.setState({ isModalAlert: false, typeModalAlert: '', actionModalAlert: '' })
        if (actionModalAlert == '1') {
            this.props.navigation.navigate('SignIn')
        }
    }

    render() {
        const { phoneNumber, errors, isLoading, checked, isModalVisible,
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
                    <View style={styles.signInView}>
                        <Logo />
                        <View style={styles.signInInput}>
                            <InputPhoneNumber
                                errors={errors}
                                onChangeInput={this.onChangePhoneNumber}
                            />
                        </View>
                        <SignInButton onPress={this.toggleModal} isLoading={isLoading} title="THIẾT LẬP LẠI" />
                    </View>
                    <Modal
                        isVisible={isModalVisible}
                        backdropColor='black'
                        style={styles.modal}
                    >
                        <View style={{ backgroundColor: '#fff', height: 200, width: '90%', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 10 }}>
                            <View style={styles.modalHeader}>
                                <Text style={{ fontSize: 14, marginBottom: 10, color: '#2f2f2f' }}>Khôi phục ví MWG với số điện thoại</Text>
                            </View>
                            <View style={styles.modalHContent}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 30, color: '#2d2c2c' }}>{phoneNumber}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <CheckBox
                                        title='Tôi đã đọc và đồng ý với điều khoản sử dụng của ví MWG.'
                                        checked={checked}
                                        onPress={() => this.setState({ checked: !checked })}
                                        textStyle={{ fontSize: 12, color: '#000' }}
                                        containerStyle={{ backgroundColor: '#fff', borderWidth: 0, marginLeft: 0, paddingLeft: 0 }}
                                    />
                                </View>
                            </View>
                            <View style={styles.modalFooter}>
                                <Button
                                    style={{ flexDirection: 'column', width: 100, textAlign: 'center', color: 'gray' }} title="QUAY LẠI"
                                    color="#717171"
                                    onPress={this.closeModal}
                                />
                                <Button
                                    style={{ flexDirection: 'column', width: 100, textAlign: 'center' }}
                                    title="TIẾP TỤC"
                                    color="#841584"
                                    onPress={this.acceptChange}
                                    disabled={!checked}
                                />
                            </View>
                        </View>
                    </Modal>
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

const ForgotPassword = connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordCom);
export default ForgotPassword;

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        width: '100%',
    },
    modalHContent: {
        height: '60%',
        width: '100%',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "center",
        height: '20%',
        width: '100%',

    },
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
});