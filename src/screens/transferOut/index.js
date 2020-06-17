import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { FlatListComponent } from '@componentsCommon/flatList'
const listFunction = [
    {
        title: 'Chuyển tiền đến ví MWGPay',
        // subtitle: 'Tài khoản MWGPay',
        icon: 'shake',
        type: 'antdesign',
        route: 'TransferOutToMWGPay'
    },
    {
        title: 'Chuyển tiền đến tài khoản',
        // subtitle: 'Tài khoản của ngân hàng nội địa',
        icon: 'bank',
        type: 'font-awesome',
        route: 'TransferOutToLocalBank'
    },
    {
        title: 'Chuyển tiền đến thẻ ngân hàng',
        // subtitle: 'Thẻ ATM của ngân hàng quốc tế',
        icon: 'credit-card',
        type: 'entypo',
        route: 'TransferOutToGlobalBank'
    },
]

export default class TransferOut extends Component {
    static navigationOptions = {
        title: 'Chuyển tiền'
    }

    onPressFunction = (item, index) => {
        this.props.navigation.navigate(item.route);
    }

    componentDidMount = () => {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={listFunction}
                        rowItemType="RowItemIcon"
                        headerTitle="CHỌN HÌNH THỨC CHUYỂN"
                        onPress={this.onPressFunction}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});