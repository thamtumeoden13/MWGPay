import React, { Component, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    StatusBar,
    ActivityIndicator,
    ImageBackground,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';

const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg',
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg',
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg',
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg',
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg',
    },
];
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ModalHelpPagination = props => {
    const [entries, setEntries] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        setEntries(ENTRIES1);
        console.log({ ENTRIES1, screenWidth })
    }, []);

    const renderItem = ({ item, index }, parallaxProps) => {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.illustration }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                {/* <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text> */}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                sliderWidth={screenWidth}
                itemWidth={screenWidth - 60}
                data={entries}
                renderItem={renderItem}
                hasParallaxImages={true}
                containerCustomStyle={styles.carousel}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Pagination
                    dotsLength={entries.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 8,
                        backgroundColor: 'rgba(0, 0, 0, 1)'
                    }}
                    inactiveDotStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    containerStyle={styles.pagination}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        width: screenWidth - 60,
        height: screenHeight - 250,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    carousel: {
        position: 'absolute',
        bottom: 24,
        marginBottom: 48,
    },
    pagination: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 12
    },
});