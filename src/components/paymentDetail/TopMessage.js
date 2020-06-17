import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

const TopMessage = (props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {props.message}
            </Text>
        </View>

    )
}
export default TopMessage;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderBottomColor: '#827c7ca8',
        borderBottomWidth: 1,
       // marginTop: 5
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10
    },
});