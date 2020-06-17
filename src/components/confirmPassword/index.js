import React, { Component, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text
} from 'react-native';

import { Logo, SignInButton, } from '../signIn';
import { InputPassword } from '@componentsCommon/input'
import { regExNumber } from '@constants/systemVars';

export const ConfirmPasswordComponent = (props) => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(props.isLoading ? props.isLoading : false)
    const [errors, setErrors] = useState({})

    const onChangePassword = (value) => {
        setPassword(value)
    }
    const onChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const onConfirmPassword = () => {
        let errors = {}
        if (confirmPassword.length > 0 && password.length > 0 && password.length == 6 && confirmPassword.length == 6 && password.indexOf('.') == -1 && confirmPassword.indexOf('.') == -1 && confirmPassword === password) {
            setIsLoading(true)
            if (props.onConfirmPassword)
                props.onConfirmPassword(password, confirmPassword)
        }
        else {
            switch (true) {
                case password.length <= 0:
                    errors.password = 'Vui lòng nhập mật khẩu';
                    break;
                case confirmPassword.length <= 0:
                    errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận';
                    break;
                case password.length < 6:
                    errors.password = 'Mật khẩu phải đủ 6 kí tự';
                    break;
                case confirmPassword.length < 6:
                    errors.confirmPassword = 'Mật khẩu phải đủ 6 kí tự';
                    break;
                case password.indexOf('.') > -1:
                    errors.password = 'Vui lòng nhập mật khẩu là kí tự số';
                    break;
                case confirmPassword.indexOf('.') > -1:
                    errors.confirmPassword = 'Vui lòng nhập mật khẩu là kí tự số';
                    break;
                case password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword:
                    errors.confirmPassword = 'Mật khẩu không trùng khớp';
                    break; Î
                case regExNumber.test(password) == false:
                    errors.password = 'Số điện thoại không đúng định dạng';
                    break;
                case regExNumber.test(confirmPassword) == false:
                    errors.confirmPassword = 'Số điện thoại không đúng định dạng';
                    break;

            }
            setErrors(errors)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setErrors({})
    }, [password, confirmPassword])

    useEffect(() => {
        setIsLoading(props.isLoading)
    }, [props.isLoading])

    return (
        <View style={styles.signInView}>
            <Logo />
            <View style={styles.smallTile}>
                <Text style={styles.title}>Thiết lập mật khẩu cho ví của bạn.</Text>
            </View>
            <View style={styles.signInInput}>
                <InputPassword
                    errors={errors.password}
                    password={password}
                    onChangeInput={onChangePassword}
                    autoFocus={true}
                />
                <InputPassword
                    errors={errors.confirmPassword}
                    password={confirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    onChangeInput={onChangeConfirmPassword}
                    autoFocus={false}
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