<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Biblioteca de Livros </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable to="/livros">
          <q-item-section avatar>
            <q-icon name="menu_book" />
          </q-item-section>
          <q-item-section>Livros</q-item-section>
        </q-item>

        <q-item clickable to="/autores">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Autores</q-item-section>
        </q-item>

        <q-item clickable to="/emprestimos">
          <q-item-section avatar>
            <q-icon name="swap_horiz" />
          </q-item-section>
          <q-item-section>Empréstimos</q-item-section>
        </q-item>

        <q-item clickable to="/usuarios">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>Usuários</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
