import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Icon, ListItem, ButtonGroup, Rating, AirbnbRating } from 'react-native-elements';
import { FlatListComponent } from '@componentsCommon/flatList'
import RateComponent from './Rate'
import TopInfoComponent from './TopInfo'
import TopMessage from './TopMessage'

const Fail = (props) => {
    const ratingCompleted = (rating) => {
        //console.log("Rating is: " + rating)
    }

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <TopInfoComponent title={props.titleTopInfo} iconName="close" color="#ef7d7d" />
            <TopMessage message={props.errorMessage} />
            <FlatListComponent
                data={props.flOtherInfo}
                extraData={props.flOtherInfo}
                rowItemType="RowItemLabel"
                flatListStyle={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#827c7ca8',
                    marginVertical: 10,
                    backgroundColor: '#fff',
                    flexGrow: 0,
                }}
                isRenderSeparator={true}
            />
            <RateComponent ratingCompleted={ratingCompleted} />
        </View>
    )
}
export default Fail;