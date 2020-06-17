import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";
import { FlatListComponent } from '@componentsCommon/flatList'

class WaterProviderByProvinceCom extends Component {
    static navigationOptions = {
        title: 'Nhà cung cấp'
    }
    constructor(props) {
        super(props)
        this.state = {
            providerByProvince: [],
        }
    }

    componentDidMount() {
        const providerByProvince = this.props.navigation.getParam('providerByProvince', []);
        this.setState({ providerByProvince });

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

    onGotoWaterInvoiceInfo = (item) => {
        this.props.navigation.push("WaterInvoiceInfo", { dataItem: item, })
    }

    render() {
        const { providerByProvince } = this.state;
        return (
            <View style={styles.container}>
                <FlatListComponent
                    data={providerByProvince}
                    extraData={providerByProvince}
                    rowItemType="RowItemAvatar"
                    onPress={this.onGotoWaterInvoiceInfo}
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

const WaterProviderByProvince = connect(mapStateToProps, mapDispatchToProps)(WaterProviderByProvinceCom);
export default WaterProviderByProvince;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});