import React, { component, useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { ListItem } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width

export const LanguageSetting = (props) => {
    return (
        <View style={styles.containerPaymentSetting}>
            <View style={styles.containerHeaderTitle}>
                <Text style={styles.HeaderTitle}>NGÔN NGỮ</Text>
            </View>
            <TouchableOpacity>
                <ListItem
                    title='Ngôn ngữ/language'
                    rightIcon={{ name: "chevron-right", type: 'material-community', color: 'gray' }}
                    rightTitle='Tiếng Việt'
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