/*
 *  Copyright 2006 Hannes Wallnoefer <hannes@helma.at>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.helma.util;

import java.util.Map;
import java.util.Set;
import java.util.Collection;
import java.util.HashMap;

/**
 * Map wrapper that makes a string-keyed map case insensitive while
 * still preserving case in key collections.
 */
public class CaseInsensitiveMap<K,V> implements Map<K,V> {

    Map<K,V> wrapped;
    Map<String,K> keymap;
    boolean ignoreCase = true;

    public CaseInsensitiveMap() {
        wrapped = new HashMap<K,V>();
        keymap = new HashMap<String, K>();
    }

    public CaseInsensitiveMap(Map<K,V> map) {
        assert map != null;
        wrapped = map;
        keymap = new HashMap<String, K>();
        for (K key: map.keySet()) {
            keymap.put(processKey(key), key);
        }
    }

    public int size() {
        return wrapped.size();
    }

    public boolean isEmpty() {
        return wrapped.isEmpty();
    }

    public boolean containsKey(Object key) {
        return keymap.containsKey(processKey(key));
    }

    public boolean containsValue(Object value) {
        return wrapped.containsValue(value);
    }

    public V get(Object key) {
        key = keymap.get(processKey(key));
        return key == null ? null : wrapped.get(key);
    }

    /**
     * Puts a new key-value pair into the map.
     * @param key key
     * @param value value
     * @return the old value, if an old value got replaced
     */
    public V put(K key, V value) {
        String pkey = processKey(key);
        K previousKey = keymap.put(pkey, key);
        V previousValue = wrapped.put(key, value);
        if (previousValue == null && previousKey != null)
            previousValue = wrapped.remove(previousKey);
        return previousValue;
    }

    public V remove(Object key) {
        String pkey = processKey(key);
        Object previousKey = keymap.remove(pkey);
        return previousKey == null ? null : wrapped.remove(previousKey);
    }

    public void putAll(Map<? extends K, ? extends V> t) {
        for (K key: t.keySet()) {
            K previousKey = keymap.put(processKey(key), key);
            if (previousKey != null) {
                wrapped.remove(previousKey);
            }
        }
        wrapped.putAll(t);
    }

    public void clear() {
        keymap.clear();
        wrapped.clear();
    }

    public Set<K> keySet() {
        return wrapped.keySet();
    }

    public Collection<V> values() {
        return wrapped.values();
    }

    public Set<Map.Entry<K,V>> entrySet() {
        return wrapped.entrySet();
    }

    public String toString() {
        return wrapped.toString();
    }

    public boolean equals(Object obj) {
        return wrapped.equals(obj);
    }

    public int hashCode() {
        return wrapped.hashCode();
    }

    private String processKey(Object key) {
        assert key != null;
        return key.toString().toLowerCase();
    }
}
