/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { To } from "CydranConstants";

/**
 * Represents an object that can send messages to other objects.
 */
interface Sendable {

	/**
	 * Sends a message with a specific propagation.
	 * @param propagation Propagation of the message
	 * @param channelName The name of the channel to send the message to
	 * @param messageName The name of the message to send
	 * @param payload The optional payload to include with the message
	 * @param startFrom The optional path to the context start the traversal from
	 */
	send(propagation: To, channelName: string, messageName: string, payload?: unknown, startFrom?: string): void;

}

export default Sendable;
