import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { PaymentSetting, SecurityAccount, OtherSetting, LanguageSetting } from '@components/setting'

export default class Setting extends Component {
    static navigationOptions = {
        title: 'Cài đặt ứng dụng'
    }
    constructor(props) {
        super(props);
        this.state = {
            appSetting: {}
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const appSetting = await this.appSettingData();
                this.setState({
                    appSetting: appSetting
                })
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock3", { routeName: this.props.navigation.state.routeName })
                }, appSetting.timeout);
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
        return appSetting;
    }

    onChangePassword = () => {
        this.props.navigation.navigate("OldPassword")
    }

    render() {
        const { appSetting } = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <PaymentSetting />

                <SecurityAccount
                    onChangePassword={this.onChangePassword}
                    appSetting={appSetting}
                />

                <LanguageSetting />
                <OtherSetting />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eff1f4',
    },
});