import React from 'react';
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import face1 from '../images/avatar1.png';

// Helper function to convert a Firestore timestamp to a readable date string (MM/DD/YYYY)
const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // If timestamp is an object and has a 'seconds' property
    if (typeof timestamp === 'object' && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-US');  // e.g., "4/11/2025"
    }
    // Otherwise try converting directly (if it's a valid ISO string or Date object)
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US');
  };
  

const TaskNotificationsModal = ({ visible, onClose, completedTasks, userMap }) => {
  // Helper to determine which avatar to use
  const getAvatarSource = (user) =>
    user && user.avatar ? { uri: user.avatar } : face1;

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      {/* Semi-transparent backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>

      <View className="flex-1 justify-center p-4 shadow-md">
        {/* Modal content container */}
        <View className="absolute top-56 right-4 bg-custom-yellow rounded-2xl max-h-[34%] w-8/12 p-1"
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onTouchStart={(e) => e.stopPropagation()}
        >
          <ScrollView>
            {completedTasks.map((task) => {
            const user = task.completedBy ? userMap[task.completedBy] : userMap[task.createdBy] || {};
              return (
                <View
                  key={task.id}
                  className="bg-[#FFE7C0] p-3 mb-1 rounded-2xl"
                >
                    {/* Time display */}
                    <Text className="text-custom-blue-200 text-m ml-40 font-spaceGrotesk">
                      { task.completedAt 
                        ? formatDate(task.completedAt)
                        : formatDate(task.createdAt)
                      }
                    </Text>

                  {/* Description & user's avatar */}
                  <View className="flex-row items-center space-x-2 mb-3 rounded-full">
                    <Image
                      source={getAvatarSource(user)}
                      className="h-12 w-12 rounded-full bg-gray-300 mr-5"
                    />
                    <View className="flex-col">
                        <Text className=" text-custom-blue-200 text-xl font-bold">
                            {user.firstName}
                        </Text>
                        <Text className="text-custom-blue-200 text-m font-spaceGrotesk">
                            completed {task.title}
                        </Text>
                        
                    </View>
                    
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      </TouchableWithoutFeedback>

    </Modal>
  );
};

export default TaskNotificationsModal;
