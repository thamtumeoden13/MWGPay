import React, { useState, useEffect } from 'react';
import { TextField } from 'react-native-material-textfield';

export const ModalConfigEmail = (props) => {

    const [email, setEmail] = useState(props.email ? props.email : '')
    const [errors, setErrors] = useState(props.errors ? props.errors : {})

    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(email)
        setErrors({})
    }, [email])

    return (
        <TextField
            label='Nhập Email'
            inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
            value={email}
            onChangeText={(value) => setEmail(value)}
            clearButtonMode="always"
            keyboardType="email-address"
            error={errors.email}
            errorColor="red"
            autoFocus={true}
        />
    );
}