import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import { callAPIWithoutAuthen } from "@actions/fetchAPIAction";

import { ConfirmPasswordComponent } from '@components/confirmPassword'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import ImageBackgroundCom from '@componentsCommon/imageBackground';

class ConfirmPasswordCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            walletRegOTPId: '',
            OTP: ''
        };
    }

    componentDidMount = () => {
        const phoneNumber = this.props.navigation.getParam('phoneNumber', '');
        const walletRegOTPId = this.props.navigation.getParam('walletRegOTPId', '');
        const otp = this.props.navigation.getParam('OTP', '');
        this.setState({ phoneNumber, walletRegOTPId, OTP: otp })
    }

    onConfirmPassword = (password, confirmPassword) => {
        this.setState({ isLoading: true });
        const { phoneNumber, walletRegOTPId, OTP } = this.state
        this.asyncModalLoading()
        this.props.navigation.navigate('InfoCustomer',
            {
                phoneNumber: phoneNumber,
                password: password,
                walletRegOTPId: walletRegOTPId,
                OTP: OTP
            }
        );
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false })
    }

    render() {
        const { isLoading } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <ImageBackgroundCom>
                    <ConfirmPasswordComponent
                        isLoading={isLoading}
                        onConfirmPassword={this.onConfirmPassword}
                    />
                    <View>
                        <ModalLoading
                            isVisible={isLoading}
                        />
                    </View>
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

const ConfirmPassword = connect(mapStateToProps, mapDispatchToProps)(ConfirmPasswordCom);
export default ConfirmPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});