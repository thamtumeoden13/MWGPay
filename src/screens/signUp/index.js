import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callAPIWithoutAuthen } from "@actions/fetchAPIAction";
import { callFetchAPI } from "@actions/fetchAPIAction";
import { Logo, SignInInput, SignInButton, SignInSocial } from '@components/signIn';
import { InputPhoneNumber } from '@componentsCommon/input';
import ImageBackgroundCom from '@componentsCommon/imageBackground';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { PrefixMobileNumber, regExNumber, checkPhoneNumber } from '@utils/function';

class SignUpCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phoneNumber: '',
            errors: {},
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    _onChangePhoneNumber = (phoneNumber) => {
        let rPhoneNumber = phoneNumber.replace(' ', '')
        this.setState({ phoneNumber: rPhoneNumber })

    }

    getPhoneNumber = async (phoneNumber) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/CheckPhoneNumber";
        let result;
        await this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, phoneNumber).then(apiResult => {
            result = apiResult;
        });
        return result;
    }

    preSignIn = () => {
        this.setState({ isLoading: true })
        setTimeout(() => {
            this.signUp();
        }, 500)
    }

    signUp = async () => {
        const { phoneNumber } = this.state
        let errors = {}
        let resultErrors = checkPhoneNumber(phoneNumber);
        if (resultErrors.length > 0) {
            errors.phoneNumber = resultErrors;
            this.setState({ errors, isLoading: false })
        }
        else {
            let resultPhoneValid = await this.getPhoneNumber(phoneNumber);
            if (resultPhoneValid.ResultObject) {
                errors.phoneNumber = 'Số điện thoại đã được đăng kí!';
                this.setState({ errors, isLoading: false })
            }
            else {
                this.registerOTP(phoneNumber);
            }
        }

    }

    registerOTP = (phoneNumber) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/WalletRegOTP/Register";
        this.props.callAPIWithoutAuthen(APIHostName, SearchAPIPath, phoneNumber).then(apiResult => {
            if (apiResult.IsError) {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi đăng ký thông tin OTP',
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
        this.setState({ isLoading: false });
        if (result) {
            setTimeout(() => { this.goToNavigate(result, phoneNumber) }, 200);
        }
    }

    goToNavigate = (result, phoneNumber) => {
        this.props.navigation.navigate("ConfirmOTPSignUp", {
            phoneNumber: phoneNumber,
            walletRegOTPId: result
        });
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { phoneNumber, errors, isLoading,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <ImageBackgroundCom>
                    <View style={styles.signInView}>
                        <Logo />
                        <View style={styles.signInInput}>
                            <InputPhoneNumber
                                errors={errors}
                                onChangeInput={this._onChangePhoneNumber}
                            />
                        </View>
                        <SignInButton onPress={this.preSignIn} title="TIẾP TỤC" />
                    </View>
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
        },
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        },
    };
};

const SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUpCom);
export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: 'black',
    },
    signInView: {
        flex: 1,
        top: 100,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    signInInput: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    signInSocial: {
        width: '90%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});