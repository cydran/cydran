/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

enum ArgumentType {

	// TODO - Document these types

	/**
	 * An object by id from the registry.
	 */
	OBJECT = "OBJECT",

	/**
	 * A provider function by from the registry.
	 */
	PROVIDER = "PROVIDER",

	TRANSMITTER = "TRANSMITTER",

	RECEIVER = "RECEIVER",

	MESSAGE_SUBSCRIBER = "MESSAGE_SUBSCRIBER",

	INSTANCE_ID = "INSTANCE_ID",

	INSTANCE_ID_PROVIDER = "INSTANCE_ID_PROVIDER",

	CONTEXT = "CONTEXT",

	ARGUMENT = "ARGUMENT",

	LOGGER = "LOGGER",

	FUNCTION = "FUNCTION",

	CONSTANT = "CONSTANT",

	PROPERTY = "PROPERTY",

	PROPERTY_PROVIDER = "PROPERTY_PROVIDER",

	PROPERTY_SUBSCRIBER = "PROPERTY_SUBSCRIBER",

	PROPERTY_FALLBACK_SUBSCRIBER = "PROPERTY_FALLBACK_SUBSCRIBER",

	SCOPE_ITEM = "SCOPE_ITEM"

}

export default ArgumentType;