import Component from './Component';
import Stage from './Stage';
import MvvmComponent from './MvvmComponent';
import ContainerComponent from './ContainerComponent';
import AbstractDecorator from './AbstractDecorator';
import Decorator from './Decorator';
import Mvvm from './Mvvm';

function registerDecorator(name: string, supportedTags: string[], decoratorClass: any): void {
	Mvvm.register(name, supportedTags, decoratorClass);
}

export {Component, Stage, MvvmComponent, ContainerComponent, Decorator, AbstractDecorator, registerDecorator};