import WeakBox from './weakbox';

const b = new WeakBox(5);
console.log(b.get());
console.log(b.get());
console.log(b.get());
