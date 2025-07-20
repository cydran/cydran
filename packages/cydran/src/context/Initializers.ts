import { CallBackThisObject } from 'CydranTypes';
// TODO - Determine if the type argument is necessary

interface Initializers<C> {

	add(thisObject: CallBackThisObject, callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
