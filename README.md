# vuex-class-sample-type-safe

This project demonstrates how to achieve "type safety" for [vuex-class](https://github.com/ktsn/vuex-class) with the help of [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators).

To see the demo, run `npm start` (after `npm install`) in command line, open a web browser, and navigate to `http://localhost:1234/`. It's a simple web app with a button and a div. When the button is clicked, a random number is appended to the div.

## The Problem

`vuex-class` allows you to bind [Vuex](https://vuex.vuejs.org/) assets into a [Vue](https://vuejs.org/) instance like this:

```typescript
import Vue from 'vue'
import Component from 'vue-class-component'
import { State, Mutation } from 'vuex-class'

@Component
export default class App extends Vue {

    @State property    // type: any
    @Mutation method   // type: any

}
```

However, when accessing `this.property` and `this.method()`, there's no type-check supported. And it even causes compiling errors when `noImplicitAny` is turned on in TypeScript configurations.

As [this issue](https://github.com/ktsn/vuex-class/issues/2) states, **decorators can not affect or even detect types from property descriptors at compile-time**. So, at least for now, we have to explicitly assign types to those properties/methods, but in a way that's convenient, intuitive, and easy to maintain.

## Attempt 1

As the very first thought, we could assign specific type definitions for them:

```typescript
import Vue from 'vue'
import Component from 'vue-class-component'
import { State, Mutation } from 'vuex-class'

@Component
export default class App extends Vue {

    @State property: string[]
    @Mutation method: ({ param1: string, param2?: { a: string, b: number } }) => void

}
```

You see, while it's relatively easy for properties, it's much tedious for methods.

## Attempt 2

We could try keeping type definitions in a separate file:

```typescript
/// in store-types.d.ts

type SomeProperty = string[]

type SomeMethod = ({ param1: string, param2?: { a: string, b: number } }) => void


/// in app.vue

import Vue from 'vue'
import Component from 'vue-class-component'
import { State, Mutation } from 'vuex-class'

@Component
export default class App extends Vue {

    @State property: SomeProperty
    @Mutation method: SomeMethod

}
```

While it helps `app.vue` be more clear, it requires much maintenance work for `store-types.d.ts`.

## My Workaround

I managed to obtain the type for a property using `typeof SomeModule.prototype.property` where `SomeModule` is a Vuex module defined using classes and decorators from `vuex-module-decorators`.

For example, I could define my Vue component like this:

```typescript
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

// Vuex modules defined using `vuex-module-decorators`
import { Foo } from '~/store/modules'

const foo = namespace('foo')

@Component
export default class App extends Vue {

    @foo.State property: typeof Foo.prototype.property  // type: string[]
    @foo.Mutation method: typeof Foo.prototype.method   // type: ({ param1: string, param2?: { a: string, b: number } }) => void

}
```

Given that the `Foo` module is defined like this:

```typescript
import { VuexModule, Module, Mutation } from 'vuex-module-decorators'

@Module({ name: 'foo', namespaced: true })
export class Foo extends VuexModule {

    public property: string[]

    @Mutation
    method(params: ({ param1: string, param2?: { a: string, b: number } })): void {
        // ....
    }

}
```

### Pros

- It just works.
- It's better than never.
- It re-uses existing type definitions rather than re-defining them.
- Adopting this pattern is as easy as copy-pasting.
- It's easy to maintain, e.g. changes to property names and/or method signatures are easy to recognize.

### Cons

- It relies upon the fact that our Vuex modules are defined as *classes*, which is not officially supported, and thus it does NOT support modules not defined using `vuex-module-decorators`.
- It does NOT support root state/getters/mutations/actions. One possible workaround is to extract them into modules as well.
- We should always keep Vue property names (or Vuex names to map) matching their `typeof` expressions. We could make a lint tool for this pattern.
