/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

type CallBackThisObject = object;
type PropertyChangeCallback<T> = (value: T) => void;
type PropertyChangeFallbackCallback<T> = (key: string, value: T) => void;

type PropertySubscriber = (thisObject: CallBackThisObject, name: string) => void;
type PropertyFallBackSubscriber = (thisObject: CallBackThisObject, name: string) => void;

type PropertyProvider<T> = () => T;

export { PropertyProvider, PropertySubscriber, PropertyFallBackSubscriber,
	PropertyChangeCallback, PropertyChangeFallbackCallback, CallBackThisObject
};
