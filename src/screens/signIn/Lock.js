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
    TouchableHighlight
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
import ImageBackgroundCom from '@componentsCommon/imageBackground';
import NetInfoErrorModalContent from '@componentsCommon/modal/content/NetInfoError'

import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { AUTHEN_HOSTNAME, } from "@constants/systemVars";
import { callRegisterClient } from "@actions/registerClient";
import { callLogin, logout } from "@actions/loginAction";
import { updateAccountBalance } from "@actions/walletAction";
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { callFetchAPI } from "@actions/fetchAPIAction";
import { getNetInfo } from '@common/library/NetInfo';

import { authenticateTouchID, supportedTouchID, supportedTouchIDAndroid } from '@utils/function';

import { TIMEOUT_LOCK_SCREEN } from '@constants/appSetting';

const optionalConfigObject = {
    title: 'Xác thực sinh trắc học.', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: true, // use unified error messages (default false)
    passcodeFallback: true,
}

const ConfigObject = {
    unifiedErrors: false,
    passcodeFallback: false,
}


class LockCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null,
        gesturesEnabled: false
    })
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            phoneNumber: '',
            fullName: '',
            currentAmount: 0,
            password: '', //123456
            errors: {},
            isModalVisible: false,
            titleModal: '',
            contentModal: '',
            status: true,
            allowTouchID: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    async componentDidMount() {
        const appSetting = await this.appSettingData();
        if (appSetting.allowTouchID) {
            this.clickHandler();
        }
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

        this.storeData()
        TouchID.isSupported()
            .then(biometryType => {
                this.setState({ biometryType });
            })
    }

    appSettingData = async () => {
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        return appSetting
    }

    storeData = async (result) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    fullName: userInfo.fullName,
                    phoneNumber: userInfo.phoneNumber,
                    currentAmount: userInfo.currentAmount
                })
            }
        }
        if (result) {
            const userInfo = {
                walletID: result.WalletID,
                fullName: result.FullName,
                phoneNumber: result.PhoneNumber,
                currentAmount: result.DefaultAccountTotalAmount,
                email: result.Email,
                hasSignIn: true
            }
            await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
        }
    }

    unlock = async (value) => {
        if (value.length > 0) {
            Keychain.getGenericPassword().then(credentials => {
                const { username, password } = credentials;
                if (value == password) {
                    this.asyncModalLoading()
                    this.props.navigation.pop()
                }
                else {
                    let errors = {}
                    errors.password = 'Mật khẩu không chính xác'
                    this.setState({ errors, isLoading: false })

                }
            });
        }
        else {
            let errors = {}
            if (value.length <= 0)
                errors.password = 'Vui lòng nhập mật khẩu'
            this.setState({ errors, isLoading: false })
        }
    }

    onSubmitUnLock = async () => {
        const { password } = this.state;
        //let passwordMD5 = await MD5Digest(password);
        let passwordSHA256 = HashingSHA256(password);
        this.unlock(passwordSHA256);
    }

    signOut = async () => {
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
        )

    }

    _signOut = async () => {
        await AsyncStorage.removeItem('UserInfo');
        this.props.navigation.navigate('SignIn')
    }

    onFingerPrintUnlock = () => {
        TouchID.authenticate('Mở khóa bằng vân tay') // Show the Touch ID prompt
            .then(success => {
                Keychain.getGenericPassword().then(credentials => {
                    const { username, password } = credentials;
                    // this.setState({ isLoading: true });
                    // this.registerClient(username, password);
                });
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
                Keychain.getGenericPassword()   // Retrieve the credentials from the keychain
                    .then(credentials => {
                        const { username, password } = credentials;
                        this.unlock(password);
                    });
            })
            .catch(error => {
                let resultErrors = authenticateTouchID(error.code);
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'warning',
                        titleModalAlert: 'Xác thực sinh trắc học',
                        contentModalAlert: resultErrors
                    })
                }, 100);
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
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'warning',
                        titleModalAlert: 'Xác thực sinh trắc học',
                        contentModalAlert: resultErrors
                    })
                }, 100);
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

    asyncModalLoading = (isLogOut) => {
        this.setState({ isLoading: false })
        if (isLogOut) {
            this.props.logout();
        }
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }

    onClose = () => {
        this.setState({ isModalVisible: false })
    }

    onChangeTextPass = (value) => {
        this.setState(
            {
                password: value,
                errors: {}
            }
        )
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { phoneNumber, fullName, password, isLoading, errors,
            isModalVisible, titleModal, contentModal, allowTouchID,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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
                <ImageBackgroundCom>
                    <View style={styles.signInView}>
                        <View style={styles.containerInfo}>
                            <Info
                                fullName={fullName}
                                phoneNumber={phoneNumber}
                            />
                        </View>
                        <View style={styles.signInInput}>
                            <InputPassword
                                errors={errors.password}
                                password={password}
                                onChangeInput={this.onChangePassword}
                                autoFocus={true}
                            />
                        </View>
                        <SignInButton onPress={this.onSubmitUnLock} title="MỞ KHOÁ" />
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
        callLogin: (username, password) => {
            return dispatch(callLogin(username, password))
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
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
    }
}

const Lock = connect(mapStateToProps, mapDispatchToProps)(LockCom);
export default Lock;

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
    containerInfo: {
        width: "95%",
        height: 80,
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