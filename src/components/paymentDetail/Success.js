import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlatListComponent } from '@componentsCommon/flatList'
import RateComponent from './Rate'
import TopInfoComponent from './TopInfo'
import TopMessage from './TopMessage'

const Success = (props) => {
    const ratingCompleted = (rating) => {
        //console.log("Rating is: " + rating)
    }

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <TopInfoComponent title={props.titleTopInfo} iconName="check" color="#264231" />
            <TopMessage message={props.topMessage} />
            {props.flDataCard && props.flDataCard.length > 0 &&
                <FlatListComponent
                    data={props.flDataCard}
                    extraData={props.flDataCard}
                    rowItemType="RowItemLabel"
                    headerTitle="Danh Sách Thẻ"
                    flatListStyle={{
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#827c7ca8',
                        marginVertical: 5,
                        backgroundColor: 'transparent',
                        flexGrow: 0
                    }}
                    isRenderSeparator={true}
                />
            }

            <FlatListComponent
                data={props.flOtherInfo}
                extraData={props.flOtherInfo}
                rowItemType="RowItemLabel"
                flatListStyle={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#827c7ca8',
                    marginVertical: 5,
                    backgroundColor: '#fff',
                    flexGrow: 0
                }}
                isRenderSeparator={true}
            />
            <RateComponent ratingCompleted={ratingCompleted} />
        </View>
    )
}
export default Success;