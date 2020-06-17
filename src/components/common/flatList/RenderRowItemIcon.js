import React, { Component } from 'react';
import {
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width

export const RenderRowItemIcon = (props) => {
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <ListItem
                key={props.index}
                title={props.item.title}
                subtitle={props.item.subtitle}
                rightTitle={props.item.rightTitle}
                leftIcon={{ name: props.item.icon, type: props.item.type }}
                rightIcon={{ name: props.rightIcon ? props.rightIcon : "chevron-right" }}
                bottomDivider={true}
                containerStyle={{ backgroundColor: "#fff" }}
                titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                subtitleStyle={{ fontSize: 12, textAlign: "left" }}
                rightTitleStyle={{ fontSize: 12, width: WIDTH * 0.5, textAlign: "right" }}
            />
        </TouchableOpacity>
    );
}