import Component from './component/Component';
import Stage from './component/Stage';
import MvvmComponent from './component/MvvmComponent';
import ContainerComponent from './component/ContainerComponent';
import AbstractDecorator from './mvvm/AbstractDecorator';
import Decorator from './mvvm/Decorator';
import Logger from './logger/Logger';
import LoggerFactory from './logger/LoggerFactory';
import Mvvm from './mvvm/Mvvm';

function registerDecorator(name: string, supportedTags: string[], decoratorClass: any): void {
	Mvvm.register(name, supportedTags, decoratorClass);
}

function registerFilter(name: string, fn: Function): void {
	Mvvm.registerFilter(name, fn);
}

export {Component, Stage, MvvmComponent, ContainerComponent, Decorator, AbstractDecorator, Logger, LoggerFactory, registerDecorator, registerFilter};