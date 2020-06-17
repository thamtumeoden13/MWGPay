import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'

export default class QRCodeData extends Component {
    constructor(props) {
        super(props);

        this.state = { qrCodeData: " ", scanner: undefined };
    }

    componentDidMount() {
        //The code bellow will receive the props passed by QRCodeScannerScreen
        const qrCodeData = this.props.navigation.getParam("data", "No data read");
        const scanner = this.props.navigation.getParam("scanner", () => false);
        this.setState({ qrCodeData: qrCodeData, scanner: scanner });

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

    scanQRCodeAgain() {
        this.state.scanner.reactivate();
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.state.qrCodeData}</Text>
                <Button
                    title={"Scan QRCode Again"}
                    onPress={() => this.scanQRCodeAgain()}
                />
                <Button
                    title={"Home"}
                    onPress={() => this.props.navigation.popToTop()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        height: 100,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'red',
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    }
});
