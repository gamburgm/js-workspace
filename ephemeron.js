export default class Ephemeron {
  // an Ephemeron is a data structure that stores a key and a value.
  // the key is held weakly. When the key is collected, the value
  // is replaced by #f.

  static #primitiveLabel = Symbol('primitive');

  static #registry = new FinalizationRegistry((ephemeron) => {
    ephemeron.#killValue();
  });

  #key;

  #val;

  constructor(key, val) {
    this.#key = Ephemeron.#canBeWeak(key) ? key : Ephemeron.#makePrimitiveKey(key);
    this.#registry.register(this.#key, this);

    this.#val = val;
  }

  get() {
    const maybeVal = this.#val;
    if (maybeVal === undefined) {
      return false;
    } else {
      return maybeVal;
    }
  }

  static #canBeWeak(v) {
    return v instanceof Object;
  }

  static #makePrimitiveKey(key) {
    return { primLabel: Ephemeron.#primitiveLabel, value: key };
  }

  #killValue() {
    this.#val = undefined;
  }
}
