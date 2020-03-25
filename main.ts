// neo4j 4.0 driver js https "Neo4jError: Connection was closed by server"
// https://neo4j.com/developer/javascript/
// https://github.com/neo4j-examples/movies-javascript-bolt

// - NEO4J_dbms_connector_bolt_tls__level=REQUIRED
// Neo4jError: Failed to connect to server. Please ensure that your database is listening on the correct host and port and that you have compatible encryption settings both on Neo4j server and driver. Note that the default encryption setting has changed in Neo4j 4.0. Caused by: connect ECONNREFUSED 79.169.170.23:7687

// https://community.neo4j.com/t/troubleshooting-connection-issues-to-neo4j/129
// curl https://neo4j.koakh.com:7473
// {
//   "bolt_routing" : "neo4j://neo4j.koakh.com:7687",
//   "transaction" : "https://neo4j.koakh.com:7473/db/{databaseName}/tx",
//   "bolt_direct" : "bolt://neo4j.koakh.com:7687",
//   "neo4j_version" : "4.0.2",
//   "neo4j_edition" : "community"
// }

// https://github.com/neo4j/neo4j-javascript-driver
// Driver default configuration for encrypted is now false (meaning that driver will only attempt clear text connections by default), and when encryption is explicitly enabled the default trust mode is TRUST_SYSTEM_CA_SIGNED_CERTIFICATES which relies upon underlying system's certificate trust settings.
// FUCK the trick is add { encrypted: true }
// const driver = neo4j.driver(
//   uri,
//   neo4j.auth.basic(databaseUser, databasePassword),
//   { encrypted: true }
// )

const neo4j = require('neo4j-driver')

const databaseType = 'NEO4J'
const databaseHost = 'neo4j.koakh.com'
const databasePort = '7687'
const databaseUser = 'neo4j'
const databasePassword = 'neo4j28'
const uri = `bolt://${databaseHost}:${databasePort}`;
console.log(`uri:${uri}`);

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(databaseUser, databasePassword),
  { encrypted: true }
)
const session = driver.session()
const personName = 'Alice'

const init = async () => {
  try {
    const result = await session.run(
      'CREATE (a:Person {name: $name}) RETURN a',
      { name: personName }
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    console.log(node.properties.name)
  } finally {
    await session.close()
  }

  // on application exit:
  await driver.close()
}

init()