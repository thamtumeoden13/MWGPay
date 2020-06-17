import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { updateAccountBalance } from "@actions/walletAction";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";


class InvoiceInfoCom extends Component {
    static navigationOptions = {
        title: 'Thông tin thanh toán'
    }
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: '',//0909607273
            value: 0,
            errors: {},
            isLoading: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, })
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

    onSubmitInvoice = () => {
        this.setState({ isLoading: true })
        const { phoneNumber, value } = this.state
        if (phoneNumber.length > 0 && value > 0) {
            const paymentInfo = {
                MerchantID: '0101101012',
                CounterNumber: '',
                BillNumber: '123',
                ServiceID: 1,
                ServiceName: 'Thanh toán tiền cước trả sau',
                Amount: value,
                TransactionContent: 'Thanh toán điện thoại trả sau:  ' + phoneNumber

            }
            this.callPayment(paymentInfo);
        }
        else {
            let errors = {}
            if (phoneNumber.length <= 0)
                errors.phoneNumber = 'Vui lòng nhập số điện thoại'
            if (value <= 0)
                errors.value = 'Vui lòng Nhập số tiền!'
            this.setState({ errors })
        }
    }

    callPayment = (paymentInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Transaction/Payment";
        this.props.callFetchAPI(APIHostName, APIPath, paymentInfo).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi thanh toán',
                        contentModalAlert: apiResult.Message
                    });
                }, 100);
            } else {
                Alert.alert("Thông báo",
                    "Thanh toán thành công",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(apiResult)
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.updateAccountBalance(result.ResultObject.NewAccountBalance);
            this.storeData(result.ResultObject.NewAccountBalance)
            this.props.navigation.popToTop()
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

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isLoading,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
        return (
            <View>
                <View style={{ height: Math.floor(Dimensions.get('window').height) - 230, }}>
                    <Card
                        image={this.props.navigation.state.params.PartnerItem.img_uri}
                        imageStyle={{ height: 60, width: 70, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 5, }}
                    >
                        <View style={styles.cardContent}>

                            <View style={styles.item}>
                                <View style={styles.pullLeft}>
                                    <Text>Mã khách hàng</Text>
                                </View>
                                <View style={styles.pullRight}>
                                    <Text>số tiền thanh toán</Text>
                                </View>
                            </View>
                            <View style={styles.item}>
                                <View style={styles.pullLeft}>
                                    <Text>Khách hàng</Text>
                                </View>
                                <View style={styles.pullRight}>
                                    <Text>Nguyễn Văn A</Text>
                                </View>
                            </View>
                            <View style={[styles.item, { borderBottomWidth: 1, borderBottomColor: 'gray', paddingBottom: 10, }]}>
                                <View style={styles.pullLeft}>
                                    <Text>Số điện thoại</Text>
                                </View>
                                <View style={styles.pullRight}>
                                    <Text>
                                        {
                                            this.props.navigation.state.params.PhoneNumber
                                        }
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.item, { marginTop: 5, }]} >
                                <View style={styles.pullLeft}>
                                    <Text>Số tiền</Text>
                                </View>
                                <View style={styles.pullRight}>
                                    <Text>12312</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                <ButtonBottomComponent
                    title="Xác nhận hóa đơn"
                    onPress={this.onSubmitInvoice}
                />
                <ModalLoading
                    isVisible={isLoading}
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

const InvoiceInfo = connect(mapStateToProps, mapDispatchToProps)(InvoiceInfoCom);
export default InvoiceInfo;

const styles = StyleSheet.create({
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