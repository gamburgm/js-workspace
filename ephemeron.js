export default class Ephemeron {
  static #primitiveLabel = Symbol('primitive');

  #key;

  #ref;

  // TODO need to add finalization registry

  constructor(key, val) {
    if (Ephemeron.#canBeWeak(key)) {
      this.#key = new WeakRef(key);
    } else {
      this.#key = new WeakRef(Ephemeron.#makePrimitiveKey(key));
    }

    this.#ref = 
  }
}
