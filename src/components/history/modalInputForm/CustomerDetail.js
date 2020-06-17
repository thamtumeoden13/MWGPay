import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, ListView, FlatList, ImageBackground, Image } from 'react-native'
import { Icon, ListItem, Divider } from 'react-native-elements';


const CustomerDetail = (props) => {
    const { ReceiverFullName, ReceiverFullAddress, ReceiverPhoneNumber, ReceiverEmail } = props.shipmentOrderInfo
    return (
        <View style={styles.containerData}>
            <Text style={{ fontSize: 20, color: 'gray', marginBottom: 5 }}>Người nhận</Text>
            <Text style={{ fontSize: 18, color: 'blue', marginBottom: 5, fontWeight: 'bold' }}>{ReceiverFullName}</Text>
            <View style={{
                width: "95%", flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    width: '100%', flexDirection: 'row', alignItems: 'center',
                    paddingTop: 5
                }}>
                    <Icon name='location-on' type='material' color='#000' size={24} containerStyle={{ justifyContent: "center" }} />
                    <Text style={{ fontSize: 14, fontWeight: '500', textAlign: "left", color: 'green', paddingLeft: 5, paddingRight: 10, }}>{ReceiverFullAddress}</Text>
                </View>
                <View style={{
                    width: '100%', flexDirection: 'row', alignItems: 'center',
                    paddingTop: 5
                }}>
                    <Icon name='av-timer' type='material' color='#000' size={24} />
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'green', paddingLeft: 5, paddingRight: 10 }}>{ReceiverPhoneNumber}</Text>
                </View>
                <View style={{
                    width: '100%', flexDirection: 'row', alignItems: 'center',
                    paddingTop: 5
                }}>
                    <Icon name='email' type='material' color='#000' size={24} />
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'green', paddingLeft: 5, paddingRight: 10 }}>{ReceiverEmail}</Text>
                </View>
            </View>
        </View>
    )
}

export default CustomerDetail;

const styles = StyleSheet.create({
    containerData: {
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#93d5f6',
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
})