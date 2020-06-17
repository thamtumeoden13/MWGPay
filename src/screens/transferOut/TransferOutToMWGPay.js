import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'

import { ContactInput } from '@components/contact/ContactInput';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { checkPhoneNumber } from '@utils/function';

class TransferOutToMWGPayCom extends Component {
    static navigationOptions = {
        title: "Chuyển đến ví MWGPay"
    }
    constructor(props) {
        super(props)
        const currentBalance = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        this.state = {
            phoneNumber: '',
            errors: {},
            isLoading: false,
            phoneNumberMain: '',
            isFocus: currentBalance >= 10000 ? true : false,
            isSelectContact: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        if (this.state.currentBalance < 10000) {
            Alert.alert("Số Dư Không Hợp Lệ",
                "Vui Lòng Nạp Tiền Vào Ví Để Tiếp Tục Giao Dịch",
                [
                    {
                        text: 'Đồng ý', onPress: () => this.props.navigation.popToTop()
                    }
                ],
                { cancelable: false }
            );
        }
        this.storeData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, })
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

    onGotoContentTransfer = () => {
        const { phoneNumber, phoneNumberMain } = this.state;
        if (phoneNumber == phoneNumberMain) {
            let errors = {};
            errors.phoneNumber = "Quý khách không thể chuyển tiền cho chính mình!"
            this.setState({ errors, isLoading: false });
        }
        else {
            this.setState({ isLoading: true })
            this.callGetWalletInfo(phoneNumber);
        }
    }

    callGetWalletInfo = (phoneNumber) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/LoadByPhoneNumber";
        this.props.callFetchAPI(APIHostName, APIPath, phoneNumber).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi lấy thông tin ví từ số điện thoại",
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            }
            else {
                this.asyncModalLoading(apiResult.ResultObject, phoneNumber)
            }
        });
    }

    asyncModalLoading = (result, phoneNumber) => {
        this.setState({ isLoading: false })
        let resultErrors = checkPhoneNumber(phoneNumber);
        if (result) {
            setTimeout(() => {
                let errors = {};
                if (resultErrors.length > 0) {
                    errors.phoneNumber = resultErrors;
                    this.setState({ errors, isLoading: false })
                }
                else {
                    if (!result.IsExist) {
                        errors.phoneNumber = 'Số điện thoại chưa được đăng ký ví MWG';
                        this.setState({ errors });
                    }
                    else {
                        setTimeout(() => {
                            this.props.navigation.navigate("TransferOutToMWGPayContent", {
                                phoneNumber: phoneNumber,
                                fullName: result.FullName,
                                walletID: result.WalletID
                            });
                        }, 200);

                    }
                }
            }, 500)
        }
    }

    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    phoneNumberMain: userInfo.phoneNumber
                })
            }
        }
    }

    detailContact = () => {
        this.props.navigation.navigate('Contact', { onSelect: this.onSelectContact })
    }

    onSelectContact = ({ phoneNumber, phoneName }) => {
        this.setState({ phoneNumber, phoneName, isSelectContact: true })
    }

    onChangeContact = (phoneNumber) => {
        this.setState({ phoneNumber, isSelectContact: false })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        let { phoneNumber, errors, isLoading, isFocus, isSelectContact,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                    <View style={styles.containerContactInput}>
                        <ContactInput
                            phoneNumber={phoneNumber}
                            errors={errors}
                            labelTextInput="Số điện thoại người nhận"
                            goToDetail={this.detailContact}
                            onChangeText={this.onChangeContact}
                            isFocus={isFocus}
                            isSelectContact={isSelectContact}
                        />
                    </View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                    <ModalCenterAlert
                        isCancel={true}
                        isOK={true}
                        isVisible={isModalAlert}
                        typeModal={typeModalAlert}
                        titleModal={titleModalAlert}
                        contentModal={contentModalAlert}
                        onCloseModalAlert={this.onCloseModalAlert}
                    />
                </KeyboardAwareScrollView>
                <ButtonBottomComponent
                    title="Tiếp tục"
                    onPress={this.onGotoContentTransfer}
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
        }
    };
};

const TransferOutToMWGPay = connect(mapStateToProps, mapDispatchToProps)(TransferOutToMWGPayCom);
export default TransferOutToMWGPay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerContactInput: {
        width: "100%",
        flexDirection: 'row',
    },
});