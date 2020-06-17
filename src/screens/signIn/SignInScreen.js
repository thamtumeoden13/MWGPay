import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    UIManager,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Logo, SignInInput, SignInButton, Info } from '@components/signIn';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import ImageBackgroundCom from '@componentsCommon/imageBackground'
import NetInfoErrorModalContent from '@componentsCommon/modal/content/NetInfoError'

import { callFetchAPI, callAPIWithoutAuthen } from "@actions/fetchAPIAction";
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { AUTHEN_HOSTNAME } from "@constants/systemVars";
import { callRegisterClient } from "@actions/registerClient";
import { callLogin, logout } from "@actions/loginAction";
import { updateAccountBalance, updateEWalletInfo } from "@actions/walletAction";
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { PrefixMobileNumber, regExNumber, getDisplayDetailModalAlert } from "@utils/function";
import { getNetInfo } from '@common/library/NetInfo'

import { TIMEOUT_LOCK_SCREEN } from '@constants/appSetting';

import DeviceInfo from 'react-native-device-info';


// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

class SignInScreenCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '', //0906145090
            password: '', //123456
            isPasswordValid: true,
            isLoading: false,
            errors: {},
            isAutoSignIn: false,
            isModalVisible: false,
            titleModal: '',
            contentModal: '',
            status: false,
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
        let uniqueId = DeviceInfo.getUniqueId();
        let modelName = DeviceInfo.getModel();
        const userName = this.props.navigation.getParam('userName', '')
        const password = this.props.navigation.getParam('password', '')
        const isAutoSignIn = this.props.navigation.getParam('isAutoSignIn', false)
        this.setState({ userName, password, isAutoSignIn, uniqueId, modelName })
        setTimeout(async () => {
            const netInfo = await getNetInfo();
            if (!netInfo.status) {
                this.setState({
                    titleModal: 'Lỗi đăng nhập',
                    contentModal: "Không thể kết nối đến máy chủ",
                    isModalVisible: true,
                })
            }
        }, 100);
        // this.preSignIn()
    }

    signUp = async () => {
        const netInfo = await getNetInfo();

        if (netInfo.status) {
            this.props.navigation.navigate('SignUp');
        }
        else {
            this.setState({
                titleModal: 'Lỗi kết nối',
                contentModal: 'Không thể kết nối đến máy chủ',
                isModalVisible: true
            })
        }
    }

    preSignIn = async () => {
        this.asyncModalLoadingEnable()
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
                    isModalVisible: true,
                    titleModal: netInfo.message,
                    contentModal: netInfo.messageDetail,
                })
            }, 100);
        }
    }

    signIn = () => {
        const { userName, password } = this.state
        const subuserNameTheFirst = userName.substring(0, 1);
        const subserName = userName.substring(0, 3);
        let errors = {}
        if (userName && userName.length > 0 && password.length > 0) {
            const passwordMD5 = MD5Digest(password);
            //const passwordSHA256 = HashingSHA256(password);
            // console.log({ password, passwordMD5 })
            this.registerClient(userName, passwordMD5);
        }
        else {
            switch (true) {
                // case userName.length <= 0:
                //     errors.userName = 'Vui lòng nhập số điện thoại'
                //     break;
                // case subuserNameTheFirst != '0':
                //     errors.userName = 'Số điện thoại bắt đầu bằng số 0';
                //     break;
                // case userName.indexOf('.') > -1:
                //     errors.userName = 'Vui lòng luôn nhập số điện thoại là số!';
                //     break;
                // case userName.length < 10:
                //     errors.userName = 'Số điện thoại phải đủ 10 số';
                //     break;
                // case password.length <= 0:
                //     errors.password = 'Vui lòng nhập mật khẩu';
                //     break;
                case PrefixMobileNumber.includes(subuserName) == false:
                    errors.userName = 'Đăng nhập không thành công. Sai tên truy cập hoặc mật khẩu.';
                    break;
                case regExNumber.test(userName) == false:
                    errors.userName = 'Số điện thoại không đúng định dạng';
                    break;
            }

            this.setState({ errors, isLoading: false })
        }
    }

    asyncStorageData = async () => {
        const appSetting = {
            timeout: TIMEOUT_LOCK_SCREEN,
            allowTouchID: false
        }
        await AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting))
    }

    registerClient = (userName, password) => {
        console.log({ AUTHEN_HOSTNAME, userName, password })
        this.props.callRegisterClient(AUTHEN_HOSTNAME, userName, password).then((registerResult) => {
            // console.log({ registerResult })
            if (registerResult && !registerResult.IsError) {
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
        });
    }

    callLogin = (userName, password) => {
        let deviceID = DeviceInfo.getUniqueId();
        this.props.callLogin(userName, password, deviceID).then((loginResult) => {
            if (loginResult) {
                this.asyncModalLoading()
                if (!loginResult.IsError) {
                    Keychain.setGenericPassword(userName, password);
                    this.asyncStorageData()
                    this.props.navigation.navigate('App');
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

    onChangeInput = (userName, password) => {
        this.setState({ userName, password })
    }

    getDeviceRegisterOTP = (userName) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/GetDeviceRegisterOTP";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, userName).then(apiResult => {
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

    forgotPassword = async () => {
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
        const { userName, password, errors, isLoading,
            isModalVisible, titleModal, contentModal,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View style={styles.container}>
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
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "flex-start" }}>
                    <ImageBackgroundCom>
                        <View style={styles.signInView}>
                            <Logo />
                            <SignInInput userName={userName} password={password} errors={errors} onChangeInput={this.onChangeInput} />

                            <SignInButton onPress={this.preSignIn} title="ĐĂNG NHẬP" />

                            {/* <View style={{ width: "100%", height: 50, justifyContent: "center", flexDirection: 'row' }}>
                                <TouchableOpacity onPress={this.forgotPassword}>
                                    <Text style={{ color: '#03a5db' }}>Quên mật khẩu</Text>
                                </TouchableOpacity>
                            </View> */}
                            {/* <View style={styles.registerAccount}>
                                <Text style={{ textAlign: 'center', color: "#000" }}>Bạn chưa có tài khoản MWGPay? </Text>
                                <TouchableOpacity onPress={this.signUp}>
                                    <Text style={{ color: '#03a5db' }}>Đăng ký ngay</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        <View>
                            <ModalLoading
                                isVisible={isLoading}
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
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        callAPIWithoutAuthen: (hostname, hostURL, postData) => {
            return dispatch(callAPIWithoutAuthen(hostname, hostURL, postData));
        },
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
        updateEWalletInfo: (eWalletInfo) => {
            return dispatch(updateEWalletInfo(eWalletInfo))
        },
    }
}

const SignInScreen = connect(mapStateToProps, mapDispatchToProps)(SignInScreenCom);
export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        flexDirection: 'row',
    },
    signInView: {
        marginTop: 10,
        height: "100%",
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerAccount: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        flexDirection: 'row',
        // alignItems: "flex-end"
    },
});