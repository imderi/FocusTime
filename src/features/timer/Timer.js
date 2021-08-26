import React, { useState } from 'react';
import { View, Text, StyleSheet, Vibration, Platform } from 'react-native';

import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

import { colors } from '../../utils/colors';
import { spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';

const DEFAULT_TIME = 5

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();

  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  // DIPANGGIL DARI EXTERNAL - Countdown
  const onProgress = (progress) => {
    setProgress(progress);
  };

  // VIBRATION UNTUK SPESIFIK PLATFORM
  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(10000);
    }
  };

  // FUNCTION YG DI INVOKE SAAT TIMER HABIS
  const onEnd = () => {
    vibrate();
    setMinutes(DEFAULT_TIME);
    // PROGRESS == LOADING BAR , 1 == KEMBALI KE 100%
    setProgress(1);
    setIsStarted(false);
    // INVOKE STATE PARENT (App.js) MELALUI PROPS
    onTimerEnd();
  };

  // DIPANGGIL DARI EXTERNAL - Timing
  const changeTime = (min) => {
    setMinutes(min);
    // PROGRESS == LOADING BAR , 1 == KEMBALI KE 100%
    setProgress(1);
    setIsStarted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View style={{ paddingTop: spacing.sm }}>
        <ProgressBar progress={progress} color="#5E84E2" />
      </View>
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={styles.buttonWrapper}>
        <RoundedButton
          title={isStarted ? 'Pause' : 'Start'}
          onPress={() => setIsStarted(!isStarted)}
        />
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={() => clearSubject()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: colors.white, textAlign: 'center' },
  task: { color: colors.white, textAlign: 'center', fontWeight: 'bold' },
  countdown: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },
  buttonWrapper: {
    flex: 0.3,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
