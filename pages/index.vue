<script setup lang="ts">

const { t, locale } = useI18n()

useHead({
    htmlAttrs: {
        lang: locale.value
    }
})

</script>

<template>
    <div>
        <h1>{{ t('hi') }}</h1>
    </div>
</template>