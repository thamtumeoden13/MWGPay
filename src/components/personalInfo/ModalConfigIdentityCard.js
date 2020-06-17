import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { TextField } from 'react-native-material-textfield';

export const ModalConfigIdentityCard = (props) => {

    const [idCard, setIDCard] = useState(props.idCard ? props.idCard : '')
    const [errors, setErrors] = useState(props.errors ? props.errors : {})

    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(idCard)
        setErrors({})
    }, [idCard])

    return (
        <TextField
            label='Nhập số CMND/CCCD'
            inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
            value={idCard}
            onChangeText={(value) => setIDCard(value)}
            clearButtonMode="always"
            keyboardType="number-pad"
            error={errors.idCard}
            errorColor="red"
            autoFocus={true}
        />
    );
}