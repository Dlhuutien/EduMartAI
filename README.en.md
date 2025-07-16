# ALlecta - Intelligent Online Learning Platform (en)

**ALlecta** is a modern online learning website offering high-quality courses, integrated with an **AI learning assistant chatbot** that helps users search and receive course suggestions quickly and conveniently.

---

## Key Features

- Search courses by **name** or **price**
- Add courses to **favorites**
- Save viewed course history via `localStorage`
- Smart course recommendations
- Integrated **AI ChatBot** to assist users:
  - Suggests courses based on keywords, category, and price
  - Displays results as a course list
  - View course details directly from suggestions
- Responsive interface for **mobile**, **tablet**, and **desktop**
- Google login (via Firebase)
- API integration via [MockAPI.io](https://mockapi.io/)

---

## Intelligent Course Recommendations

ALlecta uses an AI-based algorithm to **suggest courses based on your favorites**, helping users discover more relevant content.

### 🔍 How it works:

#### 1. Multi-factor similarity scoring:

- **Category (40%)**: Prioritize courses in the same category as your favorites
- **Name (25%)**: Compare course titles for related keywords
- **Short Description (20%)**: Analyze the course summary
- **Long Description (15%)**: Evaluate detailed relevance

#### 2. Jaccard Similarity Algorithm:

- Break text into individual words
- Calculate **intersection** and **union** of word sets

#### 3. Smart recommendation logic:

- Average similarity scores across all favorite courses

#### 4. Example:

If a user favorites **“React Cơ bản”**, the system might recommend:

- “React Nâng Cao” (same category: Frontend, shared keywords)

---

## Technologies Used

* **React.js** (Vite)
* **Material UI (MUI)**: Modern UI design
* **React Router**: Page routing
* **Firebase Auth**: User authentication
* **MockAPI.io**: Course data simulation
* **LocalStorage**: For storing favorites and history
* **Custom Chatbot UI**: Auto-recommend content based on input

---

## Installation

```bash
git clone https://github.com/Dlhuutien/EduMartAI.git
cd EduMartAI
npm install
npm run dev
```

---

## Brand Meaning: AIllecta

**"AIllecta – Smart learning, guiding the future."**

### AI – Artificial Intelligence:
Represents intelligent technology that supports learning: course recommendation, personalized content, and real-time chatbot interaction.

### llecta (short for Intellecta) – Inspired by the root word "Intellect":
The name also evokes associations with:
- *collect* – gathering knowledge
- *elect* – choosing the right courses
- *intellect* – intelligence and wisdom

Together, they convey a sense of a smart educational platform that curates, personalizes, and empowers learners to grow efficiently.
