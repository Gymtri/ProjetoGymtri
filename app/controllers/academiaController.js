const bcrypt = require('bcryptjs')
const academiaModel = require('../models/academiaModel.js')
const {body, validationResult} = require('express-validator')

const salt = bcrypt.genSaltSync(10)

const academiaController = {

    //Validação
    validacaoFormularioCadastro : [
        body('nome')
            .isLength({min:3, max:45})
            .withMessage('O nome deve ter de 3 a 45 letras'),
        body('email')
            .isEmail()
            .withMessage('O e-mail deve ser válido!'),
        body('senha')
            .isStrongPassword()
            .withMessage('A senha deve possuir no mínimo 8 caracteres: com letra miniscula, maiuscula, numeral e caracter especial!'),
        body('c-senha')
            .custom((value, {req}) => {
                if(value != req.body.senha){
                    throw new Error('Senha está errada')
                }else{
                    return true;
                }
            })   
    ],

    regrasValidacaoFormLogin: [
        body('nome')
            .isLength({min:3, max:45})
            .withMessage('O nome de usuário / e-mail deve conter de 8 a 45 caracteres.'),
        body('senha')
            .isStrongPassword()
            .withMessage('A senha deve possuir no mínimo 8 caracteres, (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)')
    ],

    //Métodos
    inserirAcademia: async(req, res) =>{
        //recuperar dados da validação
        const listaErros = validationResult(req);
        //verificar se há erros
        if(listaErros.isEmpty()){
            
        }
    }
}