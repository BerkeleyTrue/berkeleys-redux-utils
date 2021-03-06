import test from 'ava';

import { config, createAsyncTypes, combineActions, handleAction } from '../src';

const defaultConfig = Object.assign({}, config);
test.beforeEach(() => {
  Object.assign(config, defaultConfig);
});

test('should throw if type is not a string', t => {
  t.throws(() => handleAction(), /type should be a string/);
});

test('should throw if reducer is not an function/object/undefined', t => {
  t.throws(() => handleAction('foo', null), /reducer.*should be a function/);
});

test('should throw if default state undefined', t => {
  t.throws(() => handleAction('foo'), /defaultState.*should be defined/);
});

test('should return a reducer', t => {
  const reducer = handleAction('foo', () => 1, 0);
  t.is(typeof reducer, 'function');
  t.is(reducer(undefined, { type: 'foo' }), 1);
});

test('should accept reducer object', t => {
  const reducer = handleAction('foo', { next: () => 1, throw: () => 2 }, 0);
  t.is(reducer(0, { type: 'foo' }), 1);
  t.is(reducer(0, { type: 'foo', error: true }), 2);
  const reducer2 = handleAction('foo', { next: () => 1 }, 0);
  t.is(reducer2(0, { type: 'foo' }), 1);
});

test('reducer should return default state', t => {
  const reducer = handleAction('foo', () => 1, 0);
  t.is(reducer(undefined, {}), 0);
});

test('should work with combineActions', t => {
  const reducer = handleAction(
    combineActions('foo', 'bar'),
    (state, { type }) => Object.assign({}, state, { type }),
    {},
  );
  t.deepEqual(reducer({ baz: 0, type: 'foo' }, { type: 'bar' }), {
    baz: 0,
    type: 'bar',
  });

  t.deepEqual(reducer({ baz: 0, type: 'bar' }, { type: 'foo' }), {
    baz: 0,
    type: 'foo',
  });
});

test('should work with async types', t => {
  const foo = createAsyncTypes('foo');
  const reducer = handleAction(
    foo,
    (state, { type }) => Object.assign({}, state, { type }),
    {},
  );

  t.deepEqual(reducer({ baz: 0, type: 'bar' }, { type: foo.toString() }), {
    baz: 0,
    type: 'foo',
  });
});

test('should not mutate', t => {
  const reducer = handleAction(
    'foo',
    state => Object.assign({}, state, { val: 'foo' }),
    { val: 'notfoo' },
  );
  t.deepEqual(reducer(undefined, { type: 'notfoo' }), { val: 'notfoo' });
  const original = { val: 'notfoo' };
  const actual = reducer(original, { type: 'foo' });
  const actual2 = reducer(original, { type: 'notfoo' });
  t.deepEqual(actual, { val: 'foo' });
  t.deepEqual(actual2, original);
  t.is(actual2, original);
});
