import React, { Fragment, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Icon } from 'react-native-elements'

export default ClapButton = ({ content, customStyleClap, customStyleBubble }) => {

    const [state, setState] = useState({
        isRenderBubble: false,
        yPosition: new Animated.Value(0),
        animationStyle: {
            transform: [{
                translateY: new Animated.Value(0)
            }]
        }
    })

    const clapButton = () => {
        if (!state.isRenderBubble) {
            Animated.timing(state.yPosition, {
                duration: 500,
                toValue: -72,
                useNativeDriver: true,
            }).start();
        }
        else {
            Animated.timing(state.yPosition).reset();
        }
        setState({
            ...state,
            isRenderBubble: !state.isRenderBubble
        });
    }

    useEffect(() => {
        setState({
            ...state, animationStyle: {
                transform: [{
                    translateY: state.yPosition
                }]
            }
        })
    }, [state.yPosition])

    return (
        <Fragment>
            <View>
                <TouchableOpacity style={[styles.clapButton, customStyleClap]} onPress={() => clapButton()}>
                    <Icon
                        type="antdesign"
                        name="plus"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
            {state.isRenderBubble &&
                <Animated.View style={[styles.clapBubble, state.animationStyle, customStyleBubble]}>
                    {content}
                </Animated.View>
            }
        </Fragment>
    )
}


const styles = StyleSheet.create({
    clapButton: {
        position: "absolute",
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: '#20c',
        shadowOffset: { width: 1, height: 1, },
        shadowColor: '#0f0f0f23',
        shadowOpacity: 1.0,
        shadowRadius: 1,
        bottom: 56,
        right: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    clapBubble: {
        position: "absolute",
        bottom: 56,
        right: 28,
        justifyContent: 'center',
        alignItems: 'center'
    }
})