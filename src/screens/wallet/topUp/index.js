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
        title: 'Nạp Tiền Từ Liên Kết Ngân Hàng',
        subtitle: 'Liên kết ngân hàng',
        icon: 'credit-card',
        type: 'entypo',
        route: 'TopUpFromBankConnected'
    },
    {
        title: 'Nạp Tiền Từ Tín Dụng ERP',
        subtitle: 'Liên kết tín dụng ERP',
        icon: 'bank',
        type: 'font-awesome',
        route: 'TopUpFromERP'
    },
]

export default class TopUp extends Component {
    static navigationOptions = {
        title: 'Nạp Tiền Vào Ví'
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
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

    onPressFunction = (item, index) => {
        this.props.navigation.navigate(item.route);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={listFunction}
                        rowItemType="RowItemIcon"
                        headerTitle="CHỌN HÌNH THỨC NẠP TIỀN"
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