/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { OBJECT_ID } from "CydranConstants";
import { requireValid, isDefined, safeCydranDisposal, requireNotNull } from "util/Utils";
import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context, Registry } from "context/Context";
import SimpleMap from "interface/SimpleMap";
import Factory from "registry/factory/Factory";
import FactoryImpl from "registry/factory/FactoryImpl";
import FunctionalCreatorStrategyImpl from "registry/creator/FunctionalCreatorStrategyImpl";
import MemoizationCacheStrategyImpl from "registry/cache/MemoizationCacheStrategyImpl";
import ClassCreatorStrategyImpl from "registry/creator/ClassCreatorStrategyImpl";
import NoopCacheStrategyImpl from "registry/cache/NoopCacheStrategyImpl";
import ConstantCreatorStrategyImpl from "registry/creator/ConstantCreatorStrategyImpl";
import AliasFactoryImpl from "registry/factory/AliasFactoryImpl";
import { RegistrationError } from "error/Errors";
import { InstanceArgument } from "CydranTypes";

abstract class AbstractRegistryImpl implements Registry {

	private context: Context;

	private factories: SimpleMap<Factory<unknown>>;

	constructor(context: Context) {
		this.context = requireNotNull(context, "context");
		this.factories = {};
	}

	public abstract getObject<T>(id: string, instanceArguments: InstanceArgument[], localContext: Context): T;

	public getLocalObject<T>(id: string, instanceArguments: InstanceArgument[], localContext: Context): T {
		requireValid(id, "id", OBJECT_ID);
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(localContext, this.context, instanceArguments) as T;
		}

		return instance;
	}

	public hasRegistration(id: string): boolean {
		requireValid(id, "id", OBJECT_ID);

		let response: boolean = false;

		if (this.factories[id]) {
			response = true;
		}

		return response;
	}

	public registerConstant<T>(id: string, instance: T): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(
			id,
			new FactoryImpl({}, new ConstantCreatorStrategyImpl<T>(instance), new MemoizationCacheStrategyImpl<T>(), null, false)
		);

		return this;
	}

	public registerPrototype<T>(
		id: string,
		classInstance: Type<T>,
		resolvers?: ArgumentsResolvers,
		localResolution?: boolean
	): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(
			id,
			new FactoryImpl(
				{},
				new ClassCreatorStrategyImpl<T>(classInstance),
				new NoopCacheStrategyImpl<T>(),
				resolvers,
				localResolution
			)
		);

		return this;
	}

	public registerPrototypeWithFactory<T>(
		id: string,
		factoryFn: () => T,
		resolvers?: ArgumentsResolvers,
		localResolution?: boolean
	): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(
			id,
			new FactoryImpl(
				{},
				new FunctionalCreatorStrategyImpl<T>(factoryFn),
				new NoopCacheStrategyImpl<T>(),
				resolvers,
				localResolution
			)
		);

		return this;
	}

	public registerSingleton<T>(
		id: string,
		classInstance: Type<T>,
		resolvers?: ArgumentsResolvers,
		localResolution?: boolean
	): Registry {
		requireValid(id, "id", OBJECT_ID);

		this.registerFactory(
			id,
			new FactoryImpl(
				{},
				new ClassCreatorStrategyImpl<T>(classInstance),
				new MemoizationCacheStrategyImpl<T>(),
				resolvers,
				localResolution
			)
		);

		return this;
	}

	public registerSingletonWithFactory<T>(
		id: string,
		factoryFn: () => T,
		resolvers?: ArgumentsResolvers,
		localResolution?: boolean
	): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(
			id,
			new FactoryImpl(
				{},
				new FunctionalCreatorStrategyImpl<T>(factoryFn),
				new MemoizationCacheStrategyImpl<T>(),
				resolvers,
				localResolution
			)
		);

		return this;
	}

	public $release(): void {
		for (const key of Object.keys(this.factories)) {
			if (this.factories[key]) {
				safeCydranDisposal(this.factories[key]);
			}
		}
	}

	public extend(context: Context): Registry {
		return new ChildRegistryImpl(context, this);
	}

	public registerAlias(targetId: string, source: Registry, sourceId: string): void {
		requireValid(targetId, "targetId", OBJECT_ID);
		requireNotNull(source, "source");
		requireValid(sourceId, "sourceId", OBJECT_ID);

		if (this.hasRegistration(targetId)) {
			throw new RegistrationError("Unable to register alias, an object is already registered with id: " + targetId);
		}

		this.registerFactory(targetId, new AliasFactoryImpl(source, sourceId));
	}

	public removeAlias(targetId: string, source: Registry): void {
		requireValid(targetId, "targetId", OBJECT_ID);
		requireNotNull(source, "source");

		const factory: Factory<unknown> = this.factories[targetId];

		if (factory instanceof AliasFactoryImpl && factory.getSource() === source) {
			delete this.factories[targetId];
		}
	}

	protected registerFactory<T>(id: string, factory: Factory<T>): void {
		requireValid(id, "id", OBJECT_ID);

		if (id && factory) {
			this.factories[id] = factory;
		}
	}

}

class RegistryImpl extends AbstractRegistryImpl {

	constructor(context: Context) {
		super(context);
	}

	public getObject<T>(id: string, instanceArguments, localContext: Context): T {
		return this.getLocalObject(id, instanceArguments, localContext);
	}

}

class ChildRegistryImpl extends AbstractRegistryImpl {

	private parent: AbstractRegistryImpl;

	constructor(context: Context, parent: AbstractRegistryImpl) {
		super(context);
		this.parent = parent;
	}

	public getObject<T>(id: string, instanceArguments: InstanceArgument[] = [], localContext: Context): T {
		let instance: T = this.getLocalObject(id, instanceArguments, localContext);

		if (!isDefined(instance) && isDefined(this.parent)) {
			instance = this.parent.getObject(id, instanceArguments, localContext);
		}

		return instance;
	}

}

export default RegistryImpl;
