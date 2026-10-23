/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface Receivable {

	/**
	 * Sends a message to a specific object.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	message(channelName: string, messageName: string, payload?: unknown): void;

}

export default Receivable;
