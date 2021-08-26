import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

// MEMBUAT DETIK KE MILLIS
const minutesToMillis = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes, isPaused, onProgress, onEnd }) => {
  const interval = useRef(null);
  const [millis, setMillis] = useState(null);

  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        // kalo waktu habis
        clearInterval(interval.current);
        return time;
      }
      const timeLeft = time - 1000;
      return timeLeft;
    });
  };

  // SAAT MOUNT PERTAMA set millis
  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    onProgress(millis / minutesToMillis(minutes));
    if (millis === 0) {
      onEnd();
    }
  }, [millis]);

  // SAAT PAUSE CELEAR INTERVAL REF
  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused]);

  // FORMAT MINUTES DAN SECONDS
  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  return (
    <View>
      <Text style={styles.text}>
        {formatTime(minute)}:{formatTime(seconds)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: fontSizes.xxxl,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132,225, 0.3)',
  },
});
