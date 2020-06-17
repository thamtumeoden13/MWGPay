import React, { useState, useEffect } from 'react';
import { Input, Icon } from 'react-native-elements';

export const InputPhoneNumber = (props) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [errors, setErrors] = useState({})
    const autoFocus = typeof props.autoFocus !== "undefined" ? props.autoFocus : true
    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    useEffect(() => {
        setPhoneNumber(props.phoneNumber ? props.phoneNumber : '')
    }, [])

    const onChangeText = (phoneNumber) => {
        let rPhoneNumber = phoneNumber.replace(/ +/g, '');
        setPhoneNumber(rPhoneNumber)
        if (props.onChangeInput)
            props.onChangeInput(rPhoneNumber)
        setErrors({})
    }

    return (
        <Input
            leftIcon={
                <Icon
                    name="user"
                    type="font-awesome"
                    color="#288ad6"
                    size={25}
                />
            }
            onChangeText={(value) => onChangeText(value)}
            value={phoneNumber}
            inputStyle={{ marginLeft: 10, color: '#000' }}
            keyboardAppearance="light"
            placeholder={"Nhập số điện thoại"}
            autoFocus={autoFocus}
            autoCapitalize="none"
            maxLength={10}
            autoCorrect={true}
            keyboardType="number-pad"
            blurOnSubmit={true}
            placeholderTextColor="#000"
            errorStyle={{ textAlign: 'left' }}
            errorMessage={errors.phoneNumber}
        />
    )
}