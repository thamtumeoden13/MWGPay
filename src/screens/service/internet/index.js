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
import { Service_Category_ID_Internet } from '@constants/appSetting';
import { CDN_IMG } from "@constants/systemVars.js";

class InternetCom extends Component {
    static navigationOptions = {
        title: "Thanh toán hóa đơn internet"
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            data: []
        }

    }

    componentDidMount = () => {
        this.getCacheCategoryService();

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false })
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

    getCacheCategoryServiceByParentID = (result) => {
        this.setState({ isLoading: false })
        let resultInternet = result.filter((item, index) => {
            return item.ParentID == Service_Category_ID_Internet && item.IsActived == true
        });
        resultInternet.map((item, index) => {
            item.title = item.ServiceCategoryName;
            item.name = item.ServiceCategoryName;
            item.img_uri = CDN_IMG + item.ServiceCategoryLogo;
            return item;
        });
        this.setState({
            data: resultInternet
        })

    }

    getCacheCategoryService = () => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICECATEGORY";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.getCacheCategoryServiceByParentID(cacheResult.ResultObject.CacheData)
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

    asyncModalLoading = (isErrorCallAPI) => {
        this.setState({ isLoading: false })
        if (isErrorCallAPI) {
            this.props.navigation.popToTop()
        }
    }

    onPressItem = (item, index) => {
        this.props.navigation.navigate('ServiceTypeInternet',
            {
                dataItem: item,
            }
        )
    }

    render() {
        let { isLoading, data } = this.state;
        return (
            <View style={styles.container}>
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

const Internet = connect(mapStateToProps, mapDispatchToProps)(InternetCom);
export default Internet;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});