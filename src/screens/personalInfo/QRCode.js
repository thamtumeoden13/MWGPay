import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform, PermissionsAndroid, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import QRCodePersonalInfo from 'react-native-qrcode-svg';


class QRCodeCom extends Component {
    static navigationOptions = {
        title: 'QR Code'
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
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
        return (
            <View style={styles.container}>
                <View style={styles.codeScanner}>
                    {/* <QRCodePersonalInfo
                        value="aaa"
                        size={250}
                        bgColor="#000"
                        fgColor="#fff"
                        style={{ marginTop: 20, }}
                    /> */}
                    <QRCodePersonalInfo
                        value={"aaa"}
                        size={250}
                        color="#000"
                        backgroundColor="#fff"
                        style={{ marginTop: 20, }}
                        logo={{
                            url:
                                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
                        }}
                        logoSize={30}
                        logoMargin={2}
                        logoBorderRadius={15}
                        logoBackgroundColor="yellow"
                    />
                </View>
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

const QRCode = connect(mapStateToProps, mapDispatchToProps)(QRCodeCom);
export default QRCode;

const styles = StyleSheet.create({
    container: {

        justifyContent: "center",
        alignItems: "center",
    },
    codeScanner: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,
        width: '100%',
    }
});
