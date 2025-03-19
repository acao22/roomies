import React from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const camera = require("../assets/camera.png");

const CustomModal = ({ visible, onCancel, onSubmit }) => {
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
            <View className="bg-custom-blue-200" style={styles.modalView}>
              <Text className="font-spaceGrotesk text-white text-3xl font-bold" style={styles.modalText}>
                task completed!
              </Text>
              <View className="w-52 p-8 bg-custom-blue-100 rounded-3xl items-center mb-4" style={{ width: 240 }}>
                <Image source={camera} className="w-32 h-32" />
                <Text className="font-spaceGrotesk text-white text-xl">photo (optional)</Text>
              </View>
              <View className="justify-center pt-[12px]">
                <TextInput
                  placeholder="caption (optional)"
                  placeholderTextColor="#788ABF"
                  className="bg-white text-custom-blue-200 py-2 px-6 rounded-3xl font-spaceGrotesk text-l"
                  style={{ width: 236 }}
                />
              </View>
              <View className="flex-row justify-between pt-[16px]" style={{ width: 236 }}>
                <Pressable style={[styles.button, styles.buttonCancel]} onPress={onCancel}>
                  <Text className="font-spaceGrotesk text-custom-blue-100 text-2xl font-bold">cancel</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.buttonSubmit]} onPress={onSubmit}>
                  <Text className="font-spaceGrotesk text-white text-2xl font-bold">submit!</Text>
                </Pressable>
              </View>
            </View>
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
  modalView: {
    margin: 10,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    width: 320,
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
});

export default CustomModal;
