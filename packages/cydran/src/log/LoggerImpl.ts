import Level from "log/Level";
import Logger from "log/Logger";
import { Appender } from "log/appender/Appender";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import TraceLevelStrategyImpl from "log/strategy/TraceLevelStrategyImpl";
import DebugLevelStrategyImpl from 'log/strategy/DebugLevelStrategyImpl';
import InfoLevelStrategyImpl from 'log/strategy/InfoLevelStrategyImpl';
import WarnLevelStrategyImpl from 'log/strategy/WarnLevelStrategyImpl';
import ErrorLevelStrategyImpl from 'log/strategy/ErrorLevelStrategyImpl';
import FatalLevelStrategyImpl from 'log/strategy/FatalLevelStrategyImpl';
import DisabledLevelStrategyImpl from 'log/strategy/DisabledLevelStrategyImpl';
import { Context } from "context/Context";
import { LevelStrategy } from 'log/strategy/LevelStrategy';

const STRATEGIES: AdvancedMap<LevelStrategy> = new AdvancedMapImpl<LevelStrategy>();
STRATEGIES.put(Level.TRACE.toUpperCase(), new TraceLevelStrategyImpl());
STRATEGIES.put(Level.DEBUG.toUpperCase(), new DebugLevelStrategyImpl());
STRATEGIES.put(Level.INFO.toUpperCase(), new InfoLevelStrategyImpl());
STRATEGIES.put(Level.WARN.toUpperCase(), new WarnLevelStrategyImpl());
STRATEGIES.put(Level.ERROR.toUpperCase(), new ErrorLevelStrategyImpl());
STRATEGIES.put(Level.FATAL.toUpperCase(), new FatalLevelStrategyImpl());
STRATEGIES.put(Level.DISABLED.toUpperCase(), new DisabledLevelStrategyImpl());

const LOGGER_NAME_PREFIX = "cydran.logging";

class LoggerImpl implements Logger {

	private context: Context;

	private key: string;

	private label: string;

	private properties: Properties;

	private appenders: Appender[];

	private strategy: LevelStrategy;

	private allowSuppression: boolean;

	constructor(context: Context, key: string, label: string) {
		this.context = requireNotNull(context, "context");
		this.key = requireNotNull(key, "key");
		this.label = label ?? this.key;
		requireNotNull(context, "context");
		this.properties = context.getProperties();
		this.allowSuppression = false;
		const contextNameSegment = context.isRoot() ? "" : "." + context.getFullName();
		const propertyPrefix: string = LOGGER_NAME_PREFIX + contextNameSegment + "." + this.key + ".";
		this.initAllowSupressDefaultAppender(propertyPrefix);
		this.initAppenders(propertyPrefix);
		this.initLevel(propertyPrefix);
	}

	public getKey(): string {
		return this.key;
	}

	public getLabel(): string {
		return this.label;
	}

	public trace(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.trace(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifTrace(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifTrace(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public debug(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.debug(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifDebug(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifDebug(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public info(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.info(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifInfo(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifInfo(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public warn(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.warn(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifWarn(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifWarn(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public error(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.error(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifError(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifError(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public fatal(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.fatal(this.label, this.appenders, primaryMsg, moreArgs);
	}

	public ifFatal(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifFatal(this.label, this.appenders, primaryMsgFn, moreArgs);
	}

	public isTrace(): boolean {
		return this.strategy.isTrace();
	}

	public isDebug(): boolean {
		return this.strategy.isDebug();
	}

	public isInfo(): boolean {
		return this.strategy.isInfo();
	}

	public isWarn(): boolean {
		return this.strategy.isWarn();
	}

	public isError(): boolean {
		return this.strategy.isError();
	}

	public isFatal(): boolean {
		return this.strategy.isFatal();
	}

	public getLevel(): string {
		return this.strategy.getLevel();
	}

	private initAllowSupressDefaultAppender(propertyPrefix: string): void {
		const preferredPropertyName: string = propertyPrefix + "allowSupressDefaultAppender";
		this.properties.addFallbackObserver(this, this.onAppendersChange, preferredPropertyName, "cydran.logging");
		const allowSuppress: boolean = this.properties.getWithFallback(preferredPropertyName) as boolean;
		this.updateAllowSupressDefaultAppender(allowSuppress);
	}

	private initAppenders(propertyPrefix: string): void {
		const preferredPropertyName: string = propertyPrefix + "appenders";
		this.properties.addFallbackObserver(this, this.onAppendersChange, preferredPropertyName, "cydran.logging");
		const appenderIds: string = this.properties.getWithFallback(preferredPropertyName) as string;
		this.updateAppenders(appenderIds);
	}

	private initLevel(propertyPrefix: string): void {
		const preferredPropertyName: string = propertyPrefix + "level";
		this.properties.addFallbackObserver(this, this.onLevelChange, preferredPropertyName, "cydran.logging");
		const level: string = this.properties.getWithFallback(preferredPropertyName) as string;
		this.updateStrategy(level);
	}

	private onLevelChange(key: string, value: string): void {
		if (!isDefined(value)) {
			return;
		}

		this.updateStrategy(value);
		this.ifDebug(() => `level set to: ${ value }`);
	}

	private updateStrategy(value: string): void {
		const level: string = value.toUpperCase();

		if (STRATEGIES.has(level)) {
			this.strategy = STRATEGIES.get(level);
		} else {
			this.ifDebug(() => `unknown level: ${ level }`);
		}
	}

	private onAppendersChange(key: string, value: string): void {
		if (!isDefined(value)) {
			return;
		}

		this.updateAppenders(value);
		this.ifDebug(() => `Appenders set to: ${ value }`);
	}

	private updateAllowSupressDefaultAppender(allowSuppression: boolean): void {
		this.allowSuppression = allowSuppression;
	}

	private updateAppenders(appenderIds: string): void {
		const ids: string[] = !isDefined(appenderIds)
			? []
			: appenderIds.split(",")
				.map((id) => id.trim())
				.filter((value) => value.trim().length > 0);

		if (!ids.includes("consoleAppender") && !this.allowSuppression) {
			ids.push("consoleAppender");
		}

		this.appenders = ids.map((id: string) => this.context.getObject(id));
	}

}

export default LoggerImpl;
