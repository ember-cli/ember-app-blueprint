import { pageTitle } from 'ember-page-title';
import Sweet from '../components/sweet.gjs';

<template>
  {{pageTitle "Fancy"}}

  <Sweet />

  <p>Fancy</p>

  {{outlet}}
</template>
