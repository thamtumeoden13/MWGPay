import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';

import { ListItem, Icon } from 'react-native-elements'
import { formatDistanceToNowVi } from '@utils/function'

export const RenderRowItemCard = (props) => {
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={[styles.rowContainer, { backgroundColor: props.item.IsCancelDelivery ? "#f00" : "#93d5f6" }]}>
                <View style={{ width: '100%' }}>
                    <View style={styles.rowLogo}>
                        <Image
                            source={props.uri ? { uri: props.uri } : props.logo}
                            resizeMode="cover"
                            style={styles.imageLogoBank}
                        />
                    </View>
                    <View style={styles.rowNumberSerial}>
                        <ListItem
                            title={`${props.item.ReceiverFullName}`}
                            rightTitle={
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, textAlign: "left", color: '#000', fontWeight: '600' }}>#{props.item.ShipmentOrderID}</Text>
                                </View>
                            }
                            subtitle={
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='location-on' type='material' color='gray' size={24} />
                                    <Text style={{ fontSize: 14, textAlign: "left", color: '#000' }}>{props.item.ReceiverAddress}</Text>
                                </View>
                            }
                            rightSubtitle={
                                formatDistanceToNowVi(props.item.CreatedDate)
                            }
                            containerStyle={{ backgroundColor: "transparent", width: '100%', height: '100%' }}
                            titleStyle={{ fontSize: 18, width: "100%", textAlign: "left", color: "black", fontWeight: '600' }}
                            rightTitleStyle={{ fontSize: 14, textAlign: "left", color: 'green' }}
                            contentContainerStyle={{ flex: 3, height: 70, justifyContent: 'space-around', paddingRight: 15 }}
                            rightContentContainerStyle={{ flex: 2, height: 70, justifyContent: 'space-around' }}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 144,
        width: "100%",
        marginTop: 10,
        borderRadius: 8,
        shadowOffset: { width: 1, height: 1, },
        shadowColor: '#CCC',
        shadowOpacity: 1.0,
        shadowRadius: 1,
        backgroundColor: '#5fbc90'
    },
    title: {
        paddingLeft: 10,
        paddingTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#777'
    },
    author: {
        paddingLeft: 10,
        marginTop: 5,
        fontSize: 20,
        color: '#777'
    },
    thumbnail: {
        flex: 1,
    },
    rowLogo: {
        height: 56,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 5,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    rowNumberSerial: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    imageLogoBank: {
        height: '100%',
        width: '40%',
    }
});