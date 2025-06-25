# collections
Thematic Oid collections.

## Playground and Test Environment

The environment can be prepared for local execution for learning, tests, and development. We suggest the following steps to prepare the environment:

To provide flexibility, the default `package.json` configuration does not include either the -o-id library or the collections. There are two installation options. They are exclusive, and you cannot apply both:

### -o-id Adopter

If you are only using the -o-id library without modifying it, you can install it:
~~~bash
npm install @mundorum/oid
~~~

The option above is also valid for cases where you are developing a collection but only using the -o-id library.

### Collections Adopter

If you are only using the collections without modifying them, you can install them:
~~~bash
npm install @mundorum/collections
~~~

### Collections  Developer

If you are a collection developer and you want your modifications to reflect in the playground or test environment automatically, you can emulate the collection library installation as a node module straight from the `dist` of the collection library.

If you previously installed @mundorum/oid via npm install, there are two steps to link local Mundorum libraries in the development mode.

Inside `/dist` directory of the collections project:
~~~bash
npm link
~~~

Inside `/node_modules/` directory of you collections project:
~~~bash
npm link @mundorum/collections
~~~

This procedure mimics the collections library installed in the npm straight from `dist`.

### -o-id  Developer

This is not a usual option for collection developers, who will usually modify the collection and only use the -o-id library. However, if you are both an -o-id library developer and a collection developer, suppose you are modifying the -o-id library and you want your modifications to reflect in your collection automatically. In that case, you can emulate also the -o-id library installation as a node module straight from the `dist` of the -o-id library.

There are two steps to link local Mundorum libraries in the development mode.

Inside `/dist` directory of the -o-id library (e.g., `/git/mundorum/oid/dist`):
~~~bash
npm link
~~~

Inside `/node_modules/` directory of you collections project:
~~~bash
npm link @mundorum/oid @mundorum/collections
~~~

Notice that here you must specify both `@mundorum/oid` `@mundorum/collections`, since if you specify only `@mundorum/oid` it will disregard the previous `@mundorum/collections` link.

This procedure mimics the -o-id library installed in the npm straight from `/git/mundorum/oid/dist`.
