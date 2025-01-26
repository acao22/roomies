import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
//import styles from '../styles/HomeScreenStyles.css';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50, fontWeight: 'bold' }}>
  <Text style={{ color: '#6cd9d5', fontWeight: 'bold' }}>room</Text>
  <Text style={{ color: '#ffb95c', fontWeight: 'bold' }}>i</Text>
  <Text style={{ color: '#ff8c83', fontWeight: 'bold' }}>es!</Text>
</Text>

            <Text style={styles.nutshellText}>putting the "W" in roomies</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pistachioText: {
        color: '#CDE764',
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center',
    },

nutshellText: {
    textAlign: 'center',
    // color: #000,
    // font-size: 12px,
    // font-style: normal,
    // font-weight: 400,
    // line-height: normal,
},

});

export default HomeScreen;
