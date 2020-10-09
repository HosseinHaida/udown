<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn dense flat icon="img:udown-logo.png" size="22px" to="/" />
          <!-- <q-btn dense to="/" size="23px" flat label="U Down?" no-caps /> -->
          U Down?
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
