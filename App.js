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
          style={styles.scrollView}
        >
          <View style={styles.itemRow}>
            <Text>Date</Text>
            <Text>Steps</Text>
          </View>
          {
            steps.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[styles.itemRow, { backgroundColor: index % 2 ? '#f7f7f2' : '#efefef' }]}
                >
                  <Text>{item.startDate.slice(0, 10)}</Text>
                  <Text>{item.value}</Text>
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
    marginTop: 50,
    marginHorizontal: 50,
    height: '100%',
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
});

export default App;
