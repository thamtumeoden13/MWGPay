import React, { Component, useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions } from 'react-native';
import { ListItem, Divider, Icon, Input, Button } from 'react-native-elements';
// import QRCode from 'react-native-qrcode';
import QRCode from 'react-native-qrcode-svg';

export const GetBarcode = (props) => {

    return (

        <View style={styles.container}>
            <QRCode
                value={props.shipmentOrderID}
                size={250}
                color="black"
                backgroundColor="white"
                logo={{
                    url:
                        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
                }}
                logoSize={30}
                logoMargin={2}
                logoBorderRadius={15}
                logoBackgroundColor="yellow"

            />
            <View style={{
                width: "100%",
                marginTop: 20,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Button
                    activeOpacity={0.7}
                    icon={
                        <Icon
                            name="close"
                            size={24}
                            color="#f00"
                        />
                    }
                    buttonStyle={{
                        height: 50,
                        width: "100%",
                        borderWidth: 2,
                        borderColor: '#f00',
                        borderRadius: 10,
                        alignItems: 'center',
                        backgroundColor: '#0ff'
                    }}
                    title="Đóng"
                    titleStyle={{ fontWeight: '600', width: '50%', color: '#f00', textAlign: 'left' }}
                    containerStyle={{
                        width: 200, marginHorizontal: 10,
                        justifyContent: "center", alignItems: "center",
                    }}
                    onPress={props.onCloseModalInputForm}
                    iconContainerStyle={{ alignItems: 'flex-end', width: '50%' }}
                    style={{ alignItems: 'center', alignContent: 'center' }}
                />
            </View>
        </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
});