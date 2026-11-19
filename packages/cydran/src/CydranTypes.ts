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

/**
 * The payload of a message that is sent, told, delivered or received. It is `unknown`: any value is accepted, and a value
 * must be narrowed before use. The name documents intent only, so compiler errors report it as `unknown`.
 */
type MessagePayload = unknown;

/**
 * An extra argument a caller passes when resolving an object by id, as in `getObject(id, ...instanceArguments)`. It is
 * `unknown`: any value is accepted, and a value must be narrowed before use. The name documents intent only, so compiler
 * errors report it as `unknown`.
 */
type InstanceArgument = unknown;

/**
 * A resolved argument that is passed to the constructor or factory function that creates a registered object. It is
 * `unknown`: any value is accepted, and a value must be narrowed before use. The name documents intent only, so compiler
 * errors report it as `unknown`.
 */
type ConstructorArgument = unknown;

/**
 * A value passed to a logger method, after or in place of the primary message. It is `unknown`: any value is accepted, and
 * a value must be narrowed before use. The name documents intent only, so compiler errors report it as `unknown`.
 */
type LogArgument = unknown;

/**
 * The value of a configuration property. It is `unknown`: any value is accepted, and a value must be narrowed before use.
 * The name documents intent only, so compiler errors report it as `unknown`.
 */
type PropertyValue = unknown;

/**
 * A value read from or written to the model through a template expression. It is `unknown`: any value is accepted, and a
 * value must be narrowed before use. The name documents intent only, so compiler errors report it as `unknown`.
 */
type ModelValue = unknown;

/**
 * A value added to a scope, and reachable from template expressions through `s()`. It is `unknown`: any value is accepted,
 * and a value must be narrowed before use. The name documents intent only, so compiler errors report it as `unknown`.
 */
type ScopeItem = unknown;

/**
 * An element of an array rendered by `c-each` or processed by a filter. It is `unknown`: any value is accepted, and a
 * value must be narrowed before use. The name documents intent only, so compiler errors report it as `unknown`.
 */
type ListItem = unknown;

export {
	PropertyProvider,
	PropertySubscriber,
	PropertyFallBackSubscriber,
	PropertyChangeCallback,
	PropertyChangeFallbackCallback,
	CallBackThisObject,
	MessagePayload,
	InstanceArgument,
	ConstructorArgument,
	LogArgument,
	PropertyValue,
	ModelValue,
	ScopeItem,
	ListItem
};
