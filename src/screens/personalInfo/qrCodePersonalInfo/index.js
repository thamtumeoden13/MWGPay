import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import QRCodeCom from '@components/qrCode'

class QRCodePersonalInfoCom extends Component {
    static navigationOptions = {
        title: 'Mã định danh'
    }
    constructor(props) {
        super(props)
        this.state = {
            valueForQRCode: '',
        }
    }

    componentDidMount() {

        const userInfo = this.props.AppInfo.LoginInfo.LoginUserInfo;
        let value = "3|99|" + userInfo.PhoneNumber + "|" + userInfo.FullName + "|" + userInfo.Email + "|0|0|" + 0 + "";
        this.setState({
            valueForQRCode: value,
        })

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock3", { routeName: this.props.navigation.state.routeName })
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
        const { valueForQRCode } = this.state;
        return (
            <View style={styles.container}>
                <QRCodeCom
                    valueForQRCode={valueForQRCode}
                />
            </View>
        )
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
        }
    };
};

const QRCodePersonalInfo = connect(mapStateToProps, mapDispatchToProps)(QRCodePersonalInfoCom);
export default QRCodePersonalInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
