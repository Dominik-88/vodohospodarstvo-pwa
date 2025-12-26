# 🤝 Přispívání do projektu

Děkujeme za váš zájem o přispění do projektu Vodohospodářské Areály PWA! 

## 📋 Obsah

- [Code of Conduct](#code-of-conduct)
- [Jak přispět](#jak-přispět)
- [Hlášení chyb](#hlášení-chyb)
- [Návrhy vylepšení](#návrhy-vylepšení)
- [Pull Requests](#pull-requests)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

Tento projekt dodržuje [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/cs/version/2/1/code_of_conduct/). Účastí v tomto projektu se zavazujete dodržovat jeho podmínky.

## Jak přispět

### 1. Fork repozitáře

```bash
# Klikněte na tlačítko "Fork" na GitHubu
# Poté naklonujte váš fork
git clone https://github.com/YOUR_USERNAME/vodohospodarstvo-pwa.git
cd vodohospodarstvo-pwa
```

### 2. Vytvořte branch

```bash
# Vytvořte novou branch pro vaši funkci
git checkout -b feature/amazing-feature

# Nebo pro opravu chyby
git checkout -b fix/bug-description
```

### 3. Proveďte změny

```bash
# Proveďte změny v kódu
# Otestujte změny lokálně
python -m http.server 8000
```

### 4. Commit změny

```bash
# Přidejte změny
git add .

# Commitněte s popisnou zprávou
git commit -m "✨ Přidána nová funkce XYZ"
```

### 5. Push do forku

```bash
git push origin feature/amazing-feature
```

### 6. Vytvořte Pull Request

1. Jděte na GitHub
2. Klikněte na "New Pull Request"
3. Vyberte váš branch
4. Vyplňte popis změn
5. Klikněte "Create Pull Request"

## Hlášení chyb

### Před nahlášením chyby

- ✅ Zkontrolujte [existující issues](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)
- ✅ Ověřte, že chyba existuje v nejnovější verzi
- ✅ Zkuste reprodukovat chybu

### Jak nahlásit chybu

Vytvořte nový issue s následujícími informacemi:

```markdown
**Popis chyby**
Jasný a stručný popis chyby.

**Kroky k reprodukci**
1. Jděte na '...'
2. Klikněte na '...'
3. Scrollujte dolů na '...'
4. Vidíte chybu

**Očekávané chování**
Co jste očekávali, že se stane.

**Screenshots**
Pokud je to možné, přidejte screenshots.

**Prostředí:**
 - OS: [např. Windows 10]
 - Prohlížeč: [např. Chrome 120]
 - Verze: [např. 1.0.0]

**Další kontext**
Jakékoliv další informace o problému.
```

## Návrhy vylepšení

### Před návrhem vylepšení

- ✅ Zkontrolujte [existující issues](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)
- ✅ Ověřte, že vylepšení není již implementováno
- ✅ Zvažte, zda vylepšení zapadá do projektu

### Jak navrhnout vylepšení

Vytvořte nový issue s následujícími informacemi:

```markdown
**Je váš návrh spojen s problémem?**
Jasný a stručný popis problému. Např. "Jsem frustrovaný, když..."

**Popište řešení, které byste chtěli**
Jasný a stručný popis toho, co chcete, aby se stalo.

**Popište alternativy, které jste zvažovali**
Jasný a stručný popis alternativních řešení.

**Další kontext**
Přidejte jakýkoliv další kontext nebo screenshots.
```

## Pull Requests

### Checklist před PR

- [ ] Kód funguje lokálně
- [ ] Přidány/aktualizovány testy (pokud je to relevantní)
- [ ] Aktualizována dokumentace
- [ ] Dodrženy coding standards
- [ ] Commit messages jsou jasné
- [ ] PR má jasný popis

### PR Template

```markdown
## Popis
Jasný a stručný popis změn.

## Typ změny
- [ ] 🐛 Oprava chyby (bug fix)
- [ ] ✨ Nová funkce (feature)
- [ ] 💥 Breaking change
- [ ] 📝 Dokumentace
- [ ] 🎨 Styling
- [ ] ♻️ Refactoring
- [ ] ⚡ Performance
- [ ] ✅ Testy

## Jak bylo testováno?
Popište, jak jste testovali změny.

## Screenshots (pokud je to relevantní)
Přidejte screenshots změn.

## Checklist
- [ ] Kód funguje lokálně
- [ ] Přidány/aktualizovány testy
- [ ] Aktualizována dokumentace
- [ ] Dodrženy coding standards
```

## Coding Standards

### JavaScript

```javascript
// ✅ Dobře
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  return R * c;
}

// ❌ Špatně
function calc(a,b,c,d){
var x=6371;
return x*y;
}
```

### Pravidla

1. **Používejte ES6+ syntaxi**
   - Arrow funkce
   - Template literals
   - Destructuring
   - Const/let místo var

2. **Pojmenování**
   - camelCase pro proměnné a funkce
   - PascalCase pro třídy
   - UPPER_CASE pro konstanty

3. **Komentáře**
   - JSDoc pro funkce
   - Inline komentáře pro složitou logiku

4. **Formátování**
   - 2 mezery pro odsazení
   - Středníky na konci řádků
   - Single quotes pro stringy

### HTML

```html
<!-- ✅ Dobře -->
<div class="container">
  <h1 class="title">Nadpis</h1>
  <p class="description">Popis</p>
</div>

<!-- ❌ Špatně -->
<div class=container>
<h1>Nadpis</h1><p>Popis</p></div>
```

### CSS (Tailwind)

```html
<!-- ✅ Dobře -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Tlačítko
</button>

<!-- ❌ Špatně -->
<button style="background: blue; color: white;">
  Tlačítko
</button>
```

## Commit Messages

### Formát

```
<typ>: <popis>

[volitelné tělo]

[volitelná patička]
```

### Typy

- ✨ `feat`: Nová funkce
- 🐛 `fix`: Oprava chyby
- 📝 `docs`: Dokumentace
- 🎨 `style`: Formátování
- ♻️ `refactor`: Refactoring
- ⚡ `perf`: Performance
- ✅ `test`: Testy
- 🔧 `chore`: Údržba

### Příklady

```bash
# Dobrý commit
git commit -m "✨ Přidána funkce pro export do PDF"

# Dobrý commit s tělem
git commit -m "🐛 Opravena chyba v výpočtu vzdálenosti

Haversine formula měla chybu v konverzi radiánů.
Opraveno a přidány unit testy."

# Špatný commit
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## Testování

### Manuální testování

```bash
# Spusťte aplikaci lokálně
python -m http.server 8000

# Otevřete v prohlížeči
http://localhost:8000

# Otestujte:
# - Všechny funkce
# - Responzivitu
# - Offline režim
# - Různé prohlížeče
```

### Unit testy (připraveno)

```bash
# Spusťte testy
npm test

# Coverage
npm run test:coverage
```

## Dokumentace

### Aktualizace dokumentace

Pokud vaše změny ovlivňují:

- **README.md** - Hlavní dokumentace
- **QUICKSTART.md** - Rychlý start
- **TECHNICAL.md** - Technická dokumentace
- **DEPLOYMENT.md** - Deployment guide
- **CHANGELOG.md** - Seznam změn

Nezapomeňte aktualizovat příslušné soubory!

## Otázky?

Máte otázky? Neváhejte:

- 📧 Email: d.schmied@lantaron.cz
- 💬 [GitHub Discussions](https://github.com/Dominik-88/vodohospodarstvo-pwa/discussions)
- 🐛 [GitHub Issues](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)

---

**Děkujeme za vaše příspěvky! ❤️**