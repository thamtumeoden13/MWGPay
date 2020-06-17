import React, { Component, useRef, useEffect, useState, useLayoutEffect, Fragment } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    Image,
    Dimensions,
} from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker, } from "react-native-maps";
import { Icon } from 'react-native-elements'

const Images = [
    { uri: "https://i.imgur.com/sNam9iJ.jpg" },
    { uri: "https://i.imgur.com/N7rlQYt.jpg" },
    { uri: "https://i.imgur.com/UDrH0wm.jpg" },
    { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]

const Regions = [
    {
        latitude: 10.866278,  // 45.52220671242907,
        longitude: 106.803218, //-122.6653281029795, 
    },
    {
        latitude: 10.851800,  // 45.52220671242907,
        longitude: 106.755032, //-122.6653281029795, 
    },
    {
        latitude: 10.860356,  // 45.52220671242907,
        longitude: 106.761734, //-122.6653281029795, 
    },
    {
        latitude: 10.857532,
        longitude: 106.763665
    }
]
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const markers = [
    {
        coordinate: {
            latitude: 45.524548,
            longitude: -122.6749817,
        },
        title: "Best Place",
        description: "This is the best place in Portland",
        image: Images[0],
    },
    {
        coordinate: {
            latitude: 45.524698,
            longitude: -122.6655507,
        },
        title: "Second Best Place",
        description: "This is the second best place in Portland",
        image: Images[1],
    },
    {
        coordinate: {
            latitude: 45.5230786,
            longitude: -122.6701034,
        },
        title: "Third Best Place",
        description: "This is the third best place in Portland",
        image: Images[2],
    },
    {
        coordinate: {
            latitude: 45.521016,
            longitude: -122.6561917,
        },
        title: "Fourth Best Place",
        description: "This is the fourth best place in Portland",
        image: Images[3],
    },
]
export const TabDelivered = (props) => {
    let _map = useRef();
    let regionTimeout
    const [state, setState] = useState({
        index: 0,
        animation: new Animated.Value(0),
        markers: [],
        interpolations: [],
        region: {
            latitude: 10.866278,  // 45.52220671242907,
            longitude: 106.803218, //-122.6653281029795, 
            latitudeDelta: 0.04864195044303443,
            longitudeDelta: 0.040142817690068,
        }
    })


    const onEvent = event => {
        // console.log("onEvent", event.value, _map, _map.map)
        if (state.markers.length > 0) {
            let newIndex = Math.floor(event.value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (newIndex >= state.markers.length) {
                newIndex = state.markers.length - 1;
            }
            if (newIndex <= 0) {
                newIndex = 0;
            }
            clearTimeout(regionTimeout);
            regionTimeout = setTimeout(() => {
                if (state.index !== newIndex) {
                    const { coordinate } = state.markers[newIndex];
                    if (_map && _map.map) {
                        _map.animateToRegion({
                            latitude: coordinate.latitude,
                            longitude: coordinate.longitude,
                            latitudeDelta: state.region.latitudeDelta,
                            longitudeDelta: state.region.longitudeDelta,
                        }, 500);
                    }
                    setState({ ...state, index: newIndex })
                }
            }, 50)
        }
    };

    const onMapReady = () => {
        if (state.markers && state.markers.length > 0) {
            const { coordinate } = state.markers[0];
            if (_map && _map.map) {
                _map.animateToRegion({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: state.region.latitudeDelta,
                    longitudeDelta: state.region.longitudeDelta,
                }, 500);
            }
        }
    }

    useLayoutEffect(() => {
        if (props.result && props.result.length > 0) {
            let markers = []
            props.result.map((item, index) => {
                const array = item.ReceiverGeoLocation.split(',')
                if (array.length > 1) {
                    markers.push({
                        coordinate: {
                            latitude: Regions[Math.floor(Math.random() * 4)].latitude, //array[0],
                            longitude: Regions[Math.floor(Math.random() * 4)].longitude, //array[1],
                        },
                        title: `#${item.ShipmentOrderID}`,
                        description: item.ShipmentGoodsDescription,
                        image: Images[Math.floor(Math.random() * 4)],
                    })
                }
            })
            const interpolations = markers.map((marker, index) => {
                const inputRange = [
                    (index - 1) * CARD_WIDTH,
                    index * CARD_WIDTH,
                    ((index + 1) * CARD_WIDTH),
                ];
                const scale = state.animation.interpolate({
                    inputRange,
                    outputRange: [1, 2.5, 1],
                    extrapolate: "clamp",
                });
                const opacity = state.animation.interpolate({
                    inputRange,
                    outputRange: [0.35, 1, 0.35],
                    extrapolate: "clamp",
                });
                return { scale, opacity };
            });
            setState({ ...state, markers, interpolations })
        }
    }, [props.result])

    useEffect(() => {
        if (state.markers && state.markers.length > 0) {
            const { coordinate } = state.markers[0];
            if (_map && _map.map) {
                _map.animateToRegion({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: state.region.latitudeDelta,
                    longitudeDelta: state.region.longitudeDelta,
                }, 500);
            }
        }
    }, [state.markers])

    useEffect(() => {
        watchId = state.animation.addListener(onEvent)
        return () => {
            state.animation.removeListener(watchId)
        }
    })

    const interpolations = state.markers.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            ((index + 1) * CARD_WIDTH),
        ];
        const scale = state.animation.interpolate({
            inputRange,
            outputRange: [1, 2.5, 1],
            extrapolate: "clamp",
        });
        const opacity = state.animation.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: "clamp",
        });
        return { scale, opacity };
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {(state.markers && state.markers.length > 0) ?
                <Fragment>
                    <MapView
                        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        ref={map => _map = map}
                        initialRegion={state.region}
                        showsMyLocationButton={true}
                        style={styles.container}
                        onMapReady={() => onMapReady()}
                    >
                        {state.markers.map((marker, index) => {
                            const scaleStyle = {
                                transform: [
                                    {
                                        scale: interpolations[index].scale,
                                    },
                                ],
                            };
                            const opacityStyle = {
                                opacity: interpolations[index].opacity,
                            };
                            return (
                                <Marker key={index} coordinate={marker.coordinate}>
                                    <Animated.View style={[styles.markerWrap, opacityStyle]}>
                                        <Animated.View style={[styles.ring, scaleStyle]} >
                                            <View style={styles.marker} />
                                        </Animated.View>
                                    </Animated.View>
                                </Marker>
                            );
                        })}
                    </MapView>
                    <Animated.ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: state.animation,
                                        },
                                    },
                                },
                            ],
                            { useNativeDriver: true }
                        )}
                        style={styles.scrollView}
                        contentContainerStyle={styles.endPadding}
                    >
                        {state.markers.map((marker, index) => (
                            <View style={styles.card} key={index}>
                                <Image
                                    source={marker.image}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.textContent}>
                                    <Text numberOfLines={1} style={styles.cardTitle}>{marker.title}</Text>
                                    <Text numberOfLines={1} style={styles.cardDescription}>
                                        {marker.description}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Animated.ScrollView>
                </Fragment>
                :
                <Fragment>
                    <View style={styles.viewSectionNoList}>
                        <View style={styles.icon}>
                            <Icon
                                name='gift'
                                type='font-awesome'
                                color='#d82cfd99'
                                size={120} />
                        </View>
                        <View style={styles.description}>
                            <Text style={{ color: '#948f8f', fontSize: 20 }}>Bạn chưa có đơn hàng hoàn thành</Text>
                        </View>
                    </View>
                </Fragment>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: '#eff1f4',
    },
    viewSectionNoList: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.27)'
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        width: 64,
        height: 64,
        justifyContent: "center", alignItems: 'center',
        backgroundColor: 'transparent'
    },
    ring: {
        justifyContent: "center", alignItems: 'center',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    viewSectionNoList: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});