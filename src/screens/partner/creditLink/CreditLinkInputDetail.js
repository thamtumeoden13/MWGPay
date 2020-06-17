import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import MD5Digest from "@common/library/cryptography/MD5Digest.js";

import { CreditLinkInputDetailMWG } from '@components/partner/creditLink/CreditLinkInputDetailMWG'
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class InputDetailCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Nhập thông tin liên kết"
    })
    constructor(props) {
        super(props)
        const rootRoute = this.props.navigation.state.params.rootRoute;
        this.state = {
            rootRoute: rootRoute,
            username: '',
            password: '',
            errors: {},
            isLoading: false,
            phoneNumber: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        this.storeData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false })
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
                this.setState({
                    phoneNumber: userInfo.phoneNumber,
                })
            }
        }
    }

    convertStringToDate = (dateStr) => {
        const arrDate = dateStr.split('/');
        const result = new Date(2000 + parseInt(arrDate[1]), parseInt(arrDate[0]) - 1, 1, 7, 0);
        return result;
    }

    onChangeText = (username, password) => {
        this.setState({ username, password })
    }

    onConfirm = () => {
        const { username, password } = this.state
        if (username.length > 0 && password.length > 0) {
            this.setState({ isLoading: true })
            const signature = createSignature(1 + "0101101012" + username + password);
            const creditLinkRequest =
            {
                CreditTypeID: 1,
                Username: username,
                Password: password,
                MerchantID: "0101101012",
                Signature: signature
            };

            this.creditLinkRegister(creditLinkRequest);
        }
        else {
            let errors = {}
            if (username.length <= 0)
                errors.username = 'Vui lòng nhập mã nhân viên'
            if (password.length <= 0)
                errors.password = 'Vui lòng nhập mật khẩu'

            this.setState({ errors, isLoading: false })
        }
    }

    creditLinkRegister = (creditLinkRequest) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/CreditAccountLink";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, creditLinkRequest).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi liên kết tài khoản',
                            contentModalAlert: apiResult.MessageDetail
                        })
                    }, 100);
                }
                else {
                    this.asyncModalLoading(creditLinkRequest, apiResult.ResultObject)
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API liên kết tài khoản',
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (creditLinkRequest, result) => {
        this.setState({ isLoading: false })
        if (creditLinkRequest && result) {
            const { rootRoute } = this.state
            if (rootRoute === "Home") {
                this.props.navigation.navigate("CreditLinkInputOTP1", {
                    username: creditLinkRequest.Username,
                    password: creditLinkRequest.Password,
                    creditAccountID: result.CreditAccountID
                });
            }
            else {
                this.props.navigation.navigate("CreditLinkInputOTP2", {
                    username: creditLinkRequest.Username,
                    password: creditLinkRequest.Password,
                    creditAccountID: result.CreditAccountID
                });
            }
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { errors, isLoading, phoneNumber,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
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
                <View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                </View>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                    <CreditLinkInputDetailMWG
                        errors={errors}
                        onChangeText={this.onChangeText}
                        phoneNumber={phoneNumber}
                    />
                    <View style={styles.containerButtonGroup}>
                        <ButtonBottomComponent
                            title="Tiếp tục"
                            onPress={this.onConfirm}
                        />
                    </View>
                </KeyboardAwareScrollView>
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

const InputDetail = connect(mapStateToProps, mapDispatchToProps)(InputDetailCom);
export default InputDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});