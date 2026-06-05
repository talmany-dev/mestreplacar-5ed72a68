# Substituir placeholders da repescagem pelas seleções classificadas

## Mapeamento oficial (fonte: ge.globo, FIFA — 31/03/2026)
- Grupo A · "Europa 4" → **República Tcheca** (bandeira `cz`)
- Grupo B · "Europa 1" → **Bósnia e Herzegovina** (`ba`)
- Grupo D · "Europa 3" → **Turquia** (`tr`)
- Grupo F · "Europa 2" → **Suécia** (`se`)
- Grupo I · "Intercontinental 2" → **Iraque** (`iq`)
- Grupo K · "Intercontinental 1" → **RD Congo** (`cd`)

## Alterações no código

### `src/data/matches.ts`
1. No objeto `FLAGS`: remover as entradas `"Europa 1"`, `"Europa 2"`, `"Europa 3"`, `"Europa 4"`, `"Intercontinental 1"`, `"Intercontinental 2"` e adicionar:
   - `"República Tcheca": "cz"`
   - `"Bósnia": "ba"`
   - `"Turquia": "tr"`
   - `"Suécia": "se"`
   - `"Iraque": "iq"`
   - `"RD Congo": "cd"`
2. Em `GROUP_MATCHES`, substituir todas as ocorrências dos rótulos antigos pelos nomes acima, preservando mando de campo, data, horário, grupo e número da rodada (6 grupos × 3 rodadas = 18 ocorrências em jogos com placeholder).

## Fora de escopo
- Nenhuma mudança de UI, banco de dados, autenticação, lógica de palpites ou roteamento.
- `MatchesTab.tsx` consome os dados via props e não precisa ser alterado.

## Validação
- Abrir `/app` → aba **Jogos**.
- Conferir, para Rodadas 1, 2 e 3, os Grupos A, B, D, F, I e K — nomes e bandeiras das novas seleções devem aparecer corretamente em cada confronto.
