export default class Ephemeron {
  static #primitiveLabel = Symbol('primitive');

  static #registry = new FinalizationRegistry((ephemeron) => {
    ephemeron.#weakenValue();
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
    } else if (maybeVal instanceof WeakRef) {
      if (maybeVal.deref() === undefined) {
        return false;
      } else {
        return maybeVal.deref();
      }
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

  static #weakenValue() {
    this.#val = new WeakRef(this.#val);
  }
}
