import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements'

import { Logo, SignInButton } from '../signIn';

export const OTPComponent = (props) => {

    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber ? props.phoneNumber : '')
    const [OTP, setOTP] = useState('')
    const [isConfirmOTPTopUp, setIsConfirmOTPTopUp] = useState(props.isConfirmOTPTopUp ? props.isConfirmOTPTopUp : false)
    const [errors, setErrors] = useState(props.errors ? props.errors : '')

    const reSendOTP = () => {
        if (props.reSendOTP)
            props.reSendOTP(phoneNumber)
        setOTP('')
    }

    const changePhoneNumber = () => {
        if (props.changePhoneNumber)
            props.changePhoneNumber(phoneNumber)
    }

    const onConfirmOTP = () => {
        if (props.onConfirmOTP)
            props.onConfirmOTP(OTP)
    }

    useEffect(() => {
        setErrors('')
        if (props.changeErrors)
            props.changeErrors()
    }, [OTP])

    useEffect(() => {
        setPhoneNumber(props.phoneNumber)
    }, [props.phoneNumber])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])


    return (
        <View style={styles.signInView}>
            <Logo />
            <View style={styles.smallTile}>
                <Text style={styles.title}>Một tin nhắn chứa OTP đã được gửi đến số {phoneNumber}</Text>
            </View>
            <View style={styles.signInInput}>
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
                    inputStyle={{ marginLeft: 10, color: '#000' }}
                    keyboardAppearance="light"
                    placeholder={"Nhập OTP"}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor="#000"
                    errorStyle={{ textAlign: 'left', fontSize: 12 }}
                    errorMessage={errors}
                />
            </View>
            <Button
                title="TIẾP TỤC"
                activeOpacity={0.5}
                underlayColor="transparent"
                onPress={onConfirmOTP}
                loadingProps={{
                    size: 'large',
                    color: '#000',
                    hidesWhenStopped: true,
                }}
                buttonStyle={{
                    height: 50,
                    width: 150,
                    backgroundColor: '#ffee00',
                    borderWidth: 2,
                    borderColor: 'rgba(171, 189, 219, 1)',
                    borderRadius: 10,
                }}
                containerStyle={{ marginTop: 35, marginBottom: 20 }}
                titleStyle={{ fontWeight: 'bold', color: '#03a5db' }}
            />
            {
                isConfirmOTPTopUp == false &&
                <View style={styles.groupConfirmTitle}>
                    <Text style={styles.confirmTitle}>Bạn không nhận được OTP?</Text>
                    <View style={styles.groupButtonConfirm}>
                        <View style={styles.borderContainer}>
                            <TouchableOpacity onPress={reSendOTP}>
                                <Text style={styles.bottomTitle}>Gửi Lại OTP</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.borderContainer}>
                            <TouchableOpacity onPress={changePhoneNumber}>
                                <Text style={styles.bottomTitle}> Thay Đổi SĐT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

        </View>
    );
}



const styles = StyleSheet.create({
    signInView: {
        flex: 1,
        top: 100,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    signInInput: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    signInSocial: {
        width: '90%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerAccount: {
        width: '90%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    signInInput: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    smallTile: {
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '80%',
        marginBottom: 20,
    },
    title: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    groupConfirmTitle: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    confirmTitle: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },

    groupButtonConfirm: {
        width: '80%',
        height: 60,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    borderContainer: {
        width: "45%",
        height: 40,
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(171, 189, 219, 1)',
        borderRadius: 5
    },
    bottomTitle: {
        color: '#03a5db',
        fontSize: 16,
        textAlign: 'center',
    },
});