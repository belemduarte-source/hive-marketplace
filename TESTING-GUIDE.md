# 🧪 Testing Guide - Add 5 Companies to Map

## Problema Atual
As 5 empresas de teste NÃO aparecem no mapa principal (`b2b-marketplace.html`), apesar do código estar correto.

## 📋 Plano de Testes

### Step 1: Test File Isolado ✅ (COMEÇA AQUI)
**Ficheiro:** `test-add-companies-isolated.html`

Este ficheiro é **100% independente** e testa a funcionalidade sem dependências do projeto principal.

1. Abre o ficheiro no browser
2. Clica no botão **"1️⃣ Check Setup"**
   - Deverá aparecer um log mostrando que Leaflet e map estão OK
3. Clica no botão **"2️⃣ Add 5 Companies"**
   - Deverá aparecer um **alert** dizendo "✅ 5 empresas adicionadas!"
   - Deverão aparecer **5 pins** no mapa em várias cidades portuguesas
   - O console (F12) mostrará detalhes

**Se funcionar:** ✅ O conceito está OK, o problema é no ficheiro principal
**Se NÃO funcionar:** ❌ Há um problema com Leaflet ou o browser

---

### Step 2: Testar o Ficheiro Principal
**Ficheiro:** `b2b-marketplace.html`

Após atualizar o ficheiro com a nova versão:

#### Via Botão (se existir no UI):
Se há um botão para adicionar empresas de teste, clica nele.

#### Via Console (F12):
1. Abre o browser Dev Tools (Pressiona **F12**)
2. Vai para a aba **Console**
3. Escreve: `add5()`
4. Pressiona Enter
5. Deverá aparecer um **alert** e um **log** no console com detalhes

**Alternativas:**
```javascript
// Opção 1 (recomendada)
add5()

// Opção 2
addTestCompanies()

// Opção 3 (diagnostic)
diagnosticCheck()
```

---

## 🔍 Diagnostic Checklist

Se os testes não funcionarem, usa isto para diagnosticar:

### No Console (F12):
```javascript
// Ver todos os diagnosticos
diagnosticCheck()

// Ver individualmente:
typeof map                    // Deve retornar "object"
typeof L                      // Deve retornar "object"
typeof window.add5            // Deve retornar "function"
typeof window.addTestCompanies // Deve retornar "function"
map.getCenter()              // Deve mostrar as coordenadas do mapa
```

### Cache Issues (se nada funcionar):
1. **Hard Refresh:** Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
2. **Clear Cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Edge: Ctrl+Shift+Delete
3. **InPrivate/Incognito:** Abre o ficheiro em modo privado

---

## 📊 Resultados Esperados

### ✅ Sucesso (deve aparecer isto):

**Test File Isolado:**
- Log mostrando "✅ Página carregada - Leaflet ativo"
- Ao clicar "Add 5 Companies", 5 pins aparecem no mapa
- Console mostra detalhes de cada empresa adicionada

**Ficheiro Principal:**
- Alert: "✅ 5 empresas adicionadas ao mapa!"
- 5 pins em: Lisboa, Porto, Braga, Covilhã, Faro
- Console mostra logs detalhados

### ❌ Possíveis Erros:

1. **Erro: "Cannot read property 'addTo' of undefined"**
   - Causa: `map` variable não existe
   - Solução: Verifica se L.map() foi executado

2. **Erro: "L is not defined"**
   - Causa: Leaflet biblioteca não carregou
   - Solução: Hard refresh (Ctrl+Shift+R)

3. **Nenhum alert aparece**
   - Causa: Função `add5()` não está accessible
   - Solução: Verifica no console: `typeof add5`

4. **Pins aparecem mas com problema de posição**
   - Causa: Coordenadas inválidas
   - Solução: Verifica as coordenadas lat/lng

---

## 🚀 Próximos Passos

### Se Test File funciona MAS ficheiro principal NÃO:
1. Verifica se há erros de JavaScript no console (F12)
2. Procura por "Uncaught" ou "ReferenceError"
3. Pode haver um erro sintax no ficheiro principal

### Se AMBOS funcionam:
1. As 5 empresas podem não aparecer porque:
   - Filtros estão muito restritivos
   - Raio de busca é muito pequeno (verifica se radius > 200km)
   - Zoom está muito alto

### Próxima Tarefa:
Após confirmar que os pins aparecem:
1. Verificar se os filtros afetam a visualização
2. Testar se a avaliação (⭐) aparece corretamente
3. Otimizar a exibição dos pins

---

## 📞 Como Reportar

Se algo não funcionar, diz-me:
1. Qual ficheiro testou (isolated ou principal)
2. O que apareceu (alert? pins? console messages?)
3. Qualquer erro que vires no console (F12)
4. O browser que usas e a versão

---

**Última Atualização:** 2026-03-07
**Status:** 🟡 Testes em progresso
