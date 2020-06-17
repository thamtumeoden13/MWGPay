import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

import { ModalComponent } from '@componentsCommon/modal';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { formatMoney, getDisplayDetailModalAlert } from '@utils/function';
import { DefaultMoney } from '@components/defaultMoney';

class CashOutCom extends Component {
    static navigationOptions = {
        title: 'Rút tiền về thẻ',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            numberMoney: '',
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
            isModalVisible: false,
            isLoading: false,
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        };
    }

    componentDidMount() {
        this.storeData()
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
            this.setState({ isLoading: true, currentBalance })
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

    onPartnerLink = () => {
        this.setState({ isLoading: false })
        const rootRoute = this.props.navigation.state.params.rootRoute;
        if (rootRoute === "Home") {
            this.props.navigation.push("PartnerLink1");
        }
        else {
            this.props.navigation.push("PartnerLink2");
        }
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
                                    onPress: () => this.props.navigation.popToTop(),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Đồng ý',
                                    onPress: () => this.onPartnerLink(),
                                    style: 'Ok',
                                }
                            ],
                            { cancelable: false },
                        );
                    }
                    this.setState({
                        listBankConnect: listBankConnect,
                        bankAccountID: listBankConnect[0].BankAccountID
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
                        contentModalAlert: "Vui lòng tắt app và thao tác lại."
                    })
                }, 100);
            }

        });
    }

    amountChanged = (value) => {
        this.setState({
            numberMoney: formatMoney(value, 0),
            errors: {}
        });
    }

    onCashOut = () => {
        const { numberMoney, bankAccountID, currentBalance } = this.state;
        const convertNumber = numberMoney.toString().replace(new RegExp(',', 'g'), "") !== '' ? numberMoney.toString().replace(new RegExp(',', 'g'), "") : 0
        if (convertNumber > 0 && convertNumber <= currentBalance && convertNumber >= 10000 && convertNumber <= 3000000) {
            this.setState({ isLoading: true });
            const signature = createSignature(bankAccountID + convertNumber);

            const cashOutInfo = {
                BankAccountID: bankAccountID,
                Amount: numberMoney,
                Signature: signature
            };
            this.cashOut(cashOutInfo);
        }
        else {
            let errors = {}
            switch (true) {
                case convertNumber <= 0:
                    errors.amount = 'Vui lòng nhập số tiền cần rút';
                    break;

                case convertNumber < 10000:
                    errors.amount = 'Số tiền phải lớn hơn hoặc bằng 10,000đ';
                    break;

                case currentBalance < 10000:
                    errors.amount = 'Số dư ví không đủ để thực hiện giao dịch';
                    break;

                case convertNumber > currentBalance:
                    errors.amount = 'Số tiền rút phải nhỏ hơn hoặc bằng số dư ví (' + formatMoney(currentBalance, 0) + 'đ)';
                    break;

                case convertNumber > 3000000:
                    errors.amount = 'Số tiền rút vượt quá hạn mức 3,000,000đ/lần';
                    break;

            }
            this.setState({ errors, isLoading: false })
        }
    }

    cashOut = (cashOutInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/Cashout";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, cashOutInfo).then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(apiResult, cashOutInfo);
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Lỗi rút tiền từ ví về thẻ', apiResult.MessageDetail)
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
                        titleModalAlert: "Lỗi hệ thống gọi API rút tiền",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (result, cashOutInfo) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.storeData(result.ResultObject.NewAccountBalance)
            this.gotoPaymentDetail(result, cashOutInfo);
        }
    }

    gotoPaymentDetail = (result, cashOutInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PaymentDetail', {
            result: result,
            paymentInfo: cashOutInfo
        })
    }

    storeData = async (currentAmount) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            let userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    phoneNumber: userInfo.phoneNumber
                })
                if (currentAmount) {
                    userInfo.currentAmount = currentAmount
                }
            }
            await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
        }
    }

    _onChangeValue = (value) => {
        this.amountChanged(value)
    }

    onPressItemDisplay = () => {
        const { listBankConnect } = this.state
        if (listBankConnect[0].BankAccountID.length <= 0) {
            this.props.navigation.navigate("PartnerLink1")
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
        const { numberMoney, listBankConnect, isLoading, errors, isModalVisible, hasConnectedBank,
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
                <View style={styles.containerContent}>
                    <ModalComponent
                        data={listBankConnect}
                        rowItemType="RowItemModal"
                        headerTitle="Chọn TK nhận tiền"
                        isModalVisible={isModalVisible}
                        onPressItemDisplay={this.onPressItemDisplay}
                        onChangeItem={this.onChangeItem}
                    />
                    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                        <View style={styles.inputMoney}>
                            <TextField
                                label='Nhập số tiền muốn rút'
                                inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                                value={numberMoney == 0 ? '' : numberMoney}
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
                </View>
                <ButtonBottomComponent
                    title="Xác nhận rút tiền"
                    onPress={this.onCashOut}
                />
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

const CashOut = connect(mapStateToProps, mapDispatchToProps)(CashOutCom);
export default CashOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    containerContent: {
        flex: 1,
        width: '100%',
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
    },

});