class BasicTestCase extends ClassyTestCase {
  static testName = 'data-lookup - basic';

  testBasic() {
    this.assertEqual(DataLookup.lookup({}, 'foo'), undefined);
    this.assertEqual(DataLookup.lookup(null, 'foo'), undefined);
    this.assertEqual(DataLookup.lookup(undefined, 'foo'), undefined);
    this.assertEqual(DataLookup.lookup(1, 'foo'), undefined);

    this.assertEqual(DataLookup.lookup({}), {});
    this.assertEqual(DataLookup.lookup(null), null);
    this.assertEqual(DataLookup.lookup(undefined), undefined);
    this.assertEqual(DataLookup.lookup(1), 1);

    this.assertEqual(DataLookup.lookup({}, ''), undefined);
    this.assertEqual(DataLookup.lookup(null, ''), undefined);
    this.assertEqual(DataLookup.lookup(undefined, ''), undefined);
    this.assertEqual(DataLookup.lookup(1, ''), undefined);

    this.assertEqual(DataLookup.lookup({}, []), {});
    this.assertEqual(DataLookup.lookup(null, []), null);
    this.assertEqual(DataLookup.lookup(undefined, []), undefined);
    this.assertEqual(DataLookup.lookup(1, []), 1);

    this.assertEqual(DataLookup.lookup({ foo: 'bar' }, 'foo'), 'bar');
    this.assertEqual(DataLookup.lookup({ foo: { bar: 'baz' } }, 'foo'), { bar: 'baz' });
    this.assertEqual(DataLookup.lookup({ foo: { bar: 'baz' } }, 'faa'), undefined);
    this.assertEqual(DataLookup.lookup({ foo: { bar: 'baz' } }, 'foo.faa'), undefined);
    this.assertEqual(DataLookup.lookup({ foo: { bar: 'baz' } }, 'foo.bar'), 'baz');
    this.assertEqual(DataLookup.lookup({ foo: null }, 'foo.bar'), undefined);
    this.assertEqual(DataLookup.lookup({ foo: null }, 'foo'), null);

    this.assertEqual(DataLookup.lookup(() => ({ foo: { bar: 'baz' } }), 'foo'), { bar: 'baz' });
    this.assertEqual(DataLookup.lookup({ foo: () => ({ bar: 'baz' }) }, 'foo'), { bar: 'baz' });
    this.assertEqual(DataLookup.lookup(() => ({ foo: () => ({ bar: 'baz' }) }), 'foo.bar'), 'baz');
  }

  testReactive() {
    const testVar = new ReactiveVar(null);
    let runs = [];

    this.autorun((computation) => {
      runs.push(
        DataLookup.get(() => {
          return testVar.get();
        }, 'foo.bar')
      );
    });

    this.assertEqual(runs, [undefined]);
    runs = [];

    testVar.set('something');
    Tracker.flush();

    this.assertEqual(runs, []);
    runs = [];

    testVar.set({ foo: { test: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, []);
    runs = [];

    testVar.set({ foo: { bar: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, ['baz']);
    runs = [];

    testVar.set({ foo: { bar: 'baz', test: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, []);
    runs = [];

    testVar.set({ foo: { test: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, [undefined]);
    runs = [];

    testVar.set({ foo: { bar: 'baz', test: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, ['baz']);
    runs = [];

    testVar.set({ foo: { bar: 'bak', test: 'baz' } });
    Tracker.flush();

    this.assertEqual(runs, ['bak']);
    runs = [];

    const testVar2 = new ReactiveVar(null);

    testVar.set({ foo: () => testVar2.get() });
    Tracker.flush();

    this.assertEqual(runs, [undefined]);
    runs = [];

    testVar2.set({ bar: 'bak', test: 'baz' });
    Tracker.flush();

    this.assertEqual(runs, ['bak']);
  }
}

ClassyTestCase.addTest(new BasicTestCase());

