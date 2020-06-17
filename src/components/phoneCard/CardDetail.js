import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet
}
    from 'react-native'
import { Icon } from 'react-native-elements'
import { FlatListComponent } from "@componentsCommon/flatList"

export const CardDetail = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.Top}>
                <View style={styles.Logo}>
                    <ImageBackground
                        resizeMode='contain'
                        source={require('@assets/img/logo-mobifone-dep_010413095.jpg')}
                        style={{ width: 50, height: 50 }}>
                    </ImageBackground>
                </View>
                <View style={styles.groupIcon}>
                    <Icon
                        name='copy'
                        type='font-awesome'
                        color='blue'
                        onPress={() => console.log("2313")}
                    />
                    <Icon
                        name='phone'
                        type='font-awesome'
                        color='blue'
                        onPress={() => console.log("444444")}
                    />
                </View>
            </View>
            <View style={styles.Middle}>
                <FlatListComponent
                    data={props.dataDetail}
                    rowItemType="RowItemLabel"
                    flatListStyle={{ borderWidth: 1, borderColor: '#827c7ca8' }}
                />
            </View>
            <View style={styles.Bottom}>
                <View style={styles.leftValue}>
                    <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '400' }}>
                        20K
                    </Text>
                </View>
                <View style={styles.rightValue}>
                    <Text style={{ textAlign: 'center', fontSize: 14 }}>
                        Số Serial: xxxxxxxxxxxxxx
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 14 }}>
                        Mã giao dịch: yyyyyyyyyyyyyy
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightyellow',
        width: '95%', marginVertical: 20, marginHorizontal: 'auto',
        borderWidth: 1, borderColor: '#827c7ca8', borderRadius: 5
    },
    Top: {
        height: 50, width: "100%",
        flexDirection: 'row',
    },
    Logo: {
        height: 50, width: '60%',
        justifyContent: 'center',
        paddingLeft: 10
    },
    groupIcon: {
        height: 50, width: '40%',
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'
    },
    Middle: {
        width: "100%"
    },
    Bottom: {
        height: 50, width: "100%", flexDirection: 'row', margin: 5
    },
    leftValue: {
        height: 50, width: '20%',
        justifyContent: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    rightValue: {
        height: 50, width: '70%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginHorizontal: 5
    }
});