module.exports = {

    account: {
        emailIsEmpty: { message: 'O email é obrigatório.', code: 'emailIsEmpty' },
        emailIsInvalid: { message: 'O email informado está inválido.', code: 'emailIsInvalid' },
        passwordIsInvalid: {
            message: 'Ops! A senha deve conter de 6 a 20 caracteres, com letra maiuscula e caracteres especiais.'
            , code: 'passwordIsInvalid'
        },
        signupIsEmpty: { message: 'Prencha todos os campos obrigatórios marcados com *.' },
        passwordDiferentIsConfirm: { message: 'A senha e a senha de confirmação não conferem.', code: 'passwordDiferentIsConfirm' },
        nameIsEmpty: { message: 'O nome é obrigatório.', code: 'nameIsEmpty' },
        passwordIsEmpty: { message: 'A senha é obrigatória.', code: 'passwordIsEmpty' },
        passwordConfirmIsEmpty: { message: 'A senha de confirmação é obrigatória.', code: 'passwordConfirmIsEmpty' },
        newPasswordIsEmpty: { message: 'A nova senha é obrigatória.', code: 'newPasswordIsEmpty' },
        emailIsUsing: { message: 'O email já está sendo utilizado por outro usuário.', code: 'emailIsUsing' },
        emailIsNotActive: { message: 'O email informado não foi verificado!' },
        loginFailed: { message: 'Email ou senha inválidos!', code: 'loginFailed' },
        userIsEmpty: { message: 'Não existe nenhum usuário com esse endereço de email.', code: 'userIsEmpty' },
        userByPasswordIsEmpty: { message: 'A senha atual está incorreta.', code: 'userByPasswordIsEmpty' },
        manyRequestsLogin: {
            message: 'Muitas tentativas de login malsucedidas.Por favor, inclua a verificação reCaptcha ou tente novamente mais tarde.'
            , code: 'manyRequestsLogin'
        }
    }
};