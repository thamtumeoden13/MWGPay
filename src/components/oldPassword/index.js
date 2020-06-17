import React, { Component, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text
} from 'react-native';

import { Logo, SignInButton, } from '../signIn';
import { InputPassword } from '../common/input'
import { regExNumber } from '@constants/systemVars';
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';
import * as Keychain from 'react-native-keychain';

export const OldPasswordComponent = (props) => {

    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(props.isLoading ? props.isLoading : false)
    const [errors, setErrors] = useState({})

    const onChangePassword = (value) => {
        setPassword(value)
    }
    const onConfirmPassword = async () => {
        let errors = {};
        //let passwordMD5 = await MD5Digest(password);
        let passwordSHA256 = HashingSHA256(password);
        let oldPassword = '';
        await Keychain.getGenericPassword().then(credentials => {
            oldPassword = credentials.password;
        });
        //console.log({ passwordSHA256, oldPassword })
        if (password.length > 0 && password.length == 6 && password.indexOf('.') == -1 && passwordSHA256 == oldPassword) {
            setIsLoading(true)
            if (props.onConfirmPassword)
                props.onConfirmPassword(password)
        }
        else {
            switch (true) {
                case password.length <= 0:
                    errors.password = 'Vui lòng nhập mật khẩu';
                    break;
                case password.length < 6:
                    errors.password = 'Mật khẩu phải đủ 6 kí tự';
                    break;
                case password.indexOf('.') > -1:
                    errors.password = 'Vui lòng nhập mật khẩu là kí tự số';
                    break;
                case passwordSHA256 !== oldPassword:
                    errors.password = 'Mật khẩu không chính xác';
                    break;
            }
            setErrors(errors)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setErrors({})
    }, [password])

    useEffect(() => {
        setIsLoading(props.isLoading)
    }, [props.isLoading])

    return (
        <View style={styles.signInView}>
            <Logo />
            <View style={styles.smallTile}>
                <Text style={styles.title}>Nhập mật khẩu cũ</Text>
            </View>
            <View style={styles.signInInput}>
                <InputPassword
                    errors={errors.password}
                    password={password}
                    onChangeInput={onChangePassword}
                    autoFocus={true}
                />
            </View>
            <SignInButton onPress={onConfirmPassword} isLoading={isLoading} title="XÁC THỰC" />
        </View>
    )
}

const styles = StyleSheet.create({
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
    smallTile: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '80%',
        marginBottom: 20,
    },
    title: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
});