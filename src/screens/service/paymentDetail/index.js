import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'

import { callFetchAPI } from "@actions/fetchAPIAction";
import { updateAccountBalance } from "@actions/walletAction";

import { formatMoney } from '@utils/function';

import { Service_Type_Card_ID, Service_Type_Phone_Recharge_ID, Service_Type_Bill_ID } from '@constants/appSetting';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import SuccessComponent from '@components/paymentDetail/Success'
import FailComponent from '@components/paymentDetail/Fail'

export class PaymentDetailCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Chi tiết giao dịch',
        header: null,
    })

    constructor() {
        super()
        this.state = {
            errorMessage: "",
            titleTopInfo: "",
            topMessage: "",
            flDataCard: [],
            flOtherInfo: [],
        }
    }

    componentDidMount() {

        const result = this.props.navigation.getParam('result', {});
        const currentAccountBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        const paymentInfo = this.props.navigation.getParam('paymentInfo', {});

        const topMessage = this.renderTopMessage(paymentInfo);
        let titleTopInfo = "GIAO DỊCH THÀNH CÔNG";
        let errorMessage = "";
        let flDataCard = [];
        let flOtherInfo = [];

        if (result.IsError) {
            errorMessage = result.Message;
            titleTopInfo = "GIAO DỊCH KHÔNG THÀNH CÔNG(MWGPay)";
        }
        else if (result.ResultObject.IsTransactionError) {
            if (result.ResultObject.ResponseMessage)
                errorMessage = result.ResultObject.ResponseMessage;
            titleTopInfo = "GIAO DỊCH KHÔNG THÀNH CÔNG(Nhà Cung Cấp)";
        }
        else {
            flDataCard = []
            if (result.ResultObject.CardList) {
                result.ResultObject.CardList.map((e, i) => {
                    flDataCard.push({
                        leftTitle: "Mã Thẻ",
                        rightTitle: e.CardPincode,
                        subTitle: `Serial: ${e.CardSerial}`,
                        writeToClipboard: true
                    })
                })
            }
        }
        flOtherInfo = [
            {
                leftTitle: "Số Dư Trong Ví",
                rightTitle: formatMoney(currentAccountBalance, 0),
            },
            {
                leftTitle: "Mã Giao Dịch",
                rightTitle: result.ResultObject.TransactionID ? result.ResultObject.TransactionID : result.ResultObject.ServiceTransID,
            },
        ]

        this.setState({
            errorMessage,
            titleTopInfo,
            topMessage,
            flDataCard,
            flOtherInfo
        })

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
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

    ratingCompleted = (rating) => {
        // console.log("Rating is: " + rating)
    }

    renderTopMessage = (paymentInfo) => {
        let topMessage = "Giao dịch thành công";
        switch (paymentInfo.ServiceTypeID) {

            case Service_Type_Card_ID:
                topMessage = `Quý khách đã mua thành công ${paymentInfo.Quantity} mã thẻ điện thoại ${paymentInfo.DataNetworkSelect.title} mệnh giá ${formatMoney(paymentInfo.ServiceAmount, 0)}đ`;
                break;
            case Service_Type_Phone_Recharge_ID:
                topMessage = `Quý khách đã Nạp ${formatMoney(paymentInfo.ServiceAmount, 0)}đ cho SĐT ${paymentInfo.CustomerCode}`;
                break;
            case Service_Type_Bill_ID:
                topMessage = `Đã thanh toán ${formatMoney(paymentInfo.ServiceAmount, 0)}đ cho hóa đơn ${paymentInfo.CustomerCode} của dịch vụ ${paymentInfo.DataNetworkSelect.MerchantServiceName}`;
                break;
        }
        return topMessage
    }

    onConfirm = () => {
        this.props.navigation.popToTop();
    }

    render() {
        const { errorMessage, topMessage, titleTopInfo, flDataCard, flOtherInfo } = this.state
        return (
            <View style={styles.container}>
                {errorMessage.length <= 0
                    ? <SuccessComponent
                        titleTopInfo={titleTopInfo}
                        topMessage={topMessage}
                        flDataCard={flDataCard}
                        flOtherInfo={flOtherInfo}
                    />
                    : <FailComponent
                        titleTopInfo={titleTopInfo}
                        topMessage={topMessage}
                        errorMessage={errorMessage}
                        flOtherInfo={flOtherInfo}
                    />
                }
                <ButtonBottomComponent
                    title="Quay về màn hình chính"
                    onPress={this.onConfirm}
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

const PaymentDetail = connect(mapStateToProps, mapDispatchToProps)(PaymentDetailCom);
export default PaymentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#e8eaec',
    },
});