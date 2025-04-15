import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  isRecording: boolean;
}

const BAR_COUNT = 30;
const ANIMATION_DURATION = 500;

export default function AudioVisualizer({ isRecording }: Props) {
  // Create an array of shared values for each bar's scale
  const barScales = Array.from({ length: BAR_COUNT }, () =>
    useSharedValue(0.2)
  );

  // Animate a single bar
  const animateBar = useCallback(
    (index: number) => {
      if (!isRecording) {
        barScales[index].value = withTiming(0.2, {
          duration: ANIMATION_DURATION / 2,
        });
        return;
      }

      // Create a repeating animation sequence with random heights
      barScales[index].value = withDelay(
        index * (ANIMATION_DURATION / BAR_COUNT),
        withRepeat(
          withSequence(
            withTiming(Math.random() * 0.8 + 0.2, {
              duration: ANIMATION_DURATION / 2,
            }),
            withTiming(Math.random() * 0.8 + 0.2, {
              duration: ANIMATION_DURATION / 2,
            })
          ),
          -1
        )
      );
    },
    [isRecording]
  );

  // Create animated styles for each bar
  const createBarStyle = useCallback(
    (index: number) => {
      return useAnimatedStyle(() => ({
        height: 50,
        width: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
        marginHorizontal: 2,
        transform: [{ scaleY: barScales[index].value }],
      }));
    },
    [barScales]
  );

  // Start animations when recording state changes
  React.useEffect(() => {
    barScales.forEach((_, index) => animateBar(index));
  }, [isRecording, animateBar]);

  return (
    <View style={styles.container}>
      {barScales.map((_, index) => (
        <Animated.View key={index} style={createBarStyle(index)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginVertical: 20,
  },
});
