import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Alert
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent'
import { TransferOutToMWGPayContent } from '@components/transferOut/TransferOutToMWGPayContent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigContent } from '@components/personalInfo/ModalConfigContent';
import { formatMoney } from '@utils/function';
import { DefaultMoney, getDisplayDetailModalAlert } from '@components/defaultMoney';
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import { MAX_TRANSFER_OUT_CONFIG } from '@constants/appSetting'

class TransferOutToMWGPayCom extends Component {
    static navigationOptions = {
        title: "Thanh toán an toàn"
    }
    constructor(props) {
        super(props)
        this.state = {
            walletID: '',
            phoneNumber: '',
            phoneName: '',
            titleAvatar: '',
            amount: '',
            message: '',
            errors: {},
            currentBalance: 0,
            isLoading: false,
            isModalInputPassword: false,
            upwardLimit: MAX_TRANSFER_OUT_CONFIG,
            currentWalletID: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        }
    }

    componentDidMount() {
        const currentWalletID = this.props.AppInfo.LoginInfo.LoginUserInfo.WalletID;
        const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        const amountTransfer = this.props.navigation.getParam('amountTransfer', '');
        const fullName = this.props.navigation.getParam('fullName', '');
        const walletID = this.props.navigation.getParam('walletID', '');
        const fullNameList = fullName.split(' ');
        let titleAvatar = '';
        fullNameList.map((item, index) => {
            if (index < 2)
                titleAvatar = titleAvatar + item[0]
        })
        this.setState({
            walletID: walletID,
            phoneNumber: phoneNumber,
            phoneName: fullName,
            titleAvatar: titleAvatar,
            amount: formatMoney(amountTransfer, 0),
            currentBalance: currentBalance,
            currentWalletID: currentWalletID
        });

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalInputPassword: false, isModalAlert: false })
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

    onChangeText = (value, message) => {
        const formatValue = formatMoney(value, 0)
        this.setState({ amount: formatValue })
    }

    onPreConfirm = () => {
        const { upwardLimit, amount } = this.state
        const amountRevert = amount.toString().replace(new RegExp(',', 'g'), "");
        if (upwardLimit > 0 && amountRevert > upwardLimit) {
            this.asyncModalLoading();
            setTimeout(() => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: "Vượt hạn mức giao dịch",
                    contentModalAlert: `Vui lòng nhập số tiền cần chuyển nhỏ hơn ${formatMoney(upwardLimit, 0)} vnd`
                })
            }, 100);
        }
        else {
            this.onConfirmTransferOut();
        }
    }
    onConfirmTransferOut = () => {
        const { walletID, phoneNumber, phoneName, amount, currentBalance, currentWalletID } = this.state
        const amountRevert = amount.toString().replace(new RegExp(',', 'g'), "");
        if (amountRevert >= 10000 && amountRevert <= currentBalance && currentWalletID != walletID) {
            this.setState({ isLoading: true, });
            const moneyTransferContent = "Chuyển tiền cho " + phoneName;
            const signature = createSignature(walletID + amountRevert + moneyTransferContent);
            const moneyTransferInfo = {
                ToWalletID: walletID,
                Amount: amountRevert,
                MoneyTransferContent: moneyTransferContent,
                Signature: signature

            };
            this.callMoneyTransfer(moneyTransferInfo);
        }
        else {
            let errors = {}
            switch (true) {
                case amountRevert <= 0:
                    errors.value = 'Vui lòng nhập số tiền cần chuyển';
                    break;

                case amountRevert < 10000:
                    errors.value = 'Số tiền phải lớn hơn hoặc bằng 10,000đ';
                    break;

                case currentBalance < 10000:
                    errors.value = 'Số dư ví không đủ để thực hiện giao dịch';
                    break;

                case amountRevert > currentBalance:
                    errors.value = 'Số tiền chuyển phải nhỏ hơn hoặc bằng số dư ví (' + formatMoney(currentBalance, 0) + 'đ)';
                    break;

                case currentWalletID == walletID:
                    errors.value = 'Bạn không thể chuyển tiền cho chính ví của mình';
                    break;

            }
            this.setState({ errors, isLoading: false })
        }
    }

    callMoneyTransfer = (moneyTransferInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Transaction/MoneyTransfer";
        this.props.callFetchAPI(APIHostName, APIPath, moneyTransferInfo).then(apiResult => {
            console.log('callMoneyTransfer', apiResult)
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(apiResult, moneyTransferInfo);
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Lỗi chuyển tiền', apiResult.Message)
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
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API chuyển tiền",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }

        });
    }

    asyncModalLoading = (result, transferOutInfo) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.storeData(result.ResultObject.NewAccountBalance)
            this.gotoPaymentDetail(result, transferOutInfo);
        }
    }

    storeData = async (currentAmount) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            let userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                userInfo.currentAmount = currentAmount
            }
            await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
        }
    }

    gotoPaymentDetail = (result, transferOutInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PaymentDetail', {
            result: result,
            paymentInfo: transferOutInfo
        })
    }

    _onConfirmPassword = async (password) => {
        //let passwordMD5 = await MD5Digest(password);
        let passwordHashingSHA256 = HashingSHA256(password);
        Keychain.getGenericPassword().then(credentials => {
            const { username, password } = credentials;
            if (passwordHashingSHA256 == password) {
                this.setState({ isModalInputPassword: false })
                setTimeout(() => {
                    this.onConfirmTransferOut();
                }, 200);
            }
            else {
                let errors = {}
                errors.password = "Mật khẩu Ví không đúng! Vui lòng nhập lại"
                this.setState({ errors })
            }
        });
    }

    onCloseModalAlert = (value) => {
        const { actionModalAlert } = this.state
        this.setState({ isModalAlert: false, typeModalAlert: '', actionModalAlert: '' })
        if (actionModalAlert == '1') {
            this.props.navigation.navigate('SignIn')
        }
    }

    render() {
        let { phoneName, phoneNumber, titleAvatar, errors, amount, isLoading, isModalInputPassword,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View style={styles.container}>
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
                <View style={styles.containerInfoUser}>
                    <Avatar rounded size="large" title={titleAvatar} activeOpacity={0.5}
                        containerStyle={{ marginVertical: 10 }}
                    />
                    <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "400" }}>
                        {phoneName}
                    </Text>
                    <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>
                        {phoneNumber}
                    </Text>
                </View>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                    <TransferOutToMWGPayContent
                        errors={errors}
                        onChangeText={this.onChangeText}
                        value={amount}
                        upwardLimit={20000000}
                        downwardLimit={10000}
                    />
                    <DefaultMoney onPress={this.onChangeText} />
                </KeyboardAwareScrollView>
                <ButtonBottomComponent
                    title="Xác nhận thanh toán"
                    onPress={this.onPreConfirm}
                />
                <View>
                    <ModalBottomHalf
                        isVisible={isModalInputPassword}
                        content={
                            <ModalConfigContent
                                modalType="Password"
                                // password={password}
                                onClose={() => this.setState({ isModalInputPassword: false })}
                                // _onConfirm={() => this.setState({ isModalInputPassword: true })}
                                errors={errors}
                                onConfirm={this._onConfirmPassword}
                            // styleContainer={styleContainerModal}
                            />
                        }
                    />
                </View>
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
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
    };
};

const TransferOutToMWGPay = connect(mapStateToProps, mapDispatchToProps)(TransferOutToMWGPayCom);
export default TransferOutToMWGPay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerInfoUser: {
        width: "95%",
        height: 120,
        justifyContent: "center",
        marginVertical: 10,
        alignItems: "center"
    },
});