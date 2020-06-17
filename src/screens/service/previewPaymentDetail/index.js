import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Button,
    AlertIOS,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { formatMoney, getDisplayDetailModalAlert } from '@utils/function';
import { ModalItemDisplay } from '@componentsCommon/modal/ModalItemDisplay';
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigContent } from '@components/personalInfo/ModalConfigContent';
import PreviewComponent from '@components/previewPaymentDetail'
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { MODAL_CONFIRM_PASSWORD_SERVICE_ID_CONFIG } from '@constants/appSetting'

const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: true, // use unified error messages (default false)
    passcodeFallback: true,
}

class PreviewPaymentDetailCom extends Component {
    static navigationOptions = {
        title: 'Xem Trước Chi Tiết Giao Dịch'
    }

    constructor(props) {
        super(props)
        const paymentInfo = this.props.navigation.getParam('paymentInfo', {});
        const paymentKey = this.props.navigation.getParam('paymentKey', 1);
        const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        this.state = {
            paymentInfo: paymentInfo,
            paymentKey: paymentKey,
            currentBalance: currentBalance,
            isLoading: false,
            isModalInputPassword: false,
            hasModalInputPassword: false,
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        }
    }

    componentDidMount = () => {
        const { paymentInfo } = this.state
        const hasModalInputPassword = MODAL_CONFIRM_PASSWORD_SERVICE_ID_CONFIG.includes(paymentInfo.ServiceID.toString());
        this.setState({ hasModalInputPassword })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, isModalInputPassword: false, hasModalInputPassword: false })
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
                }, timeout);
            }, 500);
        });
        this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
            clearInterval(this.interval);
        });

        TouchID.isSupported()
            .then(biometryType => {
                // console.log("biometryType", biometryType)
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

    onPreSubmitInvoice = () => {
        const { hasModalInputPassword } = this.state
        if (hasModalInputPassword) {
            this.setState({ isModalInputPassword: true })
        }
        else {
            this.onSubmitInvoice();
        }
    }

    onSubmitInvoice = () => {
        this.asyncModalLoadingEnable();
        const { paymentInfo, currentBalance } = this.state
        if (paymentInfo.TransactionAmount > 0 && paymentInfo.TransactionAmount <= currentBalance) {
            const dataToSign = paymentInfo.MerchantID
                + paymentInfo.MerchantServiceTypeID
                + paymentInfo.MerchantServiceID
                + paymentInfo.CounterNumber
                + paymentInfo.BillNumber
                + paymentInfo.ServiceID
                + paymentInfo.ServiceTypeID
                + paymentInfo.ServiceName
                + paymentInfo.ParValueID
                + paymentInfo.Quantity
                + paymentInfo.CustomerCode
                + paymentInfo.CustomerName
                + paymentInfo.CustomerAddress
                + paymentInfo.BillCycle
                + paymentInfo.BillInfo
                + paymentInfo.BillAmount
                + paymentInfo.ServiceFee
                + paymentInfo.ServicePunishFee
                + paymentInfo.ServiceCostPrice
                + paymentInfo.ServiceAmount
                + paymentInfo.TransactionAmount
                + paymentInfo.TransactionContent;
            const dataToSign2 = paymentInfo.MerchantID + "-"
                + paymentInfo.MerchantServiceTypeID + "-"
                + paymentInfo.MerchantServiceID + "-"
                + paymentInfo.CounterNumber + "-"
                + paymentInfo.BillNumber + "-"
                + paymentInfo.ServiceID + "-"
                + paymentInfo.ServiceTypeID + "-"
                + paymentInfo.ServiceName + "-"
                + paymentInfo.ParValueID + "-"
                + paymentInfo.Quantity + "-"
                + paymentInfo.CustomerCode + "-"
                + paymentInfo.CustomerName + "-"
                + paymentInfo.CustomerAddress + "-"
                + paymentInfo.BillCycle + "-"
                + paymentInfo.BillInfo + "-"
                + paymentInfo.BillAmount + "-"
                + paymentInfo.ServiceFee + "-"
                + paymentInfo.ServicePunishFee + "-"
                + paymentInfo.ServiceCostPrice + "-"
                + paymentInfo.ServiceAmount + "-"
                + paymentInfo.TransactionAmount + "-"
                + paymentInfo.TransactionContent + "-";

            const signature = createSignature(dataToSign);
            const servicePaymentInfo = {
                MerchantID: paymentInfo.MerchantID,
                MerchantServiceTypeID: paymentInfo.MerchantServiceTypeID,
                MerchantServiceID: paymentInfo.MerchantServiceID,
                CounterNumber: paymentInfo.CounterNumber,
                BillNumber: paymentInfo.BillNumber,
                ServiceID: paymentInfo.ServiceID,
                ServiceTypeID: paymentInfo.ServiceTypeID,
                ServiceName: paymentInfo.ServiceName,
                ParValueID: paymentInfo.ParValueID,
                Quantity: paymentInfo.Quantity,

                CustomerCode: paymentInfo.CustomerCode,// Mã khách hàng
                CustomerName: paymentInfo.CustomerName,// Tên khách hàng
                CustomerAddress: paymentInfo.CustomerAddress,// Địa chỉ khách hàng
                BillCycle: paymentInfo.BillCycle,// Chu kỳ cước
                BillInfo: paymentInfo.BillInfo,// Thông tin hóa đơn
                BillAmount: paymentInfo.BillAmount,// Số tiền nợ cước
                ServiceFee: paymentInfo.ServiceFee,// Phí thanh toán
                ServicePunishFee: paymentInfo.ServicePunishFee,// Phí phạt
                ServiceCostPrice: paymentInfo.ServiceCostPrice,// Giá vốn dịch vụ
                ServiceAmount: paymentInfo.ServiceAmount,
                TransactionAmount: paymentInfo.TransactionAmount,
                TransactionContent: paymentInfo.TransactionContent,
                DataNetworkSelect: paymentInfo.DataNetworkSelect,
                Partner: paymentInfo.MerchantServiceName,
                Signature: signature,
            }
            setTimeout(() => {
                this.callServicePayment(servicePaymentInfo);
            }, 500);
        }
        else {
            let message = ''
            if (paymentInfo.TransactionAmount == 0) {
                message = 'Không nợ cước!'
            }
            else {
                message = 'Số dư Ví không đủ! Vui lòng nạp tiền vào Ví để tiếp tục giao dịch'
            }
            this.asyncModalLoading();
            setTimeout(() => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: 'Lỗi thanh toán',
                    contentModalAlert: message
                });
            }, 100);
        }
    }

    callServicePayment = (servicePaymentInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Transaction/ServicePayment";
        this.props.callFetchAPI(APIHostName, APIPath, servicePaymentInfo).then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(apiResult, servicePaymentInfo);
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Lỗi thanh toán', apiResult.Message)
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
                        titleModalAlert: "Lỗi hệ thống gọi API thanh toán",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    });
                }, 100);
            }
        });
    }

    gotoPaymentDetail = (result, paymentInfo) => {
        this.setState({ isLoading: false })

        this.props.navigation.navigate('PaymentDetail', {
            result: result,
            paymentInfo: paymentInfo
        })
    }

    asyncModalLoading = (result, paymentInfo) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.storeData(result.ResultObject.NewAccountBalance)
            this.gotoPaymentDetail(result, paymentInfo);
        }
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
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

    _onConfirmPassword = async (value) => {
        Keychain.getGenericPassword().then(credentials => {
            const { username, password } = credentials;
            if (value == password) {
                this.setState({ isModalInputPassword: false })
                setTimeout(() => {
                    this.onSubmitInvoice();
                }, 500);
            }
            else {
                let errors = {}
                errors.password = "Mật khẩu Ví không đúng! Vui lòng nhập lại"
                this.setState({ errors })
            }
        });
    }

    _onTouchIDConfirmPassword = () => {
        this.clickHandler()
    }

    authenticate = () => {
        TouchID.authenticate('Mở khóa bằng vân tay', optionalConfigObject).then(success => {
            Keychain.getGenericPassword().then(credentials => {
                const { username, password } = credentials;
                this._onConfirmPassword(password)
            });
        })
            .catch(error => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: error.name,
                    contentModalAlert: error.message
                });
            });
    }

    clickHandler = () => {
        TouchID.isSupported()
            .then(this.authenticate)
            .catch(error => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'warning',
                    titleModalAlert: 'Thông báo',
                    contentModalAlert: 'Không hỗ trợ TouchID'
                });
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
        const { currentBalance, paymentInfo, paymentKey, errors,
            isLoading, isModalInputPassword,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
        return (
            <View style={styles.container}>
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
                <ModalItemDisplay
                    image_url="card-plus-icon.png"
                    title="Số Dư Ví MWG"
                    rightTitle={formatMoney(currentBalance, 0) + "đ"}
                />
                <PreviewComponent
                    paymentInfo={paymentInfo}
                    paymentKey={paymentKey}
                />
                <View>
                    <ModalBottomHalf
                        isVisible={isModalInputPassword}
                        content={
                            <ModalConfigContent
                                modalType="Password"
                                onClose={() => this.setState({ isModalInputPassword: false })}
                                errors={errors}
                                onConfirm={this._onConfirmPassword}
                                onConfirmTouchID={this._onTouchIDConfirmPassword}
                            />
                        }
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <ButtonBottomComponent
                        title="Xác nhận hóa đơn"
                        onPress={this.onPreSubmitInvoice}
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

const PreviewPaymentDetail = connect(mapStateToProps, mapDispatchToProps)(PreviewPaymentDetailCom);
export default PreviewPaymentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardContent: {
        borderColor: '#bdb9b95c',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    item: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    pullLeft: {
        flexDirection: 'column',
        width: '50%',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
    pullRight: {
        flexDirection: 'column',
        width: '50%',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
});