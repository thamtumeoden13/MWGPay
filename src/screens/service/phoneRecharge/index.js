import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';

import { ModalComponent } from '@componentsCommon/modal';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";
import { updateAccountBalance } from "@actions/walletAction";

import { ContactInput } from '@components/contact/ContactInput';
import { AmountCard, TotalValue } from '@components/phoneCard';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { Service_Category_ID_PhoneRechange, Service_Type_Phone_Recharge_ID } from '@constants/appSetting';
import { checkPhoneNumber } from '@utils/function';
import { CDN_IMG } from "@constants/systemVars.js";

class PhoneRechargeCom extends Component {
    static navigationOptions = {
        title: "Nạp tiền Điện thoại"
    }
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            amountCard: 0,
            discountAmount: 0,
            totalValue: 0,
            errors: {},
            isLoading: false,
            currentBalance: 0,
            dataCard: [],
            result: [],
            dataNetworks: [],
            serviceID: '',
            dataNetworkSelect: [],
            isSelectContact: false,
            merchantID: '',
            merchantServiceID: "",
            merchantServiceTypeID: "",
            merchantServiceName: "",
            parValueID: "",
            serviceMerchanMap: [],
            indexSelect: "",
            urlImg: "",
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount = () => {
        const dataItem = this.props.navigation.getParam('dataItem', { serviceID: "", urlImg: "" });
        const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        this.setState({
            currentBalance,
        })
        this.getCacheServiceByCategoryID(dataItem.ServiceID);
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

    _onChangeAmount = (index, item) => {
        this.setState({
            amountCard: item.Amount,
            discountAmount: item.DiscountAmount,
            totalValue: parseInt(item.Amount) - parseInt(item.DiscountAmount),
            indexFocusAmount: index,
            parValueID: item.ParValueID
        })
        this.getCacheServiceMerchantMap(item.ServiceID, item.ParValueID);
    }

    _onChangePartner = (indexChoose) => {
        this.setState({ isModalVisible: false, indexChoose: indexChoose })
    }

    detailContact = () => {
        this.props.navigation.navigate('Contact', { onSelect: this.onSelectContact })
    }

    onSelectContact = ({ phoneNumber }) => {
        this.setState({ phoneNumber, isSelectContact: true })
    }

    onChangePhoneNumber = (phoneNumber) => {
        this.setState({ phoneNumber, isSelectContact: false, errors: { phoneNumber: '' } })
    }

    onConfirm = () => {
        const { phoneNumber, amountCard, totalValue, currentBalance, serviceID, dataNetworkSelect, merchantID, merchantServiceID, merchantServiceTypeID, parValueID, } = this.state;
        let resultErrors = checkPhoneNumber(phoneNumber);
        if (phoneNumber.length > 0 && totalValue > 0 && resultErrors.length == 0) {
            if (totalValue > currentBalance) {
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
                const paymentInfo = {
                    CustomerCode: phoneNumber,// Mã khách hàng
                    CustomerName: "",// Tên khách hàng
                    CustomerAddress: "",// Địa chỉ khách hàng
                    BillCycle: "",// Chu kỳ cước
                    BillInfo: "",// Thông tin hóa đơn
                    BillAmount: 0,// Số tiền nợ cước
                    ParValueID: parValueID,
                    Quantity: 0,
                    MerchantID: merchantID,
                    MerchantServiceTypeID: merchantServiceTypeID,
                    MerchantServiceID: merchantServiceID,
                    CounterNumber: '',
                    BillNumber: '',
                    ServiceID: serviceID,
                    ServiceTypeID: Service_Type_Phone_Recharge_ID,
                    ServiceName: dataNetworkSelect.ServiceCategoryName,
                    ServiceFee: 0,// Phí thanh toán
                    ServicePunishFee: 0,// Phí phạt
                    ServiceCostPrice: 0,// Giá vốn dịch vụ
                    ServiceAmount: amountCard,
                    Amount: totalValue,
                    AmountPerCard: amountCard,
                    TransactionContent: 'Nạp tiền cho số điện thoại: ' + phoneNumber,
                    TransactionAmount: totalValue,
                    DataNetworkSelect: dataNetworkSelect,
                }
                this.gotoPreviewPaymentDetail(paymentInfo);
            }
        }
        else {
            let errors = {}
            if (resultErrors.length > 0)
                errors.phoneNumber = resultErrors;
            if (totalValue <= 0)
                errors.value = 'Vui lòng chọn mệnh giá thẻ điện thoại'
            this.setState({ errors, isLoading: false })
        }
    }

    gotoPreviewPaymentDetail = (paymentInfo) => {
        this.setState({ isLoading: false })
        this.props.navigation.navigate('PreviewPaymentDetail', { paymentInfo: paymentInfo, paymentKey: 1 })
    }

    getCacheServiceByCategoryID = (serviceID) => {
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
        const categoryID = Service_Category_ID_PhoneRechange;
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
            serviceByID = resultNetworks.length > 0 ? resultNetworks[0].ServiceID : ""
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
            return item.ServiceCategoryID == Service_Category_ID_PhoneRechange
        });
        resultParValue.map((item, index) => {
            item.labelAmount = item.ParValueName;
            item.discountAmount = item.DiscountAmount;
            return item;
        });
        const dataCard = resultParValue.filter((item) => { return item.ServiceID == serviceID })
        const amountCard = dataCard.length > 0 ? dataCard[0].Amount : 0;
        const discountAmount = dataCard.length > 0 ? dataCard[0].DiscountAmount : 0;
        const parValueID = dataCard.length > 0 ? dataCard[0].ParValueID : "";
        this.setState({
            resultParValue,
            serviceID,
            dataCard,
            amountCard,
            discountAmount,
            totalValue: amountCard - discountAmount,
            parValueID,
            indexFocusAmount: 0,
            isLoading: false,
        })
        this.getCacheServiceMerchantMap(serviceID, parValueID);
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

    asyncModalLoading = (isErrorCallAPI) => {
        this.setState({ isLoading: false })
        if (isErrorCallAPI) {
            this.props.navigation.popToTop()
        }

    }

    onChangeNetworks = (index, item) => {
        this.setState({
            serviceID: item.ServiceID,
            dataNetworkSelect: item,
        })
        this.getCacheServiceParValue(item.ServiceID);
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        let { phoneNumber, amountCard, errors,
            isLoading, dataCard, dataNetworks, isSelectContact, indexFocusAmount, indexSelect,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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
                <ContactInput
                    phoneNumber={phoneNumber}
                    errors={errors}
                    labelTextInput="Nhập số điện thoại"
                    goToDetail={this.detailContact}
                    onChangeText={this.onChangePhoneNumber}
                    isSelectContact={isSelectContact}
                />
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

                <AmountCard onPress={this._onChangeAmount} dataCard={dataCard} indexFocus={indexFocusAmount} />

                <TotalValue totalValue={amountCard} />

                <ButtonBottomComponent
                    title="Xác nhận đơn hàng"
                    onPress={this.onConfirm}
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
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },
    };
};

const PhoneRecharge = connect(mapStateToProps, mapDispatchToProps)(PhoneRechargeCom);
export default PhoneRecharge;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});