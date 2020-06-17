import React, { Component } from 'react'
import { Alert, View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions } from 'react-native';
import { ListItem, Divider, Icon } from 'react-native-elements';
import { formatDistanceToNowVi } from "@utils/function"
import { ScrollView } from 'react-native-gesture-handler';
import { formatMoney } from 'utils/function';

export const DeliveringDetail = (props) => {

    const { ShipmentOrderID, ReceiverFullName, ReceiverPhoneNumber,
        ReceiverFullAddress, ExpectedDeliveryDate, ShipmentGoodsDescription,
        TotalCOD, CreatedDate
    } = props.shipmentOrderInfo
    return (
        <View styles={styles.container}>
            {props.shipmentOrderInfo.ShipmentOrderID &&
                <ScrollView contentContainerStyle={{
                    width: '100%',
                    borderRadius: 10,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    paddingVertical: 10
                }}>
                    <ListItem
                        title={`${ShipmentOrderID}`}
                        subtitle={`${ReceiverFullName}  |  ${ReceiverPhoneNumber}`}
                        // leftAvatar={{ source: { uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg" } }}
                        rightIcon={{ name: "phone", type: "font-awesome" }}
                        bottomDivider={true}
                        containerStyle={{ backgroundColor: "#fff" }}
                    titleStyle={{ fontSize: 18, width: "90%", color: "orange", textAlign: "left", borderRadius: 10, padding: 5 }}
                        subtitleStyle={{ fontSize: 16, textAlign: "left", color: '#93d5f6', padding: 5 }}
                        onPress={props.callPhone}
                    />

                    <View style={styles.address}>
                        <Icon name='location-on' type='material' color='#000' size={24}
                            containerStyle={{
                                justifyContent: 'center'
                            }}
                        />
                        <Text style={{
                            fontSize: 14, fontWeight: 'bold',
                            textAlign: 'left', color: '#93d5f6',
                            paddingLeft: 5, paddingRight: 10,
                        }}>{ReceiverFullAddress}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "flex-start", alignItems: 'center',
                        width: '100%',
                    }}>
                        <View style={styles.delivery}>
                            <Icon name='av-timer' type='material' color='#000' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'green', paddingLeft: 5, paddingRight: 10 }}>{formatDistanceToNowVi(CreatedDate)}</Text>
                        </View>
                        <View style={styles.delivery}>
                            <Icon name='money' type='font-awesome' color='#000' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'red', paddingLeft: 5, paddingRight: 10 }}>{formatMoney(TotalCOD, 0)}</Text>
                        </View>
                    </View>
                    <View style={styles.merchandise}>
                        <Icon name='empire' type='font-awesome' color='#000' size={24}
                            containerStyle={{
                                justifyContent: 'center'
                            }}
                        />
                        <Text style={{
                            fontSize: 16, fontWeight: '500',
                            textAlign: 'left', color: '#93d5f6', paddingHorizontal: 5
                        }}>{ShipmentGoodsDescription}</Text>
                    </View>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: Dimensions.get('window').height / 2,
        width: '100%',
        backgroundColor: '#eff1f4',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    },
    address: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 10
    },
    delivery: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 10
    },
    merchandise: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
});