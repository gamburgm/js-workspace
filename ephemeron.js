export default class Ephemeron {
  static #primitiveLabel = Symbol('primitive');

  static #registry = new FinalizationRegistry((ephemeron) => {
    ephemeron.#clear();
  });

  #key;

  #val;

  constructor(key, val) {
    if (Ephemeron.#canBeWeak(key)) {
      this.#key = new WeakRef(key);
    } else {
      this.#key = new WeakRef(Ephemeron.#makePrimitiveKey(key));
    }

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

  #clear() {
    this.val = false;
  }

  static #canBeWeak(v) {
    return v instanceof Object;
  }

  static #makePrimitiveKey(key) {
    return { primLabel: Ephemeron.#primitiveLabel, value: key };
  }
}
