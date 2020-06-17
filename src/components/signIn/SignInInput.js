import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { InputPhoneNumber, InputPassword } from '../common/input'

export const SignInInput = (props) => {
    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [password, setPassword] = useState(props.password)
    const [errors, setErrors] = useState({})

    const onChangePhoneNumber = (value) => {
        setPhoneNumber(value)
    }
    const onChangePassword = (value) => {
        setPassword(value)
    }
    useEffect(() => {
        if (props.onChangeInput)
            props.onChangeInput(phoneNumber, password)
        setErrors({})
    }, [phoneNumber, password])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <View style={styles.signInInput}>
            <InputPhoneNumber
                phoneNumber={phoneNumber}
                onChangeInput={onChangePhoneNumber}
                errors={errors}
                autoFocus={true}
            />
            <InputPassword
                password={password}
                onChangeInput={onChangePassword}
                errors={errors.password}
                autoFocus={false}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    signInInput: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    }
});