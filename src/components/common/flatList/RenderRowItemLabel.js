import React, { Component } from 'react';
import {
    View,
    Text, StyleSheet,
    TouchableOpacity,
    Clipboard,
    Alert
} from 'react-native';
import { Icon, Divider } from 'react-native-elements'

export const RenderRowItemLabel = (props) => {

    const writeToClipboard = async () => {
        await Clipboard.setString(props.item.rightTitle);
        Alert.alert('Thông báo', `Mã thẻ ${props.item.rightTitle} đã được lưu vào bộ nhớ tạm`);
    };
    return (
        <View style={[styles.container, props.itemStyle]}>
            <View style={styles.detail}>
                <View style={styles.detailLeft}>
                    <Text style={styles.detailContent}>
                        {props.item.leftTitle}
                    </Text>
                </View>
                <View style={styles.detailRight}>
                    <Text style={{ fontSize: 16, textAlign: 'right' }}>
                        {props.item.rightTitle}
                    </Text>
                </View>
            </View>
            {props.item.subTitle &&
                <View style={styles.subDetail}>
                    <Text style={styles.subDetailContent}>
                        {props.item.subTitle}
                    </Text>
                    {props.item.writeToClipboard &&
                        <TouchableOpacity onPress={() => writeToClipboard()}>
                            <Icon
                                name="copy"
                                type="font-awesome"
                                color="#000000"
                                size={20}
                            />
                        </TouchableOpacity>
                    }
                </View>
            }
            {
                props.isDivider &&
                <Divider style={{ height: 1, backgroundColor: '#827c7ca8' }} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        width: "100%",
        justifyContent: "flex-start",
        backgroundColor: "#fff"
    },
    detail: {
        width: "100%",
        flexDirection: "row",
        paddingBottom: 5,
        paddingTop: 5,
    },
    detailLeft: {
        width: "40%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 5,
        paddingHorizontal: 10
    },
    detailRight: {
        width: "60%",
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 5,
        paddingHorizontal: 10,
    },
    detailContent: {
        fontSize: 16,
        textAlign: "left"
    },
    subDetail: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 10,
        marginBottom: 5,
        justifyContent: 'space-between'
    },
    subDetailContent: {
        fontSize: 12,
        textAlign: "left",
        color: 'gray'
    },
});