/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import DigestionCandidate from "digest/DigestionCandidate";

interface SegmentDigester {

	digestSegment(id: string, changedCandidates: DigestionCandidate[], candidates: DigestionCandidate[]): void;

}

export default SegmentDigester;
