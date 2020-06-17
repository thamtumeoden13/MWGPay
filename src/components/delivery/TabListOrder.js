import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem, Divider, Avatar, Icon } from 'react-native-elements';
import { getFormattedDate, formatMoney, formatDistanceToNowVi } from "@utils/function"

export const TabListOrder = (props) => {
    const [result, setResult] = useState([])
    useEffect(() => {
        setResult(props.result)
        console.log("TabListOrder", props.result)
    }, [props.result])

    const handleDetail = (id) => {
        if (props.handleDetail)
            props.handleDetail(id)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {(result && result.length > 0) ?
                result.map((item, index) => (
                    <View style={{
                        height: 160, width: '98%',
                        borderRadius: 10,
                        marginHorizontal: '1%',
                        marginVertical: 5,
                        backgroundColor: '#fff',
                        paddingVertical: 10
                    }}>
                        <TouchableOpacity onPress={() => handleDetail(item.ShipmentOrderID)}>
                            <View style={{
                                height: 64,
                                width: "100%", flexDirection: 'row',
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                            }}>
                                <View style={{
                                    width: '70%', flexDirection: 'row', justifyContent: 'flex-start'
                                }}>
                                    <ImageBackground style={{ width: 54, height: 54, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                                        resizeMode='contain'
                                        source={{ uri:'https://cdn.tgdd.vn/Products/Images/2002/153825/panasonic-cu-cs-xu9ukh-8-10-550x160.jpg'}}
                                    ></ImageBackground>
                                    <View style={{
                                        width: '70%', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'space-around',
                                    }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', backgroundColor: 'orange', borderRadius: 10, padding: 5 }} >{item.ShipmentOrderID}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{item.ReceiverFullName}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', paddingBottom: 5 }}>
                                    <Divider style={{ backgroundColor: 'gray', height: '100%', width: 2 }} />
                                </View>
                                <View style={{
                                    width: '30%',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    paddingLeft: 5,
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            name='money'
                                            type='font-awesome'
                                            color='#517fa4'
                                            size={24}
                                        />
                                        <Text style={{ fontSize: 12, color: 'red', left: 5 }}>{formatMoney(item.TotalCOD, 0)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            name='tv'
                                            type='font-awesome'
                                            color='#517fa4'
                                            size={24}
                                        />
                                        <Text style={{ fontSize: 12, color: 'red', left: 5 }}>{item.TotalItems}</Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={{ backgroundColor: 'blue', height: 2, marginHorizontal: 5 }} />

                            <View style={{
                                width: "95%", flexDirection: 'column',
                                backgroundColor: "#fff",
                                justifyContent: 'space-around',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    width: '100%', flexDirection: 'row', alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <Icon name='location-on' type='material' color='#000' size={24} containerStyle={{ justifyContent: "center" }} />
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: "left", color: '#93d5f6', paddingLeft: 5, paddingRight: 10, }}>{item.ReceiverFullAddress}</Text>
                                </View>
                                <View style={{
                                    width: '100%', flexDirection: 'row', alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <Icon name='av-timer' type='material' color='#000' size={24} />
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'green', paddingLeft: 5, paddingRight: 10 }}>{formatDistanceToNowVi(item.CreatedDate)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
                :
                <View style={styles.viewSectionNoList}>
                    <View style={styles.icon}>
                        <Icon
                            name='opencart'
                            type='font-awesome'
                            color='#d82cfd99'
                            size={120} />
                    </View>
                    <View style={styles.description}>
                        <Text style={{ color: '#948f8f', fontSize: 20 }}>Bạn chưa có đơn hàng chờ giao</Text>
                    </View>
                </View>
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: '#eff1f4',
    },
    viewSectionNoList: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    containerButtonGroup: {
        height: 48,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        paddingVertical: 5,
        backgroundColor: '#fff',
    },
});