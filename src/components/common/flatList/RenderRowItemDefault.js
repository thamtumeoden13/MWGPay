import React, { Component } from 'react';
import {
    TouchableOpacity
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements'


export const RenderRowItemDefault = (props) => {
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <ListItem
                key={props.index}
                title={props.item.title}
                subtitle={props.item.subtitle}
                bottomDivider={true}
                containerStyle={{ backgroundColor: "#fff" }}

            />
        </TouchableOpacity>
    );
}