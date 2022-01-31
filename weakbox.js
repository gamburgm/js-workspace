export default class WeakBox {
  static #primitiveLabel = Symbol('primitive');

  #ref;

  constructor(val) {
    if (WeakBox.#canBeWeak(val)) {
      this.#ref = new WeakRef(val);
    } else {
      this.#ref = new WeakRef({ primLabel: WeakBox.#primitiveLabel, value: val });
    }
  }

  get() {
    const maybeVal = this.#ref.deref();

    if (maybeVal === undefined) {
      return false;
    } else if (WeakBox.#isPrimitiveReferrent(maybeVal)) {
      return maybeVal.value;
    } else {
      return maybeVal;
    }
  }

  static #canBeWeak(v) {
    return v instanceof Object;
  }

  static #isPrimitiveReferrent(val) {
    return val.primLabel && val.primLabel === WeakBox.#primitiveLabel;
  }
}
