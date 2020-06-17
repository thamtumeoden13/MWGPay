import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
    ImageBackground,
    AlertIOS,
    TouchableHighlight,
    Platform,
} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { Logo, SignInButton, Info, IconTouchID, ForgotAndLogOutFunction } from '@components/signIn';
import { InputPassword } from '@componentsCommon/input/InputPassword'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import ImageBackgroundCom from '@componentsCommon/imageBackground'
import NetInfoErrorModalContent from '@componentsCommon/modal/content/NetInfoError'

import MD5Digest from "@common/library/cryptography/MD5Digest.js";

import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { AUTHEN_HOSTNAME, } from "@constants/systemVars";
import { callRegisterClient } from "@actions/registerClient";
import { callLogin, logout } from "@actions/loginAction";
import { updateAccountBalance, updateEWalletInfo } from "@actions/walletAction";
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { callFetchAPI, callAPIWithoutAuthen } from "@actions/fetchAPIAction";
import { getNetInfo } from '@common/library/NetInfo'
import { authenticateTouchID, supportedTouchID, supportedTouchIDAndroid, getDisplayDetailModalAlert } from '@utils/function';

import { TIMEOUT_LOCK_SCREEN } from '@constants/appSetting';
import DeviceInfo from 'react-native-device-info';

const optionalConfigObject = {
    title: 'Xác thực sinh trắc học.', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    //fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: true, // use unified error messages (default false)
    passcodeFallback: true,
}

const ConfigObject = {
    unifiedErrors: false,
    passcodeFallback: false,
}

