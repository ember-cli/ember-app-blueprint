import { LinkTo } from '@ember/routing';

<template>
  {{outlet}}

  <LinkTo @route="fancy" data-test-a>Fancy</LinkTo>
</template>
