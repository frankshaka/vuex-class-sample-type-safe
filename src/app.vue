<template>
    <div id="app">
        <button @click="onClick">Add Number</button>
        <p>{{ barString }}</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

import { Foo } from './store/modules'


const foo = namespace('foo')


@Component
export default class App extends Vue {

    @foo.State bars: typeof Foo.prototype.bars

    @foo.Mutation addBar: typeof Foo.prototype.addBar

    get barString() {
        return this.bars.join(', ')
    }

    onClick() {
        const bar = Math.floor(Math.random() * 100000).toString()
        this.addBar(bar)
    }

}
</script>
