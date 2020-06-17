import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';

const TopInfo = (props) => {

    return (
        <View style={[styles.container, { backgroundColor: props.color }]}>
            <View style={styles.containerIcon}>
                <Icon
                    raised
                    name={props.iconName}
                    type='antdesign'
                    color={props.color}
                    size={30}
                    iconStyle={{ fontSize: 50 }}
                />
            </View>
            <View style={styles.containerTitle}>
                <Text style={styles.titleInfo}>{props.title}</Text>
            </View>
        </View>

    )
}
export default TopInfo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#264231',
        width: '100%',
        //marginBottom: 10
        // height: 200
    },
    containerIcon: {
        width: '100%',
        justifyContent: 'center', alignItems: 'center',
        marginTop: 80,
    },
    containerTitle: {
        width: '100%',
        justifyContent: 'center'
    },
    titleInfo: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 25
    },
});