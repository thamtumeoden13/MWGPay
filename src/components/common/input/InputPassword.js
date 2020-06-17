import React, { useState, useEffect } from 'react';
import { Input, Icon } from 'react-native-elements';


export const InputPassword = (props) => {
    const [password, setPassword] = useState(props.password)
    const [errors, setErrors] = useState('')
    const autoFocus = typeof props.autoFocus !== "undefined" ? props.autoFocus : true
    useEffect(() => {
        if (props.onChangeInput)
            props.onChangeInput(password)
        setErrors('')
    }, [password])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <Input
            leftIcon={
                <Icon
                    name="lock"
                    type="font-awesome"
                    color="#288ad6"
                    size={25}
                />
            }
            containerStyle={{ marginVertical: 10 }}
            onChangeText={(password) => setPassword(password)}
            value={password}
            inputStyle={{ marginLeft: 10, color: '#000' }}
            secureTextEntry={true}
            keyboardAppearance="light"
            placeholder={props.placeholder ? props.placeholder : "Nhập mật khẩu"}
            autoCapitalize="none"
            autoFocus={autoFocus}
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={6}
            blurOnSubmit={true}
            placeholderTextColor="#000"
            errorStyle={{ textAlign: 'left', fontSize: 12 }}
            errorMessage={errors}
        />
    )
}