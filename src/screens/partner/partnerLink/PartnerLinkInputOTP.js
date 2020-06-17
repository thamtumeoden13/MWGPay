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
import { PartnerLinkInputOTPVietinBank } from '@components/partner/partnerLink/PartnerLinkInputOTPVietinBank'
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
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount = () => {
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
        const { OTP } = this.state
        if (OTP.length > 0) {
            this.setState({ isLoading: true })
            const cardLinkID = this.props.navigation.getParam('cardLinkID', '');
            const signature = createSignature(cardLinkID + OTP);
            const cardLinkOTP = {
                CardLinkID: cardLinkID,
                OTP: OTP,
                Signature: signature
            };
            this.cardLinkVerifyOTP(cardLinkOTP);
        }
        else {
            let errors = {}
            errors.OTP = 'Vui lòng nhập mã OTP'
            this.setState({ errors, isLoading: false })
        }
    }

    cardLinkVerifyOTP = (cardLinkOTP) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CardLink/CardLinkVerifyOTP";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, cardLinkOTP).then(apiResult => {
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
                    Alert.alert("Thông báo", "Liên kết ví thẻ thành công",
                        [
                            {
                                text: 'Đồng ý',
                                onPress: () => this.asyncModalLoading(true)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API liên kết thẻ',
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
        const number = this.props.navigation.getParam('number', '');
        const memberSince = this.props.navigation.getParam('memberSince', '');
        const name = this.props.navigation.getParam('name', '');
        const card = this.props.navigation.getParam('card', '');
        const { errors, isLoading,
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
                    <PartnerLinkInputOTPVietinBank
                        errors={errors}
                        onChangeText={this.onChangeText}
                        number={number}
                        memberSince={memberSince}
                        name={name}
                        card={card}
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