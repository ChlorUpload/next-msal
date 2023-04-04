export type Equator<T> = (a: T, b: T) => boolean;

export interface IEquatable<T> {
  equals: Equator<T>;
}
