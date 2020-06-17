import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Button, Avatar, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigTransferIn } from '@components/transferIn/ModalConfigTransferIn';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";

import QRCodeCom from '@components/qrCode'

class TransferInCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Nhận tiền'
    })
    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
            message: '',
            isModalVisible: false,
            fullName: '',
            shortName: '',
            phoneNumber: '',
            valueForQRCode: '',
            email: '',
            errors: '',
        }
    }

    componentDidMount() {

        const userInfo = this.props.AppInfo.LoginInfo.LoginUserInfo;
        let value = "3|99|" + userInfo.PhoneNumber + "|" + userInfo.FullName + "|" + userInfo.Email + "|0|0|" + 0 + "";

        this.setState({
            fullName: userInfo.FullName,
            phoneNumber: userInfo.PhoneNumber,
            email: userInfo.Email,
            valueForQRCode: value,
        })

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isModalVisible: false })
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

    storeData = async () => {

        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                const fullName = userInfo.fullName.split(' ')
                let shortName = '';
                fullName.map((item, index) => {
                    if (index < 2)
                        shortName = shortName + item[0]
                });

                let value = "3|99|" + userInfo.phoneNumber + "|" + userInfo.fullName + "|" + userInfo.email + "|0|0|" + 0 + "";

                this.setState({
                    fullName: userInfo.fullName,
                    phoneNumber: userInfo.phoneNumber,
                    email: userInfo.email,
                    valueForQRCode: value,
                })
            }
        }
    }

    _onConfirm = (amount) => {
        //3|99|<STĐ>|<Tên>|<Email>|0|0|<So Tien>
        let errors = {}
        const { fullName, phoneNumber, email } = this.state;
        let amountRevert = 0;
        let subAmountTheFirst = '';
        if (amount) {
            subAmountTheFirst = amount.substring(0, 1);
            amountRevert = amount.toString().replace(new RegExp(',', 'g'), "")
        }
        if (amount && subAmountTheFirst != '0' && amountRevert >= 10000 && amountRevert <= 20000000) {
            let value = "3|99|" + phoneNumber + "|" + fullName + "|" + email + "|0|0|" + amountRevert + "";
            this.setState({
                valueForQRCode: value,
                isModalVisible: false
            });
        }
        else {
            switch (true) {
                case amount == '' || amount == undefined:
                    errors.value = 'Vui lòng nhập số tiền';
                    break;
                case subAmountTheFirst == '0':
                    errors.value = 'Số tiền bắt đâu phải lớn hơn số 0';
                    break;
                case amountRevert < 10000:
                    errors.value = 'Số tiền phải lớn hơn hoặc bằng 10,000đ';
                    break;
                case amountRevert > 20000000:
                    errors.value = 'Số tiền phải nhỏ hơn hoặc bằng 20,000,000đ';
                    break;
            }
        }
        this.setState({ errors })
    }

    render() {
        const { isModalVisible, errors, valueForQRCode } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.containerQRCode}>
                    <QRCodeCom
                        valueForQRCode={valueForQRCode}
                    />
                    <View>
                        <ModalBottomHalf
                            isVisible={isModalVisible}
                            content={
                                <ModalConfigTransferIn
                                    onClose={() => this.setState({ isModalVisible: false })}
                                    onConfirm={this._onConfirm}
                                    errors={errors}
                                />
                            }
                        />
                    </View>
                </View>
                <View style={styles.containerButtonGroup} >
                    <Button
                        title="Nhập số tiền"
                        buttonStyle={styles.confirmButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.titleButton}
                        type="solid"
                        onPress={() => this.setState({ isModalVisible: true, errors: '' })}
                    />
                    <Button
                        title="Lưu hình"
                        buttonStyle={styles.saveImageButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.titleButton}
                        type="solid"
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
        }
    };
};

const TransferIn = connect(mapStateToProps, mapDispatchToProps)(TransferInCom);
export default TransferIn;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerQRCode: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    containerInfoUser: {
        width: "100%",
        height: 150,
        justifyContent: "center",
        marginVertical: 10,
        alignItems: "center",
        paddingBottom: 50,
    },
    containerButtonGroup: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 20,
    },
    containerButton: {
        width: "40%",
        height: 40,
    },
    titleButton: {
        textAlign: 'center'
    },
    confirmButton: {
        backgroundColor: 'blue',
        borderRadius: 2,
    },
    saveImageButton: {
        backgroundColor: 'pink',
        borderRadius: 2,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});