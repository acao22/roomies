import React from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TextInput } from 'react-native';
import tail from '../assets/PointModal.png';

const PointsModal = ({ visible, onCancel, taskName, totalPoints, taskPoints }) => {
  return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            onCancel(); 
          }}
        >
          <View style={styles.overlay}>
            <View className="bg-custom-yellow" style={styles.modalView}>
              <View className=" p-8 bg-custom-tan rounded-full items-center mb-4" style={{ width: 160, height: 160}}>
                <Text style={styles.extraLargeText} className="font-spaceGrotesk font-bold text-custom-blue-100">+{taskPoints}</Text>
                <Text className="font-spaceGrotesk text-custom-blue-100 text-3xl font-bold">points</Text>
              </View>
              <Text className="font-spaceGrotesk text-custom-blue-100 font-bold text-3xl w-40 mt-6"> {taskName} complete!</Text>
              <View className="items-center mt-16">
                <Text className="font-spaceGrotesk text-xl text-custom-blue-100"> total points: {totalPoints}</Text>
              </View>
            </View>
            <Image source={tail} style={styles.tail} className="w-12 h-14 mr-0 left-0" />
          </View>
        </Modal>

  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(254,249,229,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tail: {
    left: -70,
    top: -22,
    
  },
  modalView: {
    margin: 10,
    borderRadius: 50,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    width: 280,
    height: 400,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonCancel: {
    backgroundColor: 'transparent', 
  },
  buttonSubmit: {
    backgroundColor: 'transparent',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  extraLargeText: {
    fontSize: 60,
  },
});

export default PointsModal;
