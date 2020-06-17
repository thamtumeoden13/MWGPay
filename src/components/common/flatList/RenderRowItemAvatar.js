import React, { Component } from 'react';
import {
    TouchableOpacity
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements'

export const RenderRowItemAvatar = (props) => {
    let img_url = require('@assets/img/user_unknown.png')
    let cssUppercase = 'uppercase';
    if (props.item.img_uri)
        img_url = { uri: props.item.img_uri }
    if (props.item.img_local)
        img_url = props.item.img_local
    if (props.isUppercase)
        cssUppercase = 'uppercase';
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <ListItem
                key={props.index}
                title={props.item.name}
                subtitle={props.item.subtitle}
                leftAvatar={{ source: img_url }}
                rightIcon={{ name: props.rightIcon ? props.rightIcon : "chevron-right" }}
                bottomDivider={true}
                titleStyle={{ textTransform: cssUppercase }}
            />
        </TouchableOpacity>
    );
}