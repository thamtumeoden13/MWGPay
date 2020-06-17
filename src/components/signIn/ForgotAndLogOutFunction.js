import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export const ForgotAndLogOutFunction = (props) => {
    const onForgotPassword = () => {
        if (props.onForgotPassword)
            props.onForgotPassword()
    }

    const signOut = () => {
        if (props.signOut)
            props.signOut()
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onForgotPassword()}>
                <Text style={{ color: '#03a5db', fontSize: 16 }}>Quên mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()}>
                <Text style={{ color: '#000', fontSize: 16 }}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-between",
    }
});