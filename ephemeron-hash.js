// implementation taken from WeakRefs proposal: https://github.com/tc39/proposal-weakrefs
export default class EphemeronHash {
  // WeakMaps are non-iterable ephemeron-hashes.
  // To add iterability, we construct WeakRefs for keys and throw those into a regular set.
  // We also store that weak-ref as part of the value in the WeakMap (although we don't
  // expose it to the user) so that we can remove it from the set when we delete entries.

  #weakMap = new WeakMap();
  #refSet = new Set();
  #finalizationGroup = new FinalizationRegistry(EphemeronHash.#cleanup);

  static #cleanup({ set, ref }) {
    set.delete(ref);
  }

  // TODO what are the construction modes for ephemeron-hash in racket?
  constructor(iterable) {
    for (const [key, value] of iterable) {
      this.set(key, value);
    }
  }

  set(key, value) {
    const ref = new WeakRef(key);

    this.#weakMap.set(key, { value, ref });
    this.#refSet.add(ref);

    // This registers the `key` as needing cleanup when it gets garbage collected. 
    // 'cleanup' refers to the callback passed to the FinalizationRegistry constructor above.
    // The arguments are:
    //
    // 1. The object being registered -- invoke the F.R. callback when `key` is collected
    // 2. The argument that will be passed to the F.R. callback if `key` gets collected
    // 3. The object that can be used to 'unregister' the `key` object -- we can call
    //    ```this.#fG.unregister(ref)``` to prevent the F.R. from invoking the callback
    //    on `key` from that point onwards.
    this.#finalizationGroup.register(key, {
      set: this.#refSet,
      ref,
    }, ref);
  }

  // FIXME what does the racket equivalent return?
  get(key) {
    const entry = this.#weakMap.get(key);
    return entry && entry.value;
  }

  // FIXME what does the racket equivalent return?
  delete(key) {
    const entry = this.#weakMap.get(key);
    if (!entry) {
      return false;
    }

    this.#weakMap.delete(key);
    this.#refSet.delete(entry.ref);
    this.#finalizationGroup.unregister(entry.ref);
    return true;
  }

  *[Symbol.iterator]() {
    for (const ref of this.#refSet) {
      const key = ref.deref();
      if (!key) continue;
      const { value } = this.#weakMap.get(key);
      yield [key, value];
    }
  }
}