class ReSignInScreenCom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userName: '',
            fullName: '',
            uriAvatar: '',
            currentAmount: 0,
            password: '', //123456
            errors: {},
            isModalVisible: false,
            titleModal: '',
            contentModal: '',
            status: true,
            allowTouchID: false,
            isAutoFocus: true,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: '',
            uniqueId: '',
            modelName: ''
        };
    }

    componentDidMount() {
        this.props.logout();
        this.asyncStorageData();
        let uniqueId = DeviceInfo.getUniqueId();
        let modelName = DeviceInfo.getModel();
        this.setState({ uniqueId, modelName })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const appSetting = await this.appSettingData();
                TouchID.isSupported(ConfigObject).then(biometryType => {
                    if (appSetting.allowTouchID) {
                        this.setState({
                            isAutoFocus: false
                        })
                        this.clickHandler();
                    }
                    this.setState({
                        allowTouchID: appSetting.allowTouchID
                    });
                }).catch(error => {
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: false
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting));
                    this.setState({
                        allowTouchID: false
                    })
                });
                const netInfo = await getNetInfo();
                if (!netInfo.status) {
                    this.setState({
                        titleModal: 'Lỗi đăng nhập',
                        contentModal: "Không thể kết nối đến máy chủ",
                        isModalVisible: true,
                    })
                }
            }, 500);
        });
        // this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
        //     clearInterval(this.interval);
        // });
        // this.preSignIn()
    }

    componentWillUnmount() {
        this.focusListener.remove();
        // this.didBlurListener.remove();
        // clearInterval(this.interval);
    }

    appSettingData = async () => {
        const storageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(storageInfo)
        return appSetting
    }

    asyncStorageData = async () => {
        const storageInfo = await AsyncStorage.getItem('UserInfo')
        if (storageInfo) {
            const userInfo = JSON.parse(storageInfo)
            // console.log({ userInfo })
            if (userInfo) {
                this.setState({
                    fullName: userInfo.fullName,
                    userName: userInfo.userName,
                    uriAvatar: userInfo.defaultPictureURL,
                })
            }
        }
    }

    preSignIn = async () => {
        this.asyncModalLoadingEnable();
        const netInfo = await getNetInfo();
        if (netInfo.status) {
            setTimeout(() => {
                this.signIn();
            }, 100);
        }
        else {
            this.asyncModalLoading();
            setTimeout(() => {
                this.setState({
                    titleModal: netInfo.message,
                    contentModal: netInfo.messageDetail,
                    isModalVisible: true
                })
            }, 100);
        }
    }

    signIn = () => {
        const { userName, password } = this.state;
        if (password.length > 0) {
            const passwordMD5 = MD5Digest(password);
            // const passwordSHA256 = HashingSHA256(password);
            this.registerClient(userName, passwordMD5);
        }
        else {
            let errors = {}
            if (password.length <= 0)
                errors.password = 'Vui lòng nhập mật khẩu'
            this.setState({ errors, isLoading: false })
        }

    }

    signOut = async () => {
        const netInfo = await getNetInfo();
        if (netInfo.status) {
            Alert.alert(
                'Đăng Xuất',
                'Bạn có muốn thoát số điện thoại này?',
                [
                    {
                        text: 'HUỶ BỎ',
                        style: 'cancel',
                    },
                    {
                        text: 'ĐỒNG Ý',
                        onPress: () => this._signOut(),
                        style: 'Ok',
                    },
                ],
                { cancelable: false },
            );
        }
        else {
            this.setState({
                titleModal: 'Lỗi kết nối',
                contentModal: 'Không thể kết nối đến máy chủ',
                isModalVisible: true
            })
        }

    }

    _signOut = async () => {
        await AsyncStorage.removeItem('UserInfo');
        this.props.navigation.replace('SignIn')
    }

    onFingerPrintUnlock = () => {
        TouchID.authenticate('Mở khóa bằng vân tay', optionalConfigObject) // Show the Touch ID prompt
            .then(success => {
                Keychain.getGenericPassword()   // Retrieve the credentials from the keychain
                    .then(credentials => {
                        const { username, password } = credentials;
                        this.setState({ isLoading: true });
                        this.registerClient(username, password);
                    }
                    );
            })
            .catch(error => {
                // Touch ID Authentication failed (or there was an error)!
                // Also triggered if the user cancels the Touch ID prompt
                // On iOS and some Android versions, `error.message` will tell you what went wrong
            });
    }

    authenticate = () => {
        TouchID.authenticate('', optionalConfigObject)
            .then(success => {
                Keychain.getGenericPassword().then(credentials => {
                    const { username, password } = credentials;
                    this.setState({ isLoading: true });
                    this.registerClient(username, password);
                });
            })
            .catch(error => {
                let resultErrors = authenticateTouchID(error.code);
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'warning',
                    titleModalAlert: 'Xác thực sinh trắc học',
                    contentModalAlert: resultErrors
                })
            });
    }

    clickHandler = () => {
        TouchID.isSupported()
            .then(this.authenticate)
            .catch(error => {
                let resultErrors;
                if (Platform.OS === "ios") {
                    resultErrors = supportedTouchID(error.name);
                }
                if (Platform.OS === "android") {
                    resultErrors = supportedTouchIDAndroid(error.code);
                }
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'warning',
                    titleModalAlert: 'Xác thực sinh trắc học',
                    contentModalAlert: resultErrors
                })
            });
    }

    registerClient = (userName, password) => {
        this.props.callRegisterClient(AUTHEN_HOSTNAME, userName, password).then((registerResult) => {
            if (registerResult) {
                if (!registerResult.IsError) {
                    this.callLogin(userName, password);
                }
                else {
                    this.asyncModalLoading(true)
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi đăng ký client',
                            contentModalAlert: registerResult.Message
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading(true)
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API đăng kí client",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    callLogin = (userName, password) => {
        let deviceID = DeviceInfo.getUniqueId();
        this.props.callLogin(userName, password, deviceID).then((loginResult) => {
            if (loginResult) {
                this.asyncModalLoading();
                if (!loginResult.IsError) {
                    Keychain.setGenericPassword(userName, password);
                    this.props.navigation.navigate('App');
                    this.props.updateAccountBalance(loginResult.DefaultAccountTotalAmount);
                }
                else {
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(loginResult.StatusID, 'Lỗi đăng nhập', loginResult.Message)
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: type,
                            titleModalAlert: title,
                            contentModalAlert: content,
                            actionModalAlert: action
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading(true)
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API đăng nhập",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    onForgotPassword = async () => {
        const netInfo = await getNetInfo();
        if (netInfo.status) {
            this.props.navigation.navigate('ForgotPassword')
        }
        else {
            this.setState({
                titleModal: 'Lỗi kết nối',
                contentModal: 'Không thể kết nối đến máy chủ',
                isModalVisible: true
            })
        }
    }

    onChangePassword = (value) => {
        this.setState({ password: value, errors: {} })
    }

    getDeviceRegisterOTP = (userName) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/GetDeviceRegisterOTP";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, userName).then(apiResult => {
            // console.log('getdevice', apiResult)
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi đăng ký thông tin OTP',
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            }
            else {
                this.asyncModalLoading(false, apiResult.ResultObject)
            }
        });
    }

    asyncModalLoading = (isLogOut, walletRegOTPId) => {
        this.setState({ isLoading: false })
        if (isLogOut) {
            this.props.logout();
        }
        if (walletRegOTPId) {
            setTimeout(() => { this.goToNavigate(walletRegOTPId) }, 200);
        }
    }
    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }
    onClose = () => {
        this.setState({ isModalVisible: false })
    }

    onCloseModalAlert = (value) => {
        const { actionModalAlert, userName } = this.state
        this.setState({ isModalAlert: false, typeModalAlert: '', actionModalAlert: '' })
        if (actionModalAlert == '1') {
            this.getDeviceRegisterOTP(userName)
        }
    }

    goToNavigate = (walletRegOTPId) => {
        const { userName, password, uniqueId, modelName } = this.state
        this.props.navigation.navigate("ConfirmOTPChangeDevice", {
            walletRegOTPId: walletRegOTPId,
            userName: userName,
            password: password,
            uniqueId: uniqueId,
            modelName: modelName,
            onPreSignIn: this.preSignIn
        });
    }

    render() {
        const { userName, fullName, uriAvatar, password, isLoading,
            errors, isModalVisible, titleModal, contentModal,
            allowTouchID, isAutoFocus,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <ImageBackgroundCom>
                    <ModalCenterHalf
                        isVisible={isModalVisible}
                        content={
                            <NetInfoErrorModalContent
                                titleModal={titleModal}
                                contentModal={contentModal}
                                onClose={this.onClose}
                            />
                        }
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
                    <View style={styles.signInView}>
                        <View style={styles.containerInfo}>
                            <Info
                                fullName={fullName}
                                userName={userName}
                                uriAvatar={uriAvatar}
                            />
                        </View>
                        <View style={styles.signInInput}>
                            <InputPassword
                                errors={errors.password}
                                password={password}
                                onChangeInput={this.onChangePassword}
                                autoFocus={isAutoFocus}
                            />
                        </View>
                        <SignInButton onPress={this.preSignIn} title="ĐĂNG NHẬP" />
                        <IconTouchID
                            allowTouchID={allowTouchID}
                            clickHandler={this.clickHandler}
                        />
                        <ForgotAndLogOutFunction
                            onForgotPassword={this.onForgotPassword}
                            signOut={this.signOut}
                        />
                    </View>
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
        AuthenticationInfo: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        callLogin: (username, password, deviceID) => {
            return dispatch(callLogin(username, password, deviceID))
        },
        logout: () => {
            return dispatch(logout())
        },
        callRegisterClient: (hostname, username, password) => {
            return dispatch(callRegisterClient(hostname, username, password));
        },
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
        updateEWalletInfo: (eWalletInfo) => {
            return dispatch(updateEWalletInfo(eWalletInfo))
        },
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        callAPIWithoutAuthen: (hostname, hostURL, postData) => {
            return dispatch(callAPIWithoutAuthen(hostname, hostURL, postData));
        },
    }
}

const ReSignInScreen = connect(mapStateToProps, mapDispatchToProps)(ReSignInScreenCom);
export default ReSignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
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
    containerInfo: {
        width: "95%",
        height: 240,
        justifyContent: "space-around",
        marginVertical: 10,
        alignItems: "center"
    },
    signInInput: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
});