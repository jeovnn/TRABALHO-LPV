<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Livros</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Cadastrar livro" no-caps @click="abrirCadastro" />
      <q-btn
        color="negative"
        :icon="modoExcluir ? 'close' : 'delete'"
        :label="modoExcluir ? 'Cancelar exclusão' : 'Excluir livro'"
        :outline="modoExcluir"
        no-caps
        @click="modoExcluir = !modoExcluir"
      />
    </div>

    <q-banner v-if="modoExcluir" dense class="bg-red-1 text-negative q-mb-md">
      Selecione o livro que deseja excluir.
    </q-banner>

    <div v-if="!livros.length" class="text-grey q-mt-xl text-center">
      Nenhum livro cadastrado.
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="livro in livros" :key="livro.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          bordered
          class="column items-center q-pa-md"
          :class="{ 'card-excluir': modoExcluir }"
          @click="clicarCard(livro)"
        >
          <q-icon name="menu_book" size="64px" color="primary" />
          <div class="text-subtitle1 text-center q-mt-sm">{{ livro.titulo }}</div>
          <div class="text-caption text-grey-7 text-center">
            {{ livro.ano_publicacao }} · {{ livro.editora }} · {{ livro.categoria }}
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogo">
      <q-card style="min-width: 400px">
        <q-form @submit="salvar">
          <q-card-section>
            <div class="text-h6">Cadastrar livro</div>
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <q-input
              v-model="form.titulo"
              label="Título"
              :rules="[(v) => !!v || 'Informe o título']"
            />
            <q-input
              v-model.number="form.ano_publicacao"
              type="number"
              label="Ano de publicação"
              :rules="[
                (v) => !!v || 'Informe o ano',
                (v) => (v >= 1000 && v <= anoAtual) || 'Ano inválido'
              ]"
            />
            <q-input
              v-model="form.editora"
              label="Editora"
              :rules="[(v) => !!v || 'Informe a editora']"
            />
            <q-select
              v-model="form.categoria_id"
              :options="categorias"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              label="Categoria"
              :rules="[(v) => !!v || 'Selecione a categoria']"
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
const anoAtual = new Date().getFullYear()

const livros = ref([])
const modoExcluir = ref(false)
const dialogo = ref(false)
const salvando = ref(false)
const form = ref({})
const categorias = ref([])

// busca os livros cadastrados para montar os cards
async function carregar() {
  try {
    livros.value = (await api.get('/livros')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar os livros' })
  }
}

// o clique no card só faz algo depois de apertar o botão Excluir
function clicarCard(livro) {
  if (modoExcluir.value) excluir(livro)
}

function abrirCadastro() {
  form.value = {}
  dialogo.value = true
}

async function salvar() {
  salvando.value = true
  try {
    await api.post('/livros', form.value)
    $q.notify({ type: 'positive', message: 'Livro cadastrado!' })
    dialogo.value = false
    carregar()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao cadastrar livro' })
  } finally {
    salvando.value = false
  }
}

function excluir(livro) {
  $q.dialog({
    title: 'Excluir livro',
    message: `Deseja excluir "${livro.titulo}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/livros/${livro.id}`)
      $q.notify({ type: 'positive', message: 'Livro excluído!' })
      modoExcluir.value = false
      carregar()
    } catch (e) {
      $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao excluir livro' })
    }
  })
}

// preenche as opções do select de categoria com o que está no banco
async function carregarOpcoes() {
  try {
    categorias.value = (await api.get('/categorias')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar as categorias' })
  }
}

onMounted(() => {
  carregar()
  carregarOpcoes()
})
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
