import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Dimensions,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';

import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalComponent } from '@componentsCommon/modal';
import { formatMoney, getDisplayDetailModalAlert } from '@utils/function';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { DefaultMoney } from '@components/defaultMoney';
import { MIN_TOP_UP_FROM_BANK, MAX_TOP_UP_FROM_BANK, MAX_TOP_UP_FROM_BANK_WITH_OTP } from '@constants/appSetting'

class TopUpFromBankConnectedCom extends Component {
    static navigationOptions = {
        title: 'Nạp Tiền Từ Ngân Hàng Liên Kết',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            isMoneyValid: true,
            bankAccountID: '',
            currentBalance: 0,
            listBankConnect: [{
                title: 'Thêm liên kết',
                rightTitle: '',
                image_url: 'card-plus-icon.png',
                BankAccountID: '',
                CardMask: '',
                WalletID: ''
            }],
            isLoading: false,
            isModalVisible: false,
            errors: {},
            phoneNumber: '',
            upwardLimit: MAX_TOP_UP_FROM_BANK,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        };
    }

    componentDidMount() {
        this.storeData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
            this.setState({ currentBalance, isLoading: true, });
            setTimeout(async () => {
                this.getBankAccount();
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalVisible: false, isModalAlert: false })
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

    getBankAccount = () => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/BankAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    let listBankConnect = []
                    if (apiResult.ResultObject.length > 0) {
                        apiResult.ResultObject.map((item, index) => {
                            listBankConnect.push({
                                title: item.BankShortName,
                                rightTitle: item.CardMask,
                                image_url: item.BankLogoURL,
                                BankAccountID: item.BankAccountID,
                                CardMask: item.CardMask,
                                WalletID: item.WalletID

                            })
                        })
                    }
                    else {
                        listBankConnect = [{
                            title: 'Thêm liên kết',
                            rightTitle: '',
                            image_url: 'card-plus-icon.png',
                            BankAccountID: '',
                            CardMask: '',
                            WalletID: ''
                        }]
                        Alert.alert("Chưa liên kết thẻ",
                            "Vui lòng liên kết thẻ để tiếp tục giao dịch",
                            [
                                {
                                    text: 'Không phải lúc này',
                                    onPress: () => this.goToPartnerLink(false),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Đồng ý',
                                    onPress: () => this.goToPartnerLink(true),
                                    style: 'Ok',
                                }
                            ],
                            { cancelable: false },
                        );
                    }
                    this.setState({
                        listBankConnect: listBankConnect,
                        bankAccountID: listBankConnect[0].BankAccountID,
                    });
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: "Lỗi lấy danh sách thẻ liên kết",
                            contentModalAlert: apiResult.Message
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
                        titleModalAlert: "Lỗi gọi API lấy danh sách thẻ liên kết",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    amountChanged = (value) => {
        this.setState({
            amount: formatMoney(value, 0),
            errors: {}
        });
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
                    contentModalAlert: `Vui lòng nhập số tiền cần chuyển nhỏ hơn ${formatMoney(upwardLimit, 0)} vnd`,
                })
            }, 100);
        }
        else {
            this.onConfirmTopUp();
        }
    }

    onConfirmTopUp = () => {
        const { amount, bankAccountID, currentBalance } = this.state;
        const convertAmount = amount.toString().replace(new RegExp(',', 'g'), "") !== '' ? amount.toString().replace(new RegExp(',', 'g'), "") : 0
        if (convertAmount > 0 && convertAmount >= MIN_TOP_UP_FROM_BANK) {
            this.setState({ isLoading: true });
            const signature = createSignature(bankAccountID + convertAmount);
            const topUpInfo = {
                BankAccountID: bankAccountID,
                Amount: amount,
                Signature: signature
            };
            if (convertAmount <= MAX_TOP_UP_FROM_BANK_WITH_OTP) {
                this.topUp(topUpInfo);
            }
            else {
                this.topUpWithOTP(topUpInfo);
            }
        }
        else {
            let errors = {}
            switch (true) {
                case convertAmount <= 0:
                    errors.amount = 'Vui lòng nhập số tiền cần nạp';
                    break;

                case convertAmount < MIN_TOP_UP_FROM_BANK:
                    errors.amount = 'Số tiền phải lớn hơn hoặc bằng 10,000đ';
                    break;

            }
            this.setState({ errors, isLoading: false })
        }
    }

    topUp = (topUpInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/Topup";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, topUpInfo).then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(apiResult, topUpInfo);
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        const { phoneNumber } = this.state
                        let typeModalAlert = 'error';
                        let titleModalAlert = 'Lỗi nạp tiền'
                        let contentModalAlert = apiResult.MessageDetail
                        if (apiResult.StatusID == 18 || apiResult.StatusID == 23) {
                            this.setState({ actionModalAlert: '1' })
                            if (apiResult.StatusID == 23) {
                                typeModalAlert = 'warning'
                                titleModalAlert = 'Cảnh báo đăng nhập thiết bị mới'
                                contentModalAlert = `Vui lòng đăng nhập lại và xác nhận OTP để thay đổi thiết bị sử dụng tài khoản ${phoneNumber}`
                            }
                        }
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: typeModalAlert,
                            titleModalAlert: titleModalAlert,
                            contentModalAlert: contentModalAlert
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
                        titleModalAlert: "Lỗi hệ thống gọi API nạp tiền",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    topUpWithOTP = (topUpInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/TopupWithOTP";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, topUpInfo).then(apiResult => {
            this.asyncModalLoading();
            if (apiResult) {
                if (apiResult.IsError) {
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Thông báo', 'Gửi OTP không thành công.Vui lòng thử lại!')
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
                    setTimeout(() => {
                        this.props.navigation.navigate("ConfirmOTPTopUp", {
                            transactionID: apiResult.ResultObject,
                            phoneNumber: this.state.phoneNumber
                        })
                    }, 500);
                }
            }
            else {
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API nạp tiền",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (result, topUpInfo) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.gotoPaymentDetail(result, topUpInfo);
        }
    }

    gotoPaymentDetail = (result, topUpInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PaymentDetail', {
            result: result,
            paymentInfo: topUpInfo
        })
    }

    goToPartnerLink = (value) => {
        this.setState({ isLoading: false })
        if (value) {
            this.props.navigation.push("PartnerLink1")
        }
        else {
            this.props.navigation.popToTop()
        }
    }
    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    phoneNumber: userInfo.phoneNumber
                })
            }
        }
    }

    _onChangeValue = (value) => {
        this.amountChanged(value)
    }

    onPressItemDisplay = () => {
        const { listBankConnect } = this.state
        if (listBankConnect[0].BankAccountID.length <= 0) {
            const rootRoute = this.props.navigation.state.params.rootRoute;
            if (rootRoute === "Home") {
                this.props.navigation.navigate("PartnerLink1");
            }
            else {
                this.props.navigation.navigate("PartnerLink2");
            }
        }
        else {
            this.setState({ isModalVisible: true })
        }
    }

    onChangeItem = (index, item) => {
        this.setState({ bankAccountID: item.BankAccountID })
    }

    onCloseModalAlert = (value) => {
        const { actionModalAlert } = this.state
        this.setState({ isModalAlert: false, typeModalAlert: '', actionModalAlert: '' })
        if (actionModalAlert == '1') {
            this.props.navigation.navigate('SignIn')
        }
    }

    render() {
        const { amount, listBankConnect, isLoading, errors, isModalVisible, hasConnectedBank,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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
                <View style={styles.containerContent}>
                    <ModalComponent
                        data={listBankConnect}
                        rowItemType="RowItemModal"
                        headerTitle="Chọn nguồn tiền"
                        isModalVisible={isModalVisible}
                        onPressItemDisplay={this.onPressItemDisplay}
                        onChangeItem={this.onChangeItem}
                    />
                    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                        <View style={styles.inputMoney}>
                            <TextField
                                label='Nhập số tiền muốn nạp'
                                inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, marginLeft: 'auto', marginRight: 'auto' }}
                                value={amount == 0 ? '' : amount}
                                onChangeText={(value) => this.amountChanged(value)}
                                clearButtonMode="always"
                                prefix="$"
                                keyboardType="number-pad"
                                error={errors.amount}
                                autoFocus={hasConnectedBank ? hasConnectedBank : false}
                                maxLength={10}
                            />
                        </View>
                        <DefaultMoney onPress={this._onChangeValue} />
                    </KeyboardAwareScrollView>
                    <View style={styles.labelBottomContent}>
                        <Text style={{ textAlign: "center", marginTop: 20, }}>
                            Quý khách cần phải duy trì số dư tối thiếu trong tài khoản ngân hàng là 50,000đ.
                             Vui lòng kiểm tra trước khi thực hiện giao dịch.
                         </Text>
                    </View>
                </View>
                <ButtonBottomComponent
                    title="Xác nhận Nạp tiền"
                    onPress={this.onPreConfirm}
                />
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
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
    };
};

const TopUpFromBankConnected = connect(mapStateToProps, mapDispatchToProps)(TopUpFromBankConnectedCom);
export default TopUpFromBankConnected;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    containerContent: {
        width: "100%",
        flex: 1
    },
    inputMoney: {
        marginTop: 10,
        marginBottom: 30,
        marginHorizontal: 10,
        height: 40,
    },
    labelBottomContent: {
        width: '95%',
        marginHorizontal: "2.5%",
        marginVertical: 20,
        height: 100,
        flexDirection: "row",
    },
});