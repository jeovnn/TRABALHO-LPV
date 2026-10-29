<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Empréstimos</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Novo empréstimo" no-caps @click="abrirCadastro" />
      <q-btn
        color="secondary"
        :icon="modoAtualizar ? 'close' : 'edit'"
        :label="modoAtualizar ? 'Cancelar atualização' : 'Atualizar empréstimo'"
        :outline="modoAtualizar"
        no-caps
        @click="alternarModoAtualizar"
      />
      <q-btn
        color="negative"
        :icon="modoExcluir ? 'close' : 'delete'"
        :label="modoExcluir ? 'Cancelar exclusão' : 'Excluir empréstimo'"
        :outline="modoExcluir"
        no-caps
        @click="alternarModoExcluir"
      />
    </div>

    <q-banner v-if="modoAtualizar" dense class="bg-blue-1 text-primary q-mb-md">
      Selecione o empréstimo que deseja atualizar.
    </q-banner>
    <q-banner v-if="modoExcluir" dense class="bg-red-1 text-negative q-mb-md">
      Selecione o empréstimo que deseja excluir.
    </q-banner>

    <div v-if="!emprestimos.length" class="text-grey q-mt-xl text-center">
      Nenhum empréstimo cadastrado.
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="emp in emprestimos" :key="emp.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          bordered
          :class="{ 'card-atualizar': modoAtualizar, 'card-excluir': modoExcluir }"
          @click="clicarCard(emp)"
        >
          <q-card-section>
            <div class="row items-center">
              <div class="text-subtitle1">{{ emp.livro }}</div>
              <q-space />
              <q-badge :color="situacao(emp).cor" :label="situacao(emp).texto" />
            </div>
            <div class="text-caption text-grey-7">Usuário: {{ emp.usuario }}</div>
            <div class="text-caption text-grey-7">
              Empréstimo: {{ formatarData(emp.data_emprestimo) }}
            </div>
            <div class="text-caption text-grey-7">
              Devolução prevista: {{ formatarData(emp.data_prevista_devolucao) }}
            </div>
            <div v-if="emp.data_devolucao" class="text-caption text-grey-7">
              Devolvido em: {{ formatarData(emp.data_devolucao) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogo">
      <q-card style="min-width: 400px">
        <q-form @submit="salvar">
          <q-card-section>
            <div class="text-h6">{{ form.id ? 'Atualizar empréstimo' : 'Novo empréstimo' }}</div>
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <q-select
              v-model="form.usuario_id"
              :options="usuarios"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              label="Usuário"
              :rules="[(v) => !!v || 'Selecione o usuário']"
            />
            <q-select
              v-model="form.livro_id"
              :options="livros"
              option-value="id"
              option-label="titulo"
              emit-value
              map-options
              label="Livro"
              :rules="[(v) => !!v || 'Selecione o livro']"
            />
            <q-input
              v-model="form.data_emprestimo"
              type="date"
              label="Data do empréstimo"
              stack-label
              :rules="[(v) => !!v || 'Informe a data do empréstimo']"
            />
            <q-input
              v-model="form.data_prevista_devolucao"
              type="date"
              label="Data prevista para devolução"
              stack-label
              :rules="[
                (v) => !!v || 'Informe a data prevista',
                (v) => v > form.data_emprestimo || 'Deve ser depois da data do empréstimo'
              ]"
            />
            <!-- só aparece ao atualizar: é aqui que se registra a devolução do livro -->
            <q-input
              v-if="form.id"
              v-model="form.data_devolucao"
              type="date"
              label="Data de devolução"
              stack-label
              clearable
              hint="Deixe vazio se o livro ainda não foi devolvido"
              :rules="[
                (v) => !v || v >= form.data_emprestimo || 'Não pode ser antes do empréstimo'
              ]"
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

const emprestimos = ref([])
const modoAtualizar = ref(false)
const modoExcluir = ref(false)
const dialogo = ref(false)
const salvando = ref(false)
const form = ref({})
const usuarios = ref([])
const livros = ref([])

// data de hoje no formato do campo de data (aaaa-mm-dd)
function hoje() {
  return new Date().toLocaleDateString('sv-SE')
}

// mostra a data no formato brasileiro (aaaa-mm-dd -> dd/mm/aaaa)
function formatarData(data) {
  return data ? data.slice(0, 10).split('-').reverse().join('/') : ''
}

// sem data de devolução = ainda está com o usuário; se já passou da prevista, está atrasado
function situacao(emp) {
  if (emp.data_devolucao) return { texto: 'Devolvido', cor: 'positive' }
  if (emp.data_prevista_devolucao.slice(0, 10) < hoje())
    return { texto: 'Atrasado', cor: 'negative' }
  return { texto: 'Emprestado', cor: 'warning' }
}

// busca os empréstimos cadastrados para montar os cards
async function carregar() {
  try {
    emprestimos.value = (await api.get('/emprestimos')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar os empréstimos' })
  }
}

// o clique no card depende do botão apertado antes (Atualizar ou Excluir)
function clicarCard(emp) {
  if (modoAtualizar.value) abrirAtualizacao(emp)
  if (modoExcluir.value) excluir(emp)
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
  form.value = { data_emprestimo: hoje() }
  dialogo.value = true
}

// abre o mesmo formulário, já preenchido com o empréstimo clicado
// (o campo de data só aceita aaaa-mm-dd, por isso o slice)
function abrirAtualizacao(emp) {
  modoAtualizar.value = false
  form.value = {
    id: emp.id,
    usuario_id: emp.usuario_id,
    livro_id: emp.livro_id,
    data_emprestimo: emp.data_emprestimo?.slice(0, 10),
    data_prevista_devolucao: emp.data_prevista_devolucao?.slice(0, 10),
    data_devolucao: emp.data_devolucao?.slice(0, 10)
  }
  dialogo.value = true
}

// com id no formulário é atualização (PUT); sem id é cadastro novo (POST)
async function salvar() {
  salvando.value = true
  try {
    if (form.value.id) {
      const dados = { ...form.value, data_devolucao: form.value.data_devolucao || null }
      await api.put(`/emprestimos/${form.value.id}`, dados)
      $q.notify({ type: 'positive', message: 'Empréstimo atualizado!' })
    } else {
      await api.post('/emprestimos', form.value)
      $q.notify({ type: 'positive', message: 'Empréstimo cadastrado!' })
    }
    dialogo.value = false
    carregar()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao salvar empréstimo' })
  } finally {
    salvando.value = false
  }
}

function excluir(emp) {
  $q.dialog({
    title: 'Excluir empréstimo',
    message: `Deseja excluir o empréstimo de "${emp.livro}" para ${emp.usuario}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/emprestimos/${emp.id}`)
      $q.notify({ type: 'positive', message: 'Empréstimo excluído!' })
      modoExcluir.value = false
      carregar()
    } catch (e) {
      $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao excluir empréstimo' })
    }
  })
}

// preenche as opções dos selects com o que está no banco
async function carregarOpcoes() {
  try {
    usuarios.value = (await api.get('/usuarios')).data.data
    livros.value = (await api.get('/livros')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar usuários e livros' })
  }
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
