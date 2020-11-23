/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform
} from 'react-native';
import AppleHealthKit from 'rn-apple-healthkit';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [steps, setSteps] = useState([]);
  useEffect(() => {
    if (Platform.OS === "ios") {
      const PERMS = AppleHealthKit.Constants.Permissions;
      const healthKitOptions = {
        permissions: {
          read:  [
            PERMS.StepCount
          ]
        }
      }

      AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
        if (err) {
          console.log("error initializing Healthkit: ", err);
          return;
        }

        const initialDate = new Date();
        const options = {
          startDate: new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() - 7).toISOString(),
          includeManuallyAdded: true
        };

        AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
          if (results) {
            setSteps(results);
          }
        });
      });
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {
            steps.map((item, index) => {
              return (
                <View key={index} style={{ marginVertical: 10 }}>
                  <Text>{item.startDate} - {item.value}</Text>
                </View>
              )
            })
          }
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
