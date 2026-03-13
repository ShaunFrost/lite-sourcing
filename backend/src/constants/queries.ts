// supplier queries
const INSERT_SUPPLIER = `INSERT INTO suppliers (id, name, country, website, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`
const GET_ALL_SUPPLIERS = `SELECT id, name FROM suppliers`

// products queries
const INSERT_PRODUCT = `
INSERT INTO products (id, supplier_id, name, category, unit_price, currency, unit_of_measure, lead_time_days, created_at, updated_at)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`
const GET_PRODUCT_BY_ID = `SELECT * FROM products where id = ?`
const GET_PRODUCTS_FOR_SUPPLIER = `SELECT * FROM products where supplier_id = ?`


// projects queries
const INSERT_PROJECT = `
INSERT INTO projects (id, name, client, status, created_at, updated_at)
 VALUES (?, ?, ?, ?, NOW(), NOW())
`
const GET_ALL_PROJECTS = `
SELECT * FROM projects
`
const GET_PROJECT_BY_ID = `
SELECT * FROM projects where id = ?
`

const GET_PROJECT_DATA_BY_PROJECT_ID = `
SELECT
    -- Project
    proj.id                  AS project_id,
    proj.name                AS project_name,
    proj.client              AS project_client,
    proj.status              AS project_status,
    proj.created_at          AS project_created_at,
    proj.updated_at          AS project_updated_at,

    -- Spec Item
    si.id                    AS spec_item_id,
    si.name                  AS spec_item_name,
    si.description           AS spec_item_description,
    si.quantity              AS spec_item_quantity,
    si.unit_of_measure       AS spec_item_uom,
    si.created_at            AS spec_item_created_at,

    -- Winning Sourcing (NULL if not yet selected)
    sd.id                    AS sourcing_id,
    sd.unit_price            AS sourcing_unit_price,
    sd.total_cost            AS sourcing_total_cost,
    sd.lead_time_days        AS sourcing_lead_time_days,
    sd.created_at            AS sourcing_created_at,

    -- Product
    p.id                     AS product_id,
    p.name                   AS product_name,
    p.category               AS product_category,
    p.unit_price             AS product_unit_price,
    p.currency               AS product_currency,
    p.unit_of_measure        AS product_uom,
    p.lead_time_days         AS product_lead_time_days,

    -- Supplier
    s.id                     AS supplier_id,
    s.name                   AS supplier_name,
    s.country                AS supplier_country,
    s.website                AS supplier_website

FROM projects proj

LEFT JOIN spec_items si
    ON si.project_id = proj.id

LEFT JOIN sourcing_data sd
    ON sd.spec_item_id = si.id

LEFT JOIN products p
    ON p.id = sd.product_id

LEFT JOIN suppliers s
    ON s.id = p.supplier_id

WHERE proj.id = ?

ORDER BY si.created_at ASC;
`

// spec queries
const INSERT_SPEC = `
INSERT INTO spec_items (id, project_id, name, description, quantity, unit_of_measure, created_at)
 VALUES (?, ?, ?, ?, ?, ?, NOW())
`
const GET_SPEC_BY_ID = `SELECT * FROM spec_items where id = ?`

// sourcing data queries
const INSERT_SOURCING_DATA = `
INSERT INTO sourcing_data (id, spec_item_id, product_id, unit_price, total_cost, lead_time_days, created_at)
 VALUES (?, ?, ?, ?, ?, ?, NOW())
`

export {
    INSERT_SUPPLIER,
    GET_ALL_SUPPLIERS,
    INSERT_PRODUCT,
    GET_PRODUCT_BY_ID,
    GET_PRODUCTS_FOR_SUPPLIER,
    INSERT_PROJECT,
    GET_ALL_PROJECTS,
    GET_PROJECT_BY_ID,
    GET_PROJECT_DATA_BY_PROJECT_ID,
    INSERT_SPEC,
    GET_SPEC_BY_ID,
    INSERT_SOURCING_DATA,
}
