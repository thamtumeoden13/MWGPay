import React, { Component, useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';

export const DeliveringDetailCollapse = (props) => {
    const { ShipmentOrderID, ReceiverFullName, ReceiverPhoneNumber } = props.shipmentOrderInfo
    return (
        <View style={styles.container}>
            <ListItem
                title={`${ShipmentOrderID}`}
                subtitle={`${ReceiverFullName}  |  ${ReceiverPhoneNumber}`}
                // leftAvatar={{ source: { uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg" } }}
                // rightIcon={{ name: "mouse-pointer", type: "entypo" }}
                bottomDivider={true}
                containerStyle={{ backgroundColor: "#fff" }}
                titleStyle={{ fontSize: 18, width: "70%", textAlign: "left", color: "orange", borderRadius: 10, padding: 5 }}
                subtitleStyle={{ fontSize: 16, textAlign: "left", color: '#93d5f6', padding: 5 }}
                onPress={props.onPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: '100%',
        backgroundColor: '#eff1f4'
    },
});