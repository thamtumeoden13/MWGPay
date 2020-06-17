import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { InputUserName, InputPassword } from '../common/input'

export const SignInInput = (props) => {
    const [userName, setUserName] = useState(props.userName)
    const [password, setPassword] = useState(props.password)
    const [errors, setErrors] = useState({})

    const onChangeUserName = (value) => {
        setUserName(value)
    }
    const onChangePassword = (value) => {
        setPassword(value)
    }
    useEffect(() => {
        if (props.onChangeInput)
            props.onChangeInput(userName, password)
        setErrors({})
    }, [userName, password])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <View style={styles.signInInput}>
            <InputUserName
                userName={userName}
                onChangeInput={onChangeUserName}
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