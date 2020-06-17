import React, { Component } from "react";
import { StyleSheet, Dimensions, View, Text, Platform, PermissionsAndroid, Button } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class QRCodeScannerScreenCom extends Component {
    static navigationOptions = {
        title: 'Quét mã QR'
    }

    constructor(props) {
        super(props)
        this.state = {
            reactivate: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.scanner.reactivate();
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isModalAlert: false, })
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

    onSuccess = async (e) => {
        const dataSplit = e.data.split('|');
        const phoneNumber = dataSplit[2];
        const amountTransfer = dataSplit[7];
        await this.callGetWalletInfo(phoneNumber, amountTransfer);

    };

    callGetWalletInfo = (phoneNumber, amountTransfer) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/LoadByPhoneNumber";
        this.props.callFetchAPI(APIHostName, APIPath, phoneNumber).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi lấy thông tin ví từ số điện thoại',
                        contentModalAlert: apiResult.Message
                    })
                }
                else {
                    let errors = {};
                    if (!apiResult.ResultObject.IsExist) {
                        errors.phoneNumber = 'Số điện thoại chưa được đăng ký ví MWG';
                        this.setState({ errors });
                        return;
                    }
                    this.props.navigation.navigate("TransferOutToMWGPayContent", {
                        phoneNumber: phoneNumber,
                        fullName: apiResult.ResultObject.FullName,
                        walletID: apiResult.ResultObject.WalletID,
                        amountTransfer: amountTransfer
                    });
                }
            }
            else {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: 'Lỗi gọi API lấy thông tin ví từ số điện thoại',
                    contentModalAlert: "Vui lòng tắt app và đăng nhập lại"
                })
            }
        });
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { reactivate,
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
                <View style={styles.codeScanner}>
                    <QRCodeScanner
                        onRead={this.onSuccess}
                        showMarker={true}
                        //reactivate={reactivate}
                        //reactivateTimeout={300}
                        checkAndroid6Permissions={true}
                        ref={(node) => {
                            this.scanner = node;
                        }}
                        cameraStyle={{ height: Dimensions.get("window").height, backgroundColor: 'gray' }}
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

const QRCodeScannerScreen = connect(mapStateToProps, mapDispatchToProps)(QRCodeScannerScreenCom);
export default QRCodeScannerScreen;

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
