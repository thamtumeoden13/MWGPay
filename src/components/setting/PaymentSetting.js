import React, { component, useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import SwitchSelector from 'react-native-switch-selector'
import { ListItem } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width

export const PaymentSetting = (props) => {
    const [switchToggle, SetSwitchToggle] = useState(false)
    const [rightIcon, SetRightIcon] = useState({})

    const onChangeSwitch = () => {
        SetSwitchToggle(!switchToggle)
    }

    useEffect(() => {
        if (switchToggle) {
            SetRightIcon({
                name: 'toggle-switch', type: 'material-community',
                color: '#2196f3eb', size: 50, iconStyle: { lineHeight: 40, height: 30 },
                onPress: () => onChangeSwitch()
            })
        }
        else {
            SetRightIcon({
                name: 'toggle-switch-off', type: 'material-community',
                color: '#80808091', size: 50, iconStyle: { lineHeight: 40, height: 30 },
                onPress: () => onChangeSwitch()
            })
        }
    }, [switchToggle])

    return (
        <View style={styles.containerPaymentSetting}>
            <View style={styles.containerHeaderTitle}>
                <Text style={styles.HeaderTitle}>CÀI ĐẶT THANH TOÁN</Text>
            </View>
            <TouchableOpacity>
                <ListItem
                    title='Thanh toán nhanh'
                    rightIcon={rightIcon}
                    iconStyle
                    bottomDivider={true}
                    containerStyle={{ marginHorizontal: 5 }}
                    titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                    rightTitleStyle={{ fontSize: 30, width: WIDTH * 0.5, textAlign: "right" }}
                />
            </TouchableOpacity>
            {switchToggle > 0
                ?
                <View style={styles.containerContent}>
                    <View style={styles.detailLeft}>
                        <Text style={styles.detailContent}>Giá trị giao dịch tối đa</Text>
                    </View>
                    <View style={styles.detailRight}>
                        <Text style={{ fontSize: 16, color: '#000' }}>200.000vnd</Text>
                    </View>
                </View>
                :
                null
            }
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
    containerContent: {
        height: 50,
        backgroundColor: "#fff",
        flexDirection: "row",
        marginHorizontal: 5,
        marginBottom: 1,
    },
    detailLeft: {
        width: "60%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 5,
        paddingHorizontal: 10
    },
    detailRight: {
        width: "40%",
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 5,
        paddingHorizontal: 10,
    },
    detailContent: {
        fontSize: 16,
        textAlign: "center"
    },
});