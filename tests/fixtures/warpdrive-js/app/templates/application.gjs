import { pageTitle } from 'ember-page-title';
import { Request } from '@warp-drive/ember';

<template>
  {{pageTitle "MyTestApp"}}

  {{outlet}}

  {{! The following component displays Ember's default welcome message. }}
  <Request @request={{@model.person}}>
    <:loading>
      <p>Loading person...</p>
    </:loading>
    <:error as |error|>
      <p>Error loading person: {{error.message}}</p>
    </:error>
    <:content as |result|>
      <h1>Welcome {{result.data.name}}</h1>
    </:content>
  </Request>
  {{! Feel free to remove this! }}
</template>
