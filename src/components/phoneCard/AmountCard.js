import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { formatMoney, formatData } from '@utils/function';

const numColumns = 3;

const styles = StyleSheet.create({
    defaultStyleItem: {
        flex: 1,
        // width: Dimensions.get('window').width / numColumns,
        height: Dimensions.get('window').width / numColumns,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: '#b7b7b7',
        // marginTop: 15,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 5,
    },
    highlightStyleItem: {
        flex: 1,
        // width: Dimensions.get('window').width / numColumns,
        height: Dimensions.get('window').width / numColumns,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: 'blue',
        // marginTop: 15,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 5,
    },
    visibleStyleItem: {
        flex: 1,
        // width: Dimensions.get('window').width / numColumns,
        height: Dimensions.get('window').width / numColumns,
        backgroundColor: 'transparent',
        marginHorizontal: 5,
        marginVertical: 10,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
});
export const AmountCard = (props) => {
    const [indexFocus, setIndexFocus] = useState(props.indexFocus ? props.indexFocus : 0)
    const [dataCard, setDataCard] = useState(props.dataCard)

    useEffect(() => {
        setDataCard(props.dataCard)
    }, [props.dataCard])

    useEffect(() => {
        setIndexFocus(props.indexFocus)
    }, [props.indexFocus])

    const _onValueChange = (index, item) => {
        setIndexFocus(index)
        if (props.onPress)
            props.onPress(index, item)
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
                <TouchableOpacity onPress={() => _onValueChange(index, item)}>
                    <View style={style}>
                        <View style={{ width: '100%', height: '100%', justifyContent: "center", }}>
                            <Text style={{ fontSize: 15, textAlign: "center", paddingBottom: 6 }}>{item.labelAmount}</Text>
                            <Text style={{ fontSize: 10, textAlign: "center" }}>Hoàn lại {formatMoney(item.discountAmount, 0)}đ</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <FlatList
            data={formatData(dataCard, numColumns)}
            extraData={indexFocus}
            keyExtractor={(item, index) => index.toString()}
            renderItem={_renderItem}
            numColumns='3'
            // contentContainerStyle={{ justifyContent: "center" }}
            style={{ flex: 1 }}
        />
    );
}