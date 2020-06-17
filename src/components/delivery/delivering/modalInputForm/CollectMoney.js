import React, { Component, useState, useEffect, Fragment } from 'react'
import { Alert, View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions } from 'react-native';
import { ListItem, Divider, Icon, Input, Button, CheckBox } from 'react-native-elements';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { formatMoney } from '@utils/function';
export const CollectMoney = (props) => {

    const { ShipmentOrderID, TotalCOD } = props.shipmentOrderInfo

    const [totalCODMaterial, setTotalCODMaterial] = useState(0);

    const [paymentType, setPaymentType] = useState(0);

    const [receiveMoney, setReceiveMoney] = useState(0)

    const [refundMoney, setRefundMoney] = useState(0)

    const [errors, setErrors] = useState({ receiveMoney: '' })

    const onChangePaymentType = (type) => {
        setPaymentType(type)
    }

    const onChangeReceiveMoney = (value) => {
        const convertValue = value.toString().replace(new RegExp(',', 'g'), "")
        const refund = convertValue - (totalCODMaterial + TotalCOD) > 0 ? convertValue - (totalCODMaterial + TotalCOD) : 0
        setReceiveMoney(value)
        setRefundMoney(refund)
    }

    const preReceiveMoney = () => {
        if (receiveMoney <= 0) {
            setErrors({ ...errors, receiveMoney: 'Vui lòng nhập số tiền' })
        }
        else {
            props.receiveMoney()
        }
    }

    useEffect(() => {
        if (props.shipmentOrderInfo.CombinedMaterialList) {
            const totalCODMaterial = props.shipmentOrderInfo.CombinedMaterialList.reduce((sum, curValue, curIndex, []) => {
                const totalPriceWithVAT = curValue.SaleQuantity * curValue.PriceWithVAT
                sum += totalPriceWithVAT
                return sum
            }, 0)
            setTotalCODMaterial(totalCODMaterial)
        }
    }, [props.shipmentOrderInfo.CombinedMaterialList])


    return (
        <Fragment>
            {ShipmentOrderID &&
                <View style={styles.container}>
                    <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>Thu Tiền</Text>
                    <View style={styles.row}>
                        <Text style={{ color: 'gray', fontSize: 14, textAlign: 'left' }}>Tiền COD</Text>
                        <Text style={{ color: 'red', fontSize: 14, fontWeight: '600', textAlign: 'right' }}>{formatMoney(TotalCOD, 0)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ color: 'gray', fontSize: 14, textAlign: 'left' }}>Tiền vật tư</Text>
                        <Text style={{ color: 'red', fontSize: 14, fontWeight: '600', textAlign: 'right' }}>{formatMoney(totalCODMaterial, 0)}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', padding: 5 }}>
                        <Divider style={{ backgroundColor: 'gray', height: 1, width: '100%' }} />
                    </View>
                    <View style={styles.row}>
                        <Text style={{ color: 'gray', fontSize: 14, textAlign: 'left' }}>Phải thu</Text>
                        <Text style={{ color: 'red', fontSize: 14, fontWeight: '600', textAlign: 'right' }}>{formatMoney(TotalCOD + totalCODMaterial, 0)}</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        left: 10,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ color: 'gray', fontSize: 14, }}>Hình thức thu</Text>
                        <View style={{
                            width: "100%", flexDirection: 'row', justifyContent: 'space-around'
                        }}>
                            <CheckBox
                                center
                                title='Tiền mặt'
                                checkedColor='green'
                                checked={paymentType == 0 ? true : false}
                                onPress={() => onChangePaymentType(0)}
                                containerStyle={{ alignItems: 'flex-start' }}
                            />
                            <CheckBox
                                center
                                title='Tiền thẻ'
                                checkedColor='green'
                                checked={paymentType == 1 ? true : false}
                                onPress={() => onChangePaymentType(1)}
                                containerStyle={{ alignItems: 'flex-start' }}
                            />
                        </View>
                    </View>
                    <View style={styles.row2}>
                        <Text style={{ color: 'gray', fontSize: 14, }}>Tiền khách đưa</Text>
                        <Input
                            onChangeText={(value) => onChangeReceiveMoney(value)}
                            value={receiveMoney == 0 ? '' : formatMoney(receiveMoney, 0)}
                            inputStyle={{ color: '#f00', fontSize: 16, fontWeight: '600' }}
                            keyboardAppearance="light"
                            placeholder={"Tiền khách đưa"}
                            autoCapitalize="none"
                            autoCorrect={true}
                            keyboardType="number-pad"
                            blurOnSubmit={true}
                            placeholderTextColor="gray"
                            errorStyle={{ textAlign: 'left' }}
                            containerStyle={{ width: '50%' }}
                            errorMessage={errors.receiveMoney}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', padding: 5 }}>
                        <Divider style={{ backgroundColor: 'gray', height: 1, width: '100%' }} />
                    </View>
                    <View style={styles.row3}>
                        <Text style={{ color: 'gray', fontSize: 14, }}>Tiền trả lại khách</Text>
                        <Text style={{ color: 'red', fontSize: 14, fontWeight: '600' }}>{formatMoney(refundMoney, 0)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ButtonBottomComponent
                            title="Thu tiền"
                            onPress={() => preReceiveMoney()}
                            containerButtonGroup={styles.containerButtonGroup}
                        />
                    </View>
                </View>
            }
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#288ad6',
        backgroundColor: '#fff',
        position: "relative",
    },
    containerButtonGroup: {
        height: 48,
        width: "100%",
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 5
    },
    row: {
        width: "100%",
        height: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    row2: {
        width: "100%",
        height: 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    row3: {
        width: "100%",
        height: 24,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});