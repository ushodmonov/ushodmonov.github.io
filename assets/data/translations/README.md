# Translations

This folder contains translation files for **UI elements only**. User-specific content (like About section, Services, Experiences) is stored in the data files (`profile.json`, `resume.json`) with multilingual structure.

## Architecture

- **Translation files** (`en.json`, `uz.json`, `ru.json`) → UI labels, buttons, titles, loading/error messages
- **Data files** (`profile.json`, `resume.json`) → User content with `{ "en": "...", "uz": "...", "ru": "..." }` structure

## Available Languages

- **en.json** - English (Default)
- **uz.json** - Uzbek (O'zbek tili)
- **ru.json** - Russian (Русский)

## How to Add a New Language

1. Create a new JSON file named `[language-code].json` (e.g., `fr.json` for French)
2. Copy the structure from `en.json`
3. Translate all the UI text values
4. Update `profile.json` and `resume.json` to add your language code (e.g., `"fr": "your content"`)
5. Add a new button in `index.html`:
   ```html
   <button class="language-btn" data-lang="fr">FR</button>
   ```

## Translation File Structure (UI Only)

```json
{
  "nav": {
    "about": "Navigation menu items",
    "resume": "...",
    "portfolio": "..."
  },
  "sidebar": {
    "showContacts": "Sidebar button text",
    "hideContacts": "...",
    "contactTitles": {
      "email": "Contact section titles",
      "phone": "...",
      "location": "..."
    }
  },
  "about": {
    "title": "Section title",
    "servicesTitle": "Services section title"
  },
  "resume": {
    "title": "Resume section title",
    "experienceTitle": "...",
    "educationTitle": "...",
    "skillsTitle": "..."
  },
  "portfolio": {
    "title": "Portfolio section title"
  },
  "loading": {
    "projects": "Loading messages",
    "experiences": "...",
    ...
  },
  "errors": {
    "loadProjects": "Error messages",
    "loadExperiences": "...",
    ...
  },
  "platformModal": {
    "title": "Platform selector modal text",
    "description": "...",
    "ios": "...",
    "android": "..."
  }
}
```

## Content Data Structure (in profile.json and resume.json)

User-specific content uses this multilingual structure:

### profile.json

```json
{
  "personal": {
    "name": {
      "en": "Uchkun Shodmonov",
      "uz": "Uchqun Shodmonov",
      "ru": "Учкун Шодмонов"
    },
    "title": {
      "en": "Software Engineer | Mobile App Development",
      "uz": "Dasturiy ta'minot muhandisi | Mobil ilovalar ishlab chiqish",
      "ru": "Инженер-программист | Разработка мобильных приложений"
    }
  },
  "contact": {
    "location": {
      "en": "Tashkent, Uzbekistan",
      "uz": "Toshkent, O'zbekiston",
      "ru": "Ташкент, Узбекистан"
    }
  },
  "about": {
    "introduction": {
      "en": "English text",
      "uz": "O'zbek matni",
      "ru": "Русский текст"
    },
    "highlights": {
      "en": ["English items"],
      "uz": ["O'zbek elementlar"],
      "ru": ["Русские пункты"]
    }
  },
  "services": [
    {
      "title": {
        "en": "Mobile apps",
        "uz": "Mobil ilovalar",
        "ru": "Мобильные приложения"
      },
      "description": {
        "en": "...",
        "uz": "...",
        "ru": "..."
      }
    }
  ]
}
```

### resume.json

```json
{
  "experiences": [
    {
      "company": "Company Name",
      "period": "2022 — Present",
      "position": {
        "en": "Job Title",
        "uz": "Lavozim nomi",
        "ru": "Должность"
      },
      "description": {
        "en": "Description in English",
        "uz": "O'zbek tilidagi tavsif",
        "ru": "Описание на русском"
      }
    }
  ],
  "education": [
    {
      "institution": {
        "en": "University Name",
        "uz": "Universitet nomi",
        "ru": "Название университета"
      },
      "period": "2018 — 2022",
      "degree": {
        "en": "Software Engineering",
        "uz": "Dasturiy ta'minot muhandisligi",
        "ru": "Программная инженерия"
      }
    }
  ]
}
```

## Notes

- The language preference is saved in localStorage
- Default language is English (en)
- If a translation file fails to load, it falls back to English
- All text with `data-i18n` attribute will be automatically translated from translation files
- Content fields (like descriptions, titles) are read from data files using the `getLocalizedValue()` function

