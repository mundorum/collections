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

If you are a collection developer and you want your modifications to reflect in the playground or test environment automatically, you can wire the local `dist` directly via npm's `file:` protocol.

The `package.json` already declares `@mundorum/oid` as a `devDependency` pointing to the local -o-id `dist`. A single install is enough:

~~~bash
npm install
~~~

This creates symlinks under `node_modules/@mundorum/` pointing to the local `dist` directories — no manual link commands needed. Reinstalling does not break the links.

To pick up source changes as you edit, run the watch build in the respective project. In the -o-id project:
~~~bash
npm run build:watch
~~~
And in the collections project (pick the relevant collection):
~~~bash
npm run build:watch:fiction
npm run build:watch:graph
npm run build:watch:blockly
npm run build:watch:full
~~~

### -o-id  Developer

If you are also modifying the -o-id library alongside the collections, the `file:../../oid/dist` dependency in `devDependencies` already points to the local -o-id build output. After running `npm install` in this project, changes you build in -o-id will be picked up immediately — no additional link commands are required.

Run both watch scripts in parallel (two terminals):
~~~bash
# terminal 1 — in the oid project
npm run build:watch

# terminal 2 — in the collections project
npm run build:watch:full   # or whichever collection you are working on
~~~
