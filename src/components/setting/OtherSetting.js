import React, { component, useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { ListItem } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width

export const OtherSetting = (props) => {
    return (
        <View style={styles.containerPaymentSetting}>
            <View style={styles.containerHeaderTitle}>
                <Text style={styles.HeaderTitle}>KHÁC</Text>
            </View>
            <TouchableOpacity>
                <ListItem
                    title='Màu ứng dụng'
                    rightIcon={{ name: "checkbox-blank", type: 'material-community', color: '#2196f3' }}
                    iconStyle
                    bottomDivider={true}
                    containerStyle={{ marginHorizontal: 5 }}
                    titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                    rightTitleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "right" }}
                />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    containerPaymentSetting: {
        backgroundColor: "transparent",
        marginTop: 10,
        width: '100%',
    },
    containerHeaderTitle: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 5
    },
    HeaderTitle: {
        textAlign: 'left',
        color: "#000",
        fontSize: 16
    },
});