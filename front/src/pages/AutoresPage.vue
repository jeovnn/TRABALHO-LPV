<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Autores</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Cadastrar autor" no-caps @click="abrirCadastro" />
      <q-btn
        color="negative"
        :icon="modoExcluir ? 'close' : 'delete'"
        :label="modoExcluir ? 'Cancelar exclusão' : 'Excluir autor'"
        :outline="modoExcluir"
        no-caps
        @click="modoExcluir = !modoExcluir"
      />
    </div>

    <q-banner v-if="modoExcluir" dense class="bg-red-1 text-negative q-mb-md">
      Selecione o autor que deseja excluir.
    </q-banner>

    <div v-if="!autores.length" class="text-grey q-mt-xl text-center">
      Nenhum autor cadastrado.
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="autor in autores" :key="autor.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          bordered
          :class="{ 'card-excluir': modoExcluir }"
          @click="clicarCard(autor)"
        >
          <q-card-section>
            <div class="text-subtitle1">{{ autor.nome }}</div>
            <div class="text-caption text-grey-7">{{ autor.nacionalidade }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogo">
      <q-card style="min-width: 400px">
        <q-form @submit="salvar">
          <q-card-section>
            <div class="text-h6">Cadastrar autor</div>
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <q-input
              v-model="form.nome"
              label="Nome"
              :rules="[(v) => !!v || 'Informe o nome']"
            />
            <q-input
              v-model="form.nacionalidade"
              label="Nacionalidade"
              :rules="[(v) => !!v || 'Informe a nacionalidade']"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" no-caps v-close-popup />
            <q-btn color="primary" label="Salvar" type="submit" no-caps :loading="salvando" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

const $q = useQuasar()

const autores = ref([])
const modoExcluir = ref(false)
const dialogo = ref(false)
const salvando = ref(false)
const form = ref({})

// busca os autores cadastrados para montar os cards
async function carregar() {
  try {
    autores.value = (await api.get('/autores')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar os autores' })
  }
}

// o clique no card só faz algo depois de apertar o botão Excluir
function clicarCard(autor) {
  if (modoExcluir.value) excluir(autor)
}

function abrirCadastro() {
  form.value = {}
  dialogo.value = true
}

async function salvar() {
  salvando.value = true
  try {
    await api.post('/autores', form.value)
    $q.notify({ type: 'positive', message: 'Autor cadastrado!' })
    dialogo.value = false
    carregar()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao cadastrar autor' })
  } finally {
    salvando.value = false
  }
}

function excluir(autor) {
  $q.dialog({
    title: 'Excluir autor',
    message: `Deseja excluir "${autor.nome}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/autores/${autor.id}`)
      $q.notify({ type: 'positive', message: 'Autor excluído!' })
      modoExcluir.value = false
      carregar()
    } catch (e) {
      $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao excluir autor' })
    }
  })
}

onMounted(carregar)
</script>

<style scoped>
.card-excluir {
  cursor: pointer;
  border-color: var(--q-negative);
}
.card-excluir:hover {
  background: #ffebee;
}
</style>
