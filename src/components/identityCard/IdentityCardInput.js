import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import { TextField } from 'react-native-material-textfield'

export const IdentityCardInput = (props) => {

    const [name, setName] = useState('') //HO SY LONG
    const [card, setCard] = useState('') //800260995
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(name, card)
        setErrors({})
    }, [name, card])

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Text style={{ fontSize: 12, color: '#000', textAlign: "left", fontWeight: 'bold', paddingLeft: 10 }}>
                    NHẬP THÔNG TIN CMND/CCCD
                </Text>
            </View>
            <View style={styles.containerTextField}>
                <TextField
                    label='Họ và tên(*)'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={name}
                    onChangeText={(value) => setName(value.toUpperCase())}
                    clearButtonMode="always"
                    error={errors.name}
                />
                <TextField
                    label='Số CMND/CCCD(*)'
                    keyboardType='number-pad'
                    maxLength={12}
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={card}
                    onChangeText={(value) => setCard(value)}
                    clearButtonMode="always"
                    error={errors.card}
                />
            </View>
        </View>
    )
}
const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        // backgroundColor: '#F5FCFF',
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: getRandomColor()
    },
    containerLabel: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' },
    containerTextField: {
        height: 150,
        width: "100%",
        paddingHorizontal: 10,
        // backgroundColor: getRandomColor()
    }
});