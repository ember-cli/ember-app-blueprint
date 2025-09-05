import { pageTitle } from 'ember-page-title';
import Sweet from '../components/sweet.gts';

<template>
  {{pageTitle "Fancy"}}

  <Sweet />

  <p class="purple">Fancy</p>

  {{outlet}}
</template>
