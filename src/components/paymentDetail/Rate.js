import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { AirbnbRating } from 'react-native-elements';
const Rate = (props) => {
    const ratingCompleted = (rating) => {
        //console.log("Rating is: " + rating)
    }
    return (
        <View style={styles.containerRating}>
            <Text style={styles.titleRating}>Đánh giá mức độ hài lòng của trải nghiệm</Text>
            <View style={styles.rating}>
                <AirbnbRating
                    count={5}
                    defaultRating={0}
                    size={30}
                    showReadOnlyText={false}
                    showRating={false}
                    onFinishRating={ratingCompleted}
                />
            </View>
        </View>
    )
}
export default Rate;

const styles = StyleSheet.create({
    containerRating: {
        width: '100%',
        justifyContent: 'center',
        borderColor: '#827c7ca8',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        backgroundColor: '#fff',
        paddingVertical: 5
    },
    titleRating: {
        width: '100%',
        textAlign: "center",
        fontSize: 15,
        fontWeight: '600',
    },
});