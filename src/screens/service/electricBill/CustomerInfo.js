import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { callGetCache } from "@actions/cacheAction";
import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";

import { CDN_IMG } from "@constants/systemVars.js";
import { serviceFee } from '@utils/function';
import { Service_Type_Bill_ID } from '@constants/appSetting';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import PaymentCustomerInfo from '@components/paymentCustomerInfo'

class CustomerInfoCom extends Component {
    static navigationOptions = {
        title: 'Thông tin thanh toán hóa đơn'
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dataItem: {},
            billID: "",
            serviceID: "",
            urlImg: "",
            cacheDataServiceMerchantMap: [],
            serviceMerchantMapItem: {},
            dataNetworkSelect: {},
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        const dataItem = this.props.navigation.getParam('dataItem', { serviceID: "", urlImg: "" });
        this.setState({
            dataItem: dataItem,
            serviceID: dataItem.ServiceID,
            urlImg: CDN_IMG + dataItem.ServiceLogoURL,
        })
        this.getCacheServiceMerchantMap(dataItem.ServiceID);

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false })
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

    getServiceMerchantMap = (resultMerchantMap, serviceID) => {
        const { dataItem } = this.state;
        if (resultMerchantMap.length > 0) {
            resultMerchantMap.filter((item, index) => {
                if (item.ServiceID == serviceID) {
                    dataItem.MerchantID = item.MerchantID;
                    dataItem.MerchantServiceID = item.MerchantServiceID;
                    dataItem.MerchantServiceName = item.MerchantServiceName;
                    dataItem.MerchantServiceTypeID = item.MerchantServiceTypeID;
                    dataItem.ParValueID = item.ParValueID;
                    this.setState({
                        serviceMerchantMapItem: item,
                        isLoading: false,
                    })
                }
            })
        }
    }

    getCacheServiceMerchantMap = (serviceID) => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE_MERCHANTMAP";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    cacheDataServiceMerchantMap: cacheResult.ResultObject.CacheData,
                })
                this.getServiceMerchantMap(cacheResult.ResultObject.CacheData, serviceID);
            } else {
                Alert.alert("Lỗi lấy thông tin",
                    apiResult.Message,
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    onSubmitInfoBill = () => {
        const { billID, serviceID, dataItem } = this.state;
        if (billID.length > 0) {
            this.setState({ isLoading: true })
            const signature = createSignature(dataItem.MerchantID + serviceID + dataItem.MerchantServiceID + billID);
            const billInfo = {
                MerchantID: dataItem.MerchantID,//
                ServiceID: serviceID,//
                MerchantServiceID: dataItem.MerchantServiceID,//MerchantServiceID
                CustomerCode: billID,//code:'PE04000065236'
                Signature: signature,
            };
            this.callBillQuery(billInfo);
        }
        else {
            let errors = {};
            errors.value = "Vui lòng nhập mã khách hàng"
            this.setState({ errors, isLoading: false });
        }

    }

    callBillQuery = (billInfo) => {
        const { dataItem, } = this.state;
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Transaction/BillQuery";
        this.props.callFetchAPI(APIHostName, APIPath, billInfo).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi lấy thông tin nợ cước',
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            } else {
                const fee = serviceFee(dataItem, apiResult.ResultObject.BillDebtAmount);
                const transactionAmount = apiResult.ResultObject.BillDebtAmount + fee;
                const paymentInfo = {
                    CustomerCode: apiResult.ResultObject.CustomerCode,// Mã khách hàng
                    CustomerName: apiResult.ResultObject.CustomerName,// Tên khách hàng
                    CustomerAddress: apiResult.ResultObject.CustomerAddress,// Địa chỉ khách hàng
                    BillCycle: apiResult.ResultObject.BillCycle,// Chu kỳ cước
                    BillInfo: apiResult.ResultObject.BillInfo,// Thông tin hóa đơn
                    BillAmount: apiResult.ResultObject.BillDebtAmount,// Số tiền nợ cước
                    ParValueID: "",
                    Quantity: 0,
                    MerchantID: dataItem.MerchantID,
                    MerchantServiceTypeID: apiResult.ResultObject.MerchantServiceTypeID,
                    MerchantServiceID: billInfo.MerchantServiceID,
                    CounterNumber: '',
                    BillNumber: '',
                    ServiceID: billInfo.ServiceID,
                    ServiceTypeID: Service_Type_Bill_ID,
                    ServiceName: dataItem.ServiceName, //dataNetworkSelect.ServiceCategoryName
                    ServiceFee: fee,// Phí thanh toán
                    ServicePunishFee: 0,// Phí phạt
                    ServiceCostPrice: 0,// Giá vốn dịch vụ
                    ServiceAmount: apiResult.ResultObject.BillDebtAmount,
                    Amount: apiResult.ResultObject.BillDebtAmount,
                    AmountPerCard: 0,
                    TransactionContent: 'Thu tiền điện cho hợp đồng ' + billInfo.CustomerCode,
                    TransactionAmount: transactionAmount,
                    Partner: dataItem.MerchantServiceName,
                    DataNetworkSelect: dataItem,
                }
                this.gotoPreviewPaymentDetail(paymentInfo);
            }
        });
    }

    gotoPreviewPaymentDetail = (paymentInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PreviewPaymentDetail', { paymentInfo: paymentInfo, paymentKey: 6 })
    }

    asyncModalLoading = (isErrorCallAPI) => {
        this.setState({ isLoading: false })
        if (isErrorCallAPI) {
            this.props.navigation.popToTop()
        }
    }

    onchangeValue = (value) => {
        this.setState({ billID: value })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { billID, urlImg, errors, isLoading, dataItem,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
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
                <PaymentCustomerInfo
                    urlImg={urlImg}
                    img_help={require('@assets/img/dv_dien.jpg')}
                    dataItem={dataItem}
                    errors={errors}
                    onchangeValue={this.onchangeValue}
                />
                <View>
                    <ButtonBottomComponent
                        title="Xác nhận đơn hàng"
                        onPress={this.onSubmitInfoBill}
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
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },
    };
};

const CustomerInfo = connect(mapStateToProps, mapDispatchToProps)(CustomerInfoCom);
export default CustomerInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
});