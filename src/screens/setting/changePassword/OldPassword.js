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
import * as Keychain from 'react-native-keychain';

import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { connect } from 'react-redux';
import { callAPIWithoutAuthen } from "@actions/fetchAPIAction";

import { ModalLoading } from '@componentsCommon/modal/ModalLoading'
import { OldPasswordComponent } from '@components/oldPassword';
import ImageBackgroundCom from '@componentsCommon/imageBackground';

class OldPasswordCom extends Component {
    static navigationOptions = {
        title: 'Nhập lại mật khẩu'
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            errors: {},
        };
    }

    onConfirmPassword = (oldPassword) => {
        this.props.navigation.navigate('NewPassword', { oldPassword: oldPassword });
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <ImageBackgroundCom>
                    <OldPasswordComponent
                        onConfirmPassword={this.onConfirmPassword}
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

const OldPassword = connect(mapStateToProps, mapDispatchToProps)(OldPasswordCom);
export default OldPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});