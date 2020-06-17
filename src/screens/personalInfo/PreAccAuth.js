import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Dimensions,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { updateUserInfo } from "@actions/loginAction";
import { callFetchAPI } from "@actions/fetchAPIAction";

import { Button, Avatar } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import VerifyAccount from '@components/personalInfo/preAccAuth/VerifyAccount'
import VerifyEmail from '@components/personalInfo/preAccAuth/VerifyEmail'
import VerifyInfo from '@components/personalInfo/preAccAuth/VerifyInfo'
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigContent } from '@components/personalInfo/ModalConfigContent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class PreAccAuthCom extends Component {
    static navigationOptions = {
        title: 'Xác thực thông tin cá nhân'
    }
    constructor(props) {
        super(props);
        this.state = {
            email: '', //hieu.vominhst@gmail.com
            isModalInputEmail: false,
            isLoading: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            isVerifiedEmail: false,
            isVerifiedWalletAccount: false,
            isUpdatedPersonalInfo: false,
        };
    }

    componentDidMount() {
        const loginUserInfo = this.props.LoginUserInfo
        // const eWalletInfo = this.props.EWalletInfo.EWalletInfo
        this.setState({
            email: loginUserInfo.Email ? loginUserInfo.Email : '',
            // isVerifiedEmail: eWalletInfo.IsVerifiedEmail,
            // isVerifiedWalletAccount: eWalletInfo.IsVerifiedWalletAccount,
            // isUpdatedPersonalInfo: eWalletInfo.IsUpdatedPersonalInfo
        })
        this.storeData()
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, isModalInputEmail: false })
                    this.props.navigation.push("Lock3", { routeName: this.props.navigation.state.routeName })
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

    onPreEmail = (email) => {
        this.setState({ isModalInputEmail: false, email })
        setTimeout(() => {
            this.callSendVerifyEmail(email);
        }, 500);
    }

    callSendVerifyEmail = (email) => {
        this.setState({ isLoading: true })
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/SendVerifyEmail";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, email).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi gửi thư xác minh địa chỉ email',
                            contentModalAlert: apiResult.MessageDetail
                        })
                    }, 100);
                }
                else {
                    let userInfo = this.props.LoginUserInfo
                    userInfo.Email = email

                    Alert.alert("Đã gửi email xác thực",
                        `Một email xác thực đã được gửi đến địa chỉ ${email}. Quý khách vui lòng mở email ${email} và bấm "Xác nhận" để hoàn thành việc xác thực email`,
                        [
                            {
                                text: 'Đóng',
                                onPress: () => this.asyncModalLoading(userInfo)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi gọi API xác thực email',
                        contentModalAlert: "Vui lòng tắt app và đăng nhập lại"
                    })
                }, 100);
            }
        });
    }

    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo');
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    isVerifiedEmail: userInfo.isVerifiedEmail,
                    isUpdatedPersonalInfo: userInfo.isUpdatedPersonalInfo,
                    isVerifiedWalletAccount: userInfo.isVerifiedWalletAccount,
                })
            }
        }
    }

    asyncModalLoading = (userInfo) => {
        this.setState({ isLoading: false });
        if (userInfo) {
            this.props.updateUserInfo(userInfo);
        }
    }

    onChangeEmail = () => {
        this.setState({ isModalInputEmail: true })
    }

    onVerifyAccount = () => {
        this.props.navigation.navigate("AccountAuthentication")
    }

    onVerifyInfo = () => {
        this.props.navigation.navigate("Information")
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isModalInputEmail, email, isLoading,
            isVerifiedWalletAccount, isVerifiedEmail, isUpdatedPersonalInfo,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                <View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                </View>
                {/* <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }} >
                    <Progress.Bar progress={0.3} width={Dimensions.get('screen').width * 0.8} />
                </View> */}
                <View style={{ flex: 1, alignItems: 'center', }} >
                    {!isVerifiedWalletAccount &&
                        <VerifyAccount
                            onVerifyAccount={this.onVerifyAccount}
                        />
                    }
                    {!isVerifiedEmail &&
                        <VerifyEmail
                            email={email}
                            onChangeEmail={this.onChangeEmail}
                            onPreEmail={this.onPreEmail}
                        />
                    }
                    {!isUpdatedPersonalInfo &&
                        <VerifyInfo
                            onVerifyInfo={this.onVerifyInfo}
                        />
                    }
                </View>
                <View>
                    <ModalBottomHalf
                        isVisible={isModalInputEmail}
                        content={
                            <ModalConfigContent
                                modalType="Email"
                                email={email}
                                onClose={() => this.setState({ isModalInputEmail: false })}
                                onConfirmEmail={this.onPreEmail}
                            />
                        }
                    />
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        AppInfo: state,
        LoginUserInfo: state.LoginInfo.LoginUserInfo,
        EWalletInfo: state.EWalletInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        updateUserInfo: (userInfo) => {
            return dispatch(updateUserInfo(userInfo));
        },
    };
};

const PreAccAuth = connect(mapStateToProps, mapDispatchToProps)(PreAccAuthCom);
export default PreAccAuth;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});