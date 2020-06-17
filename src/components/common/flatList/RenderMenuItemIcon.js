import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'

import { Icon } from 'react-native-elements'

export const RenderMenuItemIcon = (props) => {
    const styles = StyleSheet.create({
        item: {
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            margin: 1,
            height: Dimensions.get('window').width / props.numColumns
        },
        itemVisible: {
            backgroundColor: 'transparent',
            flex: 1,
            margin: 1,
            height: Dimensions.get('window').width / props.numColumns,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        itemText: {
            color: 'black'
        }
    });
    if (props.item.empty === true) {
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.item, styles.itemVisible]} />
            </View>
        )
    }
    const size = Math.floor((Dimensions.get('window').width / props.numColumns) / 3)
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => props.onPress(props.item.route)}>
                <View style={styles.item}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 17 }}>
                        <Icon
                            name={props.item.icon}
                            type={props.item.type}
                            color={props.item.color}
                            size={30}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 5 }}>
                        <Text style={styles.itemText}>
                            {props.item.title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
