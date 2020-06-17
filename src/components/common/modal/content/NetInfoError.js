import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
    ImageBackground,
    AlertIOS,
    TouchableHighlight
} from 'react-native';
import { Button } from 'react-native-elements';

const NetInFoError = (props) => {

    const { titleModal = '', contentModal = '' } = props;

    const onClose = () => {
        if (props.onClose)
            props.onClose()
    }
    return (
        <View style={styles.container}>
            <View style={styles.logoTitle}>
                <ImageBackground
                    source={require('@assets/img/132.jpg')}
                    resizeMode='contain'
                    style={{ width: '100%', height: 120, marginLeft: 'auto', marginRight: 'auto', }}
                />
            </View>
            <View style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', }}>
                <Text style={{ fontSize: 25, color: '#333', fontWeight: "700", }}>{titleModal}</Text>
                <Text style={{ marginTop: 10 }}>{contentModal}</Text>
                <View style={{ marginTop: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                        title="ĐÓNG"
                        type="clear"
                        containerStyle={{ width: 100, justifyContent: 'flex-end' }}
                        onPress={() => onClose()}
                    />
                </View>
            </View>
        </View>
    )
}

export default NetInFoError;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    logoTitle: {
        marginBottom: 20,
    },
});