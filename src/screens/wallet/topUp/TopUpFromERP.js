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
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';

import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalComponent, } from '@componentsCommon/modal';
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigContent } from '@components/personalInfo/ModalConfigContent';
import { formatMoney, supportedTouchIDAndroid, supportedTouchID, authenticateTouchID, getDisplayDetailModalAlert } from '@utils/function';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { DefaultMoney } from '@components/defaultMoney';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

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

class TopUpFromERPCom extends Component {
    static navigationOptions = {
        title: 'Nạp Tiền Từ Tín Dụng MWG',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            numberMoney: '',
            isMoneyValid: true,
            creditAccountID: '',
            accountBalance: 0,
            listCreditConnect: [{
                title: 'Thêm liên kết',
                rightTitle: '',
                image_url: 'mwgLogo.jpeg',
                creditAccountID: '',        //1111111
                cardMask: '',             //2222222
                walletID: ''              //3333333
            }],
            isLoading: false,
            isModalVisible: false,
            isModalInputPassword: false,
            errors: {},
            phoneNumber: '',
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
            this.setState({ isLoading: true });
            setTimeout(async () => {
                this.getCreditAccountList();
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalVisible: false, isModalInputPassword: false, isModalAlert: false })
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
                }, timeout);
            }, 500);
        });
        this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
            clearInterval(this.interval);
        });

        TouchID.isSupported()
            .then(biometryType => {
                //console.log("biometryType", biometryType)
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

    getCreditAccountList = () => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult) {
                if (!apiResult.IsError) {
                    let listCreditConnect = []
                    if (apiResult.ResultObject.length > 0) {
                        this.getCreditAccountBalance(apiResult.ResultObject[0]);
                    }
                    else {
                        listCreditConnect = [{
                            title: 'Thêm liên kết',
                            rightTitle: '',
                            image_url: 'mwgLogo.jpeg',
                            creditAccountID: '',
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
                        this.setState({
                            listCreditConnect: listCreditConnect,
                            creditAccountID: '',
                        });
                    }
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

    getCreditAccountBalance = (creditAccount) => {
        const APIHostName = "CustomerEWalletAPI";
        const signature = createSignature(creditAccount.CreditAccountID);
        const requestData = { CreditAccountID: creditAccount.CreditAccountID, Signature: signature, };
        const SearchAPIPath = "api/CreditAccount/CheckCreditAccountBalance";

        this.props.callFetchAPI(APIHostName, SearchAPIPath, requestData).then(apiResult => {
            let listCreditConnect = []
            if (apiResult) {
                if (!apiResult.IsError) {
                    listCreditConnect.push({
                        title: creditAccount.CreditFullName,
                        rightTitle: formatMoney(apiResult.ResultObject.AccountBalance, 0),
                        image_url: 'mwgLogo.jpeg',
                        creditAccountID: creditAccount.CreditAccountID,
                        WalletID: creditAccount.WalletID
                    })
                    this.setState({
                        listCreditConnect: listCreditConnect,
                        creditAccountID: creditAccount.CreditAccountID,
                        accountBalance: apiResult.ResultObject.AccountBalance
                    });
                }
                else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: apiResult.Message,
                            contentModalAlert: apiResult.MessageDetail
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
                        titleModalAlert: "Lỗi gọi API lấy số dư tín dụng MWG",
                        contentModalAlert: "Vui lòng tắt app và thử lại!",
                    })
                }, 100);
            }
        });
    }

    creditAccountTopup = (topUpInfo) => {
        this.setState({ isLoading: true })
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/CreditAccountTopup";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, topUpInfo).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, apiResult.Message, apiResult.MessageDetail)
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
                    Alert.alert(
                        "Thông báo",
                        "Nạp tiền thành công",
                        [
                            {
                                text: 'Đồng ý',
                                onPress: () => this.asyncModalLoading(apiResult)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi gọi API nạp tiền từ tín dụng MWG",
                        contentModalAlert: "Vui lòng tắt app và thử lại!"
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

    _onConfirmPassword = () => {
        const { numberMoney, creditAccountID, accountBalance } = this.state;
        const convertNumber = numberMoney.toString().replace(new RegExp(',', 'g'), "") !== '' ? numberMoney.toString().replace(new RegExp(',', 'g'), "") : 0
        if (convertNumber > 0 && convertNumber >= 10000 && convertNumber <= accountBalance) {
            this.setState({ isModalInputPassword: true })
        }
        else {
            let errors = {}
            switch (true) {
                case convertNumber <= 0:
                    errors.amount = 'Vui lòng nhập số tiền cần nạp';
                    break;

                case convertNumber < 10000:
                    errors.amount = 'Số tiền phải lớn hơn hoặc bằng 10,000đ';
                    break;

                case convertNumber > accountBalance:
                    errors.amount = 'Hạn mức tín dụng không đủ';
                    break;
            }
            this.setState({ errors, isLoading: false })
        }
    }

    preTopUp = async (value) => {
        const { numberMoney, creditAccountID } = this.state;
        const convertNumber = numberMoney.toString().replace(new RegExp(',', 'g'), "") !== '' ? numberMoney.toString().replace(new RegExp(',', 'g'), "") : 0
        const signature = createSignature(creditAccountID + convertNumber);
        const topUpInfo = {
            CreditAccountID: creditAccountID,
            Amount: numberMoney,
            Signature: signature,
        };
        Keychain.getGenericPassword().then(credentials => {
            const { username, password } = credentials;
            if (value == password) {
                this.setState({ isModalInputPassword: false })
                setTimeout(() => {
                    this.creditAccountTopup(topUpInfo);
                }, 500);
            }
            else {
                let errors = {}
                errors.password = "Mật khẩu Ví không đúng! Vui lòng nhập lại"
                this.setState({ errors })
            }
        });
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
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
        const rootRoute = this.props.navigation.state.params.rootRoute;
        const { listCreditConnect } = this.state
        if (listCreditConnect[0].creditAccountID.length <= 0) {
            if (rootRoute === "Home") {
                this.props.navigation.navigate("CreditLink1");

            }
            else {
                this.props.navigation.navigate("CreditLink2");
            }
        }
    }

    onChangeItem = (index, item) => {
        this.setState({ creditAccountID: item.BankAccountID })
    }

    _onTouchIDConfirmPassword = () => {
        this.clickHandler()
    }

    authenticate = () => {
        TouchID.authenticate('Mở khóa bằng vân tay', optionalConfigObject)
            .then(success => {
                Keychain.getGenericPassword().then(credentials => {
                    const { username, password } = credentials;
                    this.preTopUp(password)
                });
            })
            .catch(error => {
                let resultErrors = authenticateTouchID(error.code);
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: "Xác thực sinh trắc học",
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
                    typeModalAlert: 'error',
                    titleModalAlert: "Xác thực sinh trắc học",
                    contentModalAlert: resultErrors
                })
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
        const { numberMoney, listCreditConnect, errors, hasConnectedBank,
            isLoading, isModalVisible, isModalInputPassword,
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
                        data={listCreditConnect}
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
                    title="Xác nhận Nạp tiền"
                    onPress={this._onConfirmPassword}
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
                                onConfirm={this.preTopUp}
                                onConfirmTouchID={this._onTouchIDConfirmPassword}
                            />
                        }
                    />
                </View>
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

const TopUpFromERP = connect(mapStateToProps, mapDispatchToProps)(TopUpFromERPCom);
export default TopUpFromERP;
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