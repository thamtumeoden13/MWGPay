import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { formatMoney } from '@utils/function'

export const TotalValue = (props) => {

    return (
        <View style={styles.containerTotal}>
            <View style={styles.labelTotal}>
                <Text style={{ fontSize: 16, }}>
                    Số tiền thanh toán
                        </Text>
                <Text style={{ fontSize: 24 }}>
                    {formatMoney(props.totalValue, 0)} VND
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    containerTotal: {
        height: 50,
        marginVertical: 5,
        backgroundColor: "white",
        alignItems: "center",
    },
    labelTotal: {
        flex: 1,
        width: "95%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
});