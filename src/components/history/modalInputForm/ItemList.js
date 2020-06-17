import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, ListView, FlatList, ImageBackground, Image } from 'react-native'
import { Icon, ListItem, Divider } from 'react-native-elements';
import { formatMoney } from '@utils/function';


const ItemList = (props) => {
    const { ShipmentOrder_ItemList } = props.shipmentOrderInfo
    return (
        <View style={styles.containerData}>
            {ShipmentOrder_ItemList && ShipmentOrder_ItemList.length > 0 ?
                ShipmentOrder_ItemList.map((item, index) => (
                    <View style={{ width: '100%' }}>
                        <View style={{ height: 80, flexDirection: 'row', }}>
                            <View style={{ width: '25%', paddingLeft: 10 }}>
                                <ImageBackground
                                    resizeMode='contain'
                                    source={{
                                        uri: 'https://cdn.tgdd.vn/Products/Images/2002/217755/toshiba-ras-h10d2kcvg-v-1-1-org.jpg'
                                    }}
                                    resizeMode='contain'
                                    style={{ width: '95%', height: 80, justifyContent: 'center', }}
                                />
                            </View>
                            <View style={{ width: '75%' }}>
                                <ListItem
                                    title={item.ProductName}
                                    containerStyle={{ backgroundColor: '#93d5f6', width: '100%', borderTopRightRadius: 5 }}
                                    titleStyle={{ fontSize: 16, height: '100%', width: "100%", textAlign: "left", color: "#000", fontWeight: '600', marginVertical: 5, paddingTop: 10 }}
                                />
                            </View>
                        </View>
                        <View style={{
                            height: 60,
                            width: "96%",
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            paddingBottom: 5,
                            marginTop: 10,
                            borderTopWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: '2%'
                        }}>
                            <View style={{
                                width: '50%', flexDirection: 'column', alignItems: 'center',
                            }}>
                                <Text style={{ fontSize: 14, color: 'green', marginBottom: 5 }}>Số lượng</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#000' }} >{item.Quantity}</Text>
                            </View>
                            <View style={{
                                width: '50%', flexDirection: 'column', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 14, color: 'green', marginBottom: 5 }}>Giá</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#000' }}>{formatMoney(item.Price, 0)}</Text>
                            </View>
                        </View>
                    </View>
                ))
                : <View style={{ height: 146, width: '100%' }}>
                    <Text style={{ fontSize: 16, textAlign: "left", color: "#000", fontWeight: '600', }}>Không có dữ liệu</Text>
                </View>
            }
        </View>
    )
}

export default ItemList;

const styles = StyleSheet.create({
    containerData: {
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#93d5f6',
        paddingVertical: 10,
        flexDirection: 'column',
    },
})