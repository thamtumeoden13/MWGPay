import React, { Component, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { TextField } from 'react-native-material-textfield'
import { getOnlyNumber } from '@utils/function'

export const TransferOutToMWGPayContent = (props) => {
    const [value, setValue] = useState(props.value ? props.value : '')
    // const [upwardLimit, setUpwardLimit] = useState(props.upwardLimit ? props.upwardLimit : '1000000000')
    // const [downwardLimit, setDownwardLimit] = useState(props.downwardLimit ? props.downwardLimit : '10000')
    const [errors, setErrors] = useState({})
    const onChangeText = (amount) => {
        const formatValue = getOnlyNumber(amount)
        setValue(formatValue)
        if (props.onChangeText)
            props.onChangeText(formatValue)
        setErrors({})
    }

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    return (
        <View style={styles.container}>
            {/* <View style={styles.containerTextField}> */}
            <TextField
                label='Nhập số tiền muốn chuyển'
                inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                value={value == '0' ? '' : value}
                maxLength={10}
                onChangeText={(value) => onChangeText(value)}
                clearButtonMode="always"
                prefix="$"
                keyboardType="number-pad"
                error={errors.value}
                autoFocus={true}
            />
            {/* </View> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 10
    },
    // containerTextField: {
    //     flex: 1,
    //     marginHorizontal: 10
    // },
});