const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },

        // os seguintes campos são como se fossem chaves estrangeiras
        // os colchetes referenciam VÁRIOS. Se não houvesse colchetes
        // seria como se fosse somente um usuário (relacionamento tbm)
        likes: [{ // quais usuários o usuário deu like
            type: Schema.Types.ObjectId, // seria o _id atribuido pelo Mongo
            ref: 'Dev', // referente ao qual model
        }], 
        deslikes: [{  // quais usuários o usuário deu deslikes

        }]
    },
    {
        /**
         * A opção abaixo irá criar automaticamente o createdAt / updatedAt
         * preenchido automaticamente
         */
        timestamps: true,
    });

module.exports = model('Dev', DevSchema);

/**
 * Agora qualquer arquivo que importar esta model poderá manipular os registros (CRUD)
 */