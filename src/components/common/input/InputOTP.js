import React, { useState, useEffect } from 'react';
import { Input, Icon } from 'react-native-elements';

export const InputOTP = (props) => {
    const [OTP, setOTP] = useState(props.OTP)
    const [errors, setErrors] = useState({})
    useEffect(() => {
        if (props.onChangeInput)
            props.onChangeInput(OTP)
        setErrors({})
    }, [OTP])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <Input
            leftIcon={
                <Icon
                    name="user-o"
                    type="font-awesome"
                    color="rgba(171, 189, 219, 1)"
                    size={25}
                />
            }
            onChangeText={(value) => setOTP(value)}
            value={OTP}
            inputStyle={{ marginLeft: 10, color: 'white' }}
            keyboardAppearance="light"
            placeholder={"Nhập mã xác thực"}
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            blurOnSubmit={true}
            placeholderTextColor="white"
            errorStyle={{ textAlign: 'left', fontSize: 12 }}
            errorMessage={errors.OTP}
        />
    )
}