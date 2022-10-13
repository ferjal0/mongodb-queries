//////////////
// CREACION //
//////////////
db.coleccion.insertOne({ name: "Max" });
db.coleccion.insert([{ name: "Max" }, { name: "Alex" }]);
db.coleccion.insert([{ name: "Max" }, { name: "Alex" }], { ordered: false });
db.coleccion.insert({ date: ISODate() });

/////////////
// LECTURA //
/////////////
db.coleccion.findOne();
db.coleccion.find();
db.coleccion.find({ name: "Max", age: 32 }); // AND
db.coleccion.find({ date: ISODate("2020-09-25T13:57:17.180Z") }); // Busqueda por ISODate
db.coleccion.distinct("name");

// Contar documentos
db.coleccion.count({ age: 32 }); // Estimacion basada en la metadata de la coleccion
db.coleccion.countDocuments({ age: 32 }); // Cuenta precisamente los documentos

// Comparacion
db.coleccion.find({ year: { $gt: 1970 } });
db.coleccion.find({ year: { $gte: 1970 } });
db.coleccion.find({ year: { $lt: 1970 } });
db.coleccion.find({ year: { $lte: 1970 } });
db.coleccion.find({ year: { $ne: 1970 } });
db.coleccion.find({ year: { $in: [1958, 1959] } });
db.coleccion.find({ year: { $nin: [1958, 1959] } });

// Comparadores logicos
db.coleccion.find({ name: { $not: { $eq: "Max" } } });
db.coleccion.find({ $or: [{ year: 1958 }, { year: 1959 }] });
db.coleccion.find({ $nor: [{ price: 1.99 }, { sale: true }] });
db.coleccion.find({
	$and: [
		{ $or: [{ qty: { $lt: 10 } }, { qty: { $gt: 50 } }] },
		{ $or: [{ sale: true }, { price: { $lt: 5 } }] },
	],
});

// Existencia y tipo
db.coleccion.find({ name: { $exists: true } });
db.coleccion.find({ zipCode: { $type: 2 } });
db.coleccion.find({ zipCode: { $type: "string" } });

// Pipeline de agregacion
db.coleccion.aggregate([
	{ $match: { status: "A" } },
	{ $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
	{ $sort: { total: -1 } },
]);

// Busqueda de texto con indice de texto
db.coll
	.find({ $text: { $search: "Rocky" } }, { score: { $meta: "textScore" } })
	.sort({ score: { $meta: "textScore" } });

// Expresiones regulares
db.coleccion.find({ name: /^Max/ }); // regex: empieza por Max
db.coleccion.find({ name: /^Max$/i }); // regex: empieza y termina por Max, case insensitive

// Array
db.coleccion.find({ tags: { $all: ["Realm", "Charts"] } });

// Projections
db.coleccion.find({ x: 1 }, { actors: 1 }); // Muestra actors + _id
db.coleccion.find({ x: 1 }, { actors: 1, _id: 0 }); // Muestra solo actors
db.coleccion.find({ x: 1 }, { actors: 0, summary: 0 }); // Muestra todos excepto "actors" y "summary"

// Ordenado, limitado y saltado
db.coleccion.find({}).sort({ year: 1, rating: -1 }).skip(10).limit(3);

///////////////////
// ACTUALIZACION //
///////////////////
db.coleccion.update({ _id: 1 }, { year: 2016 }); // ATENCION! Reemplaza el documento entero
db.coleccion.update({ _id: 1 }, { $set: { year: 2016, name: "Max" } });
db.coleccion.update({ _id: 1 }, { $unset: { year: 1 } });
db.coleccion.update({ _id: 1 }, { $rename: { year: "date" } });
db.coleccion.update({ _id: 1 }, { $inc: { year: 5 } });
db.coleccion.update(
	{ _id: 1 },
	{ $mul: { price: NumberDecimal("1.25"), qty: 2 } },
);
db.coleccion.update({ _id: 1 }, { $min: { imdb: 5 } });
db.coleccion.update({ _id: 1 }, { $max: { imdb: 8 } });
db.coleccion.update({ _id: 1 }, { $currentDate: { lastModified: true } });
db.coleccion.update(
	{ _id: 1 },
	{ $currentDate: { lastModified: { $type: "timestamp" } } },
);

// Mutacion de arrays
db.coleccion.update({ _id: 1 }, { $push: { array: 1 } });
db.coleccion.update({ _id: 1 }, { $pull: { array: 1 } });
db.coleccion.update({ _id: 1 }, { $addToSet: { array: 2 } });
db.coleccion.update({ _id: 1 }, { $pop: { array: 1 } }); // last element
db.coleccion.update({ _id: 1 }, { $pop: { array: -1 } }); // first element
db.coleccion.update({ _id: 1 }, { $pullAll: { array: [3, 4, 5] } });
db.coleccion.update({ _id: 1 }, { $push: { scores: { $each: [90, 92, 85] } } });
db.coleccion.updateOne({ _id: 1, grades: 80 }, { $set: { "grades.$": 82 } });
db.coleccion.updateMany({}, { $inc: { "grades.$[]": 10 } });
db.coleccion.update(
	{},
	{ $set: { "grades.$[element]": 100 } },
	{ multi: true, arrayFilters: [{ element: { $gte: 100 } }] },
);

// Actualizar varios al mismo tiempo
db.coleccion.update(
	{ year: 1999 },
	{ $set: { decade: "90's" } },
	{ multi: true },
);
db.coleccion.updateMany({ year: 1999 }, { $set: { decade: "90's" } });

// Encontrar uno y actualizarlo
db.coleccion.findOneAndUpdate(
	{ name: "Max" },
	{ $inc: { points: 5 } },
	{ returnNewDocument: true },
);

// Upsert
db.coleccion.update(
	{ _id: 1 },
	{ $set: { item: "apple" }, $setOnInsert: { defaultQty: 100 } },
	{ upsert: true },
);

// Reemplazar
db.coleccion.replaceOne(
	{ name: "Max" },
	{ firstname: "Maxime", surname: "Beugnet" },
);

/////////////////
// ELIMINACION //
/////////////////
db.coleccion.remove({ name: "Max" });
db.coleccion.remove({ name: "Max" }, { justOne: true });
db.coleccion.remove({}); // ¡ADVERTENCIA! Elimina todos los documentos pero no la colección en sí y sus definiciones de índice
db.coleccion.remove(
	{ name: "Max" },
	{ writeConcern: { w: "majority", wtimeout: 5000 } },
);
db.coleccion.findOneAndDelete({ name: "Max" });
