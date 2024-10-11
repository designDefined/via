import { Observable } from "rxjs";
import { StateSnapshot, StateSubject, StateActor } from "../store";

export type Subscribable<T> = Observable<StateSnapshot<T>> & { subject: StateSubject<T>; actor: StateActor<T> };
