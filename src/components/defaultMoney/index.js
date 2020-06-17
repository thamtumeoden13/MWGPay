import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { formatData } from '@utils/function'

const data = [
    {
        price: '50000',
        label: '50,000'
    },
    {
        price: '100000',
        label: '100,000'
    },
    {
        price: '200000',
        label: '200,000'
    },
    {
        price: '300000',
        label: '300,000'
    },
    {
        price: '500000',
        label: '500,000'
    },
    {
        price: '1000000',
        label: '1,000,000'
    },
    {
        price: '2000000',
        label: '2,000,000'
    },
];

const numColumns = 2;
const styles = StyleSheet.create({
    defaultStyleItem: {
        flex: 1,
        height: 60,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderColor: '#b7b7b7',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    highlightStyleItem: {
        flex: 1,
        height: 60,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: 'blue',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    visibleStyleItem: {
        flex: 1,
        height: 60,
        backgroundColor: 'transparent',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    defaultMoney: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center"
    },
});
export const DefaultMoney = (props) => {
    const [indexFocus, setIndexFocus] = useState(0)

    const _onSelectItem = (index, value) => {
        setIndexFocus(index)
        props.onPress(value)
    }

    const _renderItem = ({ item, index }) => {
        let style = styles.defaultStyleItem
        if (index === indexFocus) {
            style = styles.highlightStyleItem
        }

        if (item.empty === true) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={[styles.visibleStyleItem]} />
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => _onSelectItem(index, item.price)}>
                    <View style={style}>
                        <View style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: "center",
                        }}>
                            <Text style={{ fontSize: 18, textAlign: "center", }}>{item.label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <FlatList
            data={formatData(data, numColumns)}
            extraData={indexFocus}
            keyExtractor={(item, index) => index.toString()}
            renderItem={_renderItem}
            numColumns={numColumns}
            style={{ flex: 1 }}
            contentContainerStyle={{ marginTop: 20 }}
        />
    );
}
