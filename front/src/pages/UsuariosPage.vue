<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Usuários</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Novo usuário" no-caps @click="abrirCadastro" />
      <q-btn
        color="secondary"
        :icon="modoAtualizar ? 'close' : 'edit'"
        :label="modoAtualizar ? 'Cancelar atualização' : 'Atualizar usuário'"
        :outline="modoAtualizar"
        no-caps
        @click="alternarModoAtualizar"
      />
      <q-btn
        color="negative"
        :icon="modoExcluir ? 'close' : 'delete'"
        :label="modoExcluir ? 'Cancelar exclusão' : 'Excluir usuário'"
        :outline="modoExcluir"
        no-caps
        @click="alternarModoExcluir"
      />
    </div>

    <q-banner v-if="modoAtualizar" dense class="bg-blue-1 text-primary q-mb-md">
      Selecione o usuário que deseja atualizar.
    </q-banner>
    <q-banner v-if="modoExcluir" dense class="bg-red-1 text-negative q-mb-md">
      Selecione o usuário que deseja excluir.
    </q-banner>

    <div v-if="!usuarios.length" class="text-grey q-mt-xl text-center">
      Nenhum usuário cadastrado.
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="usuario in usuarios" :key="usuario.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          bordered
          :class="{ 'card-atualizar': modoAtualizar, 'card-excluir': modoExcluir }"
          @click="clicarCard(usuario)"
        >
          <q-card-section>
            <div class="text-subtitle1">{{ usuario.nome }}</div>
            <div class="text-caption text-grey-7">CPF: {{ formatarCpf(usuario.cpf) }}</div>
            <div class="text-caption text-grey-7">{{ usuario.email }}</div>
            <div class="text-caption text-grey-7">{{ formatarTelefone(usuario.telefone) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogo">
      <q-card style="min-width: 400px">
        <q-form @submit="salvar">
          <q-card-section>
            <div class="text-h6">{{ form.id ? 'Atualizar usuário' : 'Novo usuário' }}</div>
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <q-input
              v-model="form.nome"
              label="Nome"
              :rules="[(v) => !!v || 'Informe o nome']"
            />
            <q-input
              v-model="form.cpf"
              label="CPF"
              mask="###.###.###-##"
              unmasked-value
              :rules="[(v) => (v && v.length === 11) || 'CPF deve ter 11 dígitos']"
            />
            <q-input
              v-model="form.email"
              type="email"
              label="E-mail"
              :rules="[(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') || 'E-mail inválido']"
            />
            <q-input
              v-model="form.telefone"
              label="Telefone"
              mask="(##) #####-####"
              unmasked-value
              :rules="[(v) => (v && v.length >= 10) || 'Telefone inválido']"
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

const usuarios = ref([])
const modoAtualizar = ref(false)
const modoExcluir = ref(false)
const dialogo = ref(false)
const salvando = ref(false)
const form = ref({})

// o banco guarda só os números; aqui coloca pontos e traços para exibir
function formatarCpf(cpf) {
  return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatarTelefone(tel) {
  return tel?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

// busca os usuários cadastrados para montar os cards
async function carregar() {
  try {
    usuarios.value = (await api.get('/usuarios')).data.data
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar os usuários' })
  }
}

// o clique no card depende do botão apertado antes (Atualizar ou Excluir)
function clicarCard(usuario) {
  if (modoAtualizar.value) abrirAtualizacao(usuario)
  if (modoExcluir.value) excluir(usuario)
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

// abre o mesmo formulário, já preenchido com o usuário clicado
function abrirAtualizacao(usuario) {
  form.value = { ...usuario }
  dialogo.value = true
  modoAtualizar.value = false
}

// com id no formulário é atualização (PUT); sem id é cadastro novo (POST)
async function salvar() {
  salvando.value = true
  try {
    if (form.value.id) {
      await api.put(`/usuarios/${form.value.id}`, form.value)
      $q.notify({ type: 'positive', message: 'Usuário atualizado!' })
    } else {
      await api.post('/usuarios', form.value)
      $q.notify({ type: 'positive', message: 'Usuário cadastrado!' })
    }
    dialogo.value = false
    carregar()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao salvar usuário' })
  } finally {
    salvando.value = false
  }
}

function excluir(usuario) {
  $q.dialog({
    title: 'Excluir usuário',
    message: `Deseja excluir "${usuario.nome}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/usuarios/${usuario.id}`)
      $q.notify({ type: 'positive', message: 'Usuário excluído!' })
      modoExcluir.value = false
      carregar()
    } catch (e) {
      $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao excluir usuário' })
    }
  })
}

onMounted(carregar)
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
