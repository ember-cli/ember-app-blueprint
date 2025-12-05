import { pageTitle } from 'ember-page-title';
import { WelcomePage } from 'ember-welcome-page';
import { LinkTo } from '@ember/routing';

<template>
  {{pageTitle "TestApp"}}

  {{outlet}}

  {{! The following component displays Ember's default welcome message. }}
  <WelcomePage @extension="gjs" />
  {{! Feel free to remove this! }}

  <LinkTo @route="fancy" data-test-a>Fancy</LinkTo>
</template>
