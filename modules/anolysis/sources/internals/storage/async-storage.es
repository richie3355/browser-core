/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import AsyncStorage from '../../../platform/async-storage';
import DefaultMap from '../../../core/helpers/default-map';
import getSynchronizedDate, { DATE_FORMAT } from '../synchronized-date';
import sortByTs from './utils';

function getAnolysisKey(key = '') {
  return `anolysis_storage_${key}`;
}

async function getKeysWithPrefix(prefix) {
  const allKeys = await AsyncStorage.getAllKeys();
  const keys = [];
  for (let i = 0; i < allKeys.length; i += 1) {
    const key = allKeys[i];
    if (key.startsWith(prefix)) {
      keys.push(key.slice(prefix.length));
    }
  }
  return keys;
}

class AggregatedView {
  static key(k = '') {
    return getAnolysisKey(`aggregated_${k}`);
  }

  async runTaskAtMostOnce(date, name, fn) {
    const dateKey = AggregatedView.key(date);
    const value = await AsyncStorage.getItem(dateKey);

    // Get list of tasks already aggregated
    const tasks = new Set(value === undefined ? [] : JSON.parse(value));
    if (tasks.has(name)) {
      return;
    }

    // Run task
    await fn();

    // Remember that this task was executed for `date`
    tasks.add(name);
    await AsyncStorage.setItem(dateKey, JSON.stringify([...tasks]));
  }

  getAggregatedDates() {
    return getKeysWithPrefix(AggregatedView.key());
  }

  async deleteOlderThan(date) {
    const dates = await this.getAggregatedDates();
    const toRemove = [];
    for (let i = 0; i < dates.length; i += 1) {
      if (dates[i] < date) {
        toRemove.push(dates[i]);
      }
    }

    await AsyncStorage.multiRemove(toRemove.map(AggregatedView.key));
  }
}

class BehaviorView {
  static key(k = '') {
    return getAnolysisKey(`behavior_${k}`);
  }

  init() {
    this.cache = new Map();
  }

  async getMetrics(date) {
    const value = await AsyncStorage.getItem(BehaviorView.key(date));
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return [];
  }

  async getTypesForDate(date) {
    // Makes sure that signals are ordered by timestamp
    const signals = sortByTs(await this.getMetrics(date));
    const types = new DefaultMap(() => []);
    for (let i = 0; i < signals.length; i += 1) {
      const { type, behavior } = signals[i];
      types.update(type, (values) => { values.push(behavior); });
    }
    return types;
  }

  async add({ type, behavior }) {
    const date = getSynchronizedDate().format(DATE_FORMAT);
    const key = BehaviorView.key(date);

    const doc = {
      behavior,
      date,
      type,

      // Add timestamp only for metrics. This is safe as we only use this to
      // order messages and this information is never sent to backend.
      ts: Date.now(),
    };

    if (this.cache.has(key)) {
      this.cache.get(key).push(doc);
    } else {
      this.cache.set(key, []);
      const storedSignals = await this.getMetrics(date);

      const signals = [
        ...this.cache.get(key),
        ...storedSignals,
        doc,
      ];
      this.cache.delete(key);

      await AsyncStorage.setItem(key, JSON.stringify(signals));
    }
  }

  async deleteByDate(date) {
    await AsyncStorage.removeItem(BehaviorView.key(date));
  }
}

class SignalQueueView {
  static key(k = '') {
    return getAnolysisKey(`signals_${k}`);
  }

  constructor() {
    this.id = 1;
    this.signals = [];
  }

  async init() {
    // Load signals
    const signals = await AsyncStorage.getItem(SignalQueueView.key('queue'));
    if (typeof signals !== 'string') {
      this.signals = [];
    } else {
      this.signals = JSON.parse(signals);
    }

    // Start again from highest `id` found in existing signals
    for (let i = 0; i < this.signals.length; i += 1) {
      this.id = (Math.max(this.id, this.signals[i].id) + 1) % Number.MAX_SAFE_INTEGER;
    }
  }

  async push(signal, attempts = 0) {
    const id = this.id;
    this.id += 1;

    this.signals.push({
      id,
      signal,
      attempts,
      date: getSynchronizedDate().format(DATE_FORMAT),
    });

    // Update async storage
    await AsyncStorage.setItem(SignalQueueView.key('queue'), JSON.stringify(this.signals));
  }

  async remove(id) {
    const signals = this.signals;
    const newSignals = [];

    // Remove signals
    for (let i = 0; i < signals.length; i += 1) {
      if (signals[i].id !== id) {
        newSignals.push(signals[i]);
      }
    }

    if (signals.length !== newSignals.length) {
      this.signals = newSignals;
      await AsyncStorage.setItem(SignalQueueView.key('queue'), JSON.stringify(newSignals));
    }
  }

  async getN(n) {
    return this.signals.slice(0, n);
  }

  async getAll() {
    return this.signals;
  }

  async getSize() {
    return this.signals.length;
  }

  async deleteOlderThan(date) {
    const signals = this.signals;
    const newSignals = [];
    for (let i = 0; i < signals.length; i += 1) {
      if (signals[i].date >= date) {
        newSignals.push(signals[i]);
      }
    }
    this.signals = newSignals;
    await AsyncStorage.setItem(SignalQueueView.key('queue'), JSON.stringify(newSignals));
  }
}

export default class AnolysisStorage {
  constructor() {
    this.aggregated = null;
    this.behavior = null;
    this.signals = null;
  }

  async init() {
    this.aggregated = new AggregatedView();

    this.behavior = new BehaviorView();
    await this.behavior.init();

    this.signals = new SignalQueueView();
    await this.signals.init();
  }

  healthCheck() {
    return true;
  }

  async destroy() {
    const keys = await getKeysWithPrefix(getAnolysisKey());
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys.map(k => getAnolysisKey(k)));
    }
  }

  unload() {}
}
