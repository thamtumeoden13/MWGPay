import React, { Component, Fragment, useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, ScrollView, TextInput, Dimensions, ImageBackground } from 'react-native';
import { ListItem, Divider, Icon, Input } from 'react-native-elements';
import { getFormattedDate, formatDistanceToNowVi } from "@utils/function"
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { formatMoney } from '@utils/function';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const DeliveredDetail = (props) => {
    const { ShipmentOrderID, ReceiverFullName, ReceiverPhoneNumber,
        ReceiverFullAddress, ExpectedDeliveryDate, CreatedDate,
        SenderFullName,
        ShipmentOrder_ItemList, CombinedMaterialList, CurrentStepPermissionList
    } = props.shipmentOrderInfo

    const [materialList, setMaterialList] = useState(CombinedMaterialList);

    const [listImage, setListImage] = useState([])

    const [totalCODMaterial, setTotalCODMaterial] = useState(0)

    const onChangeTotalQuantity = (value, item, index) => {
        const total = value.toString().replace(new RegExp(',', 'g'), "")

        const saleQuantity = total.length > 0 && (total - item.FreeQuantity) > 0 ? (total - item.FreeQuantity) : 0
        const totalPriceWithVAT = saleQuantity * item.PriceWithVAT
        // console.log({ useQuantity, saleQuantity, totalPriceWithVAT })
        const element = Object.assign({}, item, { "TotalQuantity": total, "SaleQuantity": saleQuantity, "TotalPriceWithVAT": totalPriceWithVAT })
        const listElement = Object.assign([], materialList, { [index]: element })
        // console.log({ element, listElement })
        setMaterialList(listElement)
        const totalCODMaterial = listElement.reduce((sum, curValue, curIndex, []) => {
            sum += curValue.TotalPriceWithVAT
            return sum
        }, 0);
        setTotalCODMaterial(totalCODMaterial)
    }

    useEffect(() => {
        if (props.shipmentOrderInfo.CombinedMaterialList) {
            const listElement = props.shipmentOrderInfo.CombinedMaterialList.map((item, index) => {
                const totalPriceWithVAT = item.SaleQuantity * item.PriceWithVAT
                item.TotalQuantity = item.SaleQuantity > 0 ? item.SaleQuantity + item.FreeQuantity : 0
                item.TotalPriceWithVAT = totalPriceWithVAT
                return item;
            })
            setMaterialList(listElement)
            const totalCODMaterial = listElement.reduce((sum, curValue, curIndex, []) => {
                sum += curValue.TotalPriceWithVAT
                return sum
            }, 0);
            setTotalCODMaterial(totalCODMaterial)
        }
    }, [props.shipmentOrderInfo.CombinedMaterialList])

    useEffect(() => {
        if (props.img_uri) {
            const element = {
                uri: props.img_uri,
                date: `${new Date().getHours()} : ${new Date().getMinutes()}`,
                description: ''
            }
            let listElement = listImage.slice()
            listElement.push(element)
            setListImage(listElement)
        }
    }, [props.img_uri])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={{
                width: Dimensions.get('window').width,
                paddingHorizontal: 10
            }}>
                <View style={styles.containerDetail}>
                    <ListItem
                        title={`${ShipmentOrderID}`}
                        subtitle={`${ReceiverFullName}  |  ${ReceiverPhoneNumber}`}
                        rightIcon={{ name: "phone", type: "font-awesome" }}
                        bottomDivider={true}
                        containerStyle={{ backgroundColor: "#fff" }}
                        titleStyle={{ fontSize: 18, width: "90%", textAlign: "left", color: 'orange', borderRadius: 10, padding: 5 }}
                        subtitleStyle={{ fontSize: 16, textAlign: "left", color: '#93d5f6', padding: 5 }}
                        onPress={props.callPhone}
                    />
                    <View style={styles.address}>
                        <Icon name='location-on' type='material' color='#000' size={24}
                            containerStyle={{
                                justifyContent: 'center',
                            }}
                        />
                        <Text style={{
                            fontSize: 14, fontWeight: 'bold',
                            textAlign: 'left', color: '#93d5f6#93d5f6rple', paddingLeft: 5, paddingRight: 10
                        }}>{ReceiverFullAddress}</Text>
                    </View>
                    <View style={styles.sendAddress}>
                        <Text style={{ fontSize: 16, color: 'gray' }}>Nơi gửi</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{SenderFullName}</Text>
                    </View>
                </View>
                {(ShipmentOrder_ItemList && ShipmentOrder_ItemList.length > 0) ?
                    <View style={styles.containerData}>
                        <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>{`Hàng hóa vận chuyển/lắp đặt`}</Text>
                        {
                            ShipmentOrder_ItemList.map((item, index) => (
                                <ListItem
                                    title={`${item.ProductName}`}
                                    subtitle={
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>Số lượng</Text>
                                                <Text style={{ color: 'red', fontSize: 14 }}>{`${item.Quantity}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>Giá</Text>
                                                <Text style={{ color: 'red', fontSize: 14 }}>{`${formatMoney(item.Price, 0)}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>Lắp đặt</Text>
                                                <Icon
                                                    type="feather"
                                                    name={item.IsInstallItem ? "check-square" : "square"}
                                                    size={20}
                                                    containerStyle={{ justifyContent: "center" }}
                                                />
                                            </View>
                                        </View>
                                    }
                                    leftAvatar={{ source: { uri: "https://cdn.tgdd.vn/Products/Images/2002/153825/panasonic-cu-cs-xu9ukh-8-10-550x160.jpg" } }}
                                    bottomDivider={true}
                                    containerStyle={{ backgroundColor: "#fff" }}
                                    titleStyle={{ fontSize: 18, width: "90%", textAlign: "left", color: "orange", padding: 5, paddingRight: 10 }}
                                    subtitleStyle={{ fontSize: 16, textAlign: "left", color: '#93d5f6' }}
                                />
                            ))
                        }
                    </View>
                    :
                    <View style={styles.containerEmpty}>
                        <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>Không tồn tại hàng hoá lắp đặt</Text>
                    </View>
                }
                {(CombinedMaterialList && CombinedMaterialList.length > 0) ?
                    <View style={styles.containerData}>
                        <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>Vật tư lắp đặt</Text>
                        {materialList && materialList.map((item, index) => (
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginVertical: 5
                            }}>
                                <Text style={{ fontSize: 16, color: 'blue', left: 10 }}>{item.ProductName}</Text>
                                <View style={{ flexDirection: 'row', alignItem: 'center', justifyContent: 'space-between', margin: 5 }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: 'blue' }}>SL dùng</Text>
                                        <Input
                                            placeholder='nhập sl'
                                            containerStyle={{ width: 80, }}
                                            inputStyle={{ fontSize: 14, width: 64, textAlign: 'center', fontWeight: '600' }}
                                            keyboardType='number-pad'
                                            maxLength={2}
                                            value={item.TotalQuantity ? item.TotalQuantity.toString() : ''}
                                            onChangeText={value => onChangeTotalQuantity(value, item, index)}
                                            disabled
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: 'blue' }}>SL miễn phí</Text>
                                        <Input
                                            value={item.FreeQuantity.toString()}
                                            containerStyle={{ width: 80, }}
                                            inputStyle={{ fontSize: 14, width: 64, textAlign: 'center', fontWeight: '600' }}
                                            keyboardType='number-pad'
                                            disabled
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: 'blue' }}>SL có phí</Text>
                                        <Input
                                            value={item.SaleQuantity ? item.SaleQuantity.toString() : '0'}
                                            containerStyle={{ width: 80, }}
                                            inputStyle={{ fontSize: 14, width: 64, textAlign: 'center', fontWeight: '600' }}
                                            keyboardType='number-pad'
                                            disabled
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: 'blue' }}>Đơn giá</Text>
                                        <Input
                                            value={formatMoney(item.PriceWithVAT, 0)}
                                            containerStyle={{ width: 124, }}
                                            inputStyle={{ fontSize: 14, width: 64, textAlign: 'center', fontWeight: '600' }}
                                            keyboardType='number-pad'
                                            disabled
                                        />
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', padding: 5 }}>
                                    <Divider style={{ backgroundColor: 'gray', height: 2, width: '100%' }} />
                                </View>
                            </View>
                        ))
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '60%' }}>
                                <Text style={{ fontSize: 16, color: '#000' }}>Tổng tiền vật tư: </Text>
                                <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold' }}>
                                    {totalCODMaterial ? formatMoney(totalCODMaterial, 0) : '0'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    : <View style={styles.containerEmpty}>
                        <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>Không tồn tại vật tư lắp đặt</Text>
                    </View>
                }
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerDetail: {
        height: 256,
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        paddingVertical: 10
    },
    address: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        marginTop: 10
    },
    delivery: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    deliveryChild: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    sendAddress: {
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        height: 48,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    buttonMaterialList: {
        height: 48,
        width: '30%',
        justifyContent: "center",
        alignItems: 'center',
    },
    containerData: {
        minHeight: 128, width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        paddingVertical: 10
    },
    containerEmpty: {
        height: 80,
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});