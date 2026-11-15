# BayawSec docs

BayawSec is the AI-assisted security assessment module in Bayaw Jobs (CS24 final project).
It registers an authorized target, runs and imports security tool results, uses AI to explain results and suggest fixes,
and lets a human assessor confirm every finding before it reaches the dashboard and report.

Work happens on the **`feat/bayawsec-dev`** branch.

| Doc | Read it when you want to… |
|---|---|
| [setup.md](setup.md) | run the API and frontend on your machine, fill in `.dev.vars` / `.env.local`, log in, try the flow |
| [architecture.md](architecture.md) | understand how the backend is structured: request chain, folders, data model, tools, AI pipeline |
| [schema.md](schema.md) | look up every database table and column (BayawSec and Bayaw Jobs), enums, keys, indexes and JSON shapes |
| [tasks.md](tasks.md) | see what each role still has to do, broken into small tickets |
| [bayawsec-backend.md](bayawsec-backend.md) | get the short API flow for the frontend |
| [../../scanner-agent/README.md](../../scanner-agent/README.md) | run the optional Nmap/ZAP scanner agent |

The live API reference (every endpoint, request and response) is at `/api/docs` under the **BayawSec** tag.
