import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView
} from 'react-native';
import { ListItem } from 'react-native-elements'
import { Icon, SearchBar } from 'react-native-elements'
import { Button } from 'react-native-elements';
import { RenderRowItemLabel } from "../common/flatList/RenderRowItemLabel"

export const ModalConfigContentAddress = (props) => {
    const [data, setData] = useState(props.data ? props.data : {})
    const [dataType, setDataType] = useState(props.dataType ? props.dataType : '')
    const [headerTitle, setHeaderTitle] = useState(props.headerTitle ? props.headerTitle : '')
    const _keyExtractor = (item, index) => index.toString();

    const renderHeader = (headerTitle) => {
        let header = (
            <TouchableOpacity onPress={() => props.onClose()}>
                <View style={{ backgroundColor: '#fff', height: 80, width: '100%', paddingTop: 40, }}>
                    <View style={{ flexDirection: 'row', height: 40, width: '100%', position: 'relative' }}>
                        <Icon
                            name="close"
                            type="antdesign"
                            color='#000'
                            containerStyle={{ position: 'absolute', top: 0, left: 0 }}
                            iconStyle={{ alignContent: 'center', alignItems: 'center', fontSize: 26 }}
                        />
                        <Text style={{ textAlign: 'center', color: '#000', fontSize: 18, width: '100%' }}>Danh sách các tỉnh thành</Text>
                    </View>
                    <View style={{ width: '100%', }}>
                        <SearchBar
                            placeholder="Type Here..."
                            value="11111"
                            containerStyle={{ width: '100%', backgroundColor: '#fff', }}
                            inputContainerStyle={{}}
                            inputStyle={{}}
                            lightTheme
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )

        return header
    }

    const renderRowItem = ({ item, index }) => {

        return (
            <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 1, width: '95%', marginLeft: 'auto', marginRight: 'auto', }}>
                <Text style={{ paddingLeft: 5, height: 40, width: '100%', lineHeight: 40 }} onPress={() => props.onPressItem(item, index)}>
                    {
                        item.ProvinceName ? item.ProvinceName : item.DistrictName ? item.DistrictName : item.WardName
                    }
                </Text>
            </View>
        );
    }

    const [value, setValue] = useState('')

    useEffect(() => {
        if (props.data.length > 0)
            searchFilterFunction(value);
    }, [value])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    useEffect(() => {
        setDataType(props.dataType)
    }, [props.dataType])

    useEffect(() => {
        setHeaderTitle(props.headerTitle)
    }, [props.headerTitle])

    const searchFilterFunction = (value) => {

        if (value !== '') {
            switch (dataType) {
                case 'province':
                    const dataFilterProvince = props.data.filter((item, index) => {
                        const itemData = `${item.ProvinceName.toUpperCase()}`;
                        const valueData = value.toUpperCase();
                        return itemData.indexOf(valueData) > -1;
                    })
                    setData(dataFilterProvince);
                    break;
                case 'district':
                    const dataFilterDistrict = props.data.filter((item, index) => {
                        const itemData = `${item.DistrictName.toUpperCase()}`;
                        const valueData = value.toUpperCase();
                        return itemData.indexOf(valueData) > -1;
                    })
                    setData(dataFilterDistrict);
                    break;
                case 'ward':
                    const dataFilterWard = props.data.filter((item, index) => {
                        const itemData = `${item.WardName.toUpperCase()}`;
                        const valueData = value.toUpperCase();
                        return itemData.indexOf(valueData) > -1;
                    })
                    setData(dataFilterWard);
                    break;
            }
        }
        else {
            setData(props.data);
        }

    }

    return (
        <View >
            <View style={{ backgroundColor: '#fff', height: 150, width: '100%', paddingTop: 40, }}>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', position: 'relative' }} >
                    <Icon
                        name="close"
                        type="antdesign"
                        color='#000'
                        containerStyle={{ position: 'absolute', top: 0, left: 0, zIndex: 99 }}
                        iconStyle={{ alignContent: 'center', alignItems: 'center', fontSize: 26 }}
                        onPress={() => props.onClose()}
                    />
                    <Text style={{ textAlign: 'center', color: '#000', fontSize: 18, width: '100%' }}>
                        {headerTitle}
                    </Text>
                </View>
                <View style={{ width: '100%', }}>
                    <SearchBar
                        placeholder="Type Here..."
                        value={value}
                        containerStyle={{ width: '100%', backgroundColor: '#fff', }}
                        inputContainerStyle={{}}
                        inputStyle={{ color: '#000' }}
                        lightTheme
                        onChangeText={(Text) => setValue(Text)}

                    />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <FlatList
                    data={data}
                    extraData={data}
                    keyExtractor={_keyExtractor}
                    renderItem={renderRowItem}
                    style={styles.flatListStyle}
                />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: 'yellow',
        width: '100%',
        height: Math.floor(Dimensions.get('screen').height),
    },
    flatListStyle: {
        width: '100%',
        height: Math.floor(Dimensions.get('screen').height - 150),
    },
    contentContainer: {
        backgroundColor: '#fff',

    }
});