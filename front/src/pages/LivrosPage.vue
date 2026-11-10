<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Livros</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Cadastrar livro" no-caps @click="abrirCadastro" />
      <q-btn
        color="secondary"
        :icon="modoAtualizar ? 'close' : 'edit'"
        :label="modoAtualizar ? 'Cancelar edição' : 'Editar livro'"
        :outline="modoAtualizar"
        no-caps
        @click="alternarModoAtualizar"
      />
      <q-btn
        color="negative"
        :icon="modoExcluir ? 'close' : 'delete'"
        :label="modoExcluir ? 'Cancelar exclusão' : 'Excluir livro'"
        :outline="modoExcluir"
        no-caps
        @click="alternarModoExcluir"
      />
    </div>

    <q-banner v-if="modoAtualizar" dense class="bg-blue-1 text-primary q-mb-md">
      Selecione o livro que deseja editar.
    </q-banner>
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
          :class="{ 'card-atualizar': modoAtualizar, 'card-excluir': modoExcluir }"
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
            <div class="text-h6">{{ form.id ? 'Editar livro' : 'Cadastrar livro' }}</div>
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
            <!-- digitando, sugere as que já existem; nome novo + Enter cadastra na hora -->
            <q-select
              v-model="form.editora_id"
              :options="editorasFiltradas"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              use-input
              input-debounce="0"
              label="Editora"
              hide-selected
              fill-input
              @filter="filtrarEditoras"
              @new-value="novaEditora"
              :rules="[(v) => !!v || 'Informe a editora']"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhuma editora encontrada. Aperte Enter para cadastrar.
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <!-- digitando, sugere as que já existem; nome novo + Enter cadastra na hora -->
            <q-select
              v-model="form.categoria_id"
              :options="categoriasFiltradas"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              use-input
              input-debounce="0"
              label="Categoria"
              hide-selected
              fill-input
              @filter="filtrarCategorias"
              @new-value="novaCategoria"
              :rules="[(v) => !!v || 'Informe a categoria']"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhuma categoria encontrada. Aperte Enter para cadastrar.
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
const modoAtualizar = ref(false)
const modoExcluir = ref(false)
const dialogo = ref(false)
const salvando = ref(false)
const form = ref({})
const categorias = ref([])
const editoras = ref([])
// listas que aparecem no select enquanto a pessoa digita
const categoriasFiltradas = ref([])
const editorasFiltradas = ref([])

// busca os livros cadastrados para montar os cards
async function carregar() {
  try {
    livros.value = (await api.get('/livros')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar os livros' })
  }
}

// o clique no card depende do botão apertado antes (Editar ou Excluir)
function clicarCard(livro) {
  if (modoAtualizar.value) abrirAtualizacao(livro)
  if (modoExcluir.value) excluir(livro)
}

// ligar um modo desliga o outro
function alternarModoAtualizar() {
  modoAtualizar.value = !modoAtualizar.value
  modoExcluir.value = false
}

function alternarModoExcluir() {
  modoExcluir.value = !modoExcluir.value
  modoAtualizar.value = false
}

function abrirCadastro() {
  form.value = {}
  dialogo.value = true
}

// abre o mesmo formulário, já preenchido com o livro clicado
function abrirAtualizacao(livro) {
  modoAtualizar.value = false
  form.value = {
    id: livro.id,
    titulo: livro.titulo,
    ano_publicacao: livro.ano_publicacao,
    editora_id: livro.editora_id,
    categoria_id: livro.categoria_id
  }
  dialogo.value = true
}

// com id no formulário é edição (PUT); sem id é cadastro novo (POST)
async function salvar() {
  salvando.value = true
  try {
    if (form.value.id) {
      await api.put(`/livros/${form.value.id}`, form.value)
      $q.notify({ type: 'positive', message: 'Livro atualizado!' })
    } else {
      await api.post('/livros', form.value)
      $q.notify({ type: 'positive', message: 'Livro cadastrado!' })
    }
    dialogo.value = false
    carregar()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao salvar livro' })
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

// preenche as opções dos selects de categoria e editora com o que está no banco
async function carregarOpcoes() {
  try {
    categorias.value = (await api.get('/categorias')).data.data
    editoras.value = (await api.get('/editoras')).data.data
    categoriasFiltradas.value = categorias.value
    editorasFiltradas.value = editoras.value
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar categorias e editoras' })
  }
}

// mostra só as opções que contêm o texto digitado
function filtrar(texto, lista) {
  const busca = texto.toLowerCase()
  return lista.filter((item) => item.nome.toLowerCase().includes(busca))
}

function filtrarEditoras(texto, update) {
  update(() => (editorasFiltradas.value = filtrar(texto, editoras.value)))
}

function filtrarCategorias(texto, update) {
  update(() => (categoriasFiltradas.value = filtrar(texto, categorias.value)))
}

// quando a pessoa digita um nome e aperta Enter:
// se já existe com esse nome, só seleciona; se não, cadastra na API e seleciona
async function adicionarOpcao(nome, done, lista, filtradas, rota, rotulo) {
  nome = nome.trim()
  if (!nome) return done()
  const existente = lista.value.find((item) => item.nome.toLowerCase() === nome.toLowerCase())
  if (existente) {
    filtradas.value = lista.value
    return done(existente.id, 'add-unique')
  }
  try {
    const nova = (await api.post(rota, { nome })).data.data
    lista.value.push(nova)
    filtradas.value = lista.value
    $q.notify({ type: 'positive', message: `${rotulo} "${nova.nome}" cadastrada!` })
    done(nova.id, 'add-unique')
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || `Erro ao cadastrar ${rotulo.toLowerCase()}` })
    done()
  }
}

function novaEditora(nome, done) {
  adicionarOpcao(nome, done, editoras, editorasFiltradas, '/editoras', 'Editora')
}

function novaCategoria(nome, done) {
  adicionarOpcao(nome, done, categorias, categoriasFiltradas, '/categorias', 'Categoria')
}

onMounted(() => {
  carregar()
  carregarOpcoes()
})
</script>

<style scoped>
.card-atualizar {
  cursor: pointer;
  border-color: var(--q-primary);
}
.card-atualizar:hover {
  background: #e3f2fd;
}
.card-excluir {
  cursor: pointer;
  border-color: var(--q-negative);
}
.card-excluir:hover {
  background: #ffebee;
}
</style>
