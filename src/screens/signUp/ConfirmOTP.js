import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { OTPComponent } from '@components/otp'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import ImageBackgroundCom from '@componentsCommon/imageBackground';

import { connect } from 'react-redux';
import { callAPIWithoutAuthen, createSignature } from "@actions/fetchAPIAction";

class ConfirmOTPCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            walletRegOTPId: '',
            isLoading: false,
            errors: '',
            countCallOTP: 0,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {
        const walletRegOTPId = this.props.navigation.getParam('walletRegOTPId', '');
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        this.setState({
            phoneNumber,
            walletRegOTPId
        })
    }

    reSendOTP = (phoneNumber) => {
        let { countCallOTP } = this.state
        this.setState({
            countCallOTP: countCallOTP + 1
        })
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/WalletRegOTP/ReSentOTP";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, phoneNumber).then(apiResult => {
            if (apiResult.IsError) {
                Alert.alert("Lỗi đăng ký thông tin OTP", apiResult.Message,
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.setState({
                    walletRegOTPId: apiResult.ResultObject
                })
                this.asyncModalLoading();
                let detailMess = '';
                if (countCallOTP == 2) {
                    detailMess = 'Bạn sẽ bị khoá 24h, nếu thực hiện gửi OTP lần nữa.'
                }

                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'info',
                        titleModalAlert: 'Gửi lại OTP thành công!',
                        // contentModalAlert: `Số lần còn lại ${4 - countCallOTP}`,
                        // Bạn sẽ bị khoá 24h, nếu thực hiện gửi OTP lần nữa.
                        contentModalAlert: detailMess
                    })
                }, 100);
            }
        });
    }

    changePhoneNumber = (phoneNumber) => {
        this.props.navigation.navigate("SignUp");
    }

    changeErrors = () => {
        this.setState({ errors: '' })
    }

    onConfirmOTP = (OTP) => {
        let { countCallOTP, phoneNumber, walletRegOTPId } = this.state
        this.setState({
            countCallOTP: countCallOTP + 1
        })
        if (OTP && OTP.length > 0 && countCallOTP < 5) {
            this.setState({
                isLoading: true,
            });
            const signature = createSignature(walletRegOTPId + phoneNumber + OTP);
            const walletRegOTP = {
                WalletRegOTPID: walletRegOTPId,
                PhoneNumber: phoneNumber,
                OTP: OTP,
                Signature: signature
            };

            this.verifyOTP(walletRegOTP);
        }
        else {
            let errors = '';
            if (OTP.length <= 0) {
                errors = "Vui lòng nhập mã OTP";
            }
            if (countCallOTP >= 4) {
                Alert.alert("Lỗi nhập OTP",
                    "Bạn đã nhập sai OTP quá 5 lần.",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.setState({
                    errors
                })
                this.asyncModalLoading();
            }
        }
    }

    verifyOTP = (walletRegOTP) => {
        let { countCallOTP } = this.state
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/WalletRegOTP/VerifyOTP";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, walletRegOTP).then(apiResult => {
            if (apiResult.IsError) {
                if (countCallOTP == 4) {
                    Alert.alert("Lỗi nhập OTP",
                        "Bạn đã nhập sai OTP quá 5 lần.",
                        [
                            {
                                text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                            }
                        ],
                        { cancelable: false }
                    );
                }
                else {
                    this.setState({
                        errors: apiResult.MessageDetail,
                    })
                    this.asyncModalLoading()
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.props.navigation.navigate("ConfirmPasswordSignUp", {
                        phoneNumber: walletRegOTP.PhoneNumber,
                        walletRegOTPId: walletRegOTP.WalletRegOTPID,
                        OTP: walletRegOTP.OTP,
                    });
                }, 500);
            }
        });
    }

    asyncModalLoading = (isGoBack) => {
        this.setState({ isLoading: false })
        if (isGoBack) {
            this.props.navigation.goBack();
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { phoneNumber, isLoading, errors,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <ImageBackgroundCom>
                    <OTPComponent
                        phoneNumber={phoneNumber}
                        reSendOTP={this.reSendOTP}
                        changePhoneNumber={this.changePhoneNumber}
                        changeErrors={this.changeErrors}
                        onConfirmOTP={this.onConfirmOTP}
                        errors={errors}
                    />
                    <View>
                        <ModalLoading
                            isVisible={isLoading}
                        />
                    </View>
                    <ModalCenterAlert
                        isCancel={true}
                        isOK={true}
                        isVisible={isModalAlert}
                        typeModal={typeModalAlert}
                        titleModal={titleModalAlert}
                        contentModal={contentModalAlert}
                        onCloseModalAlert={this.onCloseModalAlert}
                    />
                </ImageBackgroundCom>
            </KeyboardAwareScrollView>
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
        callAPIWithoutAuthen: (hostname, hostURL, postData) => {
            return dispatch(callAPIWithoutAuthen(hostname, hostURL, postData));
        }
    };
};

const ConfirmOTP = connect(mapStateToProps, mapDispatchToProps)(ConfirmOTPCom);
export default ConfirmOTP;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});