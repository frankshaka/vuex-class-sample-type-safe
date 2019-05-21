import { VuexModule, Module, Mutation } from 'vuex-module-decorators'

import { store, RootState } from '..'


export interface FooState {
    bars: string[]
}


@Module({ name: 'foo', namespaced: true, stateFactory: true, dynamic: true, store })
export class Foo extends VuexModule<FooState, RootState> implements FooState {

    public bars: string[] = []

    @Mutation addBar(bar: string) {
        this.bars = this.bars.concat(bar)
    }

    @Mutation removeBar(bar: string) {
        this.bars = this.bars.filter(b => b !== bar)
    }

}
