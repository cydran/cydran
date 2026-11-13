/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Releasable from "interface/ables/Releasable";

interface Register<R> extends Releasable {

	registerConstant<T>(id: string, instance: T): R;

	registerPrototype<T>(id: string, classInstance: Type<T>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerPrototypeWithFactory<T>(id: string, factoryFn: () => T, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerSingleton<T>(id: string, classInstance: Type<T>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R

	registerSingletonWithFactory<T>(id: string, factoryFn: () => T, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	hasRegistration(id: string): boolean;

	expose(id: string): R;

}

export default Register;
