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
import * as Keychain from 'react-native-keychain';
import { SwitchActions } from 'react-navigation';

import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { connect } from 'react-redux';
import { callFetchAPI, callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";

import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ConfirmPasswordComponent } from '@components/confirmPassword';
import ImageBackgroundCom from '@componentsCommon/imageBackground';

class NewPasswordCom extends Component {
    static navigationOptions = {
        title: 'Nhập mới mật khẩu'
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phoneNumber: '',
            walletID: '',
            fullName: '',
            oldPassword: '',
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {
        const oldPassword = this.props.navigation.getParam('oldPassword', '');
        this.setState({ oldPassword })
        this.storeData()
    }

    onConfirmPassword = (password, confirmPassword) => {
        this.setState({ isLoading: true });
        const { phoneNumber, walletID, oldPassword } = this.state
        const signature = createSignature(walletID + HashingSHA256(oldPassword) + HashingSHA256(password));
        const changePassObject =
        {
            WalletID: walletID,
            OldPassword: HashingSHA256(oldPassword),
            NewPassword: HashingSHA256(password),
            Signature: signature,
        }
        if (oldPassword == password) {
            Alert.alert("Thay đổi mật khẩu không thành công",
                "Mật khẩu mới không được trùng với mật khẩu cũ.",
                [
                    {
                        text: 'Đồng ý', onPress: () => this.asyncModalLoading()
                    }
                ],
                { cancelable: false }
            );
        }
        else {
            this.callChangePassword(changePassObject);
        }

    }

    callChangePassword = (changePassObject) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/ChangePassword";
        this.props.callFetchAPI(APIHostName, APIPath, changePassObject).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi đổi mật khẩu',
                        contentModalAlert: apiResult.Message
                    });
                }, 100);
            }
            else {
                Alert.alert("Thay đổi mật khẩu thành công",
                    "Vui lòng đăng nhập lại để cập nhật mật khẩu",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(changePassObject)
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    storeData = async (result) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    fullName: userInfo.fullName,
                    phoneNumber: userInfo.phoneNumber,
                    walletID: userInfo.walletID
                })
            }
        }
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            const { phoneNumber } = this.state
            Keychain.setGenericPassword(phoneNumber, result.NewPassword);
            this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: "AuthLoading" }));
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isLoading,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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
                    <ModalCenterAlert
                        isCancel={true}
                        isOK={true}
                        isVisible={isModalAlert}
                        typeModal={typeModalAlert}
                        titleModal={titleModalAlert}
                        contentModal={contentModalAlert}
                        onCloseModalAlert={this.onCloseModalAlert}
                    />
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
        },
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        }
    };
};

const NewPassword = connect(mapStateToProps, mapDispatchToProps)(NewPasswordCom);
export default NewPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});