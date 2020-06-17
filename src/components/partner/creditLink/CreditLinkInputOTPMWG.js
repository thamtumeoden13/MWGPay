import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield'

export const CreditLinkInputOTPMWG = (props) => {

    const [OTP, setOTP] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(OTP)
        setErrors({})
    }, [OTP])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <View style={styles.container}>
            <View style={styles.containerTextField}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ fontSize: 12 }}>
                        Tín dụng MWG vừa gửi một mật khẩu OTP
                        đến số điện thoại bạn đã đăng ký với BCNB.
                    </Text>
                </View>
                <TextField
                    label='Mật khẩu OTP'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={OTP}
                    onChangeText={(value) => setOTP(value)}
                    clearButtonMode="always"
                    keyboardType="number-pad"
                    error={errors.OTP}
                    autoFocus={true}
                />
            </View>
            {/* <View style={styles.containerDetail}>
                <View style={styles.headerDetail}>
                    <Text style={{ fontSize: 18 }}>
                        THÔNG TIN TÀI KHOẢN
                    </Text>
                </View>
                <View style={styles.contentDetail}>
                    <ListItem
                        title="Số thẻ"
                        rightTitle={props.number}
                    />
                    <ListItem
                        title="Ngày phát hành"
                        rightTitle={props.memberSince}
                    />
                    <ListItem
                        title="Họ tên chủ TK"
                        rightTitle={props.name}
                    />
                    <ListItem
                        title="Số CMND/Hộ chiếu"
                        rightTitle={props.card}
                    />
                </View>
            </View> */}
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
        height: "15%",
        width: "95%",
        margin: 10,
    },
    containerDetail: {
        height: "70%",
        width: "95%",
        marginHorizontal: 10,
        marginVertical: 20
    },
});