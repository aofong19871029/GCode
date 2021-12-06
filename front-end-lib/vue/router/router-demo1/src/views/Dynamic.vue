<template>
    <div class="dynamic">
        <h1>这个页面的id参数是{{id}}</h1>
        <h1>这个页面的name参数是{{name}}</h1>
    </div>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class Dynamic extends Vue {

    // computed
    get id() {
        return this.$route.params.id;
    }

    get name() {
        return this.$route.params.name;
    }
}
</script>
