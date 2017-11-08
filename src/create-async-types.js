import invariant from 'invariant';
import config from './config.js';

import addNS from './add-ns.js';

export default function createAsyncTypes(type, delimiter = config.delimiter) {
  invariant(
    type && typeof type === 'string',
    'createAsyncTypes expected a string for type, but got %s',
    type,
  );
  invariant(
    typeof delimiter === 'string',
    'createAsyncTypes expected a string for delimiter, but got %s',
    delimiter,
  );
  const { start, next, complete, error } = config;
  return addNS(type, {
    [start]: type + delimiter + config.start,
    [next]: type + delimiter + config.next,
    [error]: type + delimiter + config.error,
    [complete]: type + delimiter + config.complete,
  });
}
