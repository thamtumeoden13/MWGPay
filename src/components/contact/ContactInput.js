import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { TextField } from 'react-native-material-textfield';

export const ContactInput = (props) => {

    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [labelTextInput, setLabelTextInput] = useState(props.labelTextInput ? props.labelTextInput : 'Số của tôi')
    const [errors, setErrors] = useState({ phoneNumber: '' })

    useEffect(() => {
        setPhoneNumber(props.phoneNumber ? props.phoneNumber : '')
        setErrors({})
    }, [])

    useEffect(() => {
        setPhoneNumber(props.phoneNumber)
        setErrors({})
    }, [props.isSelectContact == true])

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(phoneNumber)
    }, [phoneNumber])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])


    return (
        <View style={styles.containerContact} >
            <View style={styles.inputPhoneNumber}>
                <TextField
                    label={labelTextInput}
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1 }}
                    value={phoneNumber}
                    onChangeText={(value) => setPhoneNumber(value)}
                    disabledLineWidth={0}
                    clearButtonMode="always"
                    error={errors.phoneNumber}
                    keyboardType="number-pad"
                    maxLength={10}
                    autoFocus={props.isFocus ? props.isFocus : false}
                />
            </View>
            <View style={styles.iconContact}>
                <TouchableOpacity >
                    <FontAwesome
                        name='address-book'
                        size={25}
                        color='#03A9F4'
                        iconStyle={{}}
                        style={{}}
                        onPress={props.goToDetail}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    containerContact: {
        // flex: 1,
        flexDirection: "row",
        width: '100%',

    },
    inputPhoneNumber: {
        width: '90%',
        flexDirection: 'column',
        paddingLeft: 10,
    },
    iconContact: {
        flexDirection: 'column',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 61,
    },
});