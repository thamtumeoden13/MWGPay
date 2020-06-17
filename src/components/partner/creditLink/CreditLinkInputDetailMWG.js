import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import { TextField } from 'react-native-material-textfield'

export const CreditLinkInputDetailMWG = (props) => {

    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(username, password)
        setErrors({})
    }, [username, password])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    useEffect(() => {
        setPhoneNumber(props.phoneNumber)
    }, [props.phoneNumber])

    return (
        <View style={styles.container}>
            <View style={styles.containerTextField}>
                <TextField
                    label='Mã nhân viên'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                    clearButtonMode="always"
                    inputStyle={{ marginLeft: 10, color: 'white' }}
                    autoCapitalize="none"
                    autoFocus={true}
                    error={errors.username}
                />
                <TextField
                    label='Mật khẩu'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    clearButtonMode="always"
                    keyboardType="default"
                    secureTextEntry={true}
                    inputStyle={{ marginLeft: 10, color: 'white' }}
                    autoCapitalize="none"
                    autoFocus={false}
                    error={errors.password}
                />
                <Text style={{ fontSize: 12 }}>
                    Lưu ý: Số điện thoại đăng ký nhận OTP tại BCNB phải trùng với số Ví MWG {phoneNumber}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#F5FCFF',
        justifyContent: "center",
        alignItems: "center"
    },
    containerTextField: {
        height: "90%",
        width: "95%",
        marginHorizontal: 10,
    }
});