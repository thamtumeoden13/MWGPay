import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";

import { FlatListComponent } from '@componentsCommon/flatList'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { CDN_IMG } from "@constants/systemVars.js";
import { getDisplayItemService, } from '@utils/function';
import { Service_Category_ID_Water } from '@constants/appSetting';

class WaterProviderCom extends Component {
    static navigationOptions = {
        title: 'Khu Vực'
    }
    constructor(props) {
        super(props)
        this.state = {
            dataProvince: [],
            dataServiceWater: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.getCacheService();
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

    getCacheService = () => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.formatDataService(cacheResult.ResultObject.CacheData)
            }
            else {
                // console.log("getCacheService call error", cacheResult)
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

    formatDataService = (result) => {
        const dataSort = result.sort((a, b) => (a.ServiceCategoryID > b.ServiceCategoryID) ? 1 : (a.ServiceCategoryID === b.ServiceCategoryID) ? ((a.ServiceID > b.ServiceID) ? 1 : -1) : -1);
        const dataFill = dataSort.filter((itemF, indexF) => {
            return itemF.ServiceCategoryID == Service_Category_ID_Water && itemF.IsActived == true
        })
        const { icon, type, color, size } = getDisplayItemService(Service_Category_ID_Water)
        const dataServiceWater = dataFill.map((dataItem, i) => {
            dataItem.key = dataItem.ServiceID
            dataItem.name = dataItem.ServiceName
            dataItem.icon = icon
            dataItem.type = type
            dataItem.color = color
            dataItem.size = size
            dataItem.img_uri = CDN_IMG + dataItem.ServiceLogoURL
            return dataItem
        })
        this.getProvince(dataServiceWater);
    }

    getProvince = (dataServiceWater) => {
        const cacheKeyID = "EWALLETCOMMONCACHE.PROVINCE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                const provideCache = cacheResult.ResultObject.CacheData;
                const dataProvince = provideCache.filter(e => {
                    const element = dataServiceWater.filter(f => { return f.ProvinceID == e.ProvinceID })
                    if (element.length > 0) {
                        e.name = e.ProvinceName
                        e.providerByProvince = element
                        return e
                    }
                })
                this.setState({ dataProvince, isLoading: false })
            }
            else {
                //console.log("getProvince error", cacheResult)
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

    onGotoProviderByProvince = (item) => {
        this.props.navigation.push("WaterProviderByProvince", { providerByProvince: item.providerByProvince })
    }

    asyncModalLoading = (isErrorCallAPI) => {
        this.setState({ isLoading: false })
        if (isErrorCallAPI) {
            this.props.navigation.popToTop()
        }
    }

    render() {
        const { dataProvince, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <FlatListComponent
                    data={dataProvince}
                    extraData={dataProvince}
                    rowItemType="RowItemAvatar"
                    onPress={this.onGotoProviderByProvince}
                />
                <View>
                    <ModalLoading
                        isVisible={isLoading}
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

const WaterProvider = connect(mapStateToProps, mapDispatchToProps)(WaterProviderCom);
export default WaterProvider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});