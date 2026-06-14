# Antigravity Pay - Full Stack Mini Fintech Dashboard

A complete, responsive Full Stack Mini Fintech Dashboard built using **React (Vite)** on the frontend, **Django REST Framework** on the backend, and **SQLite** as the database. It features modern **dark-glassmorphism styling**, animated summaries, interactive charts, and a rule-based financial spending insight engine.

---

## Key Features

1. **Transaction Management**: Easily add income and expense items with fields for Amount, Category, Type, Date, and Note. Includes frontend validation and category suggestions.
2. **Interactive Listing Table**: Live-filter transactions by Category and Date Range. Type indicators and category tags are visually color-coded.
3. **Analytics Summaries**: Dashboard cards displaying Total Income, Total Expenses, Net Balance, and the Top Spending Category.
4. **Vibrant Expense Charts**: Dynamic category spending breakdown rendered with Recharts PieChart (featuring custom active glassmorphic hover tooltips).
5. **Rule-based Insight Engine**: Calculates spending concentrations, budget deficits, and savings rates dynamically to advise the user.
6. **Mobile Responsive & Fast**: Fully optimized fluid CSS grids and flexbox designed to render beautifully on mobile, tablet, and desktop screens.

---

## Project Directory Structure

```text
mini-fintech-dashboard/
├── backend/                  # Django Backend
│   ├── manage.py
│   ├── db.sqlite3            # SQLite database
│   ├── seed_transactions.py  # Seeder script
│   ├── fintech_backend/      # Project configuration
│   │   ├── settings.py       # Registered Apps, DRF, CORS, SQLite
│   │   ├── urls.py           # Main routing
│   │   └── wsgi.py
│   └── transactions/         # Transactions App
│       ├── models.py         # Transaction model
│       ├── serializers.py    # DRF serializer with validation
│       ├── views.py          # List, Create, and Dashboard Stats views
│       ├── urls.py           # App routing
│       ├── admin.py          # Admin interface registration
│       └── tests.py          # API Unit Tests (6/6 passing)
├── frontend/                 # React Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # App layout, header, footer
│       ├── index.css         # Glassmorphic Dark UI Theme
│       ├── components/
│       │   ├── AddTransactionForm.jsx
│       │   ├── TransactionTable.jsx
│       │   ├── SummaryCards.jsx
│       │   ├── ExpenseChart.jsx
│       │   └── InsightCard.jsx
│       ├── pages/
│       │   └── Dashboard.jsx # API coordination & page state
│       └── services/
│           └── api.js        # Axios instance & endpoints mapping
└── README.md
```

---

## API Endpoints

- `GET /api/transactions/`: List all transactions. Supports filtering query parameters:
  - `category` (string, case-insensitive)
  - `start_date` (YYYY-MM-DD)
  - `end_date` (YYYY-MM-DD)
- `POST /api/transactions/`: Create a new transaction.
- `GET /api/summary/`: Retrieve aggregates for total income, total expense, net balance, top spending category, and category-level expense breakdowns.

---

## Getting Started

### Backend Setup (Django)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Seed the database with sample transactions**:
   We have included a seed script to generate 30 mock transactions representing realistic income, food, rent, utility, and shopping expenses over the last 30 days.
   ```bash
   python seed_transactions.py
   ```

6. **Start the Django development server**:
   ```bash
   python manage.py runserver
   ```
   The backend server will run on [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

7. **Verify Tests**:
   To run Django REST API unit tests:
   ```bash
   python manage.py test
   ```

---

### Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install node packages**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend app will run on [http://localhost:5173/](http://localhost:5173/).

4. **Environment Variables**:
   By default, the frontend attempts to talk to `http://127.0.0.1:8000/api/`. To configure a different backend API URL, create a `.env.local` file inside the `frontend` folder:
   ```text
   VITE_API_URL=https://your-backend-api.com/api/
   ```

---

## Deployment Instructions

### Backend Deployment (Render)

Deploying a Django + SQLite application on **Render** (as a Web Service):

1. **Create `requirements.txt`**:
   In `backend/`, run `pip freeze > requirements.txt` or create it with:
   ```text
   Django>=5.0
   djangorestframework>=3.14
   django-cors-headers>=4.0
   gunicorn>=21.0
   ```
2. **Configure Settings for Production**:
   Update `backend/fintech_backend/settings.py` for environment variables:
   ```python
   import os
   import dj_database_url # If using PostgreSQL, or stick to SQLite
   
   SECRET_KEY = os.environ.get('SECRET_KEY', 'default-unsafe-key')
   DEBUG = os.environ.get('DEBUG', 'False') == 'True'
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')
   ```
3. **Configure staticfiles**:
   ```python
   STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
   ```
4. **Create a Render Web Service**:
   - Connect your Git repository.
   - Set **Environment** to `Python`.
   - Set **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Set **Start Command**: `gunicorn fintech_backend.wsgi:application`
   - Under **Environment Variables**, add:
     - `SECRET_KEY`: (generate a strong key)
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `your-render-url.onrender.com`

*Note: Render free instances spun up with SQLite do not persist database changes after restart unless you use Render's Persistent Disks or switch `DATABASES` in settings to a hosted PostgreSQL instance.*

---

### Frontend Deployment (Vercel)

Deploying a React (Vite) application on **Vercel**:

1. **Vercel Settings**:
   - Push your code to GitHub/GitLab/Bitbucket.
   - Import your repository in Vercel.
   - Choose **Vite** as the Framework Preset.
   - Set **Root Directory** to `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
2. **Environment Variables**:
   - Add a environment variable `VITE_API_URL` pointing to your deployed backend API URL (e.g., `https://fintech-api.onrender.com/api/`).
3. **Configure Client Routing Support (Optional)**:
   Create a `frontend/vercel.json` file to route all requests back to `index.html` (supporting React Router single page application refresh):
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
4. **Click Deploy**. Vercel will build and provide a secure production-ready live URL.

---

## Continuous Integration (GitHub Actions)

![CI](https://github.com/vysakhtu/FinDash/actions/workflows/ci.yml/badge.svg)

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on `push` and `pull_request` to the `main` branch. It performs two jobs in parallel:

- **Backend — Run Django tests**: sets up Python, installs minimal dependencies (`Django`, `djangorestframework`, `django-cors-headers`), runs migrations and `python manage.py test` in the `backend` folder.
- **Frontend — Build**: sets up Node.js, installs dependencies with `npm ci`, and runs `npm run build` in the `frontend` folder to confirm the frontend compiles.

Run the same checks locally:

Backend tests:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# or: source .venv/bin/activate   # macOS/Linux
pip install Django djangorestframework django-cors-headers
python manage.py migrate
python manage.py test
```

Frontend build:
```bash
cd frontend
npm ci
npm run build
```

If you want additional CI steps (linting, security checks, automatic deployments), tell me which checks to add and I will extend the workflow.
