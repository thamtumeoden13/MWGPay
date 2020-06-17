import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ModalItemDisplay } from './ModalItemDisplay'
import { ModalBottomHalf } from './ModalBottomHalf'
import { FlatListComponent } from '../flatList'

export const ModalComponent = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isModalVisible ? props.isModalVisible : false)
    const [indexSelect, setIndexSelect] = useState(props.indexSelect ? props.indexSelect : 0)
    const [data, setData] = useState(props.data ? props.data : [])

    const onChangeItem = (item, index) => {
        setIsModalVisible(false);
        setIndexSelect(index);
        if (props.onChangeItem) {
            props.onChangeItem(index, item)
        }
    }

    const onPressItemDisplay = () => {
        if (props.onPressItemDisplay) {
            props.onPressItemDisplay()
            setIsModalVisible(true)
        }
        else {
            setIsModalVisible(true)
        }
    }

    useEffect(() => {
        setIsModalVisible(props.isModalVisible)
    }, [props.isModalVisible])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    return (
        <View>
            <ModalItemDisplay
                onPress={onPressItemDisplay}
                image_url={data[indexSelect].image_url}
                title={data[indexSelect].title}
                rightTitle={data[indexSelect].rightTitle}
                bankAccountID={data[indexSelect].BankAccountID}
            />
            <ModalBottomHalf
                isVisible={isModalVisible}
                content={
                    <View style={styles.containerContent}>
                        <FlatListComponent
                            data={data}
                            extraData={data}
                            onClose={() => setIsModalVisible(false)}
                            rowItemType={props.rowItemType}
                            headerTitle={props.headerTitle}
                            indexSelect={indexSelect}
                            onChangeIndexSelect={onChangeItem}
                        />
                    </View>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerContent: {
        height: "50%",
        width: "100%",
        justifyContent: "center",
        backgroundColor: 'white',
    },
});