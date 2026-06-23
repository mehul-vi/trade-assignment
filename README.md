# Trading Dashboard

This is a Trading Dashboard project made using Vue.js.

In this project, users can manage deals and Introducing Brokers (IBs).

## Features

- Light and Dark mode
- Collapsible sidebar
- Dashboard overview
- Deals pipeline
- Create new deals
- Drag and drop deals between stages
- Introducing Brokers management
- Add new IB
- Edit IB details
- Delete IB
- Table sorting
- Column filters
- Pagination
- Responsive design

## Technologies Used

- Vue 3
- Vite
- Tailwind CSS
- Pinia
- Axios
- JSON Server
- Vue Draggable Plus
- Lucide Vue Next

## Project Setup

First clone the project:

```bash
git clone https://github.com/mehul-vi/trade-assignment
```

Go inside the project folder:

```bash
cd trading
```

Install all packages:

```bash
npm install
```

## Run Frontend

To start the Vue frontend, run this command:

```bash
npm run dev
```

After running this command, a local link will appear in the terminal.

Usually it will be:

```text
http://localhost:5173
```

Open this link in the browser.

## Run Mock API

This project uses JSON Server as a mock API.

Open a second terminal in the same project folder and run:

```bash
npm run mock-api
```

The mock API will run on:

```text
http://localhost:3001
```

The API data is stored in the `db.json` file.

## Important

Both commands should run at the same time.

### Terminal 1

```bash
npm run dev
```

### Terminal 2

```bash
npm run mock-api
```

If mock API is not running, deals and IB data will not load.

## Main Pages

### Dashboard

This page shows overview cards like:

- Deposits
- Withdrawals
- FTD
- Active Traders

### Deals

In the Deals page, users can:

- Create a new deal
- View deals in different stages
- Drag and drop deals from one stage to another
- Save deal stage changes using mock API

### Introducing Brokers

In the Introducing Brokers page, users can:

- Add a new IB
- Edit IB details
- Delete an IB
- Sort data by columns
- Filter data using column filters
- Use pagination

## Mock API Endpoints

### Deals

```text
GET    /deals
POST   /deals
PATCH  /deals/:id
```

### Introducing Brokers

```text
GET     /ibs
POST    /ibs
PATCH   /ibs/:id
DELETE  /ibs/:id
```

Base URL:

```text
http://localhost:3001
```

## Project Folder Important Files

```text
src/
  components/
  views/
  stores/
  services/
db.json
README.md
package.json
```

## Notes

- Make sure Node.js is installed.
- Run `npm install` before starting the project.
- Keep both frontend and mock API terminals running.
- All mock data is saved in `db.json`.
