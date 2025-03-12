const { ObjectId, MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const PAGE_SIZE = 20;

let connection = null;

async function connect() {
    if (connection) return connection;

    const client = new MongoClient(process.env.MONGODB_CONNECTION);

    try {
        await client.connect();
        connection = client.db(process.env.MONGODB_DATABASE);
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        connection = null;
    }

    return connection;
}

// Funções relacionadas aos clientes (customers)

async function countCustomers() {
    const conn = await connect();
    return conn.collection("customers").countDocuments();
}

async function findCustomers(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    const conn = await connect();
    return conn
        .collection("customers")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray();
}

async function findCustomer(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("customers").findOne({ _id: objectId });
}

async function insertCustomer(customer) {
    const conn = await connect();
    return conn.collection("customers").insertOne(customer);
}

async function updateCustomer(id, customer) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("customers").updateOne({ _id: objectId }, { $set: customer });
}

async function deleteCustomer(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("customers").deleteOne({ _id: objectId });
}

async function searchCustomersByName(name) {
    const conn = await connect();
    return conn
        .collection("customers")
        .find({ name: new RegExp(name, 'i') })
        .toArray();
}

// Funções relacionadas aos pedidos (os)

async function countOs() {
    const conn = await connect();
    return conn.collection("os").countDocuments();
}

async function findOss(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    const conn = await connect();
    return conn
        .collection("os")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray();
}

async function findOs(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("os").findOne({ _id: objectId });
}

async function insertOs(os) {
    const conn = await connect();
    return conn.collection("os").insertOne(os);
}

async function updateOs(id, os) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("os").updateOne({ _id: objectId }, { $set: os });
}

async function deleteOs(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("os").deleteOne({ _id: objectId });
}
async function searchOSByName(name) {
    const conn = await connect();
    return conn
        .collection("os")
        .find({ name: new RegExp(name, 'i') })
        .toArray();
}
// Funções relacionadas aos usuários (users)

async function countUsers() {
    const conn = await connect();
    return conn.collection("users").countDocuments();
}

async function findUsers(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    const conn = await connect();
    return conn
        .collection("users")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray();
}

async function findUser(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("users").findOne({ _id: objectId });
}

async function insertUser(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    const conn = await connect();
    return conn.collection("users").insertOne(user);
}

async function updateUser(id, user) {
    if (user.password)
        user.password = bcrypt.hashSync(user.password, 12);

    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("users").updateOne({ _id: objectId }, { $set: user });
}

async function deleteUser(id) {
    const objectId = ObjectId.createFromHexString(id);
    const conn = await connect();
    return conn.collection("users").deleteOne({ _id: objectId });
}

// Exemplo de funções no db

async function insertAutoText(autoText) {
    const connection = await connect();
    return connection.collection("autotexts").insertOne(autoText);
  }
  
  async function updateAutoText(id, autoText, userId) {
    const connection = await connect();
    return connection.collection("autotexts").updateOne(
      { _id: new ObjectId(id), userId: userId },
      { $set: autoText }
    );
  }
  
  async function deleteAutoText(id, userId) {
    const connection = await connect();
    return connection.collection("autotexts").deleteOne({ _id: new ObjectId(id), userId: userId });
  }
  async function findAutoTextsByUserId(userId) {
    const connection = await connect();
    return connection.collection("autotexts").find({ userId: userId }).toArray();
}

async function findAutoTextById(id, userId) {
    try {
        console.log(`Buscando auto texto pelo ID: ${id}, userId: ${userId}`); // Log para depuração

        // Valida se o ID é uma string válida de 24 caracteres hexadecimais
        if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error('ID inválido');
        }

        // Conecta ao banco de dados
        const connection = await connect();

        // Converte o ID para ObjectId
        const objectId = new ObjectId(id);

        // Busca o auto texto pelo ID e pelo ID do usuário
        const autoText = await connection.collection('autotexts').findOne({
            _id: objectId,
            userId: userId
        });

        console.log('Auto texto encontrado:', autoText); // Log para depuração
        return autoText;
    } catch (error) {
        console.error('Erro na função findAutoTextById:', error); // Log para depuração
        throw error;
    }
}

async function findAutoTextByName(name, userId) {
    try {
        const db = await connect(); // Conecta ao banco de dados
        const autoText = await db.collection('autotexts').findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }, // Busca insensível a maiúsculas/minúsculas
            userId: userId // Garante que o auto texto pertence ao usuário
        });
        return autoText;
    } catch (error) {
        console.error('Erro na função findAutoTextByName:', error);
        throw error;
    }
}

module.exports = {
    PAGE_SIZE,
    connect,
    // Funções relacionadas aos clientes
    countCustomers,
    findCustomers,
    findCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomersByName,
    // Funções relacionadas aos pedidos
    countOs,
    findOss,
    findOs,
    insertOs,
    updateOs,
    deleteOs,
    searchOSByName,
    // Funções relacionadas aos usuários
    countUsers,
    findUsers,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
    insertAutoText,
    updateAutoText,
    deleteAutoText,
    findAutoTextById,
    findAutoTextsByUserId,
    findAutoTextByName
};
