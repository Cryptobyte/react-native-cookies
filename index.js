import React from 'react';
import { NativeModules, Platform } from 'react-native';
const invariant = require('invariant');
const RNCookieManagerIOS = NativeModules.RNCookieManagerIOS;
const RNCookieManagerAndroid = NativeModules.RNCookieManagerAndroid;

let CookieManager;

if (Platform.OS === 'ios') {
    invariant(RNCookieManagerIOS,
        'react-native-cookies: Add RNCookieManagerIOS.h and RNCookieManagerIOS.m to your Xcode project');
    CookieManager = RNCookieManagerIOS;
} else if (Platform.OS === 'android') {
    invariant(RNCookieManagerAndroid,
        'react-native-cookies: Import libraries to android "react-native link react-native-cookies"');
    CookieManager = RNCookieManagerAndroid;
} else {
    invariant(CookieManager, 'react-native-cookies: Invalid platform. This library only supports Android and iOS.');
}

const functions = [
    'setFromResponse',
    'getFromResponse',
    'clearByName'
];

module.exports = {
  getAll: (useWebKit = false) => CookieManager.getAll(useWebKit),
  clearAll: (useWebKit = false) => CookieManager.clearAll(useWebKit),
  get: (url, useWebKit = false) => CookieManager.get(url, useWebKit),
  set: (cookie, useWebKit = false) => CookieManager.set(cookie, useWebKit),
  copyCookie(name, origin, version, expires, toWebKit = false) {
    CookieManager.getAll(!toWebKit).then((res) => {
      if (res[name]) {
        CookieManager.set({
          name: res[name].name,
          value: res[name].value,
          domain: res[name].domain,
          origin: origin,
          path: res[name].path,
          version: version,
          expiration: expires

        }, toWebKit).then((res) => { 
          // Todo: Return callback
        });
      }
    });
  }
};

for (var i = 0; i < functions.length; i++) {
    module.exports[functions[i]] = CookieManager[functions[i]];
}
