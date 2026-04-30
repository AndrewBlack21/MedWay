<div align="center">

<img src="assets/medway.png" alt="MedWay Logo" width="200"/>

# MedWay — Gestão de Visitas Médicas

**Aplicativo mobile para representantes farmacêuticos organizarem rotas, registrarem visitas e acompanharem ciclos trimestrais.**

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=flat-square&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![LGPD](https://img.shields.io/badge/LGPD-Compliant-blue?style=flat-square)](https://www.gov.br/anpd)

[Funcionalidades](#-funcionalidades) •
[Stack](#-stack-técnica) •
[Instalação](#-instalação) •
[Arquitetura](#-arquitetura) •
[Segurança](#-segurança) •
[CI/CD](#-cicd) •
[LGPD](#-lgpd)

</div>

---

## 📱 Funcionalidades

### Gestão de Médicos
- Cadastro completo com nome, especialidade, endereço, horários, dias de atendimento e período (manhã/tarde)
- Geocodificação automática de endereços via OpenStreetMap/Nominatim
- Edição e exclusão com confirmação
- Importação em massa via planilha CSV com detecção automática de colunas
- Exportação para Excel/CSV com um clique

### Roteiro Inteligente
- Geração de rota otimizada com algoritmo **Nearest Neighbor**
- Cálculo de distâncias com fórmula **Haversine**
- Traçado de rota real no mapa via **OpenRouteService API**
- Ponto de partida customizável (endereço ou GPS)
- Filtros por: especialidade, dia da semana, período e exclusão manual por sessão
- Indicadores de médico mais próximo e mais distante

### Mapa
- Visualização de todos os médicos em mapa interativo (Google Maps)
- Pins customizados com número de ordem no roteiro
- Card de informações ao tocar no pin (sem Callout nativo — solução estável para Android)
- Centralização automática nos pontos cadastrados

### Check-in e Visitas
- Registro de visita com 3 status: **Visitado**, **Ausente**, **Insucesso**
- Comentário livre por visita
- Calendário mensal com indicadores coloridos por dia
- Detalhamento de logs ao selecionar uma data

### Ciclo Trimestral
- Meta de visitas por ciclo de 3 meses configurável por médico (1 a 12x)
- Bolinhas de progresso: 🟢 Visitado · 🟡 Ausente · 🔴 Insucesso · ⚪ Pendente
- Dashboard com total de médicos no ciclo completo vs. pendentes

### Dashboard (HomeScreen)
- Cards animados com Lottie para contagem de médicos e visitas do dia
- Cards de ciclo com entrada animada em cascata
- Acesso rápido a Histórico, Ciclo de Visitas e Roteiro
- FAB (Floating Action Button) com 4 ações: Importar, Gerar Roteiro, Exportar, Adicionar Médico

### Segurança
- MFA (autenticação multifator) via TOTP (Google Authenticator / Authy)
- Rate limiting de tentativas de login
- Sanitização de inputs (prevenção XSS/SQL Injection)
- Validação de senha forte
- Conformidade LGPD com registro de consentimento

---

## 🛠 Stack Técnica

### Mobile
| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81 | Framework mobile |
| Expo SDK | 54 | Plataforma e ferramentas |
| TypeScript | 5.9 | Tipagem estática |
| React Navigation | 7 | Navegação entre telas |
| NativeWind | — | Tailwind CSS para mobile |
| lottie-react-native | 7 | Animações JSON |
| react-native-maps | 1.20 | Mapas com Google Maps |
| expo-location | 19 | GPS e permissões |
| expo-document-picker | 14 | Seleção de arquivos |
| expo-file-system | 19 | Leitura/escrita de arquivos |
| expo-sharing | 14 | Compartilhamento de arquivos |
| AsyncStorage | 2.2 | Persistência local |

### Backend
| Tecnologia | Uso |
|---|---|
| Supabase | Banco de dados PostgreSQL + Autenticação |
| Row Level Security | Isolamento de dados por usuário |
| Supabase Auth | Login, registro, MFA, sessões |
| PostgreSQL Triggers | Audit log com `updated_at` automático |

### APIs Externas
| API | Uso |
|---|---|
| Nominatim (OpenStreetMap) | Geocodificação de endereços (gratuita) |
| OpenRouteService | Traçado de rota real entre pontos |
| Google Maps SDK | Renderização do mapa no Android |

### CI/CD
| Ferramenta | Uso |
|---|---|
| GitHub Actions | Pipeline de CI, preview e produção |
| EAS (Expo Application Services) | Build na nuvem (APK e AAB) |
| EAS Environment Secrets | Armazenamento seguro de API Keys |

---

## 📁 Arquitetura

```
MedWay/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Checagem de dependências e .env
│       ├── preview.yml         # Build APK em Pull Requests
│       └── production.yml      # Build + Submit para lojas
├── assets/
│   └── animations/             # Arquivos JSON do Lottie
│       ├── doctor.json
│       ├── map.json
│       ├── check.json
│       ├── pending.json
│       ├── history.json
│       ├── cycle.json
│       └── route.json
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Icons/              # Componentes animados com Lottie
│   │   │   ├── AnimatedStatCard.tsx
│   │   │   ├── AnimatedCycleCard.tsx
│   │   │   ├── AnimatedQuickCard.tsx
│   │   │   └── LottieIcon.tsx
│   │   ├── CheckInModal.tsx    # Modal de check-in de visita
│   │   ├── ConsentCheckbox.tsx # Checkbox de consentimento LGPD
│   │   ├── CycleDots.tsx       # Bolinhas de progresso do ciclo
│   │   ├── DoctorCard.tsx      # Card de médico na lista
│   │   ├── DoctorInfoCard.tsx  # Card de info ao clicar no pin
│   │   ├── LegalModal.tsx      # Modal de Termos e Privacidade
│   │   ├── Mapmarker.tsx       # Pin customizado no mapa
│   │   ├── PeriodPicker.tsx    # Seletor manhã/tarde/ambos
│   │   ├── VisitCalendar.tsx   # Calendário mensal de visitas
│   │   └── WeekDayPicker.tsx   # Seletor de dias da semana
│   ├── constants/
│   │   └── legalTexts.ts       # Termos de Uso e Política de Privacidade
│   ├── lib/
│   │   └── supabase.ts         # Cliente Supabase configurado
│   ├── navigation/
│   │   └── Appnavigator.tsx    # Stack Navigator com auth guard
│   ├── screens/                # Telas do app
│   │   ├── CalendarScreen.tsx  # Histórico de visitas
│   │   ├── DoctorFormScreen.tsx# Cadastro/edição de médico
│   │   ├── DoctorsListScreen.tsx# Lista de médicos
│   │   ├── HomeScreen.tsx      # Dashboard principal
│   │   ├── ImportScreen.tsx    # Importação de planilha
│   │   ├── LoginScreen.tsx     # Autenticação
│   │   ├── MapScreen.tsx       # Mapa com todos os médicos
│   │   ├── MFAScreen.tsx       # Configuração de MFA
│   │   ├── PrivacyScreen.tsx   # Gerenciamento LGPD
│   │   └── RouteScreen.tsx     # Gerador de roteiro
│   ├── services/               # Lógica de negócio e APIs
│   │   ├── consent.ts          # Gerenciamento de consentimento LGPD
│   │   ├── cycleLogs.ts        # Cálculo de ciclos trimestrais
│   │   ├── doctors.ts          # CRUD de médicos
│   │   ├── geocoding.ts        # Geocodificação de endereços
│   │   ├── homeSummary.ts      # Dados do dashboard
│   │   ├── Importer.ts         # Parser de planilhas CSV
│   │   ├── mfa.ts              # Autenticação multifator
│   │   ├── routing.ts          # Algoritmo de roteamento
│   │   └── visitLogs.ts        # CRUD de registros de visita
│   ├── theme/
│   │   └── color.js            # Paleta de cores do app
│   ├── types/
│   │   └── index.ts            # Interfaces e tipos TypeScript
│   └── utils/                  # Utilitários
│       ├── rateLimiter.ts      # Rate limiting de ações
│       ├── secureStorage.ts    # AsyncStorage com TTL e prefixo
│       └── validation.ts       # Sanitização e validação de inputs
├── app.json                    # Configuração do Expo
├── eas.json                    # Configuração de builds EAS
├── metro.config.js             # Configuração do Metro Bundler
├── tailwind.config.js          # Configuração do NativeWind
└── tsconfig.json               # Configuração do TypeScript
```

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Conta no [Supabase](https://supabase.com)
- Conta no [Expo](https://expo.dev)

### 1. Clone o repositório

```bash
git clone https://github.com/AndrewBlack21/MedWay.git
cd MedWay
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
EXPO_PUBLIC_ORS_API_KEY=sua_chave_openrouteservice
```

> ⚠️ **Nunca commite o arquivo `.env`** — ele está no `.gitignore`

### 4. Configure o banco de dados

Execute os seguintes SQLs no **SQL Editor do Supabase** em ordem:

```sql
-- Tabela de médicos
create table doctors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  specialty text not null,
  address text not null,
  lat numeric not null,
  lng numeric not null,
  hours text,
  visit_days text[] default '{}',
  visit_period text default 'both',
  cycle_target integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table doctors enable row level security;

create policy "users manage own doctors"
  on doctors for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tabela de registros de visita
create table visit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  doctor_id uuid references doctors(id) on delete cascade not null,
  visit_date date not null,
  status text check (status in ('visited','not_visited','absent','pending')) not null default 'pending',
  comment text,
  created_at timestamptz default now(),
  constraint visit_logs_unique unique (user_id, doctor_id, visit_date)
);

alter table visit_logs enable row level security;

create policy "users manage own logs"
  on visit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index on visit_logs(user_id, visit_date);

-- Trigger de audit log
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on doctors
  for each row execute function update_updated_at();
```

### 5. Configure a API Key do Google Maps

No painel do EAS, adicione o secret:

```bash
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value sua_api_key
```

### 6. Rode o projeto

```bash
# Expo Go (desenvolvimento rápido)
npx expo start

# Build APK para teste
eas build --platform android --profile preview

# Build para produção
eas build --platform android --profile production
```

---

## 🔐 Segurança

### Medidas implementadas

| Camada | Medida |
|---|---|
| Dados em repouso | AES-256 via PostgreSQL (Supabase) |
| Dados em trânsito | SSL/TLS obrigatório em todas as conexões |
| Senhas | Hash bcrypt/Argon2 via Supabase Auth |
| Autenticação | MFA com TOTP (RFC 6238) |
| Acesso ao banco | Row Level Security — cada usuário vê só seus dados |
| Inputs | Sanitização contra XSS e injeção |
| Login | Rate limiting: 5 tentativas → bloqueio de 15 min |
| API Keys | EAS Environment Secrets — nunca no código |
| `.env` | Verificado no CI para não ser commitado |
| Senhas | Mínimo 8 chars, maiúscula, minúscula, número e especial |

### Boas práticas no repositório público

```bash
# Verifique vulnerabilidades regularmente
npm audit

# Corrija automaticamente
npm audit fix

# Verifique se .env não foi commitado
git log --all --full-history -- .env
```

---

## ⚙️ CI/CD

### Workflows do GitHub Actions

#### `ci.yml` — Roda em todo push
- Instala dependências com `npm ci`
- Verifica se `.env` não foi commitado
- (TypeScript check desabilitado — habilitar após corrigir erros pendentes)

#### `preview.yml` — Roda em Pull Requests
- Gera APK de preview automaticamente
- Publica link de download no comentário do PR
- Também pode ser disparado manualmente para iOS

#### `production.yml` — Roda ao criar uma Release
- Gera `.aab` para Play Store
- Gera `.ipa` para App Store
- Submete automaticamente para as lojas

### Como fazer um release

```bash
# Cria tag de versão
git tag v1.0.0
git push origin v1.0.0

# O workflow production.yml dispara automaticamente
```

---

## 🧭 Algoritmo de Roteamento

O MedWay usa o algoritmo **Nearest Neighbor** para gerar roteiros otimizados:

```
1. Começa no ponto de partida (GPS ou endereço informado)
2. Calcula a distância até todos os médicos não visitados
3. Vai para o mais próximo
4. Repete até visitar todos
5. Retorna a rota ordenada com distâncias acumuladas
```

A distância entre dois pontos é calculada pela **fórmula de Haversine**, que considera a curvatura da Terra e retorna a distância em km com precisão de ~0.1%.

Para a **rota real no mapa** (traçado pelas ruas), o app consulta a **OpenRouteService API** e renderiza o GeoJSON retornado como `<Polyline>` no mapa.

---

## 📊 LGPD

O MedWay está em conformidade com a **Lei nº 13.709/2018 (LGPD)**:

- ✅ Consentimento explícito coletado no cadastro
- ✅ Versão do consentimento registrada no Supabase
- ✅ Termos de Uso e Política de Privacidade integrados ao app
- ✅ Direitos do titular implementados (acesso, correção, exclusão, portabilidade, revogação)
- ✅ Encarregado de Dados (DPO) identificado
- ✅ Contato da ANPD disponível no app
- ✅ Dados de médicos com base legal de tratamento documentada

---

## 📋 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ |
| `EXPO_PUBLIC_ORS_API_KEY` | Chave da OpenRouteService | ⚠️ Opcional |
| `GOOGLE_MAPS_API_KEY` | API Key do Google Maps (EAS Secret) | ✅ |
| `EXPO_TOKEN` | Token do Expo para CI/CD | ✅ (GitHub Secret) |
| `EXPO_PUBLIC_SUPABASE_URL` | Para CI/CD | ✅ (GitHub Secret) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Para CI/CD | ✅ (GitHub Secret) |

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commite suas mudanças: `git commit -m 'feat: minha feature'`
4. Faça push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Andrew Moraes**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-AndrewMoraes-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-AndrewBlack21-181717?style=flat-square&logo=github)](https://github.com/AndrewBlack21)

---

<div align="center">
Feito com ❤️ e muito ☕ em Santos, SP — Brasil 🇧🇷
</div>
