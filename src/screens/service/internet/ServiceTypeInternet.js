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
import { CDN_IMG } from "@constants/systemVars.js";

class ServiceTypeInternetCom extends Component {
    static navigationOptions = {
        title: "Dịch vụ thanh toán"
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
        const dataItem = this.props.navigation.getParam('dataItem', {});
        this.getCacheCategoryService(dataItem.ServiceCategoryID);

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

    getCacheCategoryServiceByCategoryID = (result, serviceCategoryID) => {
        this.setState({ isLoading: false })
        let resultService = result.filter((item, index) => {
            return item.ServiceCategoryID == serviceCategoryID && item.IsActived == true
        });
        resultService.map((item, index) => {
            item.title = item.ServiceName;
            item.name = item.ServiceName;
            item.img_uri = CDN_IMG + item.ServiceLogoURL;
            return item;
        });
        this.setState({
            data: resultService
        })

    }

    getCacheCategoryService = (serviceCategoryID) => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.getCacheCategoryServiceByCategoryID(cacheResult.ResultObject.CacheData, serviceCategoryID)
            } else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi lấy thông tin danh mục dịch vụ',
                        contentModalAlert: cacheResult.Message
                    });
                }, 100);
            }
        });
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false })
    }

    onPress = (item, index) => {
        this.props.navigation.navigate('CustomerInfoInternet',
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
                        onPress={this.onPress}
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

const ServiceTypeInternet = connect(mapStateToProps, mapDispatchToProps)(ServiceTypeInternetCom);
export default ServiceTypeInternet;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});