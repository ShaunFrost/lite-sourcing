# Submission Notes

## Setup Instructions
Clone the github repo into local.
### Backend
In the repo folder, we have the docker compose file. Run this from the repo folder:
```bash
docker compose up --build
```
The backend should be running on 3000 port.

### Frontend
In the repo folder, cd into the frontend folder.
```bash
cd frontend
npm run dev
```
The frontend should be running on 5173 port. Use http://localhost:5173 to access the frontend.

## Tech Stack

- **Backend** - Node JS with Typescript, Fastify
- **Frontend** - React JS with Typescript, Tailwind CSS
- **Databases** - MySQL, Qdrant 


## Architecture Decisions
- Due to highly relational nature of the data, I decided to use a relational database like MySQL to store the main data (suppliers, products, projects, spec items and sourcing data).
- For matching spec with available products for sourcing, I used Qdrant vector database and indexed the products using the name, category and unit of measurement.
- On the frontend side, since I need syncing state via server api calls, I used react query by tanstack. It helps cache the calls in a state and we can invalidate using the query key when we make an update request to the server. For all the UI states, I'm using reacts useState hooks.
- To keep guardrails on the category when creating products, I restricted the users to an available set of categories (taken from seed file). The same for units of measurement.
- I also gave an option for the user to correct/update/edit the parsed data before the spec is saved.
- Adding product, spec, project, supplier all have basic checks to make sure bad data is not saved to the database. When any of these new items are created, we invalidate the cached query so that the UI is always in sync with the server state.
- When users add a new product, it is indexed in the vector database using the product's name, category and unit of measurement. The productId is also added to the vector database for helping in query later.
- For parsing a spec item, I used a regex based parser. Assumption is that the quantity and measurement unit appear at the start together. Like in "500 meters of 4mm copper wire", 500 would be the quantity and meters would be the unit.
- While parsing the measurement unit part, I'm using a map of similar measurement unit terms for each allowed units of measurement. For example, "meter" can be inferred from "m", "meters", "ms", "meter".
- Once an user adds spec items to a project, they can select a specItem and the backend will return the three highest matching products (sources) from the vector searching. Since the spec item doesn't have the same structure as a product, we use the name and measurement unit from the spec to generate embeddings and do a vector search.
- After selecting their preferred source, they can attach that to the spec item.
- When a project is created and has no spec items, the status would be ***Draft***.
- When a project has a few spec items and some of them have source attached, the status would be ***Sourcing***.
- When a project has few spec items and all of them have source attached, the status would be ***Quoted***.
- When fetching details of a project, we dynamically calculated the totalCost, maxLeadDay, status. If all spec items have source attached, the user gets to see totalCost, maxLeadDay for the project.

Claude chat link: [chat](https://claude.ai/share/28aeedcf-18d3-41bd-b617-09b4225eea03)


## What I'd Do With More Time
- Add the updating/deleting flows for products, projects, suppliers, spec items.
- Add a fallback llm spec item parsing after the regex matching.
- I used USD as the fixed currency, I would implement a more robust price exchange system for various currencies.
- Currently using a local llm model with 384 vector size for generating embedding. I would use a better model leveraging OpenAI key to vectorize the products.
- Currently the indexing in Qdrant is happening synchronously when a new product is added. I would make this asynchronous by using a mediator queue system and updating the database to make sure it is in sync.
- I haven't added indices to the main db as this is a simple application running in local. I would create indices on the database column based on retrieval patterns.
- The UI is simple and I used this [palette](https://colorhunt.co/palette/3558727aaace9cd5fff7f8f0) to keep the design in sync. I would refactor the UI in a more user friendly way.
- I would also implement a more robust logging system for the backend.