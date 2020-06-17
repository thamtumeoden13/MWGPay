import React, { Component, useState } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { ListItem } from 'react-native-elements';

import { RenderRowItemAvatar } from './RenderRowItemAvatar';
import { RenderRowItemIcon } from './RenderRowItemIcon';
import { RenderRowItemDefault } from './RenderRowItemDefault';
import { RenderMenuItemIcon } from './RenderMenuItemIcon';
import { RenderRowItemLabel } from "./RenderRowItemLabel";
import { RenderRowItemModal } from "./RenderRowItemModal";
import { RenderRowItemCard } from "./RenderRowItemCard";
import { RenderRowItemCardMWG } from "./RenderRowItemCardMWG";
import { RenderRowItemImage } from './RenderRowItemImage'

export const FlatListComponent = (props) => {
    const [indexSelect, setIndexSelect] = useState(props.indexSelect)
    const onPressItem = (item, index) => {
        if (props.onPress)
            props.onPress(item, index)
    }

    const onChangeIndexSelect = (item, index) => {
        setIndexSelect(index)
        if (props.onChangeIndexSelect)
            props.onChangeIndexSelect(item, index)
    }

    const _keyExtractor = (item, index) => index.toString();

    const renderHeader = (headerTitle) => {
        let header = (
            <View style={{ margin: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {headerTitle}
                </Text>
            </View>
        )
        if (props.rowItemType == "RowItemModal") {
            header = (
                <TouchableOpacity onPress={() => props.onClose()}>
                    <ListItem
                        title={headerTitle}
                        titleStyle={{ textAlign: "center" }}
                        leftIcon={{ name: "close", type: "antdesign", color: "gray" }}
                        bottomDivider={true}
                        containerStyle={{ backgroundColor: "#fff" }}
                    />
                </TouchableOpacity>
            )
        }
        if (props.headerType && props.headerType == "HeaderTitleFlatList") {
            {
                props.data && props.data.length > 0 ?
                    header = (
                        <View style={{ paddingLeft: 10, height: 40, width: '100%', backgroundColor: "#4b494cf2" }}>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: '#fff', lineHeight: 40 }}>
                                {headerTitle}
                            </Text>
                        </View>
                    )
                    :
                    header = null
            }

        }

        return header
    }

    const renderRowItem = ({ item, index }) => {
        let rowItem
        switch (props.rowItemType) {
            case "RowItemIcon":
                rowItem = <RenderRowItemIcon index={index} item={item} onPress={() => onPressItem(item, index)} />
                break;
            case "RowItemAvatar":
                rowItem = <RenderRowItemAvatar index={index} item={item} isUppercase={props.isUppercase} onPress={() => onPressItem(item, index)} />
                break;
            case "MenuItemIcon":
                rowItem = <RenderMenuItemIcon key={index} index={index} item={item} numColumns={props.numColumns} onPress={() => onPressItem(item, index)} />
                break;
            case "RowItemLabel":
                rowItem = <RenderRowItemLabel key={index} index={index} item={item} itemStyle={props.itemStyle} isDivider={props.isDivider} />
                break;
            case "RowItemModal":
                rowItem = <RenderRowItemModal key={index} index={index} item={item} indexSelect={indexSelect} onPress={() => onChangeIndexSelect(item, index)} />
                break;
            case "RowItemCard":
                rowItem = <RenderRowItemCard index={index} item={item} logo={props.logo} onPress={() => onPressItem(item, index)} />
                break;
            case "MenuItemImage":
                rowItem = <RenderRowItemImage key={index} index={index} item={item} numColumns={props.numColumns} onPress={() => onPressItem(item, index)} />
                break;
            case "RowItemCard2":
                rowItem = <RenderRowItemCardMWG index={index} item={item} logo={props.logo} onPress={() => onPressItem(item, index)} />
                break;
            default:
                rowItem = <RenderRowItemDefault key={index} index={index} item={item} onPress={() => onPressItem(item, index)} />
                break;
        }
        return rowItem

    }
    const renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#827c7ca8",
                    // marginHorizontal: 10
                }}
            />
        );
    };
    return (
        <FlatList
            data={props.data}
            extraData={props.extraData}
            keyExtractor={_keyExtractor}
            renderItem={renderRowItem}
            numColumns={props.numColumns}
            style={props.flatListStyle}
            ListHeaderComponent={props.headerTitle ? renderHeader(props.headerTitle) : null}
            ItemSeparatorComponent={props.isRenderSeparator == true ? renderSeparator : null}
            horizontal={props.horizontal ? props.horizontal : false}
        />
    );
}