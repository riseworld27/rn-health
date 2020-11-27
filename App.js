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
import GoogleFit, { Scopes } from 'react-native-google-fit';

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

  useEffect(() => {
    if (Platform.OS === "android") {
      async function startGoogleFit() {
        await GoogleFit.checkIsAuthorized();
        console.log('google fit authorized:', GoogleFit.isAuthorized);

        if (GoogleFit.isAuthorized) {
          fetchSteps();
        } else {
          const options = {
            scopes: [
              Scopes.FITNESS_ACTIVITY_READ,
            ],
          };
  
          GoogleFit.authorize(options)
            .then(authResult => {
              if (authResult.success) {
                console.log('auth success');
                fetchSteps();
              } else {
                console.log('auth denied', authResult);
              }
            })
            .catch(() => {
              console.log('auth catch');
            })
        }
      }

      async function fetchSteps() {
        const initialDate = new Date();
        const options = {
          startDate: new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() - 7).toISOString(),
          endDate: new Date().toISOString(),
        };
        const stepsData = await GoogleFit.getDailyStepCountSamples(options);
        stepsData.map(item => {
          if (item.steps.length > 0) {
            setSteps(item.steps);
          }
        })
      }

      startGoogleFit();
    }
  }, []);

  const getEmoticonText = (stepValue) => {
    if (stepValue > 1000) return '😃';
    else return '🙁';
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
        {
          steps.map((item, index) => {
            const dateValue = item.startDate || item.date;
            return (
              <View
                key={index}
                style={styles.itemRow}
              >
                <View>
                  <Text>
                    {dateValue.slice(0, 10)}
                  </Text>
                  <Text style={styles.stepLabel}>
                    {item.value}
                  </Text>
                </View>
                <Text style={styles.emoticonLabel}>
                  {getEmoticonText(item.value)}
                </Text>
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
  container: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemRow: {
    marginVertical: 7,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#daeaed',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleLabel: {
    fontWeight: '600',
  },
  stepLabel: {
    fontWeight: '700',
    fontSize: 25
  },
  emoticonLabel: {
    fontSize: 30,
  }
});

export default App;
