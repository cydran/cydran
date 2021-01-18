import DomWalker from "element/DomWalker";
import MvvmDomWalkerImpl from "internals/MvvmDomWalkerImpl";
import { Mvvm } from "internals/Shuttle"

const WALKER: DomWalker<Mvvm> = new MvvmDomWalkerImpl();

export default WALKER;