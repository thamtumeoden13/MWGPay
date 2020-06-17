import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";

import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent'
import { CreditLinkInputOTPMWG } from '@components/partner/creditLink/CreditLinkInputOTPMWG'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class InputOTPCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Nhập mật khẩu OTP"
    })

    constructor(props) {
        super(props)
        this.state = {
            OTP: '',
            errors: {},
            isLoading: false,
            countCallOTP: 0,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        //this.storeData();
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

    onChangeText = (OTP) => {
        this.setState({ OTP })
    }

    onConfirm = () => {
        let { countCallOTP } = this.state
        const { OTP } = this.state
        this.setState({
            countCallOTP: countCallOTP + 1
        })

        if (OTP && OTP.length > 0 && countCallOTP < 5) {
            this.setState({ isLoading: true })
            const creditAccountID = this.props.navigation.getParam('creditAccountID', '');
            const signature = createSignature("0101101012" + creditAccountID + '' + OTP);
            const creditAccountLinkOTP = {
                CreditAccountID: creditAccountID,
                TokenIssueRequestID: '',
                OTP: OTP,
                MerchantID: "0101101012",
                Signature: signature
            };
            this.creditAccountLinkVerifyOTP(creditAccountLinkOTP);
        }
        else {
            let errors = {}
            // errors.OTP = 'Vui lòng nhập mã OTP'
            // this.setState({ errors, isLoading: false })
            if (OTP.length <= 0) {
                errors.OTP = "Vui lòng nhập mã OTP";
                this.setState({ errors, isLoading: false })
            }
            if (countCallOTP >= 4) {
                Alert.alert("Lỗi nhập OTP",
                    "Bạn đã nhập sai OTP quá 5 lần.",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.onPressCreditLink()
                        }
                    ],
                    { cancelable: false }
                );

            }
        }
    }

    onPressCreditLink = () => {
        const rootRoute = this.props.navigation.state.params.rootRoute;
        if (rootRoute === "Home") {
            this.props.navigation.navigate("CreditLinkInputDetail1");
        }
        else {
            this.props.navigation.navigate("CreditLinkInputDetail2");
        }
    }

    creditAccountLinkVerifyOTP = (creditAccountLinkOTP) => {
        let { countCallOTP } = this.state
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/CreditAccountLinkVerifyOTP";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, creditAccountLinkOTP).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi xác nhận OTP',
                            contentModalAlert: apiResult.MessageDetail
                        })
                    }, 100);
                }
                else {
                    Alert.alert("Thông báo", "Liên kết tín dụng thành công",
                        [
                            {
                                text: 'Đồng ý',
                                onPress: () => this.asyncModalLoading(true)
                            }
                        ],
                        { cancelable: false }
                    );
                    // this.asyncModalLoading(true)
                    // setTimeout(() => {
                    //     this.setState({
                    //         isModalAlert: true,
                    //         typeModalAlert: 'success',
                    //         titleModalAlert: 'Thông báo',
                    //         contentModalAlert: "Liên kết tín dụng thành công"
                    //     })
                    // }, 100);
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API liên kết tín dụng',
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.navigation.popToTop();
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const username = this.props.navigation.getParam('username', '');
        const password = this.props.navigation.getParam('password', '');
        const cardLinkID = this.props.navigation.getParam('cardLinkID', '');
        const { errors, isLoading, isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert } = this.state
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
                    <CreditLinkInputOTPMWG
                        errors={errors}
                        onChangeText={this.onChangeText}
                        username={username}
                        password={password}
                    />
                    <ButtonBottomComponent
                        title="Xác nhận liên kết"
                        onPress={this.onConfirm}
                    />
                </KeyboardAwareScrollView>
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

const InputOTP = connect(mapStateToProps, mapDispatchToProps)(InputOTPCom);
export default InputOTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});