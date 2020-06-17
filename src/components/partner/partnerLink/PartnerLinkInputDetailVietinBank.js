import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import { TextField } from 'react-native-material-textfield'

export const PartnerLinkInputDetailVietinBank = (props) => {

    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [number, setNumber] = useState('') //9704151200023613
    const [memberSince, setMemberSince] = useState('') //12/18
    const [name, setName] = useState('') //HO SY LONG
    const [card, setCard] = useState('') //800260995
    const [errors, setErrors] = useState({})
    const _onFormatMemberSince = (value) => {
        const temp = value.toString().replace("/", "");
        if (temp.length > 1) {
            let month = temp.substr(0, 2)
            let year = temp.substr(2)
            if (month > 12) {
                month = 12
            }
            setMemberSince(month + "/" + year)
        }
        else {
            setMemberSince(temp);
        }
    }
    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(number, memberSince, name, card)
        setErrors({})
    }, [number, memberSince, name, card])

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
                    label='Số thẻ'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={number}
                    onChangeText={(value) => setNumber(value)}
                    clearButtonMode="always"
                    prefix="$"
                    keyboardType="number-pad"
                    error={errors.number}
                    autoFocus={true}
                />
                <TextField
                    label='Ngày phát hành(mm/yy)'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={memberSince}
                    onChangeText={(value) => _onFormatMemberSince(value)}
                    clearButtonMode="always"
                    keyboardType="number-pad"
                    maxLength={5}
                    error={errors.memberSince}
                />
                <TextField
                    label='Họ và tên chủ thẻ'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    clearButtonMode="always"
                    error={errors.name}
                />
                <TextField
                    label='Số CMND/Hộ chiếu'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={card}
                    onChangeText={(value) => setCard(value)}
                    clearButtonMode="always"
                    error={errors.card}
                />
                <Text style={{ fontSize: 12 }}>
                    Lưu ý: Số điện thoại đăng ký nhận OTP tại VietinBank phải trùng với số Ví MWG {phoneNumber}
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