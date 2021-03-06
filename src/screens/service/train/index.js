
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Service_Type_Bill_ID } from '@constants/appSetting';
import { serviceFee } from '@utils/function';
import { CDN_IMG } from "@constants/systemVars.js";
import { connect } from 'react-redux';
import { callGetCache } from "@actions/cacheAction";
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import PaymentCustomerInfo from '@components/paymentCustomerInfo'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class TrainCom extends Component {
    static navigationOptions = {
        title: 'Thông tin khách hàng'
    }

    constructor(props) {
        super(props)
        this.state = {
            dataItem: {},
            billID: "",
            serviceID: "",
            urlImg: "",
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
                    this.props.navigation.navigate("ReSignIn");
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
                    });
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
                //this.callPayment(paymentInfo);
                // this.gotoPhoneRechargeDetail(paymentInfo);
                this.gotoPreviewPaymentDetail(paymentInfo);
            }
        });
    }

    gotoPreviewPaymentDetail = (paymentInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PreviewPaymentDetail', { paymentInfo: paymentInfo, paymentKey: 8 })
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
        const { billID, errors, urlImg, isLoading, dataItem,
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
                    img_help={require('@assets/img/service/bill/dv_vnpt.png')}
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

const Train = connect(mapStateToProps, mapDispatchToProps)(TrainCom);
export default Train;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    itemPartner: {
        width: '95%',
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    containerButtonGroup: {
        height: 60,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20
    },
    containerButton: {
        width: "90%",
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    confirmButton: {
        borderRadius: 2,
    }
});