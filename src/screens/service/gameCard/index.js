import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";
import { updateAccountBalance } from "@actions/walletAction";

import { AmountCard, TotalValue, NumberCard } from '@components/phoneCard'
import { ModalComponent } from '@componentsCommon/modal'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent'
import { formatMoney, serviceFee, } from '@utils/function';
import { Service_Category_ID_PhoneCard_Game, Service_Type_Card_ID } from '@constants/appSetting';

import { CDN_IMG } from "@constants/systemVars.js";

class GameCardCom extends Component {
    static navigationOptions = {
        title: 'Thông tin khách hàng'
    }

    constructor(props) {
        super(props)
        this.state = {
            numberCard: 1,
            currentBalance: 0,
            infoCustomer: {},
            dataItem: {},
            billID: "",
            serviceID: "",
            urlImg: "",
            isLoading: false,
            totalValue: 0,
            dataNetworks: [],
            dataNetworkSelect: [],
            dataCard: [],
            merchantID: '',
            merchantServiceID: "",
            merchantServiceTypeID: "",
            merchantServiceName: "",
            parValueID: "",
            serviceMerchanMap: [],
            indexFocusAmount: 0,
            indexSelect: "",
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        const dataItem = this.props.navigation.getParam('dataItem', { serviceID: "", urlImg: "" });
        const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        const infoCustomer = this.props.AppInfo.LoginInfo.LoginUserInfo;
        this.setState({
            currentBalance,
            infoCustomer,
        })
        this.getCacheServiceByCategory(dataItem.ServiceID);

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

    getCacheServiceByCategory = (serviceID) => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.createDataNetworks(cacheResult.ResultObject.CacheData, serviceID);
            } else {
                Alert.alert("Thông báo",
                    cacheResult.Message,
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

    createDataNetworks = (result, serviceID) => {
        this.setState({ isLoading: false })
        const categoryID = Service_Category_ID_PhoneCard_Game;
        let resultNetworks = result.filter((item) => {
            return item.ServiceCategoryID == categoryID && item.IsActived == true
        });

        resultNetworks.map((item, index) => {
            item.title = item.ServiceName;
            item.image_url = item.ServiceLogoURL;
            item.rightTitle = 'Thay đổi';
            item.serviceID = item.ServiceID;
            return item;
        });

        let serviceByID;
        if (serviceID != undefined) {
            serviceByID = serviceID;
        }
        else {
            serviceByID = resultNetworks[0].ServiceID
        }
        let indexSelect;
        let dataNetworkSelect = resultNetworks.filter((item, index) => {
            if (item.ServiceID == serviceByID) {
                indexSelect = index;
                return item;
            }
        });
        this.setState({
            dataNetworks: resultNetworks,
            serviceID: serviceByID,
            dataNetworkSelect: dataNetworkSelect[0],
            indexSelect: indexSelect
        })
        this.getCacheServiceParValue(serviceByID);
    }

    getCacheServiceParValue = (serviceID) => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE_PARVALUE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    result: cacheResult.ResultObject.CacheData
                })
                this.createDataCard(serviceID, cacheResult.ResultObject.CacheData);
            } else {
                Alert.alert("Thông báo",
                    cacheResult.Message,
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

    createDataCard = (serviceID, result) => {
        let resultParValue = result.filter((item) => {
            return item.ServiceCategoryID == Service_Category_ID_PhoneCard_Game;
        });
        resultParValue.map((item, index) => {
            item.labelAmount = item.ParValueName
            item.discountAmount = item.DiscountAmount
            return item
        })
        const dataCard = resultParValue.filter((item) => { return item.ServiceID == serviceID })
        const amountCard = dataCard.length > 0 ? dataCard[0].Amount : 0;
        const discountAmount = dataCard.length > 0 ? dataCard[0].DiscountAmount : 0;
        const parValueID = dataCard.length > 0 ? dataCard[0].ParValueID : '';
        const totalValue = amountCard;
        this.setState({
            resultParValue,
            serviceID,
            dataCard,
            amountCard,
            discountAmount,
            totalValue,
            parValueID,
            numberCard: 1,
            indexFocusAmount: 0,
            isLoading: false
        })
        this.getCacheServiceMerchantMap(serviceID, parValueID);
    }

    getCacheServiceMerchantMap = (serviceID, parValueID) => {
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE_MERCHANTMAP";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    serviceMerchanMap: cacheResult.ResultObject.CacheData,
                })
                this.getServiceMerchantMap(cacheResult.ResultObject.CacheData, serviceID, parValueID);
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

    getServiceMerchantMap = (resultMerchantMap, serviceID, parValueID) => {
        if (resultMerchantMap.length > 0) {
            resultMerchantMap.filter((item, index) => {
                if (item.ServiceID == serviceID && item.ParValueID == parValueID) {
                    this.setState({
                        merchantID: item.MerchantID,
                        merchantServiceID: item.MerchantServiceID,
                        merchantServiceTypeID: item.MerchantServiceTypeID,
                        merchantServiceName: item.MerchantServiceName,
                        parValueID: item.ParValueID,
                        isLoading: false,
                    })
                }
            })
        }
    }

    asyncModalLoading = (isErrorCallAPI) => {
        this.setState({ isLoading: false })
        if (isErrorCallAPI) {
            this.props.navigation.popToTop()
        }
    }

    onConfirm = () => {
        const { discountAmount, amountCard, numberCard, totalValue, currentBalance, dataNetworkSelect, serviceID, infoCustomer, merchantID, merchantServiceID, merchantServiceTypeID, parValueID, } = this.state;
        const totalPayment = totalValue - numberCard * discountAmount;
        if (totalPayment > currentBalance) {
            this.asyncModalLoading();
            setTimeout(() => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: 'Lỗi thanh toán',
                    contentModalAlert: "Số dư Ví không đủ để thực hiện giao dịch"
                });
            }, 100);
        }
        else {
            this.setState({ isLoading: true })
            const fee = serviceFee(dataNetworkSelect, totalPayment);
            const transactionAmount = totalPayment + fee
            const paymentInfo = {
                CustomerCode: infoCustomer.PhoneNumber,// Mã khách hàng
                CustomerName: infoCustomer.FullName,// Tên khách hàng
                CustomerAddress: infoCustomer.FullAddress,// Địa chỉ khách hàng
                BillCycle: "",// Chu kỳ cước
                BillInfo: "",// Thông tin hóa đơn
                BillAmount: 0,// Số tiền nợ cước
                ParValueID: parValueID,
                Quantity: numberCard,
                MerchantID: merchantID,
                MerchantServiceTypeID: merchantServiceTypeID,
                MerchantServiceID: merchantServiceID,
                CounterNumber: '',
                BillNumber: '',
                ServiceID: serviceID,
                ServiceTypeID: Service_Type_Card_ID,
                ServiceName: dataNetworkSelect.ServiceCategoryName,
                ServiceFee: fee,// Phí thanh toán
                ServicePunishFee: 0,// Phí phạt
                ServiceCostPrice: 0,// Giá vốn dịch vụ
                ServiceAmount: transactionAmount,
                Amount: transactionAmount,
                AmountPerCard: amountCard,
                TransactionContent: `Mua thẻ game(số lượng: ${numberCard})`,
                TransactionAmount: transactionAmount,
                DataNetworkSelect: dataNetworkSelect,
            }
            this.gotoPreviewPaymentDetail(paymentInfo);
        }
    }

    gotoPreviewPaymentDetail = (paymentInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PreviewPaymentDetail', { paymentInfo: paymentInfo, paymentKey: 11 })
    }

    onChangeNetworks = (index, item) => {
        this.setState({
            serviceID: item.ServiceID,
            dataNetworkSelect: item,
        })
        this.getCacheServiceParValue(item.ServiceID);
    }

    _onChangeAmount = (index, item) => {
        const { numberCard } = this.state
        this.getCacheServiceMerchantMap(item.ServiceID, item.ParValueID);
        this.setState({
            amountCard: item.Amount,
            discountAmount: item.DiscountAmount,
            totalValue: parseInt(numberCard) * parseInt(item.Amount),
            indexFocusAmount: index,
            parValueID: item.ParValueID
        })
    }

    _onChangeNumber = (number) => {
        const { amountCard } = this.state
        this.setState({
            numberCard: number,
            totalValue: parseInt(number) * parseInt(amountCard),
        })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { totalValue, isLoading, dataNetworks, numberCard, dataCard, indexFocusAmount, indexSelect,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View style={styles.container}>
                {dataNetworks && dataNetworks.length > 0
                    ? <ModalComponent
                        data={dataNetworks}
                        rowItemType="RowItemModal"
                        headerTitle="Chọn nhà mạng"
                        onChangeItem={this.onChangeNetworks}
                        indexSelect={indexSelect}
                    />
                    : null
                }
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
                <AmountCard onPress={this._onChangeAmount} dataCard={dataCard} indexFocus={indexFocusAmount} />

                <NumberCard onPress={this._onChangeNumber} number={numberCard} />

                <TotalValue totalValue={totalValue} />

                <ButtonBottomComponent
                    title="Xác nhận đơn hàng"
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
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },
    };
};

const GameCard = connect(mapStateToProps, mapDispatchToProps)(GameCardCom);
export default GameCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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