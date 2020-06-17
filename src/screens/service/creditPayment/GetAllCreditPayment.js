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

import { FlatListComponent } from '@componentsCommon/flatList';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { Service_Category_ID_CreditPayment } from '@constants/appSetting';
import { CDN_IMG } from "@constants/systemVars.js";

class GetAllCreditPaymentCom extends Component {
    static navigationOptions = {
        title: "Thanh toán thu hộ/Trả góp"
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            data: [],
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount = () => {
        this.getCacheService();

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

    getCacheServiceByCategoryID = (result) => {
        this.setState({ isLoading: false })
        let resultPhonePostPaid = result.filter((item, index) => {
            return item.ServiceCategoryID == Service_Category_ID_CreditPayment && item.IsActived == true
        });
        resultPhonePostPaid.map((item, index) => {
            item.title = item.ServiceName;
            item.name = item.ServiceName;
            item.img_uri = CDN_IMG + item.ServiceLogoURL;
            return item;
        });
        this.setState({
            data: resultPhonePostPaid
        })
    }

    getCacheService = () => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.getCacheServiceByCategoryID(cacheResult.ResultObject.CacheData)
            } else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi lấy cache dịch vụ',
                        contentModalAlert: cacheResult.Message
                    })
                }, 100);
            }

        });
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
    }

    onPressItem = (item, index) => {
        this.props.navigation.navigate('CreditPayment',
            {
                dataItem: item,
            }
        )
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        let { isLoading, data,
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
                <View>
                    <FlatListComponent
                        data={data}
                        extraData={data}
                        rowItemType="RowItemAvatar"
                        onPress={this.onPressItem}
                        isUppercase={true}
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
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },
    };
};

const GetAllCreditPayment = connect(mapStateToProps, mapDispatchToProps)(GetAllCreditPaymentCom);
export default GetAllCreditPayment;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});