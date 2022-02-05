import Ephemeron from './ephemeron';

const e = new Ephemeron({}, 5);

while (e.get()) {}

console.log('made it out');
